import { alertDialog, errorDialog } from "@core/components/dialogs";
import { DialogRequest } from "@core/components/dialogs/dialogModal";
import { ApiErrorCode } from "@types";
import i18n from "i18n";

const knownErrorCodes = [
  ApiErrorCode.SQL_DUPLICATE_ERROR,
  ApiErrorCode.SQL_DATA_INTEGRITY,
  ApiErrorCode.FILE_EXTEND_ERROR,
  ApiErrorCode.SAME_REQ_EXCEPTION,
];

export async function errorHandler(err: any, msgs?: Record<string, any>) {
  const t = i18n.t;

  if (err === "confirm_cancel") {
    return true;
  }
  if (err?.nativeEvent) {
    return true;
  }

  try {
    if (err?.code) {
      if (knownErrorCodes.includes(err.code)) {
        await alertDialog({
          content: msgs?.[err.code] ?? t(`api-error.${err.code}`) + (err.data ? `\n[${err.data}]` : ""),
        });
      } else {
        await errorDialog({
          code: err.code,
          content: err.message,
          data: err.data,
        } as DialogRequest);
      }
    } else {
      if (err?.message) {
        await alertDialog({ content: err.message });
      }
    }
  } catch (e) {
    if (e === "dialog_cancel") {
      return true;
    } else {
      console.error(e);
    }
  }
}
