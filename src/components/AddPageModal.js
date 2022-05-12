import React, { useState, useContext, useEffect } from "react";
import {
  Button,
  Spinner,
  Modal,
  InputGroup,
  FormControl,
} from "react-bootstrap";
import { MyContext } from "./MyContext";
import axios from "axios";

export default function AddPageModal() {
  const [myValues, setMyValues] = useContext(MyContext);
  const [loading, setLoading] = useState(false);
  const [linkToNewPage, setLinkToNewPage] = useState(null);
  const [copyPageUrl, setCopyPageUrl] = useState("");
  const [modalText, setModalText] = useState(
    "Would you like to create a new page or copy an existing page?"
  );

  async function getPageData() {
    setLoading(true);
    const telegraphGetPage = "https://api.telegra.ph/getPage/";

    const pagePath = copyPageUrl.replace("https://telegra.ph/", "");
    const return_content = "?return_content=true";

    const apiCallGetPage = telegraphGetPage + pagePath + return_content;

    axios
      .post(apiCallGetPage)
      .then(function (response) {
        if (response.data.ok) {
          setLoading(false);
          const content = JSON.stringify(response.data.result.content);
          const title = response.data.result.title;
          setTimeout(() => {
            createTelegraphPage(title, content);
          }, 100);

          setModalText("test  was deleted successfully!");
        } else {
          setLoading(false);
          console.log(response.data.error);
        }
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  async function createTelegraphPage(title, content) {
    setLoading(true);

    var data = new FormData();
    data.append("access_token", myValues.currentAccessToken);
    data.append("title", title);
    data.append("content", content);

    var config = {
      method: "post",
      url: "https://api.telegra.ph/createPage",
      headers: {
        "content-type": "text/json",
      },
      data: data,
    };

    axios(config)
      .then(function (response) {
        if (response.data.ok) {
          setLoading(false);
          setLinkToNewPage(
            <a href={response.data.result.url} target="_blank" rel="noreferrer">
              {response.data.result.title}
            </a>
          );
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
      showAddPageModal: false,
    }));

  const handleCopyPage = () => {
    getPageData();
  };
  const handleCreateNewPage = () => {
    window.open("https://telegra.ph/", "_blank");
  };

  function onInputchange(event) {
    setCopyPageUrl(event.target.value);
  }

  useEffect(() => {}, []);

  return (
    <>
      <Modal show={myValues.showAddPageModal} onHide={handleClose} size="sm">
        <Modal.Body>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <div style={{ color: "#198754", fontWeight: "bolder" }}>
              telegraph-buddy.org - add page
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
            <Button
              variant="outline-success"
              onClick={handleCreateNewPage}
              style={{ margin: "10px" }}
            >
              create new page
            </Button>

            <InputGroup
              className=""
              style={{ width: "auto", marginTop: "10px" }}
            >
              <FormControl
                style={{ width: "" }}
                placeholder="https://telegra.ph/..."
                aria-label="Access Token"
                aria-describedby="basic-addon2"
                value={copyPageUrl}
                onChange={onInputchange}
              />
              <Button
                key="setPagesPerSite"
                variant="outline-success"
                id="button-addon2"
                onClick={() => handleCopyPage()}
              >
                copy page
              </Button>
            </InputGroup>

            {linkToNewPage}

            {loading ? <Spinner animation="border" variant="secondary" /> : ""}
          </div>
        </Modal.Body>
        <Modal.Footer style={{ justifyContent: "center" }}>
          <Button variant="outline-secondary" onClick={handleClose}>
            cancel
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
