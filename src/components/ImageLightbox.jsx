import React, { useEffect, useRef } from "react";

const ImageLightbox = ({ image, alt, onClose, language }) => {
  const closeButtonRef = useRef(null);

  useEffect(() => {
    if (!image) return undefined;
    closeButtonRef.current?.focus();
    const handleKeyDown = (event) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [image, onClose]);

  if (!image) return null;

  return (
    <div className="image-lightbox" role="dialog" aria-modal="true" aria-label={alt} onMouseDown={onClose}>
      <button ref={closeButtonRef} type="button" className="image-lightbox-close" onClick={onClose} aria-label={language === "fr" ? "Fermer l’image" : "Close image"}>×</button>
      <img src={image} alt={alt} onMouseDown={(event) => event.stopPropagation()} />
    </div>
  );
};

export default ImageLightbox;
