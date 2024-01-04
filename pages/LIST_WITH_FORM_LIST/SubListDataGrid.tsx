import { AXFDGColumn, AXFDGDataItemStatus } from "@axframe/datagrid";
import { DataGrid } from "@core/components/DataGrid";
import { ExampleSubItem } from "@core/services/example/ExampleRepositoryInterface";
import styled from "@emotion/styled";
import { Button, Tag } from "antd";
import { getSelectEditor, InputEditor } from "components/dataGridEditor";
import { useBtnI18n, useContainerSize, useI18n } from "hooks";
import React from "react";
import { PageLayout } from "../../../styles/pageStyled";
import { use$LIST_WITH_FORM_LIST$Store } from "./use$LIST_WITH_FORM_LIST$Store";

interface DtoItem extends ExampleSubItem {}

interface Props {}

const ITEM_STAT = {
  [AXFDGDataItemStatus.new]: <Tag color='processing'>C</Tag>,
  [AXFDGDataItemStatus.edit]: <Tag color='warning'>U</Tag>,
  [AXFDGDataItemStatus.remove]: <Tag color='error'>D</Tag>,
};

function SubListDataGrid({}: Props) {
  const { t } = useI18n("$example$");
  const btnT = useBtnI18n();
  const subListColWidths = use$LIST_WITH_FORM_LIST$Store((s) => s.subListColWidths);
  const subListData = use$LIST_WITH_FORM_LIST$Store((s) => s.subListData);
  const subListSpinning = use$LIST_WITH_FORM_LIST$Store((s) => s.subListSpinning);
  const subListSelectedRowKey = use$LIST_WITH_FORM_LIST$Store((s) => s.subListSelectedRowKey);
  const setSubListColWidths = use$LIST_WITH_FORM_LIST$Store((s) => s.setSubListColWidths);

  const addSubList = use$LIST_WITH_FORM_LIST$Store((s) => s.addSubList);
  const delSubList = use$LIST_WITH_FORM_LIST$Store((s) => s.delSubList);
  const setSubListData = use$LIST_WITH_FORM_LIST$Store((s) => s.setSubListData);
  const subListCheckedIndexes = use$LIST_WITH_FORM_LIST$Store((s) => s.subListCheckedIndexes);
  const setSubListCheckedIndexes = use$LIST_WITH_FORM_LIST$Store((s) => s.setSubListCheckedIndexes);

  const containerRef = React.useRef<HTMLDivElement>(null);
  const { width: containerWidth, height: containerHeight } = useContainerSize(containerRef);

  const handleColumnsChange = React.useCallback(
    (columnIndex: number, width: number, columns: AXFDGColumn<DtoItem>[]) => {
      setSubListColWidths(columns.map((column) => column.width));
    },
    [setSubListColWidths],
  );

  const handleAddSubItem = React.useCallback(() => {
    addSubList([
      {
        type: "",
        useYn: "Y",
      },
    ]);
  }, [addSubList]);

  const handleDelSubItem = React.useCallback(() => {
    if (subListCheckedIndexes) delSubList(subListCheckedIndexes);
  }, [delSubList, subListCheckedIndexes]);

  const handleChangeData = React.useCallback(
    (ri, ci, item) => {
      setSubListData([...subListData]);
    },
    [setSubListData, subListData],
  );

  const columns = React.useMemo(
    () =>
      (
        [
          {
            key: "_",
            label: "Status",
            align: "left",
            width: 80,
            itemRender: ({ item }) => {
              return item.status !== undefined ? ITEM_STAT[item.status] : "";
            },
          },
          {
            key: "code",
            label: "Code",
            align: "left",
            width: 80,
            itemRender: InputEditor,
            getClassName: (item) => "datagrid-editable",
          },
          {
            key: "type",
            label: "Type",
            align: "left",
            width: 100,
            itemRender: InputEditor,
            getClassName: (item) => "datagrid-editable",
          },
          {
            key: "useYn",
            label: "Use YN",
            align: "left",
            width: 120,
            itemRender: getSelectEditor([
              { value: "Y", label: "사용" },
              { value: "N", label: "사용안함" },
            ]),
            getClassName: (item) => "datagrid-editable",
          },
        ] as AXFDGColumn<DtoItem>[]
      ).map((column, colIndex) => {
        if (subListColWidths.length > 0) {
          column.width = subListColWidths[colIndex];
          return column;
        }

        return column;
      }),
    [subListColWidths],
  );

  return (
    <>
      <FormBoxHeader>
        <div>LIST</div>
        <ButtonGroup compact>
          <Button onClick={handleAddSubItem}>{btnT("추가")}</Button>
          <Button onClick={handleDelSubItem}>{btnT("삭제")}</Button>
        </ButtonGroup>
      </FormBoxHeader>

      <Container ref={containerRef}>
        <DataGrid<DtoItem>
          frozenColumnIndex={0}
          width={containerWidth}
          height={containerHeight}
          columns={columns}
          data={subListData}
          spinning={subListSpinning}
          onChangeColumns={handleColumnsChange}
          onChangeData={handleChangeData}
          rowKey={"code"}
          selectedRowKey={subListSelectedRowKey ?? ""}
          rowChecked={{
            checkedIndexes: subListCheckedIndexes,
            onChange: (ids, selectedAll) => {
              console.log("onChange rowSelection", ids, selectedAll);
              setSubListCheckedIndexes(ids);
            },
          }}
          editable
        />
      </Container>
    </>
  );
}

const Container = styled.div`
  height: 300px;
`;
const FormBoxHeader = styled(PageLayout.ContentBoxHeader)``;
const ButtonGroup = styled(PageLayout.ButtonGroup)``;

export { SubListDataGrid };
