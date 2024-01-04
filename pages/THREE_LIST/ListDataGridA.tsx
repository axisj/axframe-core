import { AXFDGColumn, AXFDGProps } from "@axframe/datagrid";
import { DataGrid } from "@core/components/DataGrid";
import { ExampleSubItem } from "@core/services/example/ExampleRepositoryInterface";
import styled from "@emotion/styled";
import { Button } from "antd";
import { getSelectEditor, InputEditor } from "components/dataGridEditor";
import { useBtnI18n, useContainerSize, useI18n } from "hooks";
import React from "react";
import { PageLayout } from "styles/pageStyled";
import { ITEM_STAT } from "./Types";
import { use$THREE_LIST$Store } from "./use$THREE_LIST$Store";

interface DtoItem extends ExampleSubItem {}

interface Props {
  onClick?: AXFDGProps<DtoItem>["onClick"];
}

function ListDataGridA({ onClick }: Props) {
  const { t } = useI18n("$example$");
  const btnT = useBtnI18n();

  const listAColWidths = use$THREE_LIST$Store((s) => s.listAColWidths);
  const setListAColWidths = use$THREE_LIST$Store((s) => s.setListAColWidths);
  const listASelectedRowKey = use$THREE_LIST$Store((s) => s.listASelectedRowKey);
  const listACheckedIndexes = use$THREE_LIST$Store((s) => s.listACheckedIndexes);
  const setListACheckedIndexes = use$THREE_LIST$Store((s) => s.setListACheckedIndexes);
  const listAData = use$THREE_LIST$Store((s) => s.listAData);
  const spinning = use$THREE_LIST$Store((s) => s.spinning);

  const addListAData = use$THREE_LIST$Store((s) => s.addListAData);
  const delListAData = use$THREE_LIST$Store((s) => s.delListAData);
  const setListAData = use$THREE_LIST$Store((s) => s.setListAData);

  const containerRef = React.useRef<HTMLDivElement>(null);
  const { width: containerWidth, height: containerHeight } = useContainerSize(containerRef);

  const handleColumnsChange = React.useCallback(
    (columnIndex: number, width: number, columns: AXFDGColumn<DtoItem>[]) => {
      setListAColWidths(columns.map((column) => column.width));
    },
    [setListAColWidths],
  );

  const handleAddSubItem = React.useCallback(() => {
    addListAData([
      {
        type: "",
        useYn: "Y",
      },
    ]);
  }, [addListAData]);

  const handleDelSubItem = React.useCallback(() => {
    if (listACheckedIndexes) delListAData(listACheckedIndexes);
  }, [delListAData, listACheckedIndexes]);

  const handleChangeData = React.useCallback(
    (ri, ci, item) => {
      setListAData([...listAData]);
    },
    [listAData, setListAData],
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
          { key: "code", label: "Code", align: "left", width: 80, itemRender: InputEditor },
          { key: "type", label: "Type", align: "left", width: 100, itemRender: InputEditor },
          {
            key: "useYn",
            label: "Use YN",
            align: "left",
            width: 120,
            itemRender: getSelectEditor([
              { value: "Y", label: "사용" },
              { value: "N", label: "사용안함" },
            ]),
          },
        ] as AXFDGColumn<DtoItem>[]
      ).map((column, colIndex) => {
        if (listAColWidths.length > 0) {
          column.width = listAColWidths[colIndex];
          return column;
        }

        return column;
      }),
    [listAColWidths],
  );

  return (
    <>
      <Header>
        <div>{t("목록 A")}</div>
        <ButtonGroup compact>
          <Button onClick={handleAddSubItem}>{btnT("추가")}</Button>
          <Button onClick={handleDelSubItem}>{btnT("삭제")}</Button>
        </ButtonGroup>
      </Header>

      <Container ref={containerRef}>
        <DataGrid<DtoItem>
          frozenColumnIndex={0}
          width={containerWidth}
          height={containerHeight}
          columns={columns}
          data={listAData}
          spinning={spinning}
          onClick={onClick}
          onChangeColumns={handleColumnsChange}
          onChangeData={handleChangeData}
          rowKey={"id"}
          selectedRowKey={listASelectedRowKey ?? ""}
          rowChecked={{
            checkedIndexes: listACheckedIndexes,
            onChange: (ids, selectedAll) => {
              setListACheckedIndexes(ids);
            },
          }}
          editable
        />
      </Container>
    </>
  );
}

const Container = styled.div`
  flex: 1;
`;
const Header = styled(PageLayout.FrameHeader)``;
const ButtonGroup = styled(PageLayout.ButtonGroup)``;

export { ListDataGridA };
