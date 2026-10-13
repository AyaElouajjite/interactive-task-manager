import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import store from "./redux/store";
import "./index.css";
import App from "./App.tsx";

createRoot(document.getElementById("root")!).render(
  /*
  <BrowserRouter> est un composant fourni par react-router-dom qui permet de gérer le routage 
  dans une application React en utilisant l’historique du navigateur.
  */
  //StrictMode => Lets you find common bugs in your components early during development.

  <StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Provider>
  </StrictMode>
);
