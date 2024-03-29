import { Checkbox, Form } from "antd";
import { CheckboxChangeEvent } from "antd/es/checkbox";
import React from "react";
import { useI18n } from "../../../hooks";
import { SearchParamComponent } from "./SearchParam";

export const SearchParamCheckbox: SearchParamComponent = ({
  name,
  options = [],
  label,
  checkAllItem,
  onChangedComponentValue,
  disabled,
}) => {
  const { t } = useI18n();
  const form = Form.useFormInstance();
  const checkedAll = Form.useWatch(name, form) || [];

  const onCheckAllChange = (e: CheckboxChangeEvent) => {
    const list = e.target.checked ? options.map((opt) => opt.value) : [];
    form.setFieldValue(name, list);
    onChangedComponentValue?.();
  };

  return (
    <Form.Item {...(label ? { label, style: { marginRight: 10 } } : { noStyle: true })}>
      {checkAllItem && (
        <Checkbox
          indeterminate={checkedAll.length < options.length}
          onChange={onCheckAllChange}
          checked={checkedAll.length === options.length}
          disabled={disabled}
        >
          {t("checkAll")}
        </Checkbox>
      )}

      <Form.Item name={name} noStyle>
        <Checkbox.Group options={options} disabled={disabled} />
      </Form.Item>
    </Form.Item>
  );
};
