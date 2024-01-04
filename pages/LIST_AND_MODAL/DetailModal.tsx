import { Loading } from "@core/components/common";
import { useBtnI18n, useDidMountEffect, useI18n, useSpinning } from "hooks";
import { useModalStore } from "@core/stores/useModalStore";
import { delay } from "@core/utils/thread/timing";
import styled from "@emotion/styled";
import { Badge, Button, Descriptions, message, Modal } from "antd";
import React from "react";
import { ModalLayout } from "styles/pageStyled";
import { use$LIST_AND_MODAL$Store } from "./use$LIST_AND_MODAL$Store";

export interface ModalRequest {
  query?: Record<string, any>;
}

export interface ModalResponse {
  save?: boolean;
  delete?: boolean;
}

interface Props {
  open: boolean;
  onOk: (value: ModalResponse) => ModalResponse;
  onCancel: (reason?: any) => void;
  params: ModalRequest;
  afterClose: () => void;
}

function DetailModal({ open, onOk, onCancel, afterClose, params }: Props) {
  const [messageApi, contextHolder] = message.useMessage();
  const { t } = useI18n("$example$");
  const btnT = useBtnI18n();

  const { spinning, setSpinning, isBusy } = useSpinning<{ test: boolean; save: boolean; delete: boolean }>();

  const callDetailApi = use$LIST_AND_MODAL$Store((s) => s.callDetailApi);
  const detailSpinning = use$LIST_AND_MODAL$Store((s) => s.detailSpinning);
  const detail = use$LIST_AND_MODAL$Store((s) => s.detail);

  const handleTest = React.useCallback(async () => {
    if (isBusy) return;
    setSpinning({ test: true });
    messageApi.info("The test has been completed.");
    await delay(1000);
    setSpinning({ test: false });
  }, [messageApi, setSpinning, isBusy]);

  const handleSave = React.useCallback(async () => {
    if (isBusy) return;
    setSpinning({ save: true });
    await delay(1000);
    onOk({
      save: true,
    });
    setSpinning({ save: false });
  }, [onOk, setSpinning, isBusy]);

  const handleDelete = React.useCallback(async () => {
    if (isBusy) return;
    setSpinning({ delete: true });
    await delay(300);
    onOk({
      delete: true,
    });
    setSpinning({ delete: false });
  }, [onOk, setSpinning, isBusy]);

  useDidMountEffect(() => {
    callDetailApi({ id: params.query?.id });
  });

  return (
    <Modal width={800} {...{ open, onCancel, onOk: onOk as any, afterClose }}>
      {contextHolder}
      <Container>
        <ModalLayout.Header title={`샘플(상세#${params.query?.id})`}>
          <Button size={"small"} onClick={handleTest} loading={spinning?.test}>
            TEST
          </Button>
        </ModalLayout.Header>
        <Body>
          <Descriptions bordered size={"small"}>
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

          <Loading active={detailSpinning} />
        </Body>
        <Footer>
          <Button type='primary' onClick={handleSave} loading={spinning?.save}>
            {btnT("저장")}
          </Button>
          <Button onClick={handleDelete} loading={spinning?.delete}>
            {btnT("삭제")}
          </Button>
          <Button onClick={onCancel}>{btnT("취소")}</Button>
        </Footer>
      </Container>
    </Modal>
  );
}

const Container = styled(ModalLayout)``;
const Body = styled(ModalLayout.Body)``;
const Footer = styled(ModalLayout.Footer)``;

export async function openDetailModal(params: ModalRequest = {}) {
  const openModal = useModalStore.getState().openModal;
  return await openModal<ModalResponse>((open, resolve, reject, onClose, afterClose) => (
    <DetailModal open={open} onOk={resolve} onCancel={reject} afterClose={afterClose} params={params} />
  ));
}

export default DetailModal;
