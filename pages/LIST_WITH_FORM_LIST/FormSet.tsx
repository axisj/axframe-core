import { ExampleItem } from "@core/services/example/ExampleRepositoryInterface";
import { convertToDate } from "@core/utils/object";
import styled from "@emotion/styled";
import { Button, Col, DatePicker, Form, FormInstance, Input, Row, Select } from "antd";
import { EmptyMsg } from "components/common";
import { useBtnI18n, useI18n } from "hooks";
import React from "react";
import { PageLayout } from "styles/pageStyled";
import { errorHandling } from "utils";
import { SubListDataGrid } from "./SubListDataGrid";
import { use$LIST_WITH_FORM_LIST$Store } from "./use$LIST_WITH_FORM_LIST$Store";

interface Props {
  form: FormInstance<DtoItem>;
}

interface DtoItem extends ExampleItem {}

function FormSet({ form }: Props) {
  const { t } = useI18n("$example$");
  const btnT = useBtnI18n();

  const saveRequestValue = use$LIST_WITH_FORM_LIST$Store((s) => s.saveRequestValue);
  const setSaveRequestValue = use$LIST_WITH_FORM_LIST$Store((s) => s.setSaveRequestValue);
  const callSaveApi = use$LIST_WITH_FORM_LIST$Store((s) => s.callSaveApi);
  const listSelectedRowKey = use$LIST_WITH_FORM_LIST$Store((s) => s.listSelectedRowKey);
  const formActive = use$LIST_WITH_FORM_LIST$Store((s) => s.formActive);
  const cancelFormActive = use$LIST_WITH_FORM_LIST$Store((s) => s.cancelFormActive);
  const setFormActive = use$LIST_WITH_FORM_LIST$Store((s) => s.setFormActive);

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
            <Row gutter={[20, 0]}>
              <Col xs={24} sm={8}>
                <Form.Item label={"ID"} name={"id"} rules={[{ required: true }]}>
                  <Input />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={[20, 0]}>
              <Col xs={24} sm={8}>
                <Form.Item
                  label={t("지역")}
                  name={"area"}
                  rules={[{ required: true, message: "커스텀 메세지 사용 가능" }]}
                >
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
                <Form.Item label={t("상담일자")} name={"cnsltDt"}>
                  <DatePicker />
                </Form.Item>
              </Col>
            </Row>
          </FormBox>

          <SubListDataGrid />
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
