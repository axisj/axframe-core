import React from "react";
import { Button, Checkbox, Col, DatePicker, Form, FormInstance, Input, Radio, Row, Select, Space } from "antd";
import styled from "@emotion/styled";
import { PageLayout } from "styles/pageStyled";
import dayjs from "dayjs";
import { ExampleItem } from "@core/services/example/ExampleRepositoryInterface";
import { useI18n } from "@core/hooks";
import { use$FORM$Store } from "./use$FORM$Store";
import { useDidMountEffect } from "@core/hooks/useDidMountEffect";
import { convertToDate } from "@core/utils/object";
import { useDaumPostcodePopup } from "react-daum-postcode";
import { errorHandling } from "../../../utils";

interface Props {
  form: FormInstance<DtoItem>;
}
interface DtoItem extends ExampleItem {}

function FormSet({ form }: Props) {
  const { t } = useI18n();
  const _t = t.example;

  const saveRequestValue = use$FORM$Store((s) => s.saveRequestValue);
  const setSaveRequestValue = use$FORM$Store((s) => s.setSaveRequestValue);
  const callSaveApi = use$FORM$Store((s) => s.callSaveApi);
  const saveSpinning = use$FORM$Store((s) => s.saveSpinning);
  const reset = use$FORM$Store((s) => s.reset);

  const openZipCodeFinder = useDaumPostcodePopup("//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js");

  const cnsltHow = Form.useWatch("cnsltHow", form);
  const cnsltPath = Form.useWatch("cnsltPath", form);
  const hopePoint = Form.useWatch<Record<string, any>>("hopePoint", form);
  const hopePoint1 = Form.useWatch("hopePoint1", form);
  const hopePoint2 = Form.useWatch("hopePoint2", form);
  const hopePoint3 = Form.useWatch("hopePoint3", form);
  const birthDt = Form.useWatch("birthDt", form);

  const formInitialValues = {}; // form 의 초기값 reset해도 이값 으로 리셋됨

  const handleFindZipCode = React.useCallback(async () => {
    await openZipCodeFinder({
      onComplete: (data) => {
        form.setFieldsValue({
          zipNum: data.zonecode,
          addr: data.address,
        });
        form.getFieldInstance("addrDtls").focus();
      },
    });
  }, [form, openZipCodeFinder]);

  const onValuesChange = React.useCallback(
    (_changedValues: any, values: Record<string, any>) => {
      setSaveRequestValue(values);
    },
    [setSaveRequestValue],
  );

  React.useEffect(() => {
    if (birthDt) {
      const age = dayjs().diff(dayjs(birthDt), "years");
      form.setFieldValue("age", age);
    }
  }, [birthDt, form]);

  React.useEffect(() => {
    if (!saveRequestValue || Object.keys(saveRequestValue).length < 1) {
      form.resetFields();
    }
  }, [saveRequestValue, form]);

  useDidMountEffect(() => {
    console.log("form.setFieldsValue by metaData");
    try {
      form.setFieldsValue(convertToDate(saveRequestValue, ["cnsltDt", "birthDt"]));
    } catch (err) {
      errorHandling(err).then();
    }
  });

  return (
    <Form<DtoItem>
      form={form}
      layout={"vertical"}
      colon={false}
      scrollToFirstError
      initialValues={formInitialValues}
      onValuesChange={onValuesChange}
      onFinish={async () => {
        await callSaveApi();
        await reset();
      }}
      validateMessages={t.core.validateMessages}
    >
      <Body>
        <FormBox>
          <Row gutter={20}>
            <Col xs={24} sm={8}>
              <Form.Item label={_t.label.area} name={"area"} rules={[{ required: true }]}>
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

        <FormBoxHeader>{_t.title.formSub}</FormBoxHeader>
        <FormBox>
          <Row gutter={20}>
            <Col xs={24} sm={8}>
              <Form.Item label={_t.label.name} name={"name"} rules={[{ required: true }]}>
                <Input />
              </Form.Item>
            </Col>
            <Col xs={24} sm={8}>
              <Form.Item label={_t.label.birthDt}>
                <Space.Compact>
                  <Form.Item name={"birthDt"} noStyle rules={[{ required: true }]}>
                    <DatePicker picker={"date"} />
                  </Form.Item>
                  <Form.Item name={"age"} noStyle>
                    <Input readOnly style={{ width: 80 }} prefix={_t.label.age} />
                  </Form.Item>
                </Space.Compact>
              </Form.Item>
            </Col>
            <Col xs={24} sm={8}>
              <Form.Item label={_t.label.sex} name={"sex"}>
                <Radio.Group>
                  {_t.options.sex.map((o, i) => (
                    <Radio value={o.value} key={i}>
                      {o.label}
                    </Radio>
                  ))}
                </Radio.Group>
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={20}>
            <Col xs={24} sm={8}>
              <Form.Item label={_t.label.phone1} name={"phone1"} rules={[{ required: true }]}>
                <Input />
              </Form.Item>
            </Col>
            <Col xs={24} sm={8}>
              <Form.Item label={_t.label.phone2} name={"phone2"} rules={[{ required: true }]}>
                <Input />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={20}>
            <Col xs={24} sm={8}>
              <Form.Item label={_t.label.hndcapYn} name={"hndcapYn"} rules={[{ required: true }]}>
                <Radio.Group>
                  {_t.options.hndcapYn.map((o, i) => (
                    <Radio value={o.value} key={i}>
                      {o.label}
                    </Radio>
                  ))}
                </Radio.Group>
              </Form.Item>
            </Col>
            <Col xs={24} sm={16}>
              <Form.Item label={_t.label.hndcapGrade} name={"hndcapGrade"} rules={[{ required: true }]}>
                <Radio.Group>
                  {_t.options.hndcapGrade.map((o, i) => (
                    <Radio value={o.value} key={i}>
                      {o.label}
                    </Radio>
                  ))}
                </Radio.Group>
              </Form.Item>
            </Col>
          </Row>

          <Form.Item label={_t.label.hndcapTyp} name={"hndcapTyp"} rules={[{ required: true }]}>
            <Radio.Group>
              {_t.options.hndcapTyp.map((o, i) => (
                <Radio value={o.value} key={i}>
                  {o.label}
                </Radio>
              ))}
            </Radio.Group>
          </Form.Item>

          <Form.Item label={_t.label.addr}>
            <Row gutter={[10, 10]}>
              <Col xs={12} sm={3}>
                <Form.Item noStyle name={"zipNum"}>
                  <Input readOnly />
                </Form.Item>
              </Col>
              <Col xs={12} sm={3}>
                <Button block onClick={handleFindZipCode}>
                  {t.button.findAddr}
                </Button>
              </Col>
              <Col xs={24} sm={9}>
                <Form.Item noStyle name={"addr"}>
                  <Input readOnly />
                </Form.Item>
              </Col>
              <Col xs={24} sm={9}>
                <Form.Item noStyle name={"addrDtls"}>
                  <Input />
                </Form.Item>
              </Col>
            </Row>
          </Form.Item>
        </FormBox>

        <FormBoxHeader>{_t.title.formSub2}</FormBoxHeader>
        <FormBox>
          <FormGroupTitle>
            <Form.Item name={["hopePoint", "직접지원"]} noStyle valuePropName={"checked"}>
              <Checkbox>{_t.label.directSupport}</Checkbox>
            </Form.Item>
          </FormGroupTitle>

          <FormBox level={2}>
            <Space size={[8, 8]} wrap>
              <Form.Item noStyle name={"hopePoint1"}>
                <Radio.Group disabled={!hopePoint?.["직접지원"]}>
                  {_t.options.hopePoint1.map((o, i) => (
                    <Radio value={o.value} key={i}>
                      {o.label}
                    </Radio>
                  ))}
                </Radio.Group>
              </Form.Item>
              <Form.Item noStyle name={"hopePoint1Etc"}>
                <Input disabled={hopePoint1 !== "기타" || !hopePoint?.["직접지원"]} size={"small"} />
              </Form.Item>
            </Space>
          </FormBox>

          <FormGroupTitle>
            <Form.Item name={["hopePoint", "주거정보자원"]} noStyle valuePropName={"checked"}>
              <Checkbox>{_t.label.residentialInfo}</Checkbox>
            </Form.Item>
          </FormGroupTitle>

          <FormBox level={2}>
            <Space size={[8, 8]} wrap>
              <Form.Item noStyle name={"hopePoint2"}>
                <Radio.Group disabled={!hopePoint?.["주거정보자원"]}>
                  {_t.options.hopePoint2.map((o, i) => (
                    <Radio value={o.value} key={i}>
                      {o.label}
                    </Radio>
                  ))}
                </Radio.Group>
              </Form.Item>
              <Form.Item noStyle name={"hopePoint2Etc"}>
                <Input disabled={hopePoint2 !== "기타" || !hopePoint?.["주거정보자원"]} size={"small"} />
              </Form.Item>
            </Space>
          </FormBox>

          <FormGroupTitle>
            <Form.Item name={["hopePoint", "내부자원"]} noStyle valuePropName={"checked"}>
              <Checkbox>{_t.label.internalResource}</Checkbox>
            </Form.Item>
          </FormGroupTitle>

          <FormBox level={2}>
            <Space size={[8, 8]} wrap>
              <Form.Item noStyle name={"hopePoint3"}>
                <Radio.Group disabled={!hopePoint?.["내부자원"]}>
                  {_t.options.hopePoint3.map((o, i) => (
                    <Radio value={o.value} key={i}>
                      {o.label}
                    </Radio>
                  ))}
                </Radio.Group>
              </Form.Item>
              <Form.Item noStyle name={"hopePoint3Etc"}>
                <Input disabled={hopePoint3 !== "기타" || !hopePoint?.["내부자원"]} size={"small"} />
              </Form.Item>
            </Space>
          </FormBox>

          <FormGroupTitle>
            <Form.Item name={["hopePoint", "기타"]} noStyle valuePropName={"checked"}>
              <Checkbox>{_t.label.etc}</Checkbox>
            </Form.Item>
          </FormGroupTitle>

          <Form.Item name={"hopePoint4Etc"}>
            <Input disabled={!hopePoint?.["기타"]} />
          </Form.Item>

          <FormGroupTitle>
            <Form.Item name={["hopePoint", "세부내용"]} noStyle valuePropName={"checked"}>
              <Checkbox> {_t.label.detail}</Checkbox>
            </Form.Item>
          </FormGroupTitle>

          <Form.Item name={"hopePoint5Etc"}>
            <Input.TextArea disabled={!hopePoint?.["세부내용"]} showCount maxLength={200} />
          </Form.Item>

          <Form.Item label={_t.label.fldT} name={"fldT"} rules={[{ required: true }]}>
            <Input.TextArea rows={4} showCount maxLength={200} />
          </Form.Item>
        </FormBox>
      </Body>
    </Form>
  );
}

const Body = styled(PageLayout.Body)``;
const FormBoxHeader = styled(PageLayout.ContentBoxHeader)``;
const FormBox = styled(PageLayout.ContentBox)`
  > * {
    max-width: 960px;
  }
`;
const FormGroupTitle = styled(PageLayout.GroupTitle)``;

export { FormSet };
