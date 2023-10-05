import { Button } from "antd";
import React from "react";
import { SearchParamComponent } from "./SearchParam";

export const SearchParamSubmitButton: SearchParamComponent = ({ label, disabled, loading, icon, style }) => {
  return (
    <Button disabled={disabled} loading={loading} icon={icon} style={style} htmlType={"submit"}>
      {label}
    </Button>
  );
};
