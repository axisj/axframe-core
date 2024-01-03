import { useBtnI18n, useI18n } from "@core/hooks";
import { ExampleItem } from "@core/services/example/ExampleRepositoryInterface";
import { convertToDate } from "@core/utils/object";
import styled from "@emotion/styled";
import { Button, Checkbox, Col, DatePicker, Form, FormInstance, Input, Radio, Row, Select, Space } from "antd";
import dayjs from "dayjs";
import React from "react";
import { useDaumPostcodePopup } from "react-daum-postcode";
import { PageLayout } from "styles/pageStyled";
import { errorHandling } from "utils";
import { use$FORM$Store } from "./use$FORM$Store";

interface Props {
  form: FormInstance<DtoItem>;
}

interface DtoItem extends ExampleItem {}

function FormSet({ form }: Props) {
  const { t } = useI18n("$example$");
  const btnT = useBtnI18n();

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
    try {
      if (!saveRequestValue || Object.keys(saveRequestValue).length < 1) {
        form.resetFields();
      } else {
        // 날짜 스트링은 dayjs 로 변환 날짜를 사용하는 컴포넌트 'cnsltDt'
        form.setFieldsValue(convertToDate({ ...formInitialValues, ...saveRequestValue }, ["cnsltDt", "birthDt"]));
      }
    } catch (err) {
      errorHandling(err).then();
    }
  }, [saveRequestValue, form, formInitialValues]);

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
    >
      <Body>
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

        <FormBoxHeader>{t("인적사항")}</FormBoxHeader>
        <FormBox>
          <Row gutter={20}>
            <Col xs={24} sm={8}>
              <Form.Item label={t("성명")} name={"name"} rules={[{ required: true }]}>
                <Input />
              </Form.Item>
            </Col>
            <Col xs={24} sm={8}>
              <Form.Item label={t("생년월일")}>
                <Space.Compact>
                  <Form.Item name={"birthDt"} noStyle rules={[{ required: true }]}>
                    <DatePicker picker={"date"} />
                  </Form.Item>
                  <Form.Item name={"age"} noStyle>
                    <Input readOnly style={{ width: 80 }} prefix={t("나이")} />
                  </Form.Item>
                </Space.Compact>
              </Form.Item>
            </Col>
            <Col xs={24} sm={8}>
              <Form.Item label={t("성별")} name={"sex"}>
                <Radio.Group
                  options={[
                    { label: t("남"), value: "남" },
                    { label: t("여"), value: "여" },
                  ]}
                />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={20}>
            <Col xs={24} sm={8}>
              <Form.Item label={t("연락처 1")} name={"phone1"} rules={[{ required: true }]}>
                <Input />
              </Form.Item>
            </Col>
            <Col xs={24} sm={8}>
              <Form.Item label={t("연락처 2")} name={"phone2"} rules={[{ required: true }]}>
                <Input />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={20}>
            <Col xs={24} sm={8}>
              <Form.Item label={t("장애유무")} name={"hndcapYn"} rules={[{ required: true }]}>
                <Radio.Group
                  options={[
                    { value: "유", label: t("유") },
                    { value: "무", label: t("무") },
                  ]}
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={16}>
              <Form.Item label={t("장애등급")} name={"hndcapGrade"} rules={[{ required: true }]}>
                <Radio.Group
                  options={[
                    { value: "심한 장애인", label: t("심한 장애인") },
                    { value: "심하지않은 장애인", label: t("심하지않은 장애인") },
                  ]}
                />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item label={t("장애종류")} name={"hndcapTyp"} rules={[{ required: true }]}>
            <Radio.Group
              options={[
                { value: "지체장애", label: t("지체장애") },
                { value: "뇌병변장애", label: t("뇌병변장애") },
                { value: "시각장애", label: t("시각장애") },
                { value: "청각장애", label: t("청각장애") },
                { value: "언어장애", label: t("언어장애") },
                { value: "안면장애", label: t("안면장애") },
                { value: "정신지체", label: t("정신지체") },
                { value: "발달장애", label: t("발달장애") },
                { value: "정신장애", label: t("정신장애") },
                { value: "신장장애", label: t("신장장애") },
                { value: "심장장애", label: t("심장장애") },
                { value: "호흡기장애", label: t("호흡기장애") },
                { value: "간장애", label: t("간장애") },
                { value: "장루요류장애", label: t("장루요류장애") },
                { value: "간질장애", label: t("간질장애") },
              ]}
            />
          </Form.Item>

          <Form.Item label={t("주소")}>
            <Row gutter={[10, 10]}>
              <Col xs={12} sm={3}>
                <Form.Item noStyle name={"zipNum"}>
                  <Input readOnly />
                </Form.Item>
              </Col>
              <Col xs={12} sm={3}>
                <Button block onClick={handleFindZipCode}>
                  {btnT("주소찾기")}
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

        <FormBoxHeader>{t("상담내용")}</FormBoxHeader>
        <FormBox>
          <FormGroupTitle>
            <Form.Item name={["hopePoint", "직접지원"]} noStyle valuePropName={"checked"}>
              <Checkbox>{t("직접지원")}</Checkbox>
            </Form.Item>
          </FormGroupTitle>

          <FormBox level={2}>
            <Space size={[8, 8]} wrap>
              <Form.Item noStyle name={"hopePoint1"}>
                <Radio.Group
                  disabled={!hopePoint?.["직접지원"]}
                  options={[
                    { value: "긴급임대료", label: t("긴급임대료") },
                    { value: "집수리", label: t("집수리") },
                    { value: "긴급연료", label: t("긴급연료") },
                    { value: "보증금지원", label: t("보증금지원") },
                    { value: "주거이전지원(이사비)", label: t("주거이전지원(이사비)") },
                    { value: "기타", label: t("기타") },
                  ]}
                />
              </Form.Item>
              <Form.Item noStyle name={"hopePoint1Etc"}>
                <Input disabled={hopePoint1 !== "기타" || !hopePoint?.["직접지원"]} size={"small"} />
              </Form.Item>
            </Space>
          </FormBox>

          <FormGroupTitle>
            <Form.Item name={["hopePoint", "주거정보자원"]} noStyle valuePropName={"checked"}>
              <Checkbox>{t("주거정보자원")}</Checkbox>
            </Form.Item>
          </FormGroupTitle>

          <FormBox level={2}>
            <Space size={[8, 8]} wrap>
              <Form.Item noStyle name={"hopePoint2"}>
                <Radio.Group
                  disabled={!hopePoint?.["주거정보자원"]}
                  options={[
                    { value: "임대주택", label: t("임대주택") },
                    { value: "융자정보", label: t("융자정보") },
                    { value: "청약정보", label: t("청약정보") },
                    { value: "대출정보", label: t("대출정보") },
                    { value: "재개발/뉴타운", label: t("재개발/뉴타운") },
                    { value: "기타", label: t("기타") },
                  ]}
                />
              </Form.Item>
              <Form.Item noStyle name={"hopePoint2Etc"}>
                <Input disabled={hopePoint2 !== "기타" || !hopePoint?.["주거정보자원"]} size={"small"} />
              </Form.Item>
            </Space>
          </FormBox>

          <FormGroupTitle>
            <Form.Item name={["hopePoint", "내부자원"]} noStyle valuePropName={"checked"}>
              <Checkbox>{t("내부자원")}</Checkbox>
            </Form.Item>
          </FormGroupTitle>

          <FormBox level={2}>
            <Space size={[8, 8]} wrap>
              <Form.Item noStyle name={"hopePoint3"}>
                <Radio.Group
                  disabled={!hopePoint?.["내부자원"]}
                  options={[
                    { value: "주거복지", label: t("주거복지") },
                    { value: "주거물품지원", label: t("주거물품지원") },
                    { value: "연료지원", label: t("연료지원") },
                    { value: "긴급지원주택", label: t("긴급지원주택") },
                    { value: "주거상향", label: t("주거상향") },
                    { value: "주거비소액대출", label: t("주거비소액대출") },
                    { value: "청약저축", label: t("청약저축") },
                    { value: "비주택거주자", label: t("비주택거주자") },
                    { value: "노후주택개보수", label: t("노후주택개보수") },
                    { value: "주거안정지원", label: t("주거안정지원") },
                    { value: "사랑의집수리", label: t("사랑의집수리") },
                    { value: "아동주거환경개선", label: t("아동주거환경개선") },
                    { value: "기타", label: t("기타") },
                  ]}
                />
              </Form.Item>
              <Form.Item noStyle name={"hopePoint3Etc"}>
                <Input disabled={hopePoint3 !== "기타" || !hopePoint?.["내부자원"]} size={"small"} />
              </Form.Item>
            </Space>
          </FormBox>

          <FormGroupTitle>
            <Form.Item name={["hopePoint", "기타"]} noStyle valuePropName={"checked"}>
              <Checkbox>{t("기타")}</Checkbox>
            </Form.Item>
          </FormGroupTitle>

          <Form.Item name={"hopePoint4Etc"}>
            <Input disabled={!hopePoint?.["기타"]} />
          </Form.Item>

          <FormGroupTitle>
            <Form.Item name={["hopePoint", "세부내용"]} noStyle valuePropName={"checked"}>
              <Checkbox> {t("세부내용")}</Checkbox>
            </Form.Item>
          </FormGroupTitle>

          <Form.Item name={"hopePoint5Etc"}>
            <Input.TextArea disabled={!hopePoint?.["세부내용"]} showCount maxLength={200} />
          </Form.Item>

          <Form.Item label={t("상담희망내용")} name={"fldT"} rules={[{ required: true }]}>
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
