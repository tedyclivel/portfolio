import React from "react";
import "../styles/Intro.css";
import { TypeAnimation } from "react-type-animation";
import EmailRoundedIcon from "@mui/icons-material/EmailRounded";
import FadeInSection from "./FadeInSection";
import AsciiPortrait from "./AsciiPortrait";

const Intro = ({ language }) => {
  const copy = language === "fr"
    ? { greeting: "salut, ", closing: " ici.", description: "Développeur logiciel junior basé au Cameroun, spécialisé dans les applications mobiles et web. Je conçois des produits numériques fiables avec Flutter, React Native, TypeScript et Supabase.", contact: "Me contacter" }
    : { greeting: "hi, ", closing: " here.", description: "Junior software developer from Cameroon focused on mobile and web applications. I build reliable digital products with Flutter, React Native, TypeScript, and Supabase.", contact: "Say hi!" };

  return (
    <div id="intro">
      <div className="intro-simulation">
        <AsciiPortrait />
      </div>
      <div className="intro-block">
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
          <div className="intro-desc">
            {copy.description}
          </div>
          <a href="mailto:tedyclivel1@gmail.com" className="intro-contact">
            <EmailRoundedIcon />
            {` ${copy.contact}`}
          </a>
        </FadeInSection>
      </div>
    </div>
  );
};

export default Intro;
