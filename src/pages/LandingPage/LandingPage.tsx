import React from "react";
import { Container } from "../../components/common/Grid/Container";
import "./LandingPage.scss";

export const LandingPage = () => {
  document.title = "Etienne Thompson - Admin Center";
  document.documentElement.className = "theme-light";

  return (
    <div className="landing-page-container">
      <Container>LandingPage</Container>
    </div>
  );
};
