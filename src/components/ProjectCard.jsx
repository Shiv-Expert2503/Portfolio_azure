//Changes to adapt the width and height of the video and image to prevent cropping
import React, { useState, useEffect } from 'react';

const ProjectCard = ({ project, inView }) => {
  const [currentVisualIndex, setCurrentVisualIndex] = useState(0);
  const [expanded, setExpanded] = useState(false);

  const hasVisuals = Array.isArray(project.visuals) && project.visuals.length > 0;

  const nextVisual = () => {
    if (hasVisuals && project.visuals.length > 1) {
      setCurrentVisualIndex((prev) => (prev + 1) % project.visuals.length);
    }
  };

  const prevVisual = () => {
    if (hasVisuals && project.visuals.length > 1) {
      setCurrentVisualIndex((prev) => (prev - 1 + project.visuals.length) % project.visuals.length);
    }
  };
  
  useEffect(() => {
    if (inView && hasVisuals && project.visuals.length > 1) {
      const nextVisualIndex = (currentVisualIndex + 1) % project.visuals.length;
      const nextVisual = project.visuals[nextVisualIndex];
      if (nextVisual.type === 'image') {
        const img = new Image();
        img.src = nextVisual.src;
      }
    }
  }, [inView, currentVisualIndex, project.visuals, hasVisuals]);

  const currentVisual = hasVisuals ? project.visuals[currentVisualIndex] : null;

  return (
    <div>
      {hasVisuals && (
        // --- FIX: 'aspect-video' has been removed from this line to fix empty space ---
        <div className='w-full relative rounded-xl overflow-hidden bg-gray-200'>
          
          {inView ? (
            <>
              {currentVisual.type === 'video' ? (
                <video
                  key={currentVisual.mp4} 
                  autoPlay loop muted playsInline
                  // --- FIX: Changed to h-auto and object-contain for consistency ---
                  className='w-full h-auto object-contain' 
                >
                  <source src={currentVisual.webm} type="video/webm" />
                  <source src={currentVisual.mp4} type="video/mp4" />
                </video>
              ) : (
                <img
                  src={currentVisual.src}
                  alt={`${project.name} Visual`}
                  // --- FIX: Changed to h-auto and object-contain to prevent cropping ---
                  className='w-full h-auto object-contain'
                />
              )}

              {project.visuals.length > 1 && (
                <>
                  <button onClick={prevVisual} className='absolute top-1/2 left-2 transform -translate-y-1/2 bg-black/50 text-white p-2 rounded-full z-10'>
                    &#10094;
                  </button>
                  <button onClick={nextVisual} className='absolute top-1/2 right-2 transform -translate-y-1/2 bg-black/50 text-white p-2 rounded-full z-10'>
                    &#10095;
                  </button>
                </>
              )}
            </>
          ) : (
             // Render a simple placeholder with a minimum height to prevent layout jump on initial load
             <div style={{ minHeight: '250px' }}></div>
          )}
        </div>
      )}

      {/* The text content section stays the same */}
      <div className='mt-5 flex flex-col'>
          <h4 className='text-2xl font-poppins font-semibold text-white'>{project.name}</h4>
          <div className='mt-2 flex flex-wrap gap-2'>
              {project.tags.map((tag) => (
                  <span key={tag} className='text-sm text-blue-500 bg-blue-500/10 px-2 py-1 rounded-full'>
                      {tag}
                  </span>
              ))}
          </div>
          <p className='mt-3 text-slate-500 text-white/80'>{project.oneLiner}</p>
          {expanded && (
              <div className='mt-4 text-slate-500 text-white/80'>
                  <ul className='list-disc ml-5 space-y-2'>
                      {project.description.map((point, index) => (
                          <li key={`project-point-${index}`}>{point}</li>
                      ))}
                  </ul>
              </div>
          )}
          
          <div className='mt-5 flex items-center gap-4 font-poppins'>
              {project.links.github && <a href={project.links.github} target='_blank' rel='noopener noreferrer' className='font-semibold text-blue-600 hover:underline'>View on GitHub</a>}
              {project.links.demo && <a href={project.links.demo} target='_blank' rel='noopener noreferrer' className='font-semibold text-green-600 hover:underline'>Live Demo</a>}
              {project.links.analysis && <a href={project.links.analysis} target='_blank' rel='noopener noreferrer' className='font-semibold text-purple-600 hover:underline'>Read Analysis</a>}
              
              <button onClick={() => setExpanded(!expanded)} className='text-sm text-gray-400 hover:text-blue-400 ml-auto'>
                  {expanded ? 'Hide Details ▲' : 'Project Details ▼'}
              </button>
          </div>
      </div>
    </div>
  );
};

export default ProjectCard;