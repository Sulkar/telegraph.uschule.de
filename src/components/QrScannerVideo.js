import React, { useState, useContext, useEffect, useRef } from "react";
import { InputGroup, FormControl, Button, Spinner } from "react-bootstrap";
import { MyContext } from "./MyContext";
import QrScanner from "qr-scanner";

export default function QrScannerVideo() {
  const [myValues, setMyValues] = useContext(MyContext);
  const [scanning, setScanning] = useState(false);
  const [loading, setLoading] = useState(false);
  const myContainer = useRef(null);
  const [scannerHeight, setScannerHeight] = useState("0px");

  useEffect(() => {
    const scanner = new QrScanner(
      myContainer.current,
      (result) => {
        setMyValues((oldValues) => ({
          ...oldValues,
          currentAccessToken: result.data,
        }));
      },
      { returnDetailedScanResult: true, highlightScanRegion: true }
    );
    setMyValues((oldValues) => ({
      ...oldValues,
      qrCodeScanner: scanner,
    }));
  }, [setMyValues]);

  function handleQrCodeScanner() {
    if (scanning) {
      setScannerHeight("0px");
      myValues.qrCodeScanner.stop();
      setScanning(false);
    } else {
      setLoading(true);
      myValues.qrCodeScanner.start().then(function () {
        setScannerHeight("200px");
        setScanning(true);
        setLoading(false);
      });
    }
  }

  return (
    <>
      {loading ? <Spinner animation="grow" /> : ""}

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
