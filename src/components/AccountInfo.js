import React, { useState, useContext, useEffect } from "react";
import { Form, Button, Spinner } from "react-bootstrap";
import { MyContext } from "./MyContext";
import axios from "axios";

export default function AccountInfo() {
  // Declare a new state variable, which we'll call "count"

  const [myValues, setMyValues] = useContext(MyContext);
  const [loading, setLoading] = useState(false);
  const [form1Changed, setForm1Changed] = useState(false);
  const [form2Changed, setForm2Changed] = useState(false);
  const [form3Changed, setForm3Changed] = useState(false);

  const normalFormControlBorder = "1px solid #ced4da";
  const changedFormControlBorder = "2px solid tomato";

  var compStyle = {
    video: { maxWidth: "500px", marginBottom: "10px" },
    inputGroup: { maxWidth: "300px" },
    navbar: {
      borderRadius: "20px",
    },
    button: {
      margin: "2px",
    },
  };

  //let access_token =  "b968da509bb76866c35425099bc0989a5ec3b32997d55286c657e6994bbb";

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

  useEffect(() => {
    //get Account Information from telegra.ph api
    getAccountInfo();
  }, []);

  return (
    <>
      <h2>Account </h2>

      {loading ? (
        <Spinner animation="border" variant="secondary" />
      ) : (
        <Form style={{ textAlign: "left" }}>
          <Form.Group className="mb-3" controlId="formShortName">
            <Form.Label>Short name</Form.Label>
            <Form.Control
              style={{
                border: form1Changed
                  ? changedFormControlBorder
                  : normalFormControlBorder,
              }}
              type="text"
              placeholder="Enter short name"
              value={myValues.currentShortName}
              onChange={onInputchangeShortName}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formAuthorName">
            <Form.Label>Author name</Form.Label>
            <Form.Control
              style={{
                border: form2Changed
                  ? changedFormControlBorder
                  : normalFormControlBorder,
              }}
              type="text"
              placeholder="Enter author name"
              value={myValues.currentAuthorName}
              onChange={onInputchangeAuthorName}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formAuthorUrl">
            <Form.Label>Author url</Form.Label>
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
            <Form.Label>Page count</Form.Label>
            <span style={{ float: "right" }}>{myValues.currentPageCount}</span>
          </Form.Group>

          <Button
            variant="primary"
            type="button"
            onClick={handleUpdateInfoClick}
          >
            update Infos
          </Button>
        </Form>
      )}
    </>
  );
}
