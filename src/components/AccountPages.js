import React, { useState, useContext, useEffect } from "react";
import { Button, InputGroup, FormControl, ProgressBar } from "react-bootstrap";
import { MyContext } from "./MyContext";
import axios from "axios";
import PagesTable from "./PagesTable";

export default function AccountPages() {
  const [myValues, setMyValues] = useContext(MyContext);
  const [loading, setLoading] = useState(false);
  const [pageArray, setPageArray] = useState([]);
  const [pagePerSiteInput, setPagePerSiteInput] = useState(
    myValues.pagesPerSite
  );

  const [pageLoadingProgress, setPageLoadingProgress] = useState(0);

  //access_token: b968da509bb76866c35425099bc0989a5ec3b32997d55286c657e6994bbb
  let allPageArray = [];

  async function getAccountPages(tempPaginationPage) {
    setLoading(true);
    const telegraphAccountPages =
      "https://api.telegra.ph/getPageList?access_token=";

    let offset =
      tempPaginationPage * myValues.pagesPerSite - myValues.pagesPerSite;

    const limit = myValues.pagesPerSite;
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
      let newPageObject = {
        title: element.title,
        url: element.url,
        views: element.views,
        pageDate: getPostDate(element),
      };
      tempPageArray.push(newPageObject);
    });

    allPageArray.push(...tempPageArray);

    //update progress bar
    const percent =
      Math.round(
        ((allPageArray.length * 100) / myValues.currentPageCount) * 100
      ) / 100;
    setPageLoadingProgress(percent);

    //check for maxpages
    if (allPageArray.length < myValues.currentPageCount) {
      setTimeout(() => {
        getAccountPages(tempPaginationPage + 1);
      }, 50);
    } else {
      setLoading(false);
      setPageArray(allPageArray);
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
      tempDate = new Date().getFullYear() + "-" + tempDate;
    }
    return tempDate;
  }

  function handleCreateNewPage() {
    window.open("https://telegra.ph/", "_blank");
  }

  function handleRefreshPages() {
    allPageArray = [];
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

  useEffect(() => {
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
          + new page
        </Button>

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
      </div>
      {loading ? (
        <>
          <p style={{ marginTop: "20px" }}>
            page count: {myValues.currentPageCount}
          </p>
          <ProgressBar
            animated
            now={pageLoadingProgress}
            label={`${pageLoadingProgress}%`}
            style={{ minWidth: "250px" }}
          />
        </>
      ) : (
        <>
          <p style={{ marginTop: "20px" }}>
            page count: {myValues.currentPageCount}
          </p>
          <PagesTable pageArray={pageArray} />
        </>
      )}
    </>
  );
}
