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

function ListDataGridB({ onClick }: Props) {
  const { t } = useI18n("$example$");
  const btnT = useBtnI18n();

  const listBColWidths = use$THREE_LIST$Store((s) => s.listBColWidths);
  const setListBColWidths = use$THREE_LIST$Store((s) => s.setListBColWidths);
  const listBSelectedRowKey = use$THREE_LIST$Store((s) => s.listBSelectedRowKey);
  const listBCheckedIndexes = use$THREE_LIST$Store((s) => s.listBCheckedIndexes);
  const setListBCheckedIndexes = use$THREE_LIST$Store((s) => s.setListBCheckedIndexes);
  const listBData = use$THREE_LIST$Store((s) => s.listBData);
  const spinning = use$THREE_LIST$Store((s) => s.spinning);

  const addListBData = use$THREE_LIST$Store((s) => s.addListBData);
  const delListBData = use$THREE_LIST$Store((s) => s.delListBData);
  const setListBData = use$THREE_LIST$Store((s) => s.setListBData);

  const containerRef = React.useRef<HTMLDivElement>(null);
  const { width: containerWidth, height: containerHeight } = useContainerSize(containerRef);

  const handleColumnsChange = React.useCallback(
    (columnIndex: number, width: number, columns: AXFDGColumn<DtoItem>[]) => {
      setListBColWidths(columns.map((column) => column.width));
    },
    [setListBColWidths],
  );

  const handleAddSubItem = React.useCallback(() => {
    addListBData([
      {
        type: "",
        useYn: "Y",
      },
    ]);
  }, [addListBData]);

  const handleDelSubItem = React.useCallback(() => {
    if (listBCheckedIndexes) delListBData(listBCheckedIndexes);
  }, [delListBData, listBCheckedIndexes]);

  const handleChangeData = React.useCallback(
    (ri, ci, item) => {
      setListBData([...listBData]);
    },
    [listBData, setListBData],
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
        if (listBColWidths.length > 0) {
          column.width = listBColWidths[colIndex];
          return column;
        }

        return column;
      }),
    [listBColWidths],
  );

  return (
    <>
      <Header>
        <div>{t("목록 B")}</div>
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
          data={listBData}
          spinning={spinning}
          onClick={onClick}
          onChangeColumns={handleColumnsChange}
          onChangeData={handleChangeData}
          rowKey={"id"}
          selectedRowKey={listBSelectedRowKey ?? ""}
          rowChecked={{
            checkedIndexes: listBCheckedIndexes,
            onChange: (ids, selectedAll) => {
              setListBCheckedIndexes(ids);
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

export { ListDataGridB };
