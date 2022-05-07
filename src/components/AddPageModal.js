import React, { useState, useContext, useEffect, useRef } from "react";
import {
  Form,
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
  const [copyPageUrl, setCopyPageUrl] = useState(
    "https://telegra.ph/Sample-Page-12-15"
  );
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
          const content = JSON.stringify(response.data.result.content)
            .replace(/\//g, "\\/")
            .replace(/#/g, "%23");
          const title = response.data.result.title;
          setTimeout(() => {
            //createTelegraphPage2(title, content);
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
    const telegraphCreatePage = "https://api.telegra.ph/createPage";
    const access_token = "?access_token=" + myValues.currentAccessToken;
    const urlTitle = "&title=" + title;
    const urlContent = "&content=" + content;

    const apiCallCreatePage =
      telegraphCreatePage + access_token + urlTitle + urlContent;

    axios
      .post(apiCallCreatePage)
      .then(function (response) {
        if (response.data.ok) {
          setLoading(false);
          setLinkToNewPage(
            <a href={response.data.result.url} target="_blank">
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
  async function createTelegraphPage2(title, content) {
    setLoading(true);

    axios
      .post("https://api.telegra.ph/createPage", {
        data: {
          access_token: myValues.currentAccessToken,
          title: title,
          content: content,
        },
      })
      .then(function (response) {
        if (response.data.ok) {
          setLoading(false);
          setLinkToNewPage(
            <a href={response.data.result.url} target="_blank">
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

    /*if (showCopyPageInput) {
      setShowCopyPageInput(false);
    } else {
      setShowCopyPageInput(true);
    }*/
  };
  const handleCreateNewPage = () => {
    //window.open("https://telegra.ph/", "_blank");
    let tempContent =
      '[{"tag":"p","children":["[date=2022-04-29]"]},{"tag":"h3","attrs":{"id":"Inhalt"},"children":["Inhalt"]},{"tag":"ul","children":[{"tag":"li","children":[{"tag":"a","attrs":{"href":"#Klassen"},"children":["Klassen"]}]},{"tag":"li","children":[{"tag":"a","attrs":{"href":"#Start-ins-Abenteuer"},"children":["Start ins Abenteuer"]}]}]},{"tag":"p","children":["Mit dem Update 33, welches zum 15 jährigen Jubiläum auf die Server gespielt wurde, wurde das Free to Play Spiel gehörig aufgebohrt. "]},{"tag":"p","children":["Nun stehen allen Spielern alle Inhalte kostenlos zur Verfügung, also alle bis jetzt erschienen Erweiterungen und auch alle Völker und Klassen. Die einzige Ausnahme ist eine neue Zwergenrasse und die Klasse Schläger. Diese müssen extra gekauft werden."]},{"tag":"figure","children":[{"tag":"img","attrs":{"src":"/file/f3a587a508fd7cd69bcbb.png"}},{"tag":"figcaption","children":[""]}]},{"tag":"h3","attrs":{"id":"Die-Zeit-ist-reif-noch-einmal-das-Spiel-zu-spielen"},"children":["Die Zeit ist reif noch einmal das Spiel zu spielen"]},{"tag":"p","children":["Nach dem Download auf Steam wirst du gefragt, ob du zusätzlich 6 GB hochauflösende Dateien herunterladen möchtest. Das bringt das etwas ältere Spiel wahrscheinlich auf einen neueren Stand."]},{"tag":"p","children":["Nach dem Download kann man sich über die Webseite einen neuen Account erstellen:"]},{"tag":"figure","children":[{"tag":"img","attrs":{"src":"/file/028d62c7c4494292169fe.png"}},{"tag":"figcaption","children":[""]}]},{"tag":"p","children":["Das ist ein bisschen "old school", da man keinerlei Feedback bekommt, ob der Accountname bereits vergeben ist oder nicht. Es werden einfach alle Felder wieder geleert, falls der Name nicht vorhanden ist :-)"]},{"tag":"p","children":["Natürlich wähle ich als Spielwelt einen RP (Role Playing) Server:"]},{"tag":"figure","children":[{"tag":"img","attrs":{"src":"/file/eb452df9fb9d80065100f.png"}},{"tag":"figcaption","children":[""]}]},{"tag":"p","children":[{"tag":"br"}]},{"tag":"figure","children":[{"tag":"img","attrs":{"src":"/file/2f27dc9b471c9d6264e6d.png"}},{"tag":"figcaption","children":["Klassenauswahl"]}]},{"tag":"p","children":["Seit dem letzten Spielen gibt es zwei neue Klassen. Der Beorninger ist ein Gestaltswandler mit Unterstützungsfähigkeiten und der Schläger ist eine neue Nahkampfklasse die mit der Ressource Wut kämpft."]},{"tag":"h3","attrs":{"id":"Klassen"},"children":["Klassen"]},{"tag":"p","children":[{"tag":"a","attrs":{"href":"#Inhalt"},"children":["zurück"]}]},{"tag":"p","children":["Eine Übersicht der zur Verfügung stehenden Klassen kann man auf Lotro-Wiki finden:"]},{"tag":"p","children":[{"tag":"a","attrs":{"href":"https://lotro-wiki.com/index.php/Class","target":"_blank"},"children":["https://lotro-wiki.com/index.php/Class"]}]},{"tag":"figure","children":[{"tag":"img","attrs":{"src":"/file/320873121a4f6677ef840.png"}},{"tag":"figcaption","children":["P = Primary, S = Secondary"]}]},{"tag":"h3","attrs":{"id":"Start-ins-Abenteuer"},"children":["Start ins Abenteuer"]},{"tag":"h4","attrs":{"id":"Tag-1"},"children":["Tag 1"]},{"tag":"p","children":["Ich habe mich für einen Captain entschieden mit Namen Seikaul:"]},{"tag":"figure","children":[{"tag":"img","attrs":{"src":"/file/15a6a8dc05f42d67e1ab3.jpg"}},{"tag":"figcaption","children":[""]}]},{"tag":"p","children":[{"tag":"br"}]},{"tag":"figure","children":[{"tag":"img","attrs":{"src":"/file/2144447e1047dbc6e06d5.jpg"}},{"tag":"figcaption","children":["Karte von Archet"]}]},{"tag":"p","children":[{"tag":"br"}]},{"tag":"figure","children":[{"tag":"img","attrs":{"src":"/file/24381d8ba5c474392080d.jpg"}},{"tag":"figcaption","children":["Beim Kampf mit einem Wildschwein"]}]},{"tag":"p","children":["Nach ein paar Quests bin ich immer noch in ",{"tag":"strong","children":["Archet "]},"und Level 6 geworden. Jetzt kann ich einen Begleiter, einen Herald, beschwören, der an meiner Seite kämpft."]},{"tag":"h4","attrs":{"id":"Tag-2"},"children":["Tag 2"]},{"tag":"p","children":["ddd"]},{"tag":"p","children":[{"tag":"br"}]},{"tag":"p","children":[{"tag":"br"}]},{"tag":"p","children":[{"tag":"br"}]}]';
    createTelegraphPage("Test", tempContent);
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
