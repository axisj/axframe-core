import { AXFDGColumn, AXFDGProps } from "@axframe/datagrid";
import { DataGrid } from "@core/components/DataGrid";
import { useContainerSize, useI18n } from "hooks";
import { ExampleItem } from "@core/services/example/ExampleRepositoryInterface";
import styled from "@emotion/styled";
import React from "react";
import { use$LIST_WITH_FORM_ROW$Store } from "./use$LIST_WITH_FORM_ROW$Store";

interface DtoItem extends ExampleItem {}

interface Props {
  onClick: AXFDGProps<DtoItem>["onClick"];
}

function ListDataGrid({ onClick }: Props) {
  const { t } = useI18n("$example$");
  const _t: any = {};

  const listColWidths = use$LIST_WITH_FORM_ROW$Store((s) => s.listColWidths);
  const listSortParams = use$LIST_WITH_FORM_ROW$Store((s) => s.listSortParams);
  const listData = use$LIST_WITH_FORM_ROW$Store((s) => s.listData);
  const listPage = use$LIST_WITH_FORM_ROW$Store((s) => s.listPage);
  const listSpinning = use$LIST_WITH_FORM_ROW$Store((s) => s.listSpinning);
  const setListColWidths = use$LIST_WITH_FORM_ROW$Store((s) => s.setListColWidths);
  const setListSortParams = use$LIST_WITH_FORM_ROW$Store((s) => s.setListSortParams);
  const changeListPage = use$LIST_WITH_FORM_ROW$Store((s) => s.changeListPage);
  const listSelectedRowKey = use$LIST_WITH_FORM_ROW$Store((s) => s.listSelectedRowKey);

  const containerRef = React.useRef<HTMLDivElement>(null);
  const { width: containerWidth, height: containerHeight } = useContainerSize(containerRef);

  const handleColumnsChange = React.useCallback(
    (columnIndex: number, width: number, columns: AXFDGColumn<DtoItem>[]) => {
      setListColWidths(columns.map((column) => column.width));
    },
    [setListColWidths],
  );

  const columns = React.useMemo(() => {
    return (
      [
        { key: "id", label: _t.label.id, align: "left", width: 80 },
        { key: "name", label: _t.label.name, align: "left", width: 80 },
        { key: "cnsltDt", label: _t.label.cnsltDt, align: "left", width: 100 },
        { key: "area", label: _t.label.area, align: "left", width: 80 },
        { key: "birthDt", label: _t.label.birthDt, align: "center", width: 120 },
        { key: "phone1", label: _t.label.phone1, align: "center", width: 150 },
        { key: "cnsltHow", label: _t.label.cnsltHow, align: "left", width: 100 },
        { key: "cnsltPath", label: _t.label.cnsltPath, align: "left", width: 150 },
        { key: "fmTyp", label: _t.label.fmTyp, align: "left", width: 100 },
        { key: "homeTyp", label: _t.label.homeTyp, align: "left", width: 100 },
        { key: "fldA", label: _t.label.fldA, align: "left", width: 100 },
        { key: "hopePoint", label: _t.label.hopePoint, align: "left", width: 150 },
        { key: "updatedByNm", label: _t.label.updatedByNm, align: "left", width: 120 },
      ] as AXFDGColumn<DtoItem>[]
    ).map((column, colIndex) => {
      if (listColWidths.length > 0) {
        column.width = listColWidths[colIndex];
        return column;
      }

      return column;
    });
  }, [_t, listColWidths]);

  return (
    <Container ref={containerRef}>
      <DataGrid<DtoItem>
        frozenColumnIndex={0}
        width={containerWidth}
        height={containerHeight}
        columns={columns}
        data={listData}
        spinning={listSpinning}
        onClick={onClick}
        page={{
          ...listPage,
          loading: false,
          onChange: async (currentPage, pageSize) => {
            await changeListPage(currentPage, pageSize);
          },
        }}
        // sort={{
        //   sortParams: listSortParams,
        //   onChange: setListSortParams,
        // }}
        onChangeColumns={handleColumnsChange}
        rowKey={"id"}
        selectedRowKey={listSelectedRowKey ?? ""}
      />
    </Container>
  );
}

const Container = styled.div`
  flex: 1;
`;

export { ListDataGrid };
