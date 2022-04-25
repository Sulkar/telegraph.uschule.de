import React, { useState } from "react";

const MyContext = React.createContext({});

function MyContextProvider(props) {
  const [myValues, setMyValues] = useState({
    qrCodeScanner: null,
    loggedIn: false,
    currentPage: "login",
    currentAccessToken: "",  
    currentAuthorName: "",
    currentShortName: "",
    currentAuthorUrl: "",
    currentPageCount: "",
    showAccessTokenModal: false,
    currentPaginationPage: 1,
    pagesPerSite: 10,
  });

  return (
    <MyContext.Provider value={[myValues, setMyValues]}>
      {props.children}
    </MyContext.Provider>
  );
}

export { MyContext, MyContextProvider };
