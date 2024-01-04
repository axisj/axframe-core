import { AXFDGColumn, AXFDGProps } from "@axframe/datagrid";
import { DataGrid } from "@core/components/DataGrid";
import { useBtnI18n, useContainerSize, useI18n } from "hooks";
import { ExampleItem } from "@core/services/example/ExampleRepositoryInterface";
import styled from "@emotion/styled";
import React from "react";
import { PageLayout } from "styles/pageStyled";
import { use$LIST_WITH_LIST$Store } from "./use$LIST_WITH_LIST$Store";

interface DtoItem extends ExampleItem {}

interface Props {
  onClick: AXFDGProps<DtoItem>["onClick"];
}

function ListDataGrid({ onClick }: Props) {
  const { t } = useI18n("$example$");
  const btnT = useBtnI18n();

  const listColWidths = use$LIST_WITH_LIST$Store((s) => s.listColWidths);
  const listSortParams = use$LIST_WITH_LIST$Store((s) => s.listSortParams);
  const listData = use$LIST_WITH_LIST$Store((s) => s.listData);
  const listPage = use$LIST_WITH_LIST$Store((s) => s.listPage);
  const spinning = use$LIST_WITH_LIST$Store((s) => s.spinning);
  const setListColWidths = use$LIST_WITH_LIST$Store((s) => s.setListColWidths);
  const setListSortParams = use$LIST_WITH_LIST$Store((s) => s.setListSortParams);
  const changeListPage = use$LIST_WITH_LIST$Store((s) => s.changeListPage);
  const listSelectedRowKey = use$LIST_WITH_LIST$Store((s) => s.listSelectedRowKey);

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
        { key: "id", label: t("아이디"), align: "left", width: 80 },
        { key: "name", label: t("성명"), align: "left", width: 80 },
        { key: "cnsltDt", label: t("상담일자"), align: "left", width: 100 },
        { key: "area", label: t("지역"), align: "left", width: 80 },
        { key: "birthDt", label: t("생년월일"), align: "center", width: 120 },
        { key: "phone1", label: t("전화"), align: "center", width: 150 },
        { key: "cnsltHow", label: t("상담방법"), align: "left", width: 100 },
        { key: "cnsltPath", label: t("상담경로"), align: "left", width: 150 },
        { key: "fmTyp", label: t("가족유형"), align: "left", width: 100 },
        { key: "homeTyp", label: t("주거형태"), align: "left", width: 100 },
        { key: "fldA", label: t("수급여부"), align: "left", width: 100 },
        { key: "hopePoint", label: t("상담내용"), align: "left", width: 150 },
        { key: "updatedByNm", label: t("수정일자"), align: "left", width: 120 },
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
    <>
      <Header>
        <div>{t("목록")}</div>
        <ButtonGroup compact></ButtonGroup>
      </Header>
      <Container ref={containerRef}>
        <DataGrid<DtoItem>
          frozenColumnIndex={0}
          width={containerWidth}
          height={containerHeight}
          columns={columns}
          data={listData}
          spinning={spinning}
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
    </>
  );
}

const Container = styled.div`
  flex: 1;
`;
const ButtonGroup = styled(PageLayout.ButtonGroup)``;
const Header = styled(PageLayout.FrameHeader)``;

export { ListDataGrid };
