import React, { useState, useContext } from "react";
import { InputGroup, FormControl, Button, Spinner } from "react-bootstrap";
import { MyContext } from "./MyContext";
import axios from "axios";
import QrScannerVideo from "./QrScannerVideo";
import MyAlert from "./MyAlert";

export default function Login() {
  const [myValues, setMyValues] = useContext(MyContext);
  const [loading, setLoading] = useState(false);
  const [loginUrl, setLoginUrl] = useState("");
  const [tempAlert, setTempAlert] = useState();

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

  //let access_token =  "6adcc093222552a1402b02d0b2434131ca403b9cc08f33a7bd97dfe64a4c";

  async function handleLogin() {
    myValues.qrCodeScanner.stop();
    setLoading(true);
    const telegraphAccountInfo =
      "https://api.telegra.ph/getAccountInfo?access_token=";

    const telegraphFields = '&fields=["short_name","auth_url"]';
    const apiCallGetAccountInfo =
      telegraphAccountInfo + myValues.currentAccessToken + telegraphFields;

    axios
      .post(apiCallGetAccountInfo)
      .then(function (response) {
        if (response.data.ok) {
          setLoading(false);          
          setLoginUrl(response.data.result.auth_url);
          setTempAlert(
            <MyAlert
              type="success"
              title="access token checked"
              value={response.data.result.short_name + ", your token is correct. Now you can log in to telegra.ph!"}
            />
          );
        } else {
          setLoading(false);
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

  function handleCancel() {
    localStorage.setItem("access_token", "");
    setLoginUrl("");
    setTempAlert();
  }

  function handleTelegraphLogin() {
    localStorage.setItem("access_token", myValues.currentAccessToken);
    setMyValues((oldValues) => ({
      ...oldValues,
      loggedIn: true,
      currentPage: "accountInfo",
    }));
  }
  function onInputchange(event) {
    setMyValues((oldValues) => ({
      ...oldValues,
      currentAccessToken: event.target.value,
    }));
  }

  return (
    <>
      <div style={{ marginTop: "20px" }}></div>
      {loginUrl === "" ? <QrScannerVideo /> : ""}
      {tempAlert}
      {loading ? (
        <Spinner animation="border" variant="secondary" />
      ) : loginUrl === "" ? (
        <InputGroup className="mb-3" style={compStyle.inputGroup}>
          <FormControl
            placeholder="access token"
            aria-label="Access Token"
            aria-describedby="basic-addon2"
            value={myValues.currentAccessToken}
            onChange={onInputchange}
          />

          <Button
            variant="outline-secondary"
            id="button-addon2"
            onClick={() => handleLogin()}
          >
            check
          </Button>
        </InputGroup>
      ) : (
        <>
          <div>
            <Button
              variant="outline-secondary"
              id="button-addon2"
              style={{ marginRight: "5px" }}
              onClick={() => handleCancel()}
            >
              cancel
            </Button>
            <a href={loginUrl} target="_blank" rel="noreferrer">
              <Button
                variant="outline-secondary"
                id="button-addon2"
                onClick={() => handleTelegraphLogin()}
              >
                login
              </Button>
            </a>
          </div>
        </>
      )}
    </>
  );
}
