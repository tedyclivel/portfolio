import React from "react";
import "../styles/Credits.css";
import FadeInSection from "./FadeInSection";

const Credits = ({ language }) => {
  const copy = language === "fr"
    ? ["Conçu et développé par Tedy Clivel Fokou Temfack.", "Tous droits réservés. ©"]
    : ["Built and designed by Tedy Clivel Fokou Temfack.", "All rights reserved. ©"];
  return (
    <FadeInSection>
      <div id="credits">
        <div className="ending-credits">
          <div>{copy[0]}</div>
          <div>{copy[1]}</div>
        </div>
      </div>
    </FadeInSection>
  );
};

export default Credits;
