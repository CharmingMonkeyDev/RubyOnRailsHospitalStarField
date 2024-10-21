export const setSortOrder = (sortBy, direction, setSortObject) => {
  let sort = {
    field: sortBy,
    direction: direction,
  };
  setSortObject(sort);
};

export const getSortedListByDate = (
  sortingList,
  sortObject,
  columnSortField
) => {
  let sortedList = [...sortingList];

  sortedList.sort((a, b) => (a.id > b.id ? 1 : -1));
  if (sortObject.field == columnSortField) {
    sortedList.sort((a, b) =>
      new Date(a[columnSortField]) > new Date(b[columnSortField]) ? 1 : -1
    );
  }

  if (sortObject.direction == "descending") {
    sortedList.reverse();
  }

  return sortedList;
};

export const getSortedListByString = (
  sortingList,
  sortObject,
  columnSortField
) => {
  let sortedList = [...sortingList];

  if (sortObject.field == columnSortField) {
    sortedList.sort((a, b) =>
      a[columnSortField]?.toLowerCase() > b[columnSortField]?.toLowerCase()
        ? 1
        : -1
    );
  }

  if (sortObject.direction == "descending") {
    sortedList.reverse();
  }

  return sortedList;
};

export const getSortedListByNumber = (
  sortingList,
  sortObject,
  columnSortField
) => {
  let sortedList = [...sortingList];

  if (sortObject.field == columnSortField) {
    sortedList.sort((a, b) =>
      a[columnSortField] > b[columnSortField] ? 1 : -1
    );
  }

  if (sortObject.direction == "descending") {
    sortedList.reverse();
  }

  return sortedList;
};
