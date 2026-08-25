import React from "react";
import "../styles/About.css";
import FadeInSection from "./FadeInSection";

const About = () => {
  const one = (
    <p>
      I am a <b>Computer Science graduate</b> and junior software developer
      based in Yaoundé, Cameroon. I have hands-on experience developing mobile
      interfaces with Flutter and React Native, as well as web applications
      with React.js and Next.js.
    </p>
  );
  const two = (
    <p>
      I also enjoy exploring secure software development through networking,
      cryptography, digital forensics and cybersecurity competitions.
    </p>
  );

  const techStack = [
    "Flutter / Dart",
    "React Native / Expo",
    "React.js / Next.js",
    "TypeScript / JavaScript",
    "Supabase / PostgreSQL",
    "REST APIs / Git",
  ];

  return (
    <div id="about">
      <FadeInSection>
        <div className="section-header ">
          <span className="section-title">/ about me</span>
        </div>
        <div className="about-content">
          <div className="about-description">
            {one}
            {"Here are some technologies I have been working with:"}
            <ul className="tech-stack">
              {techStack.map((techItem, i) => (
                <FadeInSection key={i} delay={(i + 1) * 100 + "ms"}>
                  <li>{techItem}</li>
                </FadeInSection>
              ))}
            </ul>
            {two}
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
