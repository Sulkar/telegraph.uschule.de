import React, { useState, useContext, useEffect, useRef } from "react";
import { Form, Button, Spinner, Modal } from "react-bootstrap";
import { MyContext } from "./MyContext";

export default function TelegraphLoginModal() {
  const [myValues, setMyValues] = useContext(MyContext);
  const [accessTokenQrCode, setAccessTokenQrCode] = useState();

  const handleClose = () =>
    setMyValues((oldValues) => ({
      ...oldValues,
      showTelegraphLoginModal: false,
    }));

  useEffect(() => {}, []);

  return (
    <>
      <Modal
        show={myValues.showTelegraphLoginModal}
        onHide={handleClose}
        size="sm"
      >
        <Modal.Body>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <div>telegraph-buddy.org</div>
            <div>Access Token for {myValues.currentShortName}</div>
            <img src={accessTokenQrCode} />
            <div style={{ wordBreak: "break-all", textAlign: "center" }}>
              {myValues.currentAccessToken}
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer style={{ justifyContent: "center" }}>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
