import React from "react";
import styled from "@emotion/styled";
import { ExampleItem } from "@core/services/example/ExampleRepositoryInterface";
import { DataGrid } from "@core/components/DataGrid";
import { useBtnI18n, useContainerSize, useI18n } from "@core/hooks";
import { AXFDGColumn, AXFDGProps } from "@axframe/datagrid";

import { use$LIST$Store } from "./use$LIST$Store";

interface DtoItem extends ExampleItem {}

interface Props {
  onClick: AXFDGProps<DtoItem>["onClick"];
}

function ListDataGrid({ onClick }: Props) {
  const { t } = useI18n("$example$");
  const btnT = useBtnI18n();

  const listColWidths = use$LIST$Store((s) => s.listColWidths);
  const listSortParams = use$LIST$Store((s) => s.listSortParams);
  const listData = use$LIST$Store((s) => s.listData);
  const listPage = use$LIST$Store((s) => s.listPage);
  const listSpinning = use$LIST$Store((s) => s.listSpinning);
  const setListColWidths = use$LIST$Store((s) => s.setListColWidths);
  const setListSortParams = use$LIST$Store((s) => s.setListSortParams);
  const changeListPage = use$LIST$Store((s) => s.changeListPage);

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
        { key: "id", label: t("id"), align: "left", width: 80 },
        { key: "name", label: t("name"), align: "left", width: 80 },
        { key: "cnsltDt", label: t("cnsltDt"), align: "left", width: 100 },
        { key: "area", label: t("area"), align: "left", width: 80 },
        { key: "birthDt", label: t("birthDt"), align: "center", width: 120 },
        { key: "phone1", label: t("phone1"), align: "center", width: 150 },
        { key: "cnsltHow", label: t("cnsltHow"), align: "left", width: 100 },
        { key: "cnsltPath", label: t("cnsltPath"), align: "left", width: 150 },
        { key: "fmTyp", label: t("fmTyp"), align: "left", width: 100 },
        { key: "homeTyp", label: t("homeTyp"), align: "left", width: 100 },
        { key: "fldA", label: t("fldA"), align: "left", width: 100 },
        { key: "hopePoint", label: t("hopePoint"), align: "left", width: 150 },
        { key: "updatedByNm", label: t("updatedByNm"), align: "left", width: 120 },
      ] as AXFDGColumn<DtoItem>[]
    ).map((column, colIndex) => {
      if (listColWidths.length > 0) {
        column.width = listColWidths[colIndex];
        return column;
      }

      return column;
    });
  }, [t, listColWidths]);

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
      />
    </Container>
  );
}

const Container = styled.div`
  flex: 1;
`;

export { ListDataGrid };
