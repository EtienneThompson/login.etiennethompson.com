import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Provider } from "react-redux";
import { Login } from "./pages/Login";
import { Error404 } from "./pages/404Error";
import { store } from "./store/store";
import "./index.scss";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { LandingPage } from "./pages/LandingPage";
import { ResetPassword } from "./pages/ResetPassword";

ReactDOM.render(
  <Provider store={store}>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />}>
          <Route path="" element={<LandingPage />} />
          <Route path="login" element={<Login />} />
          <Route path="reset_password" element={<ResetPassword />} />
          <Route path="*" element={<Error404 />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </Provider>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
