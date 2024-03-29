import * as React from "react";
import { StatCol, StatRowTd, StatTableStyleProps } from "./types";
import styled from "@emotion/styled";

interface Props<T> {
  tableClassName?: string;
  tableWidth: number;
  bodyRowHeight: number;
  colGroups: StatCol[];
  onClick?: (rowIndex: number, item: T) => void;
  selectedRowIndex?: number;
  rawBodyData: StatRowTd[][];
}

function StatTableRawFoot<T>({
  tableClassName,
  tableWidth,
  bodyRowHeight,
  colGroups,
  onClick,
  selectedRowIndex,
  rawBodyData,
}: Props<T>) {
  return (
    <Table style={{ minWidth: tableWidth }} bodyRowHeight={bodyRowHeight} className={tableClassName}>
      <colgroup>
        {colGroups.map((cg, cgi) => (
          <col key={cgi} width={cg.width} />
        ))}
        <col />
      </colgroup>
      <tfoot>
        {rawBodyData?.map((row, ri) => {
          return (
            <tr key={ri} className={ri === selectedRowIndex ? "selected" : ""}>
              {row.map((c, ci) => {
                return (
                  <td
                    key={ci}
                    rowSpan={c.rowspan}
                    colSpan={c.colspan}
                    align={c.align ?? "center"}
                    data-text-cell={c.textCell}
                    className={c.className}
                  >
                    {c.value}
                  </td>
                );
              })}
              <td className={"dummy"} />
            </tr>
          );
        })}
      </tfoot>
    </Table>
  );
}

const Table = styled.table<StatTableStyleProps>`
  table-layout: fixed;
  width: 100%;
  border-collapse: collapse;
  border-style: hidden;
  border-bottom: 1px solid ${(p) => p.theme.border_color_base};

  tfoot {
    td {
      background-color: transparent;
      white-space: nowrap;
      border: 1px solid ${(p) => p.theme.border_color_base};
      line-height: 20px;
      padding: 0 6.5px;
      height: ${(p) => p.bodyRowHeight}px;
      color: ${(p) => p.theme.axfdg_body_color};

      overflow: hidden;
      text-overflow: ellipsis;

      &[role="click-item"] {
        cursor: pointer;
      }
    }

    tr.selected {
      background: ${(p) => p.theme.item_active_bg};
      color: ${(p) => p.theme.primary_color};
    }
  }
`;

export { StatTableRawFoot };
