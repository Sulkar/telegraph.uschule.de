import React, { useState } from "react";
import { Navbar, Container, Nav, NavDropdown } from "react-bootstrap";
import { Button } from "react-bootstrap";

export default function ButtonGroup() {
  var compStyle = {
    div: {
      display: "flex",
    },
    button: {
      margin: "2px",
    },
  };

  // Declare a new state variable, which we'll call "count"
  const [count, setCount] = useState(0);

  return (
    <div style={compStyle.div}>
      <Button variant="outline-primary" style={compStyle.button}>
        Primary
      </Button>{" "}
      <Button variant="outline-primary">Primary</Button>{" "}
      <Button variant="outline-primary">Primary</Button>{" "}
    </div>
  );
}
