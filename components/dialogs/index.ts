import { ApiError } from "@core/services/ApiError";
import { CustomError } from "@core/services/CustomError";
import { ApiErrorCode } from "@types";
import i18n from "i18n";
import { dialogModal, DialogRequest } from "./dialogModal";

export async function alertDialog(params?: DialogRequest) {
  await dialogModal({
    type: "info",
    ...params,
    content: params?.content ?? "alert",
  });
}

export async function confirmDialog(params?: DialogRequest) {
  return await dialogModal({
    type: "confirm",
    ...params,
    content: params?.content ?? "confirm",
  });
}

export async function errorDialog(params?: ApiError | CustomError | DialogRequest) {
  const t = i18n.t;

  if (params instanceof CustomError || params instanceof Error) {
    return await dialogModal({
      type: "error",
      ...params,
      title: Object.entries(ApiErrorCode).find(([k, v]) => v === `${params?.code}`)?.[0],
      content:
        params?.code && t(`api-error.${params.code}`)
          ? t(`api-error.${params.code}`) + (params.message ? ` [${params.message}]` : "")
          : "",
      message: params?.message,
      code: params?.code,
    });
  } else {
    return await dialogModal({
      type: "error",
      ...params,
      content: params?.content ?? "error",
    });
  }
}
