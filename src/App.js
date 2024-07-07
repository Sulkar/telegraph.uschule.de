import logo from "./logo.svg";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import MyNavbar from "./components/MyNavbar";
import Page from "./components/Page";
import { MyContextProvider } from "./components/MyContext";

function App() {

  return (
    <MyContextProvider>
      <div className="App">
        <header className="App-header">
          <img src="./logo2.svg" style={{maxWidth: "400px", marginTop: "20px", marginBottom: "20px"}}/>
          
          <MyNavbar />
          <Page />
        </header>
        <footer className="App-footer">with ❤️ by <a href="https://unsere-schule.org/">Richard Scheglmann</a></footer>
      </div>
    </MyContextProvider>
  );
}

export default App;
