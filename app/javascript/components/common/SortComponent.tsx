import * as React from "react";
import { ImagesContext } from "../Context";
import { SxProps, TableCell, Theme } from "@mui/material";

interface Props {
  column_name: string;
  column_title: string;
  list: any;
  setList: Function;
  sortObject: any;
  setSortObject: Function;
  className?: string;
  sx?: SxProps<Theme>;
  width?: string;
}

const SortComponent: React.FC<Props> = ({
  column_name,
  column_title,
  list,
  setList,
  sortObject,
  setSortObject,
  className = "nowrap-header",
  sx = {},
  width = "20%",
}) => {
  const images = React.useContext(ImagesContext);
  React.useEffect(() => {
    if (list.length) {
      sortList();
    }
  }, [sortObject]);

  const sortList = () => {
    const sorted = getSortedAndSearchedList();
    setList(sorted);
  };

  const setSortOrder = (sortBy, direction) => {
    let sort = {
      field: sortBy,
      direction: direction,
    };
    setSortObject(sort);
  };

  const getSortedAndSearchedList = () => {
    let sortlist = [...list];
    sortlist.sort((a, b) => (a.id > b.id ? 1 : -1));

    if (sortObject.field) {
      sortlist.sort((a, b) =>
        a[sortObject.field]?.toLowerCase() > b[sortObject.field]?.toLowerCase()
          ? 1
          : -1
      );
    }

    if (sortObject.direction == "descending") {
      sortlist.reverse();
    }
    return sortlist;
  };

  return (
    <TableCell
      className={className}
      sx={sx}
      style={{ cursor: "pointer" }}
      width={width}
      onClick={() => {
        setSortOrder(
          column_name,
          sortObject.direction == "ascending" ? "descending" : "ascending"
        );
      }}
    >
      <div className="row">
        {column_title}
        {sortObject.field == column_name ? (
          <span className="sortIndicator">
            {sortObject.direction == "ascending" ? (
              <img
                src={images.sort_ascending_src}
                width="10"
                className="sort-icon"
                alt="Sort Asc"
              />
            ) : (
              <img
                src={images.sort_descending_src}
                width="10"
                className="sort-icon"
                alt="Sort Desc"
              />
            )}
          </span>
        ) : (
          <span className="sortIndicator">
            <img
              src={images.sort_plain_src}
              width="10"
              className="sort-icon"
              alt="Sort Asc"
            />
          </span>
        )}
      </div>
    </TableCell>
  );
};

export default SortComponent;