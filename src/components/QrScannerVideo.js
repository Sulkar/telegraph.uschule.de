import React, { useState, useContext, useEffect, useRef } from "react";
import { InputGroup, FormControl, Button } from "react-bootstrap";
import { MyContext } from "./MyContext";
import QrScanner from "qr-scanner";

export default function QrScannerVideo() {
  const [myValues, setMyValues] = useContext(MyContext);
  const [scanning, setScanning] = useState(false);
  const [myScanner, setMyScanner] = useState(false);
  const myContainer = useRef(null);
  const [scannerHeight, setScannerHeight] = useState("0px");

  useEffect(() => {
    setMyScanner(
      new QrScanner(
        myContainer.current,
        (result) => {
          console.log("decoded qr code:", result);
          setMyValues((oldValues) => ({ ...oldValues, currentAccessToken: result.data }));
        },
        { returnDetailedScanResult: true, highlightScanRegion: true }
      )
    );
  }, [setMyValues]);

  function handleQrCodeScanner() {
    if (scanning) {
      setScannerHeight("0px");
      myScanner.stop();
      setScanning(false);
    } else {
      setScannerHeight("200px");
      myScanner.start();
      setScanning(true);
    }
  }

  return (
    <>
      <video
        ref={myContainer}
        id="qr-video"
        style={{
          maxWidth: "500px",
          marginBottom: "10px",
          height: scannerHeight,
        }}
      ></video>

      <Button
        variant="outline-secondary"
        id="button-addon2"
        style={{ marginBottom: "10px" }}
        onClick={() => handleQrCodeScanner()}
      >
        QR Code
      </Button>
    </>
  );
}
