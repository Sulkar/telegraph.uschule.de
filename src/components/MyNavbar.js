import React, { useState, useContext } from "react";
import { Navbar, Container, Nav, NavDropdown } from "react-bootstrap";
import { MyContext } from "./MyContext";

export default function MyNavbar() {
  // Declare a new state variable, which we'll call "count"
  const [count, setCount] = useState(0);
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

  const handleClick = (type) => {
    switch (type) {
      case "accountInfo":
        setMyValues((oldValues) => ({
          ...oldValues,
          currentPage: "accountInfo",
        }));
        break;
      case "pageList":
        setMyValues((oldValues) => ({ ...oldValues, currentPage: "pageList" }));
        break;
      case "createAccount":
        setMyValues((oldValues) => ({
          ...oldValues,
          currentPage: "createAccount",
        }));
        break;

      case "login":
        setMyValues((oldValues) => ({
          ...oldValues,
          currentPage: "login",
        }));
        break;
      case "logout":
        setMyValues((oldValues) => ({
          ...oldValues,
          loggedIn: false,
          currentAccessToken: "",
          currentPage: "logout",
        }));
        localStorage.setItem("access_token", "");        
        break;
      default:
        break;
    }
  };

  return (
    <Navbar collapseOnSelect bg="light" expand="lg" style={compStyle.navbar}>
      <Container style={compStyle.container}>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            {myValues.loggedIn ? (
              <>
                <Nav.Link
                  href="#accountInfo"
                  onClick={() => handleClick("accountInfo")}
                  className={myValues.currentPage === "accountInfo" ? "active" : ""}
                >
                  Account Info
                </Nav.Link>
                <Nav.Link
                  href="#pageList"
                  onClick={() => handleClick("pageList")}
                >
                  Page List
                </Nav.Link>

                <Nav.Link href="#logout" onClick={() => handleClick("logout")}>
                  Logout
                </Nav.Link>
              </>
            ) : (
              <>
                <Nav.Link
                  href="#createAccount"
                  onClick={() => handleClick("createAccount")}
                >
                  create Account
                </Nav.Link>
                <Nav.Link href="#login" onClick={() => handleClick("login")} className={myValues.currentPage === "login" ? "active" : ""}>
                  Login
                </Nav.Link>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
