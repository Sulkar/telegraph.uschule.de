import React, { useState, useContext } from "react";
import { Navbar, Container, Nav, NavDropdown } from "react-bootstrap";
import { MyContext } from "./MyContext";
import Login from "./Login";

export default function Page() {
  // Declare a new state variable, which we'll call "count"

  const [myValues, setMyValues] = useContext(MyContext);
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
      {myValues.currentPage === "accountInfo" ? "accountInfo Page" : ""}
      {myValues.currentPage === "pageList" ? "pageList Page" : ""}
      {myValues.currentPage === "createAccount" ? "createAccount Page" : ""}
      {myValues.currentPage === "login" ? <Login /> : ""}
    </>
  );
}
