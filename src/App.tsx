import React from "react";
import { Outlet } from "react-router";
import { Link } from "react-router-dom";
import { BrandMark } from "./components/common/BrandMark";
import "./App.scss";

const App = () => {
  return (
    <div className="app">
      <header className="app-header">
        <Link to="/" className="app-brand">
          <BrandMark size={34} />
          <span className="app-brand-name">Etienne Thompson</span>
          <span className="app-brand-divider" aria-hidden="true" />
          <span className="app-brand-product">Account</span>
        </Link>
      </header>
      <main className="app-main">
        <Outlet />
      </main>
      <footer className="app-footer">
        <span>© {new Date().getFullYear()} Etienne Thompson</span>
        <span aria-hidden="true">·</span>
        <a href="https://etiennethompson.com">etiennethompson.com</a>
        <span aria-hidden="true">·</span>
        <a href="https://github.com/EtienneThompson/login.etiennethompson.com">
          Source
        </a>
      </footer>
    </div>
  );
};

export default App;
