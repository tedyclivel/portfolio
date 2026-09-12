import React from "react";
import FadeInSection from "./FadeInSection";

const EngineeringHighlights = ({ language }) => {
  const copy = language === "fr"
    ? { title: "/ points d’ingénierie", items: [["Mobile", "Flutter, React Native, responsive product flows"], ["Web", "React, TypeScript, Next.js, Vite"], ["Pratiques", "Git, REST APIs, Supabase, accessibilité et performance"]] }
    : { title: "/ engineering highlights", items: [["Mobile", "Flutter, React Native, responsive product flows"], ["Web", "React, TypeScript, Next.js, Vite"], ["Practices", "Git, REST APIs, Supabase, accessibility, and performance"]] };

  return <section id="highlights"><FadeInSection><div className="section-header"><span className="section-title">{copy.title}</span></div><div className="highlights-grid">{copy.items.map(([title, value]) => <div className="highlight-item" key={title}><h3>{title}</h3><p>{value}</p></div>)}</div></FadeInSection></section>;
};

export default EngineeringHighlights;
