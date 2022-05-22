import React, { useState } from "react";

const MyContext = React.createContext({});

function MyContextProvider(props) {
  const [myValues, setMyValues] = useState({
    //global state variables
    qrCodeScanner: null,
    loggedIn: false,
    currentPage: "login",
    allPages: [],
    filteredPages: [],
    pageFilter: "",
    sortFilter: "",
    currentAccessToken: "",
    currentAuthorName: "",
    currentShortName: "",
    currentAuthorUrl: "",
    currentPageCount: "",
    showAccessTokenModal: false,
    showQRCodeModal: false,
    showAddPageModal: false,
    showDeletePageModal: false,
    showDeletedPages: false,
    deletePagePath: "",
    deletePageTitle: "",
    currentDeletedPages: 0,
    currentPaginationPage: 1,
    currentSelectedPage: null,
    pagesPerSite: 10,
    //reset function
    reset: function () {
      this.qrCodeScanner = null;
      this.loggedIn = false;
      this.currentPage = "login";
      this.allPages = [];
      this.filteredPages = [];
      this.pageFilter = "";
      this.sortFilter = "";
      this.currentAccessToken = "";
      this.currentAuthorName = "";
      this.currentShortName = "";
      this.currentAuthorUrl = "";
      this.currentPageCount = "";
      this.showAccessTokenModal = false;
      this.showQRCodeModal = false;
      this.showAddPageModal = false;
      this.showDeletePageModal = false;
      this.showDeletedPages = false;
      this.deletePagePath = "";
      this.deletePageTitle = "";
      this.currentPaginationPage = 1;
      this.currentSelectedPage = null;
    },
  });

  return (
    <MyContext.Provider value={[myValues, setMyValues]}>
      {props.children}
    </MyContext.Provider>
  );
}

export { MyContext, MyContextProvider };
