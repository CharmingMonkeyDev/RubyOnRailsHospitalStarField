/* eslint-disable prettier/prettier */

import { TableCell } from "@mui/material";
import React from "react";
import { setSortOrder } from "./TableHelper";

interface Props {
  sortObject: any;
  setSortObject: Function;
  sort_ascending_src: string;
  sort_descending_src: string;
  sort_plain_src: string;
  columnTitle: string;
  columnSortField: string;
}
const SortableHeaderColumn: React.FC<Props> = (props: any) => {
  const { sortObject, columnTitle, columnSortField, setSortObject } = props;

  return (
    <TableCell
      align="left"
      onClick={() => {
        setSortOrder(
          columnSortField,
          sortObject.direction == "ascending" ? "descending" : "ascending",
          setSortObject
        );
      }}
      style={{ cursor: "pointer" }}
      className="table-header name-header provider"
    >
      <strong style={{ fontFamily: "QuicksandMedium" }}>
        {columnTitle}
      </strong>
      {sortObject.field == columnSortField ? (
        <span className="sortIndicator provider">
          {sortObject.direction == "ascending" ? (
            <img
              src={props.sort_ascending_src}
              width="10"
              className="sort-icon"
              alt="Sort Asc"
            />
          ) : (
            <img
              src={props.sort_descending_src}
              width="10"
              className="sort-icon"
              alt="Sort Desc"
            />
          )}
        </span>
      ) : (
        <span className="sortIndicator provider">
          <img
            src={props.sort_plain_src}
            width="10"
            className="sort-icon"
            alt="Sort Asc"
          />
        </span>
      )}
    </TableCell>
  );
};

export default SortableHeaderColumn;
