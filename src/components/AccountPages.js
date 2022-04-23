import React, { useState, useContext, useEffect } from "react";
import {
  Button,
  Spinner,
  ListGroup,
  Pagination,
  InputGroup,
  FormControl,
} from "react-bootstrap";
import { MyContext } from "./MyContext";
import axios from "axios";

export default function AccountPages() {
  // Declare a new state variable, which we'll call "count"

  const [myValues, setMyValues] = useContext(MyContext);
  const [loading, setLoading] = useState(false);
  const [pageArray, setPageArray] = useState([]);
  const [paginationItems, setPaginationItems] = useState([]);
  const [pagesPerSite, setPagesPerSite] = useState(10);
  const [currentPaginationPage, setCurrentPaginationPage] = useState(1);

  async function getAccountPages(tempPaginationPage, currentLimit) {
    setLoading(true);
    const telegraphAccountPages =
      "https://api.telegra.ph/getPageList?access_token=";

    let offset = tempPaginationPage * currentLimit - currentLimit;

    const limit = currentLimit;
    const apiCallGetAccountPages =
      telegraphAccountPages +
      myValues.currentAccessToken +
      "&offset=" +
      offset +
      "&limit=" +
      limit;

    axios
      .post(apiCallGetAccountPages)
      .then(function (response) {
        setLoading(false);
        if (response.data.ok) {
          //update current page count
          setMyValues((oldValues) => ({
            ...oldValues,
            currentPageCount: response.data.result.total_count,
          }));
          fillPageArray(response.data.result.pages);

          ///
        } else {
          console.log(response.data.error);
        }
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  function fillPageArray(telegraphPages) {
    let tempPageArray = [];
    telegraphPages.forEach((element) => {
      let newPageObject = {
        title: element.title,
        url: element.url,
        views: element.views,
        pageDate: getPostDate(element.url),
      };
      tempPageArray.push(newPageObject);
    });
    setPageArray(tempPageArray);
  }

  function getPostDate(elementUrl) {
    let tempInfo = elementUrl.match(/-(\d+)(-(\d+)$|-(\d+)-\d+$)/);
    let tempDate = "";
    tempDate += tempInfo[1] + "-";
    if (tempInfo[3] === undefined) {
      tempDate += tempInfo[4];
    } else {
      tempDate += tempInfo[3];
    }
    return tempDate;
  }

  function handlePaginationClick(number) {
    setCurrentPaginationPage(number);
    getAccountPages(number, pagesPerSite);
    updatePaginationToolbar(number);
  }

  function updatePaginationToolbar(activeItem) {
    const maxPaginationButtons = 4;

    let tempItems = [];
    let maxPaginationPages = Math.ceil(
      myValues.currentPageCount / pagesPerSite
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
        <Pagination.First onClick={() => handlePaginationClick(1)} />
      );
      tempItems.push(
        <Pagination.Prev
          onClick={() => handlePaginationClick(activeItem - 1)}
        />
      );
    }

    for (let number = startPage; number <= endPage; number++) {
      tempItems.push(
        <Pagination.Item
          key={number}
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
          onClick={() => handlePaginationClick(activeItem + 1)}
        />
      );
      tempItems.push(
        <Pagination.Last
          onClick={() => handlePaginationClick(maxPaginationPages)}
        />
      );
    }

    setPaginationItems(tempItems);
  }

  function handleCreateNewPage() {
    window.open("https://telegra.ph/", "_blank");
  }

  function handleRefreshPages() {
    handlePaginationClick(currentPaginationPage);
  }
  function handleSetPagePerSite() {
    handlePaginationClick(1);
  }

  function onInputchange(event) {
    if (event.target.value.length <= 3) {
      setPagesPerSite(event.target.value);
    }
  }

  useEffect(() => {
    //get Account Information from telegra.ph api
    getAccountPages(1, pagesPerSite);
    updatePaginationToolbar(1);
  }, []);

  return (
    <>
      <div
        style={{
          display: "flex",
          gap: "5px",
          alignItems: "center",
          marginTop: "20px",
        }}
      >
        <Button
          key="refreshPage"
          onClick={handleRefreshPages}
          variant="outline-secondary"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="currentColor"
            className="bi bi-arrow-clockwise"
            viewBox="0 0 16 16"
          >
            <path
              fillRule="evenodd"
              d="M8 3a5 5 0 1 0 4.546 2.914.5.5 0 0 1 .908-.417A6 6 0 1 1 8 2v1z"
            />
            <path d="M8 4.466V.534a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384L8.41 4.658A.25.25 0 0 1 8 4.466z" />
          </svg>
        </Button>
        <Button
          key="newPage"
          onClick={handleCreateNewPage}
          variant="outline-secondary"
        >
          + new Page
        </Button>

        <InputGroup className="" style={{ width: "auto" }}>
          <FormControl
            style={{ width: "52px" }}
            placeholder="200"
            aria-label="Access Token"
            aria-describedby="basic-addon2"
            value={pagesPerSite}
            onChange={onInputchange}
          />
          <Button
            key="setPagesPerSite"
            variant="outline-secondary"
            id="button-addon2"
            onClick={handleSetPagePerSite}
          >
            set
          </Button>
        </InputGroup>
      </div>
      {loading ? (
        <Spinner animation="border" variant="secondary" />
      ) : (
        <>
          <p style={{ marginTop: "1rem" }}>
            Pagecount: {myValues.currentPageCount}
          </p>
          <ListGroup variant="flush" style={{ width: "90%" }}>
            <ListGroup.Item
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
              key={"header"}
            >
              <span>Post title</span>

              <div>
                <span>views</span>
                <span>&nbsp;|&nbsp;</span>
                <span>date</span>
              </div>
            </ListGroup.Item>
            {pageArray.map((page) => (
              <ListGroup.Item
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
                key={page.url}
              >
                <a href={page.url} target="_blank" rel="noreferrer">
                  {page.title}
                </a>

                <div>
                  <span>{page.views}</span>
                  <span>&nbsp;|&nbsp;</span>
                  <span>{page.pageDate}</span>
                </div>
              </ListGroup.Item>
            ))}
          </ListGroup>

          <Pagination>{paginationItems}</Pagination>
        </>
      )}
    </>
  );
}
