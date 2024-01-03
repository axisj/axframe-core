import styled from "@emotion/styled";
import { Badge, Descriptions } from "antd";
import { useI18n } from "hooks";
import { PageLayout } from "styles/pageStyled";
import { use$DETAIL$Store } from "./use$DETAIL$Store";

interface Props {}

function View({}: Props) {
  const { t } = useI18n("$example$");

  const detail = use$DETAIL$Store((s) => s.detail);

  return (
    <Body>
      <ContentBoxHeader>{t("폼")}</ContentBoxHeader>
      <ContentBox>
        <Descriptions bordered>
          <Descriptions.Item label={t("이름")}>{detail?.name}</Descriptions.Item>
          <Descriptions.Item label={t("생일")}>{detail?.birthDt}</Descriptions.Item>
          <Descriptions.Item label={t("성별")}>{detail?.sex}</Descriptions.Item>
          <Descriptions.Item label={t("전화1")}>{detail?.phone1}</Descriptions.Item>
          <Descriptions.Item label={t("전화2")} span={2}>
            {detail?.phone2}
          </Descriptions.Item>
          <Descriptions.Item label={t("상태")} span={3}>
            <Badge status='processing' text='Running' />
          </Descriptions.Item>
          <Descriptions.Item label={t("hndcapYn")}>{detail?.hndcapYn}</Descriptions.Item>
          <Descriptions.Item label={t("hndcapGrade")}>{detail?.hndcapGrade}</Descriptions.Item>
          <Descriptions.Item label={t("hndcapTyp")}>{detail?.hndcapTyp}</Descriptions.Item>
          <Descriptions.Item label='Config Info'>
            Data disk type: MongoDB
            <br />
            Database version: 3.4
            <br />
            Package: dds.mongo.mid
            <br />
            Storage space: 10 GB
            <br />
            Replication factor: 3
            <br />
            Region: East China 1
            <br />
          </Descriptions.Item>
        </Descriptions>
      </ContentBox>
    </Body>
  );
}

const Body = styled(PageLayout.Body)``;
const ContentBoxHeader = styled(PageLayout.ContentBoxHeader)``;
const ContentBox = styled(PageLayout.ContentBox)``;

export { View };
