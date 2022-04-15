import React, { useState } from "react";

const MyContext = React.createContext({});

function MyContextProvider(props) {
  const [myValues, setMyValues] = useState({
    username: "",
    loggedIn: false,
    currentPage: "login",
    currentAccessToken: "",   
  });

  return (
    <MyContext.Provider value={[myValues, setMyValues]}>
      {props.children}
    </MyContext.Provider>
  );
}

export { MyContext, MyContextProvider };
