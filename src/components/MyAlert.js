import React, { useState, useEffect } from "react";
import { Alert } from "react-bootstrap";

export default function MyAlert({ type, title, value }) {
  const [show, setShow] = useState(true);

  useEffect(() => {
    setShow(true);
  }, []);

  return (
    <>
      {show ? (
        <>
          <Alert
            variant={type}
            style={{ maxWidth: "500px", textAlign: "left" }}
          >
            <Alert.Heading>{title}</Alert.Heading>
            <p>{value}</p>
          </Alert>
        </>
      ) : (
        ""
      )}
    </>
  );
}
