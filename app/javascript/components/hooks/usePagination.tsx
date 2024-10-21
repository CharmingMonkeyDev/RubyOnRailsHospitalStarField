import { Link } from "@mui/material";
import React, { useState, useEffect } from "react";

const usePagination = (dataArray, perPage, currentPage, selectPage) => {
  const [pageCount, setPageCount] = useState(0);
  const [pageLinks, setPageLinks] = useState([]);

  useEffect(() => {
    if (dataArray) {
      let totalPages = Math.ceil(dataArray.length / perPage);
      setPageCount(totalPages);

      const maxPagesToShow = 8;
      const middlePage = Math.floor(maxPagesToShow / 2);
      let startPage = currentPage - middlePage;
      let endPage = currentPage + middlePage;

      if (startPage < 1) {
        startPage = 1;
        endPage = Math.min(totalPages, maxPagesToShow);
      }
      if (endPage > totalPages) {
        endPage = totalPages;
        startPage = Math.max(1, totalPages - maxPagesToShow + 1);
      }

      const links = [];
      for (let i = startPage; i <= endPage; i++) {
        links.push(
          <Link
            key={i}
            onClick={() => {
              selectPage(i);
            }}
            className={currentPage === i ? "linkDark" : "linkLight"}
          >
            {i}
          </Link>
        );
      }
      setPageLinks(links);
    }
  }, [dataArray, perPage, currentPage]);

  return { pageCount, pageLinks };
};

export default usePagination;
