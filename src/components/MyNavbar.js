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
      /*fontSize: "12px",*/
    },
    button: {
      margin: "2px",
    },
  };

  const handleClick = (type) => {
    switch (type) {
      case "link":
        console.log("link clicked");
        let counter = myValues.counter;
        setMyValues((oldValues) => ({ ...oldValues, counter: counter + 1 }));
        break;
      case "login":
        console.log("link clicked");
        setMyValues((oldValues) => ({ ...oldValues, loggedIn: true }));
        break;
      case "logout":
        console.log("link clicked");
        setMyValues((oldValues) => ({ ...oldValues, loggedIn: false }));
        break;
      default:
        break;
    }
  };

  return (
    <Navbar bg="light" expand="lg" style={compStyle.navbar}>
      <Container style={compStyle.container}>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            {myValues.loggedIn ? (
              ""
            ) : (
              <Nav.Link href="#login" onClick={() => handleClick("login")}>
                Login {myValues.counter}
              </Nav.Link>
            )}
            <Nav.Link href="#accountInfo" onClick={() => handleClick("link")}>
              Account Info
            </Nav.Link>
            {myValues.loggedIn ? (
              <Nav.Link href="#logout" onClick={() => handleClick("logout")}>
                Logout
              </Nav.Link>
            ) : (
              ""
            )}
            <Nav.Link href="#createAccount" onClick={() => handleClick("link")}>
              Create Account
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
