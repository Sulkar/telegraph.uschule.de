import React, { useState } from "react";

const MyContext = React.createContext({});

function MyContextProvider(props) {
  const [myValues, setMyValues] = useState({
    username: "",
    qrCodeScanner: null,
    loggedIn: false,
    currentPage: "login",
    currentAccessToken: "",  
    currentAuthorName: "",
    currentShortName: "",
    currentAuthorUrl: "",
    currentPageCount: "",
  });

  return (
    <MyContext.Provider value={[myValues, setMyValues]}>
      {props.children}
    </MyContext.Provider>
  );
}

export { MyContext, MyContextProvider };
