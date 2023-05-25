import { render } from "preact";
import { App } from "./app.jsx";
import "./index.css";
import Context from "./userContext.jsx";

render(
  <Context>
    <App />
  </Context>,
  document.getElementById("app")
);
