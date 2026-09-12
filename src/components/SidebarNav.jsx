import React from "react";

import "../styles/SidebarNav.css";
import FadeInSection from "./FadeInSection";

import { useMediaQuery } from "@mui/material";

const SidebarNav = ({ language }) => {
  const isMobile = useMediaQuery("(max-width: 800px)");
  const labels = language === "fr"
    ? ["accueil", "à propos", "expérience", "projets"]
    : ["home", "about", "experience", "projects"];
  const links = [
    <a key="1" href="/#intro"><span className="nav-slash">/</span>{labels[0]}</a>,
    <a key="2" href="/#about"><span className="nav-slash">/</span>{labels[1]}</a>,
    <a key="3" href="/#experience"><span className="nav-slash">/</span>{labels[2]}</a>,
    <a key="4" href="/#projects"><span className="nav-slash">/</span>{labels[3]}</a>
  ];

  return (
    <div className="sidebar-nav">
      {!isMobile && (
        <div className="sidebar-links">
          {links.map((link, i) => (
            <FadeInSection key={i} delay={(i + 1) * 100 + "ms"}>
              <div>{link}</div>
            </FadeInSection>
          ))}
        </div>
      )}
    </div>
  );
};

export default SidebarNav;
