import React from "react";
import { App } from "./App";
import { render } from "preact";
import "./index.css";

render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.body,
);
