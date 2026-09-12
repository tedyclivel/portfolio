import React, { useEffect, useState } from "react";
import "../styles/ScrollProgress.css";

const sectionIds = ["intro", "about", "experience", "highlights", "projects"];

const ScrollProgress = ({ language }) => {
  const [activeSection, setActiveSection] = useState("intro");
  const [progress, setProgress] = useState(0);
  const labels = language === "fr"
    ? ["Accueil", "À propos", "Expérience", "Expertise", "Projets"]
    : ["Home", "About", "Experience", "Expertise", "Projects"];

  useEffect(() => {
    let ticking = false;
    const update = () => {
      const scrollable = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(scrollable > 0 ? Math.min(1, window.scrollY / scrollable) : 0);
      const target = window.scrollY + window.innerHeight * 0.42;
      let current = sectionIds[0];
      sectionIds.forEach((id) => {
        const section = document.getElementById(id);
        if (section && section.offsetTop <= target) current = id;
      });
      setActiveSection(current);
      ticking = false;
    };
    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <nav className="scroll-progress" aria-label={language === "fr" ? "Progression dans la page" : "Page progress"} style={{ "--page-progress": progress }}>
      <div className="scroll-progress-track" aria-hidden="true"><span /></div>
      <div className="scroll-progress-points">
        {sectionIds.map((id, index) => (
          <a key={id} href={`#${id}`} className={activeSection === id ? "is-active" : ""} aria-current={activeSection === id ? "location" : undefined}>
            <span className="scroll-progress-dot" aria-hidden="true" />
            <span className="scroll-progress-label">{labels[index]}</span>
          </a>
        ))}
      </div>
    </nav>
  );
};

export default ScrollProgress;
