import { Form, Select } from "antd";
import React from "react";
import { SearchParamComponent } from "./SearchParam";

export const SearchParamSelect: SearchParamComponent = ({
  name,
  placeholder,
  options,
  label,
  width,
  loading,
  disabled,
  allowClear = true,
  showSearch = true,
}) => {
  return (
    <Form.Item name={name} {...(label ? { label, style: { marginBottom: 0, marginRight: 10 } } : { noStyle: true })}>
      <Select
        placeholder={placeholder}
        showSearch={showSearch}
        allowClear={allowClear}
        style={{ minWidth: 50, width }}
        loading={loading}
        options={options}
        disabled={disabled || loading}
      />
    </Form.Item>
  );
};
