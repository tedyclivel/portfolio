import React from "react";
import JobList from "./JobList";
import "../styles/Experience.css";
import FadeInSection from "./FadeInSection";

const Experience = ({ language }) => {
  return (
    <div id="experience">
      <FadeInSection>
        <div className="section-header ">
          <span className="section-title">{language === "en" ? "/ experience" : "/ expérience"}</span>
        </div>
        <JobList language={language} />
      </FadeInSection>
    </div>
  );
};

export default Experience;
