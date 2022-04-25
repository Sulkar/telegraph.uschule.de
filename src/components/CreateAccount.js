import React, { useState, useContext, useEffect } from "react";
import { Form, Button, Spinner } from "react-bootstrap";
import { MyContext } from "./MyContext";
import axios from "axios";
import AccessTokenModal from "./AccessTokenModal";
import MyAlert from "./MyAlert";

export default function CreateAccount() {
  // Declare a new state variable, which we'll call "count"

  const [myValues, setMyValues] = useContext(MyContext);
  const [loading, setLoading] = useState(false);
  const [form1Value, setForm1Value] = useState("");
  const [form2Value, setForm2Value] = useState("");
  const [form3Value, setForm3Value] = useState("");
  const [tempAlert, setTempAlert] = useState();

  async function createAccount() {
    setLoading(true);
    const telegraphCreateAccount = "https://api.telegra.ph/createAccount?";

    const field1 = "short_name=" + form1Value;
    const field2 = "&author_name=" + form2Value;
    const field3 = "&author_url=" + form3Value;

    const apiCallCreateAccount =
      telegraphCreateAccount + field1 + field2 + field3;

    axios
      .post(apiCallCreateAccount)
      .then(function (response) {
        setLoading(false);
        if (response.data.ok) {
          setTempAlert("");
          setMyValues((oldValues) => ({
            ...oldValues,
            currentAccessToken: response.data.result.access_token,
            currentAuthorName: response.data.result.author_name,
            currentShortName: response.data.result.short_name,
            currentAuthorUrl: response.data.result.author_url,
            showAccessTokenModal: true,
          }));
        } else {
          setTempAlert(
            <MyAlert type="danger" title="error" value={response.data.error} />
          );
        }
      })
      .catch(function (error) {
        setLoading(false);
        setTempAlert(<MyAlert type="danger" title="error" value={error} />);
      });
  }

  function onInputchangeShortName(event) {
    if (event.target.value.length <= 32) setForm1Value(event.target.value);
  }
  function onInputchangeAuthorName(event) {
    if (event.target.value.length <= 128) setForm2Value(event.target.value);
  }
  function onInputchangeAuthorUrl(event) {
    if (event.target.value.length <= 512) setForm3Value(event.target.value);
  }

  function handleUpdateInfoClick() {
    createAccount();
  }

  function handleAccessTokenModalClick() {
    setMyValues((oldValues) => ({
      ...oldValues,
      showAccessTokenModal: true,
    }));
  }
  useEffect(() => {
    //get Account Information from telegra.ph api
  }, []);

  return (
    <>
      {myValues.currentAccessToken !== "" ? (
        <AccessTokenModal backdrop="static" redirectPage="login" />
      ) : (
        ""
      )}

      {loading ? (
        <Spinner animation="border" variant="secondary" />
      ) : (
        <Form style={{ textAlign: "left", marginTop: "10px" }}>
          <Form.Group className="mb-3" controlId="formShortName">
            <Form.Label>short name*</Form.Label>
            <Form.Control
              type="text"
              placeholder="enter short name"
              value={form1Value}
              onChange={onInputchangeShortName}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formAuthorName">
            <Form.Label>author name</Form.Label>
            <Form.Control
              type="text"
              placeholder="enter author name"
              value={form2Value}
              onChange={onInputchangeAuthorName}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formAuthorUrl">
            <Form.Label>author url</Form.Label>
            <Form.Control
              type="text"
              placeholder="enter author url"
              value={form3Value}
              onChange={onInputchangeAuthorUrl}
            />
          </Form.Group>
          {tempAlert}
          <Button
            variant="outline-secondary"
            type="button"
            onClick={handleUpdateInfoClick}
          >
            create account
          </Button>
        </Form>
      )}
    </>
  );
}
