import React, { useState } from "react";
import Intro from "./components/Intro";
import Experience from "./components/Experience";
import About from "./components/About";
import Projects from "./components/Projects";
import Credits from "./components/Credits";
import NavBar from "./components/NavBar";
import SidebarNav from "./components/SidebarNav";
import RobotGame from "./components/RobotGame";
import EngineeringHighlights from "./components/EngineeringHighlights";
import { Routes, Route, useLocation } from "react-router-dom";
import { useEffect } from "react";
import "./App.css";
import "./styles/Global.css";
import "./styles/RobotGame.css";

function App() {
  const { pathname } = useLocation();
  const [gameActive, setGameActive] = useState(false);
  const [showGameInfo, setShowGameInfo] = useState(false);
  const [language, setLanguage] = useState(() => localStorage.getItem("portfolio-language") || "en");

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  useEffect(() => {
    localStorage.setItem("portfolio-language", language);
    document.documentElement.lang = language;
  }, [language]);

  return (
    <div className="App">
      <NavBar language={language} onLanguageChange={setLanguage} />
      <div className="game-toggle-fixed">
        <div className="game-toggle-row">
          <button
            className={`game-toggle-btn${gameActive ? " game-toggle-btn--on" : ""}`}
            onClick={() => setGameActive((a) => !a)}
            title={gameActive ? "Disable game mode" : "Enable game mode"}
          >
            <span className="game-toggle-dot" />
            game mode
          </button>
          {gameActive && (
            <button
              className="game-info-btn"
              onMouseEnter={() => setShowGameInfo(true)}
              onMouseLeave={() => setShowGameInfo(false)}
            >
              i
            </button>
          )}
        </div>
        {showGameInfo && gameActive && (
          <div className="robot-game-info">
            <div className="robot-game-info-title">how to play</div>
            <div className="robot-game-info-row">
              <span className="robot-game-key">← →</span>
              <span>move</span>
            </div>
            <div className="robot-game-info-row">
              <span className="robot-game-key">space</span>
              <span>jump</span>
            </div>
            <div className="robot-game-info-row">
              <span className="robot-game-key">scroll</span>
              <span>explore</span>
            </div>
        <div className="robot-game-info-goal">explore the portfolio and have fun</div>
          </div>
        )}
      </div>
      <SidebarNav language={language} />
      <RobotGame active={gameActive} />
      <div id="content">
        <Routes>
          <Route
            path="/"
            element={
              <>
                <Intro language={language} />
                <About language={language} />
                <Experience language={language} />
                <EngineeringHighlights language={language} />
                <Projects language={language} />
                <Credits language={language} />
              </>
            }
          />
        </Routes>
      </div>
    </div>
  );
}

export default App;
