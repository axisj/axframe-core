import styled from "@emotion/styled";
import { Button, Divider, Modal } from "antd";
import {
  CheckCircleFilled,
  CloseCircleFilled,
  ExclamationCircleFilled,
  InfoCircleFilled,
  QuestionCircleFilled,
} from "@ant-design/icons";
import { SMixinFlexRow } from "../../styles/emotion";
import { useI18n } from "../../hooks";
import { css } from "@emotion/react";
import { useModalStore } from "../../stores/useModalStore.ts";
import React, { useMemo } from "react";

export type DialogType = "info" | "success" | "error" | "warning" | "confirm";
export interface DialogRequest {
  type?: DialogType;
  className?: string;
  width?: string | number;
  title?: React.ReactNode;
  content: React.ReactNode;
  message?: string;
  code?: number;
}

export interface DialogResponse {}

interface Props {
  open: boolean;
  onOk: (value: DialogResponse) => DialogResponse;
  onCancel: (reason?: any) => void;
  params?: DialogRequest;
  afterClose: () => void;
}

function Icon({ type }: { type?: DialogType }) {
  switch (type) {
    case "success":
      return <CheckCircleFilled />;
    case "error":
      return <CloseCircleFilled />;
    case "warning":
      return <ExclamationCircleFilled />;
    case "confirm":
      return <QuestionCircleFilled />;
    default:
      return <InfoCircleFilled />;
  }
}

export function DialogModal({ open, onCancel, onOk, afterClose, params }: Props) {
  const { t } = useI18n();

  const { title, content } = useMemo(() => {
    if (params?.type === "error") {
      return {
        title: params?.title ?? `Error ${params?.code}`,
        content: (
          <>
            {params?.content || params?.message || "Unknown error occurred"} <Divider style={{ margin: "10px 0" }} />
            {params?.code && `Code: ${params?.code}`}
            {params?.message && `, ${params?.message}`}
          </>
        ),
      };
    } else if (params?.type === "confirm") {
      return {
        title: params?.title ?? "Confirm",
        content: params?.content,
      };
    }

    return {
      title: params?.title ?? "Alert",
      content: params?.content,
    };
  }, [params]);

  return (
    <Modal
      width={params?.width ?? 412}
      transitionName={"slide-up"}
      closable={false}
      {...{ open, onOk: onOk as any, onCancel, afterClose }}
      onCancel={() => {
        onCancel();
      }}
    >
      <Container>
        <Header type={params?.type ?? "info"}>
          <div role={"img"}>
            <Icon type={params?.type} />
          </div>
          {title}
        </Header>
        <Body>{content}</Body>
        <Footer>
          <Button type={"primary"} onClick={onOk}>
            {t.button.ok}
          </Button>

          {params?.type === "confirm" && <Button onClick={() => onCancel("cancel")}>{t.button.cancel}</Button>}
        </Footer>
      </Container>
    </Modal>
  );
}

const Container = styled.div`
  padding: 16px 20px;
`;
const Header = styled.div<{ type: DialogType }>`
  ${SMixinFlexRow("flex-start", "center")};
  gap: 10px;
  font-size: 16px;
  font-weight: 600;

  div[role="img"] {
    width: 20px;

    font-size: 20px;

    ${({ theme, type }) => {
      if (type === "error") {
        return css`
          color: ${theme.error_color};
        `;
      }
      return css`
        color: ${theme.primary_color};
      `;
    }}
  }
`;
const Body = styled.div`
  padding: 5px 0 0 30px;
`;
const Footer = styled.div`
  ${SMixinFlexRow("flex-end", "center")};
  margin-top: 1em;
  gap: 6px;
`;

export async function dialogModal(params?: DialogRequest) {
  const openModal = useModalStore.getState().openModal;
  return await openModal<DialogResponse>(
    (open, resolve, reject, onClose, afterClose) => (
      <DialogModal open={open} onOk={resolve} onCancel={reject} afterClose={afterClose} params={params} />
    ),
    "DialogModal",
  );
}
