import logo from "./logo.svg";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import MyNavbar from "./components/MyNavbar";
import ButtonGroup from "./components/ButtonGroup";
import { MyContextProvider } from "./components/MyContext";


function App() {
  return (
    <MyContextProvider>
      <div className="App">
        <header className="App-header">
          <MyNavbar />
          <img src={logo} className="App-logo" alt="logo" />
          <p>
            Edit <code>src/App.js</code> and save to reload.
          </p>
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React
          </a>
          <button type="button" className="btn btn-primary">
            Prim2ary
          </button>
        </header>
      </div>
    </MyContextProvider>
  );
}

export default App;
