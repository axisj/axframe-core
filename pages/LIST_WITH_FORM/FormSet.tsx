import { useI18n } from "@core/hooks";
import { ExampleItem } from "@core/services/example/ExampleRepositoryInterface";
import { convertToDate } from "@core/utils/object";
import styled from "@emotion/styled";
import { Button, Col, DatePicker, Form, FormInstance, Input, Radio, Row, Select, Space } from "antd";
import { EmptyMsg } from "components/common";
import React from "react";
import { PageLayout } from "styles/pageStyled";
import { errorHandling } from "utils";
import { use$LIST_WITH_FORM$Store } from "./use$LIST_WITH_FORM$Store";

interface Props {
  form: FormInstance<DtoItem>;
}

interface DtoItem extends ExampleItem {}

function FormSet({ form }: Props) {
  const { t } = useI18n("$example$");
  const _t: any = {};

  const saveRequestValue = use$LIST_WITH_FORM$Store((s) => s.saveRequestValue);
  const setSaveRequestValue = use$LIST_WITH_FORM$Store((s) => s.setSaveRequestValue);
  const callSaveApi = use$LIST_WITH_FORM$Store((s) => s.callSaveApi);
  const listSelectedRowKey = use$LIST_WITH_FORM$Store((s) => s.listSelectedRowKey);
  const formActive = use$LIST_WITH_FORM$Store((s) => s.formActive);
  const cancelFormActive = use$LIST_WITH_FORM$Store((s) => s.cancelFormActive);
  const setFormActive = use$LIST_WITH_FORM$Store((s) => s.setFormActive);

  const cnsltHow = Form.useWatch("cnsltHow", form);
  const cnsltPath = Form.useWatch("cnsltPath", form);

  const formInitialValues = React.useRef({}).current; // form 의 초기값 reset해도 이값 으로 리셋됨

  const onValuesChange = React.useCallback(
    (changedValues: any, values: Record<string, any>) => {
      setSaveRequestValue(values);
    },
    [setSaveRequestValue],
  );

  React.useEffect(() => {
    try {
      if (!saveRequestValue || Object.keys(saveRequestValue).length < 1) {
        form.resetFields();
      } else {
        // 날짜 스트링은 dayjs 로 변환 날짜를 사용하는 컴포넌트 'cnsltDt'
        form.setFieldsValue(convertToDate({ ...formInitialValues, ...saveRequestValue }, ["cnsltDt"]));
      }
    } catch (err) {
      errorHandling(err).then();
    }
  }, [saveRequestValue, form, formInitialValues]);

  if (!formActive && !listSelectedRowKey) {
    return (
      <>
        <EmptyMsg>
          <Button
            onClick={() => {
              cancelFormActive();
              setFormActive();
            }}
          >
            {t("button.addNew")}
          </Button>
        </EmptyMsg>
        <Form form={form} />
      </>
    );
  }

  return (
    <>
      <Header>
        Form
        <ButtonGroup compact>
          <Button onClick={() => cancelFormActive()}>{t("button.cancel")}</Button>
        </ButtonGroup>
      </Header>
      <Body>
        <Form<DtoItem>
          form={form}
          layout={"vertical"}
          colon={false}
          scrollToFirstError
          initialValues={formInitialValues}
          onValuesChange={onValuesChange}
          onFinish={async () => {
            await callSaveApi();
            await cancelFormActive();
          }}
        >
          <FormBox>
            <Row gutter={20}>
              <Col xs={24} sm={8}>
                <Form.Item
                  label={_t.label.area}
                  name={"area"}
                  rules={[{ required: true, message: "커스텀 메세지 사용 가능" }]}
                >
                  <Select options={_t.options.area} />
                </Form.Item>
              </Col>
              <Col xs={24} sm={8}>
                <Form.Item label={_t.label.cnsltUserCd} name={"cnsltUserCd"} rules={[{ required: true }]}>
                  <Select>
                    <Select.Option value={"system"}>시스템관리자</Select.Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col xs={24} sm={8}>
                <Form.Item label={_t.label.cnsltDt} name={"cnsltDt"}>
                  <DatePicker />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item label={_t.label.cnsltHow} rules={[{ required: true }]}>
              <Space size={[8, 16]} wrap>
                <Form.Item noStyle name={"cnsltHow"}>
                  <Radio.Group>
                    {_t.options.cnsltHow.map((o, i) => (
                      <Radio value={o.value} key={i}>
                        {o.label}
                      </Radio>
                    ))}
                  </Radio.Group>
                </Form.Item>
                <Form.Item noStyle name={"cnsltHowEtc"}>
                  <Input disabled={cnsltHow !== "기타"} />
                </Form.Item>
              </Space>
            </Form.Item>

            <Form.Item label={_t.label.cnsltPath} required name={"cnsltPath"} style={{ marginBottom: 5 }}>
              <Radio.Group>
                {_t.options.cnsltPath.map((o, i) => (
                  <Radio value={o.value} key={i}>
                    {o.label}
                  </Radio>
                ))}
              </Radio.Group>
            </Form.Item>

            {cnsltPath === "관련기관" && (
              <Form.Item noStyle name={"cnsltPathDtl"}>
                <Radio.Group>
                  {_t.options.cnsltPathDtl.map((o, i) => (
                    <Radio value={o.value} key={i}>
                      {o.label}
                    </Radio>
                  ))}
                </Radio.Group>
              </Form.Item>
            )}
            {cnsltPath === "개인소개" && (
              <Form.Item noStyle name={"cnsltPathPerson"}>
                <Input placeholder={_t.placeholder.cnsltPathPerson} style={{ maxWidth: 300 }} />
              </Form.Item>
            )}
            {cnsltPath === "본인직접" && (
              <Form.Item noStyle name={"cnsltPathDirect"}>
                <Input placeholder={_t.placeholder.cnsltPathDirect} style={{ maxWidth: 300 }} />
              </Form.Item>
            )}
            {cnsltPath === "기타기관" && (
              <Space size={20} wrap>
                <Form.Item noStyle name={"cnsltPathOrg"}>
                  <Input placeholder={_t.placeholder.cnsltPathOrg} />
                </Form.Item>
                <Form.Item noStyle name={"cnsltPathOrgPerson"}>
                  <Input placeholder={_t.placeholder.cnsltPathOrgPerson} />
                </Form.Item>
                <Form.Item noStyle name={"cnsltPathOrgPhone"}>
                  <Input placeholder={_t.placeholder.cnsltPathOrgPhone} />
                </Form.Item>
              </Space>
            )}
          </FormBox>
        </Form>
      </Body>
    </>
  );
}

const Header = styled(PageLayout.FrameHeader)``;
const Body = styled.div``;
const FormBox = styled(PageLayout.ContentBox)`
  > * {
    max-width: 960px;
  }
`;
const ButtonGroup = styled(PageLayout.ButtonGroup)``;

export { FormSet };
