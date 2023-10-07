import { Badge, Descriptions } from "antd";
import styled from "@emotion/styled";
import { PageLayout } from "styles/pageStyled";
import { useI18n } from "@core/hooks";
import { use$DETAIL$Store } from "./use$DETAIL$Store";

interface Props {}

function View({}: Props) {
  const { t } = useI18n();
  const _t = t.example;

  const detail = use$DETAIL$Store((s) => s.detail);

  return (
    <Body>
      <ContentBoxHeader>{_t.title.detail}</ContentBoxHeader>
      <ContentBox>
        <Descriptions bordered>
          <Descriptions.Item label={_t.label.name}>{detail?.name}</Descriptions.Item>
          <Descriptions.Item label={_t.label.birthDt}>{detail?.birthDt}</Descriptions.Item>
          <Descriptions.Item label={_t.label.sex}>{detail?.sex}</Descriptions.Item>
          <Descriptions.Item label={_t.label.phone1}>{detail?.phone1}</Descriptions.Item>
          <Descriptions.Item label={_t.label.phone2} span={2}>
            {detail?.phone2}
          </Descriptions.Item>
          <Descriptions.Item label='Status' span={3}>
            <Badge status='processing' text='Running' />
          </Descriptions.Item>
          <Descriptions.Item label={_t.label.hndcapYn}>{detail?.hndcapYn}</Descriptions.Item>
          <Descriptions.Item label={_t.label.hndcapGrade}>{detail?.hndcapGrade}</Descriptions.Item>
          <Descriptions.Item label={_t.label.hndcapTyp}>{detail?.hndcapTyp}</Descriptions.Item>
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
