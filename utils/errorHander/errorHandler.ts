import { getI18n } from "@core/hooks";
import { ApiErrorCode } from "@types";
import { alertDialog, errorDialog } from "@core/components/dialogs";

const knownErrorCodes = [
  ApiErrorCode.SQL_DUPLICATE_ERROR,
  ApiErrorCode.SQL_DATA_INTEGRITY,
  ApiErrorCode.FILE_EXTEND_ERROR,
  ApiErrorCode.SAME_REQ_EXCEPTION,
];

export async function errorHandler(err: any, msgs?: Record<string, any>) {
  const { t } = getI18n();

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
          content: msgs?.[err.code] ?? t.apiErrMsg[err.code],
        });
      } else {
        await errorDialog(err);
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

export function getErrorMsg(err: any) {
  if (err?.code) {
    return getI18n().t.apiErrMsg[err.code] ?? `Error : ${err.code}`;
  }
  return err?.message;
}
