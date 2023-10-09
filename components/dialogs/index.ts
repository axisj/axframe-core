import { dialogModal, DialogRequest } from "./dialogModal.tsx";
import { CustomError } from "../../services/CustomError.ts";
import { ApiErrorCode } from "../../../@types";
import { getI18n } from "../../hooks";
import { ApiError } from "../../services/ApiError.ts";

export function alertDialog(params?: DialogRequest) {
  return dialogModal({
    type: "info",
    ...params,
    content: params?.content ?? "alert",
  });
}

export function confirmDialog(params?: DialogRequest) {
  return dialogModal({
    type: "confirm",
    ...params,
    content: params?.content ?? "confirm",
  });
}

export function errorDialog(params?: ApiError | CustomError | DialogRequest) {
  const { t } = getI18n();

  if (params instanceof CustomError || params instanceof Error) {
    return dialogModal({
      type: "error",
      ...params,
      title: Object.entries(ApiErrorCode).find(([k, v]) => v === `${params?.code}`)?.[0],
      content:
        params?.code && t.apiErrMsg[params.code]
          ? t.apiErrMsg[params.code] + (params.message ? ` [${params.message}]` : "")
          : "",
      message: params?.message,
      code: params?.code,
    });
  } else {
    return dialogModal({
      type: "error",
      ...params,
      content: params?.content ?? "error",
    });
  }
}
