import React, { useState, useContext, useEffect, useRef } from "react";
import { Form, Button, Spinner, Modal } from "react-bootstrap";
import { MyContext } from "./MyContext";
import QRCode from "qrcode";

export default function AccessTokenModal() {
  const [myValues, setMyValues] = useContext(MyContext);
  const [accessTokenQrCode, setAccessTokenQrCode] = useState();

  const handleClose = () =>
    setMyValues((oldValues) => ({
      ...oldValues,
      showAccessTokenModal: false,
    }));

  useEffect(() => {
    //get Account Information from telegra.ph api
    QRCode.toDataURL(myValues.currentAccessToken)
      .then((qrCode) => {
        console.log(qrCode);
        setAccessTokenQrCode(qrCode);
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);

  return (
    <>
      <Modal show={myValues.showAccessTokenModal} onHide={handleClose} size="sm">
        <Modal.Body>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <div>telegraph-buddy.org</div>
            <div>Access Token for {myValues.currentAuthorName}</div>
            <img src={accessTokenQrCode} />
            <div style={{ wordBreak: "break-all", textAlign: "center" }}>
              {myValues.currentAccessToken}
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer style={{justifyContent: "center"}}>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
      
    </>
  );
}
