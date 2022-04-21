import React, { useState, useContext } from "react";
import { InputGroup, FormControl, Button, Spinner } from "react-bootstrap";
import { MyContext } from "./MyContext";
import axios from "axios";
import QrScannerVideo from "./QrScannerVideo";

export default function Login() {
  // Declare a new state variable, which we'll call "count"

  const [myValues, setMyValues] = useContext(MyContext);
  const [loading, setLoading] = useState(false);
  const [loginUrl, setLoginUrl] = useState("");

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
        setLoading(false);
        if (response.data.ok) {
          setLoginUrl(response.data.result.auth_url);
          setMyValues((oldValues) => ({
            ...oldValues,
            loggedIn: true,
            currentPage: "accountInfo",
          }));
          //redirect to logged in telegra.ph page in new tab/window
          //window.open(response.data.result.auth_url, "_blank");
          localStorage.setItem("access_token", myValues.currentAccessToken);
        } else {
          console.log(response.data.error);
        }
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  function onInputchange(event) {
    setMyValues((oldValues) => ({
      ...oldValues,
      currentAccessToken: event.target.value,
    }));
  }

  return (
    <>
     
     <div style={{marginTop: "20px"}}></div>
      <QrScannerVideo />

      {loading ? (
        <Spinner animation="border" variant="secondary" />
      ) : (
        <InputGroup className="mb-3" style={compStyle.inputGroup}>
          <FormControl
            placeholder="Access Token"
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
            login
          </Button>
        </InputGroup>
      )}
    </>
  );
}
