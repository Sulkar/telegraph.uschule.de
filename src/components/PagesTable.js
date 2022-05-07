import React, { useState, useContext, useEffect } from "react";
import { MyContext } from "./MyContext";
import { Table } from "react-bootstrap";
import PagesPagination from "./PagesPagination";

export default function PagesTable({ pageArray }) {
  const [myValues, setMyValues] = useContext(MyContext);
  const [currentPages, setCurrentPages] = useState([]); //part of pages that you see in table
  const [updatedPages, setUpdatedPages] = useState([]); //all pages that are modified through sorting, ...
  const [sortConfig, setSortConfig] = useState(null);

  //sort table
  function sortFields(field, type) {
    let direction = "asc";

    if (
      sortConfig &&
      sortConfig.field === field &&
      sortConfig.direction === "asc"
    ) {
      direction = "desc";
    }
    setSortConfig({ field, direction });

    let sortedPages = [...pageArray];

    if (type === "string") {
      sortedPages.sort((a, b) => {
        if (a[field].toLowerCase() < b[field].toLowerCase()) {
          return direction === "asc" ? -1 : 1;
        }
        if (a[field].toLowerCase() > b[field].toLowerCase()) {
          return direction === "asc" ? 1 : -1;
        }
        return 0;
      });
    } else if (type === "number") {
      sortedPages.sort((a, b) => {
        if (a[field] < b[field]) {
          return direction === "asc" ? -1 : 1;
        }
        if (a[field] > b[field]) {
          return direction === "asc" ? 1 : -1;
        }
        return 0;
      });
    } else if (type === "date") {
      sortedPages.sort((a, b) => {
        const tempDiff = new Date(b[field]) - new Date(a[field]);

        return direction === "asc" ? tempDiff : tempDiff * -1;
      });
    }

    setUpdatedPages(sortedPages);
  }

  function getCurrentPages(pages) {
    var filteredPages = [];

    if (myValues.showDeletedPages) {
      filteredPages = pages;
    } else {
      filteredPages = pages.filter(function (page) {
        return !page.deleted;
      });
    }

    const offset =
      (myValues.currentPaginationPage - 1) * parseInt(myValues.pagesPerSite);
    const limit = offset + parseInt(myValues.pagesPerSite);
    const tempCurrentPages = filteredPages.slice(offset, limit);
    setCurrentPages(tempCurrentPages);
  }

  function handlePageDelete(page) {
    setMyValues((oldValues) => ({
      ...oldValues,
      showDeletePageModal: true,
      deletePagePath: page.path,
      deletePageTitle: page.title,
    }));
  }

  useEffect(() => {
    if (updatedPages.length > 0) {
      getCurrentPages(updatedPages);
    } else {
      //on page load: first call
      getCurrentPages(pageArray);
    }
  }, [
    myValues.currentPaginationPage,
    updatedPages,
    myValues.pagesPerSite,
    myValues.showDeletedPages,
    myValues.showDeletePageModal,
  ]);

  return (
    <>
      <Table striped bordered hover style={{ width: "90%" }}>
        <thead>
          <tr>
            <th>#</th>
            <th
              onClick={() => sortFields("title", "string")}
              style={{ cursor: "pointer", width: "70%" }}
            >
              page title
            </th>

            <th
              onClick={() => sortFields("views", "number")}
              style={{ cursor: "pointer" }}
            >
              views
            </th>
            <th
              onClick={() => sortFields("pageDate", "date")}
              style={{ cursor: "pointer" }}
            >
              date
            </th>
          </tr>
        </thead>
        <tbody>
          {currentPages.map((page, index) => (
            <tr
              key={
                (myValues.currentPaginationPage - 1) * myValues.pagesPerSite +
                index +
                1
              }
            >
              <td>
                {(myValues.currentPaginationPage - 1) * myValues.pagesPerSite +
                  index +
                  1}
              </td>
              <td>
                <a href={page.url} target="_blank" rel="noreferrer">
                  {page.title}
                </a>
                <span
                  style={{
                    float: "right",
                    cursor: "pointer",
                    color: "#dc3545",
                  }}
                  onClick={() => handlePageDelete(page)}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    viewBox="0 0 16 16"
                  >
                    <path d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5ZM11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H2.506a.58.58 0 0 0-.01 0H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1h-.995a.59.59 0 0 0-.01 0H11Zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5h9.916Zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47ZM8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5Z" />
                  </svg>
                </span>
              </td>
              <td>{page.views}</td>
              <td>{page.pageDate}</td>
            </tr>
          ))}
        </tbody>
      </Table>
      <PagesPagination />
    </>
  );
}
