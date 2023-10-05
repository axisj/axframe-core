import { Button } from "antd";
import React from "react";
import { SearchParamComponent } from "./SearchParam";

export const SearchParamButton: SearchParamComponent = ({ label, disabled, loading, icon, style, onClick }) => {
  return (
    <Button disabled={disabled} loading={loading} icon={icon} style={style} htmlType={"button"} onClick={onClick}>
      {label}
    </Button>
  );
};
