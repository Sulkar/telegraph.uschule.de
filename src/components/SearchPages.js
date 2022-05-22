import React, { useState, useEffect, useContext, useRef } from "react";
import { Alert, FormControl } from "react-bootstrap";
import { MyContext } from "./MyContext";

export default function SearchPages() {
  const [myValues, setMyValues] = useContext(MyContext);
  const [value, setValue] = useState("");
  const initialLoad = useRef(true);

  useEffect(() => {
    if (!initialLoad.current) {
      filterPages(myValues.pageFilter);
    }
  }, [myValues.allPages, myValues.showDeletedPages]);

  useEffect(() => {
    initialLoad.current = false;
  }, []);

  function handleSearchInput(e) {
    const filterString = e.target.value;
    setValue(filterString);
    filterPages(filterString);
  }
  //filter pages based on search string
  function filterPages(filterString) {
    console.log("filterPages()");
    let filteredPages = myValues.allPages.filter((page) => {
      if (myValues.showDeletedPages) {
        if (page.title.toLowerCase().includes(filterString)) {
          return page;
        }
      } else {
        if (!page.deleted && page.title.toLowerCase().includes(filterString)) {
          return page;
        }
      }
    });
    setMyValues((oldValues) => ({
      ...oldValues,
      pageFilter: filterString,
      filteredPages: filteredPages,
      currentPageCount: filteredPages.length,
      currentPaginationPage: 1,
    }));
  }

  return (
    <>
      <FormControl
        autoFocus
        className="my-2 w-auto"
        placeholder="Type to filter..."
        onChange={(e) => {
          handleSearchInput(e);
        }}
        value={value}
      />
    </>
  );
}
