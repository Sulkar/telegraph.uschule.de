import React, { useState, useContext, useEffect } from "react";
import { Navbar, Container, Nav, NavDropdown } from "react-bootstrap";
import { MyContext } from "./MyContext";
import Login from "./Login";
import AccountInfo from "./AccountInfo";

export default function Page() {
  // Declare a new state variable, which we'll call "count"

  const [myValues, setMyValues] = useContext(MyContext);

  useEffect(() => {
    const access_token = localStorage.getItem("access_token") || "";
    let currentPage = "login";
    let loggedIn = false;
    if (access_token !== "") {
      currentPage = "accountInfo";
      loggedIn = true;
    }
    setMyValues((oldValues) => ({
      ...oldValues,
      currentAccessToken: access_token,
      currentPage: currentPage,
      loggedIn: loggedIn,
    }));
  }, [setMyValues]);

  var compStyle = {
    container: { justifyContent: "center" },
    navbar: {
      borderRadius: "20px",
    },
    button: {
      margin: "2px",
    },
  };

  const handleClick = (type) => {};

  return (
    <>
      {myValues.currentPage === "accountInfo" ? <AccountInfo /> : ""}
      {myValues.currentPage === "pageList" ? "pageList Page" : ""}
      {myValues.currentPage === "createAccount" ? "createAccount Page" : ""}
      {myValues.currentPage === "login" ? <Login /> : ""}
      {myValues.currentPage === "logout" ? "Logout successful" : ""}
    </>
  );
}
