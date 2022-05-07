import React, { useState, useContext, useEffect, useRef } from "react";
import { Button, Spinner, Dropdown } from "react-bootstrap";
import { MyContext } from "./MyContext";
import QrScanner from "qr-scanner";

export default function QrScannerVideo() {
  const [myValues, setMyValues] = useContext(MyContext);
  const [scanning, setScanning] = useState(false);
  const [loading, setLoading] = useState(false);
  const myContainer = useRef(null);
  const [displayScanner, setDisplayScanner] = useState("none");

  const [cameraItems, setCameraItems] = useState([]);
  const [currentCamera, setCurrentCamera] = useState([]);

  useEffect(() => {
    const scanner = new QrScanner(
      myContainer.current,
      (result) => {
        const access_token = result.data.replace(
          "https://telegraph-buddy.unsere-schule.org/?at=",
          ""
        );
        setMyValues((oldValues) => ({
          ...oldValues,
          currentAccessToken: access_token,
        }));
        scanner.stop();
        setScanning(false);
        setDisplayScanner("none");
      },
      { returnDetailedScanResult: true, highlightScanRegion: true }
    );
    setMyValues((oldValues) => ({
      ...oldValues,
      qrCodeScanner: scanner,
    }));
    listAvailableCameras();
  }, [setMyValues]);

  function listAvailableCameras() {
    let tempCameraItems = [];
    QrScanner.listCameras().then((cameras) => {
      cameras.forEach((camera) => {
        tempCameraItems.push(
          <Dropdown.Item
            key={camera.id}
            href="#/action-1"
            onClick={() => handleChangeCamera(camera.id)}
          >
            {camera.label}
          </Dropdown.Item>
        );
      });

      setCameraItems(tempCameraItems);
    });
  }

  function handleChangeCamera(selectedCameraId) {
    setCurrentCamera(selectedCameraId);
  }

  function handleQrCodeScanner() {
    if (scanning) {
      setDisplayScanner("none");
      myValues.qrCodeScanner.stop();
      setScanning(false);
    } else {
      setLoading(true);
      myValues.qrCodeScanner.start().then(function () {
        setDisplayScanner("block");
        setScanning(true);
        setLoading(false);
      });
    }
  }
  useEffect(() => {
    if (myValues.qrCodeScanner != null) {
      setLoading(true);
      myValues.qrCodeScanner.setCamera(currentCamera).then(function () {
        setLoading(false);
      });
    }
  }, [currentCamera]);

  return (
    <>
      {loading ? (
        <Spinner animation="grow" style={{ marginBottom: "10px" }} />
      ) : (
        ""
      )}

      <div
        style={{
          display: displayScanner,
          textAlign: "center",
          marginBottom: "10px",
          maxWidth: "500px",
        }}
      >
        <video
          ref={myContainer}
          id="qr-video"
          style={{
            maxWidth: "100%",
          }}
        ></video>

        <Dropdown>
          <Dropdown.Toggle variant="outline-secondary" id="dropdown-basic">
            change camera
          </Dropdown.Toggle>

          <Dropdown.Menu>{cameraItems}</Dropdown.Menu>
        </Dropdown>
      </div>

      <Button
        variant="outline-secondary"
        id="button-addon2"
        style={{ marginBottom: "10px" }}
        onClick={() => handleQrCodeScanner()}
      >
        QR code
      </Button>
    </>
  );
}
