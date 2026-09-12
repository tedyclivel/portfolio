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
import ScrollProgress from "./components/ScrollProgress";
import BackgroundWave from "./components/BackgroundWave";
import { Routes, Route, useLocation } from "react-router-dom";
import { useEffect } from "react";
import "./App.css";
import "./styles/Global.css";

function App() {
  const { pathname } = useLocation();
  const [gameActive, setGameActive] = useState(false);
  const [showGameInfo, setShowGameInfo] = useState(false);
  const [language, setLanguage] = useState(() => localStorage.getItem("portfolio-language") || "en");
  const gameCopy = language === "fr"
    ? { enable: "Activer le mode jeu", disable: "Désactiver le mode jeu", mode: "mode jeu", how: "comment jouer", move: "bouger", jump: "sauter", explore: "défilement automatique", goal: "récupère les cinq neurones à travers le portfolio" }
    : { enable: "Enable game mode", disable: "Disable game mode", mode: "game mode", how: "how to play", move: "move", jump: "jump", explore: "auto-scroll", goal: "recover five neurons across the portfolio" };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  useEffect(() => {
    localStorage.setItem("portfolio-language", language);
    document.documentElement.lang = language;
  }, [language]);

  return (
    <div className="App">
      <div className="ambient-background" aria-hidden="true">
        <span className="ambient-orb" />
        <span className="ambient-particle ambient-particle--one" />
        <span className="ambient-particle ambient-particle--two" />
        <span className="ambient-particle ambient-particle--three" />
        <span className="ambient-particle ambient-particle--four" />
      </div>
      <BackgroundWave />
      <NavBar language={language} onLanguageChange={setLanguage} />
      <ScrollProgress language={language} />
      <div className="game-toggle-fixed">
        <div className="game-toggle-row">
          <button
            className={`game-toggle-btn${gameActive ? " game-toggle-btn--on" : ""}`}
            onClick={() => setGameActive((active) => { if (active) setShowGameInfo(false); return !active; })}
            title={gameActive ? gameCopy.disable : gameCopy.enable}
            aria-pressed={gameActive}
          >
            <span className="game-toggle-dot" />
            {gameCopy.mode}
          </button>
          {gameActive && (
            <button
              className="game-info-btn"
              onMouseEnter={() => setShowGameInfo(true)}
              onMouseLeave={() => setShowGameInfo(false)}
              onFocus={() => setShowGameInfo(true)}
              onBlur={() => setShowGameInfo(false)}
              onClick={() => setShowGameInfo(true)}
              aria-label={gameCopy.how}
              aria-expanded={showGameInfo}
            >
              i
            </button>
          )}
        </div>
        {showGameInfo && gameActive && (
          <div className="robot-game-info">
            <div className="robot-game-info-title">{gameCopy.how}</div>
            <div className="robot-game-info-row">
              <span className="robot-game-key">← →</span>
              <span>{gameCopy.move}</span>
            </div>
            <div className="robot-game-info-row">
              <span className="robot-game-key">space</span>
              <span>{gameCopy.jump}</span>
            </div>
            <div className="robot-game-info-row">
              <span className="robot-game-key">scroll</span>
              <span>{gameCopy.explore}</span>
            </div>
        <div className="robot-game-info-goal">{gameCopy.goal}</div>
          </div>
        )}
      </div>
      <SidebarNav language={language} />
      {gameActive && <RobotGame active language={language} />}
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
