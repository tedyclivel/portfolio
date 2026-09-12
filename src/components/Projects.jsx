import React from "react";
import "../styles/Projects.css";
import FolderOpenRoundedIcon from "@mui/icons-material/FolderOpenRounded";
import FadeInSection from "./FadeInSection";
import ExternalLinks from "./ExternalLinks";
import { Carousel } from "react-bootstrap";
import portfolioPreview from "../assets/projects/tedy-portfolio/cover.png";

const githubProfile = "https://github.com/tedyclivel";
const linkedinProfile = "https://linkedin.com/in/tedy-clivel-fokou-temfack-2474ba331";

const spotlightProjects = [
  { title: "Growth OS", desc: "A personal productivity app that turns long-term goals into scheduled focus sessions, tracks daily habits, and provides progress reviews.", tech: "React, TypeScript, Vite, Tailwind CSS", image: "/assets/growth_os/img1.png", mobileImages: [1, 2, 3, 4, 5].map((number) => "/assets/growth_os/img" + number + ".png") },
  { title: "Kouture & Maestro", desc: "A SaaS platform for tailors combining business management with a web marketplace.", tech: "Flutter, BLoC, Next.js, Supabase", image: "/assets/kouture-maestro/cover.png", github: "https://github.com/tedyclivel/KoutureMaestro" },
  { title: "TchopTime", desc: "A family kitchen management application with meal planning and shopping list generation.", tech: "React Native", image: "/assets/tchoptime/talltales.png", github: "https://github.com/tedyclivel/tchoptime-3", mobileImages: [1, 2, 3, 4, 5, 6, 7].map((number) => "/assets/tchoptime/recettte" + number + ".png") },
  { title: "LexiFlow", desc: "A crossword puzzle game featuring interactive gameplay and a Duel mode.", tech: "Flutter", image: "/assets/lexiflow/nomansland.png", github: "https://github.com/tedyclivel/LexiFlow", mobileImages: [1, 2, 3, 4].map((number) => "/assets/lexiflow/lexi" + number + ".png") },
  { title: "Iron Mind", desc: "A mobile learning application for creating personalized learning paths and tracking progress.", tech: "Flutter", image: "/assets/iron-mind/portfolio.png", github: "https://github.com/tedyclivel/roamap_cyber_security", mobileImages: [1, 2, 3, 4, 5, 6].map((number) => "/assets/iron-mind/iron" + number + ".png") },
  { title: "Maestro", desc: "The mobile companion application for Kouture & Maestro, designed to help tailors manage their activity, orders and workflow from their phone.", tech: "Flutter, Dart, BLoC", image: "/assets/maestro/mobile1.jpg", github: "https://github.com/tedyclivel/Maestro", mobileImages: [1, 2, 3, 4, 5, 6, 7].map((number) => "/assets/maestro/mobile" + number + ".jpg") },
  { title: "Tedy Portfolio", desc: "A personal portfolio website presenting my experience, skills and software projects.", tech: "React, Vite, JavaScript, CSS, Cloudflare Pages", image: portfolioPreview, github: "https://github.com/tedyclivel/portfolio" },
];

const projects = [
  ...spotlightProjects.map(({ title, desc, tech, github }) => ({ title, desc, tech, github })),
];

const Projects = () => (
  <div id="projects">
    <div className="section-header">
      <span className="section-title">/ projects</span>
      <a href="https://github.com/tedyclivel" className="explore-link" target="_blank" rel="noopener noreferrer">
        View GitHub
      </a>
    </div>
    <div className="spotlight-projects-desktop">
      <Carousel interval={null}>
        {spotlightProjects.map((project) => (
          <Carousel.Item key={project.title}>
            {project.mobileImages ? (
              <div className="desktop-project-gallery">
                {project.mobileImages.map((image, imageIndex) => (
                  <img
                    key={image}
                    src={image}
                    alt={project.title + " mobile screen " + (imageIndex + 1)}
                  />
                ))}
              </div>
            ) : (
              <img className="d-block w-100" src={project.image} alt={project.title} />
            )}
            <Carousel.Caption>
              <h3>{project.title}</h3>
              <div>
                {project.desc}
                <div className="techStack">{project.tech}</div>
              </div>
              <ExternalLinks githubLink={project.github || githubProfile} openLink={linkedinProfile} />
            </Carousel.Caption>
          </Carousel.Item>
        ))}
      </Carousel>
    </div>
    <div className="spotlight-projects-mobile">
      {spotlightProjects.map((project, i) => (
        <FadeInSection key={project.title} delay={(i + 1) * 100 + "ms"}>
          <div className="projects-card">
            <div className="card-header">
              <div className="folder-icon">
                <FolderOpenRoundedIcon sx={{ fontSize: 35 }} />
              </div>
              <ExternalLinks githubLink={project.github || githubProfile} openLink={linkedinProfile} />
            </div>
            <div className="card-title">{project.title}</div>
            <div className="spotlight-mobile-image">
              <img src={project.image} alt={project.title} />
            </div>
            {project.mobileImages && (
              <div className="mobile-project-gallery">
                {project.mobileImages.map((image, imageIndex) => (
                  <img
                    key={image}
                    src={image}
                    alt={project.title + " mobile screen " + (imageIndex + 1)}
                  />
                ))}
              </div>
            )}
            <div className="card-desc">{project.desc}</div>
            <div className="card-tech">{project.tech}</div>
          </div>
        </FadeInSection>
      ))}
    </div>
    <div className="project-container">
      <ul className="projects-grid">
        {projects.map((project, i) => (
          <FadeInSection key={project.title} delay={(i + 1) * 100 + "ms"}>
            <li className="projects-card">
              <div className="card-header">
                <div className="folder-icon">
                  <FolderOpenRoundedIcon sx={{ fontSize: 35 }} />
                </div>
                <ExternalLinks githubLink={project.github || githubProfile} openLink={linkedinProfile} />
              </div>
              <div className="card-title">{project.title}</div>
              <div className="card-desc">{project.desc}</div>
              <div className="card-tech">{project.tech}</div>
            </li>
          </FadeInSection>
        ))}
      </ul>
    </div>
  </div>
);

export default Projects;
