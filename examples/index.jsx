import React from "react";
import { createRoot } from "react-dom/client";
//import App from "./App"
import TestApp from "./TestApp";

const container = document.getElementById("app");
const root = createRoot(container);
root.render(<TestApp  />);