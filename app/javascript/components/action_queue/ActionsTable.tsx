/* eslint-disable react-hooks/exhaustive-deps */
import { Link, Paper } from "@mui/material";
import {
  KeyboardArrowRight,
  KeyboardArrowLeft,
  ArrowForward,
  ArrowBack,
} from "@mui/icons-material";

import {
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import * as React from "react";

// helpers
import { useEffect } from "react";
import SortableHeaderColumn from "../shared/tables/SortableHeaderColumn";
import { getSortedListByString } from "../shared/tables/TableHelper";
import usePagination from "../hooks/usePagination";

interface Props {
  csrfToken: string;
  setError: any;
  setDisabledButton: any;
  reloadHook: boolean;
  setReloadHook: any;
  actionStatuses: any;
  action_queue_assign_icon: string;
  sort_ascending_src: string;
  sort_descending_src: string;
  sort_plain_src: string;
  actionListFragments: any;
  setActionsList: Function;
  actionsList: any;
}

const ActionsTable: React.FC<Props> = (props: Props) => {
  const { actionListFragments, actionsList, setActionsList } = props;

  const [sortObject, setSortObject] = React.useState<any>({
    field: "created_at",
    direction: "descending",
  });

  // pagination states
  const [currentPage, setCurrentPage] = React.useState<number>(1);
  const [paginatedList, setPaginatedList] = React.useState<any>([]);
  const perPage = 10;

  const selectPage = (page) => {
    setCurrentPage(page);
  };
  const { pageCount, pageLinks } = usePagination(
    actionsList,
    perPage,
    currentPage,
    selectPage
  );

  const paginateList = (list) => {
    if (list.length == 0) {
      return [];
    } else {
      let providerList = list;
      if (currentPage == 1) {
        return providerList.slice(0, perPage);
      } else {
        let offsetIndex = perPage * (currentPage - 1);
        return providerList.slice(offsetIndex, offsetIndex + perPage);
      }
    }
  };

  const updatePagination = () => {
    setPaginatedList(paginateList(actionListFragments));
  };

  React.useEffect(() => {
    updatePagination();
  }, [actionsList, currentPage]);

  useEffect(() => {
    if (actionsList) {
      sortList();
    }
  }, [sortObject]);

  const sortList = () => {
    switch (sortObject.field) {
      case "provider_name":
        setActionsList(
          getSortedListByString(actionsList, sortObject, "provider_name")
        );
        break;
      case "name":
        setActionsList(getSortedListByString(actionsList, sortObject, "name"));
        break;
      case "text":
        setActionsList(getSortedListByString(actionsList, sortObject, "text"));
        break;
      case "due_date":
        setActionsList(
          getSortedListByString(actionsList, sortObject, "due_date")
        );
        break;
      default:
        break;
    }
  };

  return (
    <>
      <TableContainer component={Paper} className="tableContainer">
        <Table className="table" aria-label="simple table">
          <TableHead>
            <TableRow>
              <SortableHeaderColumn
                setSortObject={setSortObject}
                sortObject={sortObject}
                sort_ascending_src={props.sort_ascending_src}
                sort_plain_src={props.sort_plain_src}
                sort_descending_src={props.sort_descending_src}
                columnTitle="Patient"
                columnSortField="name"
              />
              <SortableHeaderColumn
                setSortObject={setSortObject}
                sortObject={sortObject}
                sort_ascending_src={props.sort_ascending_src}
                sort_plain_src={props.sort_plain_src}
                sort_descending_src={props.sort_descending_src}
                columnTitle="Action"
                columnSortField="text"
              />
              <SortableHeaderColumn
                setSortObject={setSortObject}
                sortObject={sortObject}
                sort_ascending_src={props.sort_ascending_src}
                sort_plain_src={props.sort_plain_src}
                sort_descending_src={props.sort_descending_src}
                columnTitle="Provider"
                columnSortField="provider_name"
              />
              <SortableHeaderColumn
                setSortObject={setSortObject}
                sortObject={sortObject}
                sort_ascending_src={props.sort_ascending_src}
                sort_plain_src={props.sort_plain_src}
                sort_descending_src={props.sort_descending_src}
                columnTitle="Due Date"
                columnSortField="due_date"
              />
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedList ? (
              paginatedList.map((actionFragment) => {
                return actionFragment;
              })
            ) : (
              <p>No actions found.</p>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <p className="pagerLinks">
        <Link
          onClick={() => {
            selectPage(1);
          }}
          className="linkDark"
        >
          <ArrowBack />
        </Link>
        <Link
          onClick={() => {
            selectPage(currentPage > 1 ? currentPage - 1 : currentPage);
          }}
          className="linkDark"
        >
          <KeyboardArrowLeft />
        </Link>
        {pageLinks}
        <Link
          onClick={() => {
            selectPage(currentPage < pageCount ? currentPage + 1 : currentPage);
          }}
          className="linkDark"
        >
          <KeyboardArrowRight />
        </Link>
        <Link
          onClick={() => {
            selectPage(pageCount);
          }}
          className="linkDark"
        >
          <ArrowForward />
        </Link>
      </p>
    </>
  );
};

export default ActionsTable;
