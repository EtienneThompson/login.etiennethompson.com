import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Provider } from "react-redux";
import { Login } from "./pages/Login";
import { Error404 } from "./pages/404Error";
import { store } from "./store/store";
import "./index.scss";
import App from "./App";
import { LandingPage } from "./pages/LandingPage";
import { EnterEmail } from "./pages/EnterEmail";
import { ResetPassword } from "./pages/ResetPassword";

ReactDOM.render(
  <Provider store={store}>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />}>
          <Route path="" element={<LandingPage />} />
          <Route path="login" element={<Login />} />
          <Route path="enter_email" element={<EnterEmail />} />
          <Route path="reset_password" element={<ResetPassword />} />
          <Route path="*" element={<Error404 />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </Provider>,
  document.getElementById("root")
);
