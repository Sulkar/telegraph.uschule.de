import React, { useState, useContext, useEffect } from "react";
import { Form, Button, Spinner } from "react-bootstrap";
import { MyContext } from "./MyContext";
import axios from "axios";
import AccessTokenModal from "./AccessTokenModal";

export default function AccountInfo() {
  // Declare a new state variable, which we'll call "count"

  const [myValues, setMyValues] = useContext(MyContext);
  const [loading, setLoading] = useState(false);
  const [form1Changed, setForm1Changed] = useState(false);
  const [form2Changed, setForm2Changed] = useState(false);
  const [form3Changed, setForm3Changed] = useState(false);

  const normalFormControlBorder = "1px solid #ced4da";
  const changedFormControlBorder = "2px solid tomato";

  async function getAccountInfo() {
    setLoading(true);
    const telegraphAccountInfo =
      "https://api.telegra.ph/getAccountInfo?access_token=";

    const telegraphFields =
      '&fields=["short_name","author_name","author_url","page_count"]';
    const apiCallGetAccountInfo =
      telegraphAccountInfo + myValues.currentAccessToken + telegraphFields;

    axios
      .post(apiCallGetAccountInfo)
      .then(function (response) {
        setLoading(false);
        if (response.data.ok) {
          setMyValues((oldValues) => ({
            ...oldValues,
            currentAuthorName: response.data.result.author_name,
            currentShortName: response.data.result.short_name,
            currentAuthorUrl: response.data.result.author_url,
            currentPageCount: response.data.result.page_count,
          }));
        } else {
          console.log(response.data.error);
        }
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  async function editAccountInfo() {
    setLoading(true);
    const telegraphAccountInfo =
      "https://api.telegra.ph/editAccountInfo?access_token=";

    const updateField1 = "&short_name=" + myValues.currentShortName;
    const updateField2 = "&author_name=" + myValues.currentAuthorName;
    const updateField3 = "&author_url=" + myValues.currentAuthorUrl;

    const apiCallEditAccountInfo =
      telegraphAccountInfo +
      myValues.currentAccessToken +
      updateField1 +
      updateField2 +
      updateField3;

    axios
      .post(apiCallEditAccountInfo)
      .then(function (response) {
        setLoading(false);
        if (response.data.ok) {
          setMyValues((oldValues) => ({
            ...oldValues,
            currentAuthorName: response.data.result.author_name,
            currentShortName: response.data.result.short_name,
            currentAuthorUrl: response.data.result.author_url,
          }));
          setForm1Changed(false);
          setForm2Changed(false);
          setForm3Changed(false);
        } else {
          console.log(response.data.error);
        }
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  function onInputchangeShortName(event) {
    setForm1Changed(true);
    setMyValues((oldValues) => ({
      ...oldValues,
      currentShortName: event.target.value,
    }));
  }
  function onInputchangeAuthorName(event) {
    setForm2Changed(true);
    setMyValues((oldValues) => ({
      ...oldValues,
      currentAuthorName: event.target.value,
    }));
  }
  function onInputchangeAuthorUrl(event) {
    setForm3Changed(true);
    setMyValues((oldValues) => ({
      ...oldValues,
      currentAuthorUrl: event.target.value,
    }));
  }

  function handleUpdateInfoClick() {
    editAccountInfo();
  }

  function handleAccessTokenModalClick() {
    setMyValues((oldValues) => ({
      ...oldValues,
      showAccessTokenModal: true,
    }));
  }
  useEffect(() => {
    //get Account Information from telegra.ph api
    getAccountInfo();
  }, []);

  return (
    <>
      <AccessTokenModal />

      {loading ? (
        <Spinner animation="border" variant="secondary" />
      ) : (
        <Form style={{ textAlign: "left", marginTop: "10px" }}>
          <Form.Group className="mb-3" controlId="formShortName">
            <Form.Label>short name</Form.Label>
            <Form.Control
              style={{
                border: form1Changed
                  ? changedFormControlBorder
                  : normalFormControlBorder,
              }}
              type="text"
              placeholder="enter short name"
              value={myValues.currentShortName}
              onChange={onInputchangeShortName}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formAuthorName">
            <Form.Label>author name</Form.Label>
            <Form.Control
              style={{
                border: form2Changed
                  ? changedFormControlBorder
                  : normalFormControlBorder,
              }}
              type="text"
              placeholder="enter author name"
              value={myValues.currentAuthorName}
              onChange={onInputchangeAuthorName}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formAuthorUrl">
            <Form.Label>author url</Form.Label>
            <Form.Control
              style={{
                border: form3Changed
                  ? changedFormControlBorder
                  : normalFormControlBorder,
              }}
              type="text"
              placeholder="Enter author url"
              value={myValues.currentAuthorUrl}
              onChange={onInputchangeAuthorUrl}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formPageCount">
            <Form.Label>page count</Form.Label>
            <span style={{ float: "right" }}>{myValues.currentPageCount}</span>
          </Form.Group>
          <div style={{ textAlign: "center" }}>
            <Button
              variant="outline-secondary"
              type="button"
              style={{ marginRight: "5px" }}
              onClick={handleAccessTokenModalClick}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                className="bi bi-qr-code-scan"
                viewBox="0 0 16 16"
              >
                <path d="M0 .5A.5.5 0 0 1 .5 0h3a.5.5 0 0 1 0 1H1v2.5a.5.5 0 0 1-1 0v-3Zm12 0a.5.5 0 0 1 .5-.5h3a.5.5 0 0 1 .5.5v3a.5.5 0 0 1-1 0V1h-2.5a.5.5 0 0 1-.5-.5ZM.5 12a.5.5 0 0 1 .5.5V15h2.5a.5.5 0 0 1 0 1h-3a.5.5 0 0 1-.5-.5v-3a.5.5 0 0 1 .5-.5Zm15 0a.5.5 0 0 1 .5.5v3a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1 0-1H15v-2.5a.5.5 0 0 1 .5-.5ZM4 4h1v1H4V4Z" />
                <path d="M7 2H2v5h5V2ZM3 3h3v3H3V3Zm2 8H4v1h1v-1Z" />
                <path d="M7 9H2v5h5V9Zm-4 1h3v3H3v-3Zm8-6h1v1h-1V4Z" />
                <path d="M9 2h5v5H9V2Zm1 1v3h3V3h-3ZM8 8v2h1v1H8v1h2v-2h1v2h1v-1h2v-1h-3V8H8Zm2 2H9V9h1v1Zm4 2h-1v1h-2v1h3v-2Zm-4 2v-1H8v1h2Z" />
                <path d="M12 9h2V8h-2v1Z" />
              </svg>
              &nbsp;code
            </Button>

            <Button
              variant="outline-secondary"
              type="button"
              onClick={handleUpdateInfoClick}
            >
              update
            </Button>
          </div>
        </Form>
      )}
    </>
  );
}
