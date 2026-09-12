import React from "react";
import "../styles/About.css";
import FadeInSection from "./FadeInSection";

const About = ({ language }) => {
  const copy = language === "fr"
    ? {
        title: "/ à propos",
        one: <>Je suis diplômé en <b>informatique</b> et développeur logiciel junior basé à Yaoundé, Cameroun. Je développe des interfaces mobiles avec Flutter et React Native, ainsi que des applications web avec React.js et Next.js.</>,
        stack: "Voici quelques technologies avec lesquelles je travaille :",
        two: "J’explore aussi le développement logiciel sécurisé à travers les réseaux, la cryptographie, l’investigation numérique et les compétitions de cybersécurité.",
      }
    : {
        title: "/ about me",
        one: <>I am a <b>Computer Science graduate</b> and junior software developer based in Yaoundé, Cameroon. I build mobile interfaces with Flutter and React Native, as well as web applications with React.js and Next.js.</>,
        stack: "Here are some technologies I have been working with:",
        two: "I also explore secure software development through networking, cryptography, digital forensics, and cybersecurity competitions.",
      };

  const techStack = [
    { name: "Flutter / Dart", icon: "flutter/flutter-original.svg" },
    { name: "React Native / Expo", icon: "react/react-original.svg" },
    { name: "React.js", icon: "react/react-original.svg" },
    { name: "Next.js", icon: "nextjs/nextjs-original.svg" },
    { name: "AngularJS", icon: "angularjs/angularjs-original.svg" },
    { name: "Three.js", icon: "threejs/threejs-original.svg" },
    { name: "TypeScript / JavaScript", icon: "typescript/typescript-original.svg" },
    { name: "Supabase / PostgreSQL", icon: "supabase/supabase-original.svg" },
    { name: "REST APIs / Git", icon: "git/git-original.svg" },
  ];

  return (
    <div id="about">
      <FadeInSection>
        <div className="section-header ">
          <span className="section-title">{copy.title}</span>
        </div>
        <div className="about-content">
          <div className="about-description">
            <p>{copy.one}</p>
            {copy.stack}
            <ul className="tech-stack">
              {techStack.map((techItem, i) => (
                <FadeInSection key={i} delay={(i + 1) * 100 + "ms"}>
                  <li>
                    <img
                      className="tech-logo"
                      src={`https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/${techItem.icon}`}
                      alt={`${techItem.name} logo`}
                      width="22"
                      height="22"
                      loading="lazy"
                    />
                    {techItem.name}
                  </li>
                </FadeInSection>
              ))}
            </ul>
            <p>{copy.two}</p>
          </div>
          <div className="about-image">
            <img alt="Tedy Clivel Fokou Temfack" src="/assets/me3.jpeg" />
          </div>
        </div>
      </FadeInSection>
    </div>
  );
};

export default About;
