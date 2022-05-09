import React, { useState, useContext, useEffect } from "react";
import { Button, Modal } from "react-bootstrap";
import { MyContext } from "./MyContext";
import QRCode from "qrcode";

export default function QRCodeModal() {
  const [myValues, setMyValues] = useContext(MyContext);
  const [pageQrCode, setPageQrCode] = useState();

  const handleClose = () =>
    setMyValues((oldValues) => ({
      ...oldValues,
      showQRCodeModal: false,
    }));

  const opts = {
    width: 290,
  };
  useEffect(() => {
    //get Account Information from telegra.ph api
    if (myValues.currentSelectedPage !== null) {
      QRCode.toDataURL(myValues.currentSelectedPage.url, opts)
        .then((qrCode) => {
          setPageQrCode(qrCode);
        })
        .catch((err) => {
          console.error(err);
        });
    }
  }, [myValues.showQRCodeModal]);

  return (
    <>
      <Modal show={myValues.showQRCodeModal} onHide={handleClose} size="sm">
        <Modal.Body>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <div style={{ fontWeight: "bolder" }}>telegraph-buddy.org</div>
            <div>
              {myValues.currentSelectedPage !== null
                ? myValues.currentSelectedPage.title
                : ""}
            </div>
            <img src={pageQrCode} alt="qrCode" />
            <div style={{ wordBreak: "break-all", textAlign: "center" }}>
              <a
                href={
                  myValues.currentSelectedPage !== null
                    ? myValues.currentSelectedPage.url
                    : ""
                }
                target="_blank"
              >
                {myValues.currentSelectedPage !== null
                  ? myValues.currentSelectedPage.url
                  : ""}
              </a>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer style={{ justifyContent: "center" }}>
          <Button variant="outline-secondary" onClick={handleClose}>
            close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
