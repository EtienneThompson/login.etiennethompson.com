import React from "react";
import { Outlet } from "react-router";
import { Toolbar } from "./components/common/Toolbar";
import { Container } from "./components/common/Grid/Container";
import "./App.scss";

const App = () => {
  return (
    <Container>
      <Toolbar />
      <Outlet />
    </Container>
  );
};

export default App;
