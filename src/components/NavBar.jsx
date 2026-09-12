import React, { useState, useEffect, useRef } from "react";
import { Container, Nav, Navbar } from "react-bootstrap";
import EmailRoundedIcon from "@mui/icons-material/EmailRounded";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import GitHubIcon from "@mui/icons-material/GitHub";
import "../styles/NavBar.css";

const NavBar = ({ language, onLanguageChange }) => {
  const [expanded, setExpanded] = useState(false);
  const scrollPos = useRef(0);

  useEffect(() => {
    if (expanded) {
      scrollPos.current = window.scrollY;
      document.body.style.position = "fixed";
      document.body.style.top = `-${scrollPos.current}px`;
      document.body.style.width = "100%";
    } else {
      const scrollY = document.body.style.top;
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.width = "";
      if (scrollY) {
        window.scrollTo(0, parseInt(scrollY || "0") * -1);
      }
    }
  }, [expanded]);

  return (
    <Navbar
      fixed="top"
      expand="lg"
      className="navbar"
      data-bs-theme="dark"
      expanded={expanded}
      onToggle={(isExpanded) => setExpanded(isExpanded)}
    >
      <Container>
        <Navbar.Brand href="/">Tedy Clivel</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto" onSelect={() => setExpanded(false)}>
            <Nav.Link href="/#intro">{language === "en" ? "Home" : "Accueil"}</Nav.Link>
            <Nav.Link href="/#about">{language === "en" ? "About" : "À propos"}</Nav.Link>
            <Nav.Link href="/#experience">{language === "en" ? "Experience" : "Expérience"}</Nav.Link>
            <Nav.Link href="/#projects">{language === "en" ? "Projects" : "Projets"}</Nav.Link>
          </Nav>
          <Nav className="ms-auto" onSelect={() => setExpanded(false)}>
            <Nav.Link href="mailto:tedyclivel1@gmail.com" aria-label="Email Tedy Clivel">
              <EmailRoundedIcon style={{ fontSize: 20 }} />
            </Nav.Link>
            <Nav.Link href="https://github.com/tedyclivel" target="_blank" rel="noopener noreferrer" aria-label="Tedy Clivel on GitHub">
              <GitHubIcon style={{ fontSize: 19 }} />
            </Nav.Link>
            <Nav.Link
              href="https://linkedin.com/in/tedy-clivel-fokou-temfack-2474ba331"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Tedy Clivel on LinkedIn"
            >
              <LinkedInIcon style={{ fontSize: 21 }} />
            </Nav.Link>
            <button
              type="button"
              className="language-switcher"
              onClick={() => onLanguageChange(language === "en" ? "fr" : "en")}
              aria-label={language === "en" ? "Passer en français" : "Switch to English"}
            >
              {language === "en" ? "FR" : "EN"}
            </button>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavBar;
