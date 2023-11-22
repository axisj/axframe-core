import React from "react";
import { SearchParamComponent } from "./SearchParam";
import { DatePicker, DatePickerProps, Form } from "antd";

export const SearchParamDate: SearchParamComponent = ({ name, label, picker, width, disabled, allowClear = true }) => {
  const onChange: DatePickerProps["onChange"] = (date, dateString) => {
    console.log(date, dateString);
  };

  return (
    <Form.Item name={name} {...(label ? { label, style: { marginBottom: 0, marginRight: 10 } } : { noStyle: true })}>
      <DatePicker
        style={{ width: width ?? 120 }}
        onChange={onChange}
        allowClear={allowClear}
        picker={picker ?? "date"}
        disabled={disabled}
      />
    </Form.Item>
  );
};
