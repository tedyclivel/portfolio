import React from "react";
import "../styles/Intro.css";
import { TypeAnimation } from "react-type-animation";
import EmailRoundedIcon from "@mui/icons-material/EmailRounded";
import FadeInSection from "./FadeInSection";
import AsciiPortrait from "./AsciiPortrait";
import HeroScene from "./HeroScene";

const Intro = ({ language }) => {
  const copy = language === "fr"
    ? { greeting: "salut, ", closing: " ici.", status: "disponible pour de nouveaux projets", role: "software engineer · mobile + web", description: "Développeur logiciel junior basé au Cameroun, spécialisé dans les applications mobiles et web. Je conçois des produits numériques fiables avec Flutter, React Native, TypeScript et Supabase.", contact: "Me contacter", work: "Voir mes projets" }
    : { greeting: "hi, ", closing: " here.", status: "available for new opportunities", role: "software engineer · mobile + web", description: "Junior software developer from Cameroon focused on mobile and web applications. I build reliable digital products with Flutter, React Native, TypeScript, and Supabase.", contact: "Say hi!", work: "Explore my work" };

  return (
    <div id="intro">
      <div className="intro-simulation">
        <HeroScene />
        <AsciiPortrait />
      </div>
      <div className="intro-block">
        <div className="intro-terminal"><span>&gt;_</span> {copy.status}<i aria-hidden="true" /></div>
        <div className="intro-title">
          {copy.greeting}
          <span className="intro-name">
            <TypeAnimation
              sequence={["Tedy"]}
              wrapper="span"
              cursor={false}
              repeat={0}
            />
          </span>
          {copy.closing}
          <span className="intro-cursor">|</span>
        </div>
        <FadeInSection>
          <div className="intro-role">{copy.role}</div>
          <div className="intro-desc">
            {copy.description}
          </div>
          <div className="intro-actions">
            <a href="mailto:tedyclivel1@gmail.com" className="intro-contact"><EmailRoundedIcon />{` ${copy.contact}`}</a>
            <a href="#projects" className="intro-work">{copy.work}<span aria-hidden="true">↓</span></a>
          </div>
        </FadeInSection>
      </div>
    </div>
  );
};

export default Intro;
