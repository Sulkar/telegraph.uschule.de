import React, { useState, useContext, useEffect, useRef } from "react";
import { MyContext } from "./MyContext";
import { Pagination } from "react-bootstrap";

export default function PagesPagination() {
  const [myValues, setMyValues] = useContext(MyContext);
  const [paginationItems, setPaginationItems] = useState([]);
  const initialLoad = useRef(true);

  //
  function updatePaginationToolbar(activeItem) {
    console.log("updatePaginationToolbar()");
    const maxPaginationButtons = 4;

    let tempItems = [];
    let maxPaginationPages = 0;

    maxPaginationPages = Math.ceil(
      myValues.currentPageCount / myValues.pagesPerSite
    );

    //start page
    let startPage =
      activeItem <= maxPaginationButtons / 2
        ? 1
        : activeItem - maxPaginationButtons / 2;
    //end page
    let endPage = startPage + maxPaginationButtons;
    endPage = maxPaginationPages < endPage ? maxPaginationPages : endPage;
    //difference between start and end page
    let diff =
      endPage - startPage < maxPaginationButtons
        ? maxPaginationButtons - (endPage - startPage)
        : 0;

    if (startPage - diff < 1) {
      startPage = 1;
    } else {
      startPage -= diff;
    }

    //display first, prev buttons if:
    if (startPage > 1) {
      tempItems.push(
        <Pagination.First
          key={"first"}
          onClick={() => handlePaginationClick(1)}
        />
      );
      tempItems.push(
        <Pagination.Prev
          key={"prev"}
          onClick={() => handlePaginationClick(activeItem - 1)}
        />
      );
    }

    for (let number = startPage; number <= endPage; number++) {
      tempItems.push(
        <Pagination.Item
          key={"item" + number}
          active={number === activeItem}
          onClick={() => handlePaginationClick(number)}
        >
          {number}
        </Pagination.Item>
      );
    }

    //display last, next buttons if:
    if (endPage < maxPaginationPages) {
      tempItems.push(
        <Pagination.Next
          key={"next"}
          onClick={() => handlePaginationClick(activeItem + 1)}
        />
      );
      tempItems.push(
        <Pagination.Last
          key={"last"}
          onClick={() => handlePaginationClick(maxPaginationPages)}
        />
      );
    }

    setPaginationItems(tempItems);
  }

  function handlePaginationClick(number) {
    setMyValues((oldValues) => ({
      ...oldValues,
      currentPaginationPage: number,
    }));
  }

  useEffect(() => {
    if (!initialLoad.current) {
      updatePaginationToolbar(myValues.currentPaginationPage);
    }
  }, [
    myValues.currentPaginationPage,
    myValues.pagesPerSite,
    myValues.showDeletedPages,
    myValues.filteredPages,
  ]);

  useEffect(() => {
    initialLoad.current = false;
  }, []);

  return (
    <>
      <Pagination>{paginationItems}</Pagination>
    </>
  );
}
