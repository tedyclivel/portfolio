import React, { useEffect, useRef } from "react";
import { Modal } from "react-bootstrap";

const ProjectDetailsModal = ({ project, onHide, language, onImageSelect }) => {
  const closeButtonRef = useRef(null);
  const copy = language === "fr"
    ? { close: "Fermer", challenge: "Contexte", solution: "Approche", engineering: "Points d’ingénierie", impact: "Impact", screenshots: "Aperçus du produit", enlarge: "Agrandir l’image" }
    : { close: "Close", challenge: "Context", solution: "Approach", engineering: "Engineering highlights", impact: "Impact", screenshots: "Product previews", enlarge: "Enlarge image" };

  useEffect(() => {
    if (project) closeButtonRef.current?.focus();
  }, [project]);

  if (!project) return null;

  return (
    <Modal show={Boolean(project)} onHide={onHide} centered size="lg" contentClassName="project-modal" aria-labelledby="project-case-study-title">
      <Modal.Header>
        <Modal.Title id="project-case-study-title">{project.title}</Modal.Title>
        <button ref={closeButtonRef} type="button" className="project-modal-close" onClick={onHide} aria-label={copy.close}>×</button>
      </Modal.Header>
      <Modal.Body>
        <p className="project-modal-tech">{project.tech}</p>
        <section>
          <h4>{copy.challenge}</h4>
          <p>{project.details.challenge}</p>
        </section>
        <section>
          <h4>{copy.solution}</h4>
          <p>{project.details.solution}</p>
        </section>
        <section>
          <h4>{copy.engineering}</h4>
          <ul>
            {project.details.engineering.map((item) => <li key={item}>{item}</li>)}
          </ul>
        </section>
        <section>
          <h4>{copy.impact}</h4>
          <p>{project.details.impact}</p>
        </section>
        {(
          <section>
            <h4>{copy.screenshots}</h4>
            <div className="project-modal-gallery">
              {[project.image, ...(project.mobileImages || []).filter((image) => image !== project.image)].map((image, index) => (
                <button type="button" key={image} onClick={() => onImageSelect(image, `${project.title} screen ${index + 1}`)} aria-label={`${copy.enlarge}: ${project.title} screen ${index + 1}`}>
                  <img src={image} alt={`${project.title} screen ${index + 1}`} loading="lazy" decoding="async" />
                </button>
              ))}
            </div>
          </section>
        )}
      </Modal.Body>
    </Modal>
  );
};

export default ProjectDetailsModal;
