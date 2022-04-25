import React, { useState, useContext, useEffect } from "react";
import { MyContext } from "./MyContext";
import {
  Table,
} from "react-bootstrap";
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
    const offset =
      (myValues.currentPaginationPage - 1) * parseInt(myValues.pagesPerSite);
    const limit = offset + parseInt(myValues.pagesPerSite);
    const tempCurrentPages = pages.slice(offset, limit);
    setCurrentPages(tempCurrentPages);
  }

  useEffect(() => {
    if (updatedPages.length > 0) {
      getCurrentPages(updatedPages);
    } else {
      getCurrentPages(pageArray);
    }
  }, [myValues.currentPaginationPage, updatedPages, myValues.pagesPerSite]);

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
            <tr key={index}>
              <td>{index}</td>
              <td>
                <a href={page.url} target="_blank" rel="noreferrer">
                  {page.title}
                </a>
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
