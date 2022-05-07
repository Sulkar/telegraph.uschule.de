import React, { useState, useContext, useEffect, useRef } from "react";
import { Form, Button, Spinner, Modal } from "react-bootstrap";
import { MyContext } from "./MyContext";
import axios from "axios";

export default function DeletePageModal() {
  const [myValues, setMyValues] = useContext(MyContext);
  const [loading, setLoading] = useState(false);
  const [pageDeleted, setPageDeleted] = useState(false);
  const [modalText, setModalText] = useState(
    "Are you sure you want to delete page:"
  );

  async function deletePage() {
    setLoading(true);
    const telegraphEditPage = "https://api.telegra.ph/editPage/";

    const pagePath = myValues.deletePagePath;
    const access_token = "?access_token=" + myValues.currentAccessToken;
    const newValue =
      '&title=...&author_name=...&content=[{"tag":"p","children":["..."]}]';

    const apiCallEditPage =
      telegraphEditPage + pagePath + access_token + newValue;

    axios
      .post(apiCallEditPage)
      .then(function (response) {
        if (response.data.ok) {
          setPageDeleted(true);
          setLoading(false);
          setModalText(myValues.deletePageTitle + " was deleted successfully!");
          setMyValues((oldValues) => ({
            ...oldValues,
            deletePagePath: "",
            deletePageTitle: "",
          }));
        } else {
          setLoading(false);
          console.log(response.data.error);
        }
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  const handleClose = () =>
    setMyValues((oldValues) => ({
      ...oldValues,
      showDeletePageModal: false,
    }));

  const handleDeletePage = () => deletePage();

  useEffect(() => {}, []);

  return (
    <>
      <Modal show={myValues.showDeletePageModal} onHide={handleClose} size="sm">
        <Modal.Body>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <div style={{ color: "#dc3545", fontWeight: "bolder" }}>
              telegraph-buddy.org - delete page
            </div>
            <div>{modalText}</div>

            <div
              style={{
                wordBreak: "break-all",
                textAlign: "center",
                fontWeight: "bolder",
              }}
            >
              {myValues.deletePageTitle}
            </div>
            {loading ? <Spinner animation="border" variant="secondary" /> : ""}
          </div>
        </Modal.Body>
        <Modal.Footer style={{ justifyContent: "center" }}>
          {pageDeleted ? (
            <Button variant="outline-secondary" onClick={handleClose}>
              ok
            </Button>
          ) : (
            <>
              <Button variant="outline-secondary" onClick={handleClose}>
                cancel
              </Button>
              <Button variant="outline-danger" onClick={handleDeletePage}>
                delete
              </Button>{" "}
            </>
          )}
        </Modal.Footer>
      </Modal>
    </>
  );
}
