import React, { useState, useContext, useEffect, useRef } from "react";
import {
  Button,
  InputGroup,
  FormControl,
  ProgressBar,
  Spinner,
} from "react-bootstrap";
import { MyContext } from "./MyContext";
import axios from "axios";
import PagesTable from "./PagesTable";
import DeletePageModal from "./DeltePageModal";
import AddPageModal from "./AddPageModal";
import SearchPages from "./SearchPages";

export default function AccountPages() {
  const [myValues, setMyValues] = useContext(MyContext);
  const [loading, setLoading] = useState(false);
  const [fetchedPages, setFetchedPages] = useState(0);
  const [pagePerSiteInput, setPagePerSiteInput] = useState(
    myValues.pagesPerSite
  );

  const initialLoad = useRef(true);

  const [pageLoadingProgress, setPageLoadingProgress] = useState(0);

  let tempAllPageArray = [];
  let tempDeletedPages = 0;

  async function getAccountPages(tempPaginationPage) {
    console.log("getAccountPages() from API");
    setLoading(true);
    const telegraphAccountPages =
      "https://api.telegra.ph/getPageList?access_token=";

    const limit = 200;

    let offset = tempPaginationPage * limit - limit;

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
        if (response.data.ok) {
          //update current page count
          setMyValues((oldValues) => ({
            ...oldValues,
            currentPageCount: response.data.result.total_count,
          }));
          fillPageArray(response.data.result.pages, tempPaginationPage);
        } else {
          console.log(response.data.error);
        }
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  function fillPageArray(telegraphPages, tempPaginationPage) {
    let tempPageArray = [];
    telegraphPages.forEach((element) => {
      //dont display "deleted" pages
      let newPageObject = {
        path: element.path,
        title: element.title,
        url: element.url,
        views: element.views,
        pageDate: getPostDate(element),
        deleted: false,
      };

      if (element.title !== "...") {
        newPageObject.deleted = false;
      } else {
        newPageObject.deleted = true;
        tempDeletedPages++;
      }
      tempPageArray.push(newPageObject);
    });

    tempAllPageArray.push(...tempPageArray);
    const fetchedPages = tempAllPageArray.length;
    setFetchedPages(fetchedPages);

    //update progress bar
    const percent =
      Math.floor(((fetchedPages * 100) / myValues.currentPageCount) * 100) /
      100;
    setPageLoadingProgress(percent);

    //check for maxpages
    if (
      tempAllPageArray.length + tempDeletedPages <
      myValues.currentPageCount
    ) {
      setTimeout(() => {
        getAccountPages(tempPaginationPage + 1);
      }, 100);
    } else {
      setLoading(false);
      setMyValues((oldValues) => ({
        ...oldValues,
        allPages: tempAllPageArray,
        currentDeletedPages: tempDeletedPages,
      }));
    }
  }

  function getPostDate(element) {
    let tempDate = "";
    let customDate = element.description.match(/\[date=([0-9-]+)/);
    if (customDate !== null && customDate[1] !== undefined) {
      tempDate = customDate[1];
    } else {
      let tempInfo = element.url.match(/-(\d+)(-(\d+)$|-(\d+)-\d+$)/);

      tempDate += tempInfo[1] + "-";
      if (tempInfo[3] === undefined) {
        tempDate += tempInfo[4];
      } else {
        tempDate += tempInfo[3];
      }
      tempDate = "2000-" + tempDate;
    }
    return tempDate;
  }

  function handleCreateNewPage() {
    //window.open("https://telegra.ph/", "_blank");
    setMyValues((oldValues) => ({
      ...oldValues,
      showAddPageModal: true,
    }));
  }

  function handleRefreshPages() {
    tempAllPageArray = [];
    tempDeletedPages = 0;
    getAccountPages(1);
  }
  function handleSetPagePerSite() {
    setMyValues((oldValues) => ({
      ...oldValues,
      currentPaginationPage: 1,
      pagesPerSite: pagePerSiteInput,
    }));
    localStorage.setItem("pages_per_site", pagePerSiteInput);
  }

  function onInputchange(event) {
    if (event.target.value.length <= 3) {
      setPagePerSiteInput(event.target.value);
    }
  }

  function handleShowHideDeletedPages() {
    setMyValues((oldValues) => ({
      ...oldValues,
      showDeletedPages: !myValues.showDeletedPages,
      currentPaginationPage: 1,
    }));
  }

  useEffect(() => {
    if (!myValues.showDeletePageModal && !initialLoad.current) {
      getAccountPages(1);
    }
  }, [myValues.showDeletePageModal]);

  useEffect(() => {
    if (!myValues.showAddPageModal && !initialLoad.current) {
      getAccountPages(1);
    }
  }, [myValues.showAddPageModal]);

  useEffect(() => {
    initialLoad.current = false;
    getAccountPages(1);
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
          + page
        </Button>

        <SearchPages />
      </div>
      {loading ? (
        <>
          <Spinner animation="grow" style={{ marginTop: "10px" }} />
          <ProgressBar
            animated
            now={pageLoadingProgress}
            style={{ minWidth: "250px", marginTop: "10px" }}
          />
          <span>
            {pageLoadingProgress} % ( {fetchedPages} pages ){" "}
          </span>
        </>
      ) : (
        <>
          <p style={{ marginTop: "20px" }}>
            page count: {myValues.currentPageCount} (
            <span
              style={{ cursor: "pointer" }}
              onClick={() => handleShowHideDeletedPages()}
            >
              {myValues.showDeletedPages ? (
                <>
                  <span>hide deleted pages </span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    viewBox="0 0 16 16"
                  >
                    <path d="M13.359 11.238C15.06 9.72 16 8 16 8s-3-5.5-8-5.5a7.028 7.028 0 0 0-2.79.588l.77.771A5.944 5.944 0 0 1 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.134 13.134 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755-.165.165-.337.328-.517.486l.708.709z" />
                    <path d="M11.297 9.176a3.5 3.5 0 0 0-4.474-4.474l.823.823a2.5 2.5 0 0 1 2.829 2.829l.822.822zm-2.943 1.299.822.822a3.5 3.5 0 0 1-4.474-4.474l.823.823a2.5 2.5 0 0 0 2.829 2.829z" />
                    <path d="M3.35 5.47c-.18.16-.353.322-.518.487A13.134 13.134 0 0 0 1.172 8l.195.288c.335.48.83 1.12 1.465 1.755C4.121 11.332 5.881 12.5 8 12.5c.716 0 1.39-.133 2.02-.36l.77.772A7.029 7.029 0 0 1 8 13.5C3 13.5 0 8 0 8s.939-1.721 2.641-3.238l.708.709zm10.296 8.884-12-12 .708-.708 12 12-.708.708z" />
                  </svg>
                </>
              ) : (
                <>
                  <span>show deleted pages </span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    viewBox="0 0 16 16"
                  >
                    <path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8zM1.173 8a13.133 13.133 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.133 13.133 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5c-2.12 0-3.879-1.168-5.168-2.457A13.134 13.134 0 0 1 1.172 8z" />
                    <path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5zM4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0z" />
                  </svg>
                </>
              )}
            </span>
            )
          </p>
          <DeletePageModal />
          <AddPageModal />
          <PagesTable />

          <InputGroup className="" style={{ width: "auto" }}>
            <FormControl
              style={{ width: "52px" }}
              placeholder="200"
              aria-label="Access Token"
              aria-describedby="basic-addon2"
              value={pagePerSiteInput}
              onChange={onInputchange}
            />
            <Button
              key="setPagesPerSite"
              variant="outline-secondary"
              id="button-addon2"
              onClick={() => handleSetPagePerSite(1)}
            >
              set
            </Button>
          </InputGroup>
        </>
      )}
    </>
  );
}
