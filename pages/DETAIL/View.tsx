import styled from "@emotion/styled";
import { Badge, Descriptions } from "antd";
import { useI18n } from "hooks";
import React from "react";
import { PageLayout } from "styles/pageStyled";
import { use$DETAIL$Store } from "./use$DETAIL$Store";

interface Props {}

function View({}: Props) {
  const { t } = useI18n("$example$");

  const detail = use$DETAIL$Store((s) => s.detail);

  return (
    <Body>
      <ContentBoxHeader>{t("제목")}</ContentBoxHeader>
      <ContentBox>
        <Descriptions bordered>
          <Descriptions.Item label={t("성명")}>{detail?.name}</Descriptions.Item>
          <Descriptions.Item label={t("생년월일")}>{detail?.birthDt}</Descriptions.Item>
          <Descriptions.Item label={t("성별")}>{detail?.sex}</Descriptions.Item>
          <Descriptions.Item label={t("연락처 1")}>{detail?.phone1}</Descriptions.Item>
          <Descriptions.Item label={t("연락처 2")} span={2}>
            {detail?.phone2}
          </Descriptions.Item>
          <Descriptions.Item label='Status' span={3}>
            <Badge status='processing' text='Running' />
          </Descriptions.Item>
          <Descriptions.Item label={t("장애유무")}>{detail?.hndcapYn}</Descriptions.Item>
          <Descriptions.Item label={t("장애등급")}>{detail?.hndcapGrade}</Descriptions.Item>
          <Descriptions.Item label={t("장애종류")}>{detail?.hndcapTyp}</Descriptions.Item>
        </Descriptions>
      </ContentBox>
    </Body>
  );
}

const Body = styled(PageLayout.Body)``;
const ContentBoxHeader = styled(PageLayout.ContentBoxHeader)``;
const ContentBox = styled(PageLayout.ContentBox)``;

export { View };
