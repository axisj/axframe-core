import { useBtnI18n, useI18n } from "hooks";
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
  const btnT = useBtnI18n();

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
            {btnT("추가")}
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
          <Button onClick={() => cancelFormActive()}>{btnT("취소")}</Button>
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
                <Form.Item label={t("지역")} name={"area"} rules={[{ required: true }]}>
                  <Select
                    options={[
                      { label: t("중구"), value: "중구" },
                      { label: t("동구"), value: "동구" },
                      { label: t("서구"), value: "서구" },
                      { label: t("남구"), value: "남구" },
                      { label: t("북구"), value: "북구" },
                      { label: t("수성구"), value: "수성구" },
                      { label: t("달서구"), value: "달서구" },
                      { label: t("달성군"), value: "달성군" },
                    ]}
                  />
                </Form.Item>
              </Col>
              <Col xs={24} sm={8}>
                <Form.Item label={t("상담원")} name={"cnsltUserCd"} rules={[{ required: true }]}>
                  <Select>
                    <Select.Option value={"system"}>시스템관리자</Select.Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col xs={24} sm={8}>
                <Form.Item label={t("상담일자")} name={"cnsltDt"}>
                  <DatePicker />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item label={t("상담방법")} rules={[{ required: true }]}>
              <Space size={[8, 16]} wrap>
                <Form.Item noStyle name={"cnsltHow"}>
                  <Radio.Group
                    options={[
                      { label: t("유선"), value: "유선" },
                      { label: t("내방"), value: "내방" },
                      { label: t("방문"), value: "방문" },
                      { label: t("이동상담"), value: "이동상담" },
                      { label: t("기타"), value: "기타" },
                    ]}
                  />
                </Form.Item>
                <Form.Item noStyle name={"cnsltHowEtc"}>
                  <Input disabled={cnsltHow !== "기타"} />
                </Form.Item>
              </Space>
            </Form.Item>

            <Form.Item label={t("상담경로")} required name={"cnsltPath"} style={{ marginBottom: 5 }}>
              <Radio.Group
                options={[
                  { label: t("방문"), value: "방문" },
                  { label: t("관련기관"), value: "관련기관" },
                  { label: t("개인소개"), value: "개인소개" },
                  { label: t("본인직접"), value: "본인직접" },
                  { label: t("기타기관"), value: "기타기관" },
                ]}
              />
            </Form.Item>

            {cnsltPath === "관련기관" && (
              <Form.Item noStyle name={"cnsltPathDtl"}>
                <Radio.Group
                  options={[
                    { label: t("동사무소/구청"), value: "동사무소/구청" },
                    { label: t("복지관"), value: "복지관" },
                    { label: t("보건소"), value: "보건소" },
                    { label: t("관리사무소"), value: "관리사무소" },
                    { label: t("복지기관"), value: "복지기관" },
                    { label: t("시민사회단체"), value: "시민사회단체" },
                  ]}
                />
              </Form.Item>
            )}
            {cnsltPath === "개인소개" && (
              <Form.Item noStyle name={"cnsltPathPerson"}>
                <Input style={{ maxWidth: 300 }} />
              </Form.Item>
            )}
            {cnsltPath === "본인직접" && (
              <Form.Item noStyle name={"cnsltPathDirect"}>
                <Input style={{ maxWidth: 300 }} />
              </Form.Item>
            )}
            {cnsltPath === "기타기관" && (
              <Space size={20} wrap>
                <Form.Item noStyle name={"cnsltPathOrg"}>
                  <Input />
                </Form.Item>
                <Form.Item noStyle name={"cnsltPathOrgPerson"}>
                  <Input />
                </Form.Item>
                <Form.Item noStyle name={"cnsltPathOrgPhone"}>
                  <Input />
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
