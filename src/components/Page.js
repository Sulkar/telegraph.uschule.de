import React, { useState, useContext, useEffect } from "react";
import { MyContext } from "./MyContext";
import Login from "./Login";
import AccountInfo from "./AccountInfo";
import AccountPages from "./AccountPages";
import CreateAccount from "./CreateAccount";

export default function Page() {
  // Declare a new state variable, which we'll call "count"

  const [myValues, setMyValues] = useContext(MyContext);
  const [urlAccessToken, setUrlAccessToken] = useState("");

  function getUrlAccessToken() {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    setUrlAccessToken(urlParams.get("at"));
  }

  useEffect(() => {
    getUrlAccessToken();
    let currentPage = "login";
    let loggedIn = false;
    let access_token = urlAccessToken;
    if (access_token === null) {
      access_token = localStorage.getItem("access_token") || "";
      if (access_token !== "") {
        currentPage = "accountInfo";
        loggedIn = true;
      }
    }
    const pagesPerSiteLocalStorage =
      localStorage.getItem("pages_per_site") || 10;
    setMyValues((oldValues) => ({
      ...oldValues,
      currentAccessToken: access_token,
      currentPage: currentPage,
      loggedIn: loggedIn,
      pagesPerSite: pagesPerSiteLocalStorage,
    }));
  }, [urlAccessToken]);

  return (
    <>
      {myValues.currentPage === "accountInfo" ? <AccountInfo /> : ""}
      {myValues.currentPage === "pageList" ? <AccountPages /> : ""}
      {myValues.currentPage === "createAccount" ? <CreateAccount /> : ""}
      {myValues.currentPage === "login" ? <Login /> : ""}
      {myValues.currentPage === "logout" ? "Logout successful" : ""}
    </>
  );
}
