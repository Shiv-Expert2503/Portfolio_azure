// // In src/components/ProjectCard.jsx
// import React, { useState } from 'react';

// const ProjectCard = ({ project }) => {
//   const [currentVisual, setCurrentVisual] = useState(0);
//   const [expanded, setExpanded] = useState(false);

//   const nextVisual = () => {
//     setCurrentVisual((prev) => (prev + 1) % project.visuals.length);
//   };

//   const prevVisual = () => {
//     setCurrentVisual((prev) => (prev - 1 + project.visuals.length) % project.visuals.length);
//   };

//   return (
//     <div className='lg:w-3/4 w-full'>
//       <div className='block-container w-full h-60 sm:h-80 relative'>
//         <div className={`btn-back rounded-xl ${project.theme}`} />
//         <img
//           src={project.visuals[currentVisual]}
//           alt={`${project.name} Visual`}
//           className='w-full h-full object-cover rounded-xl'
//         />
//         {/* Navigation Arrows for Carousel */}
//         {project.visuals.length > 1 && (
//           <>
//             <button onClick={prevVisual} className='absolute top-1/2 left-2 transform -translate-y-1/2 bg-black/50 text-white p-2 rounded-full'>
//               &#10094;
//             </button>
//             <button onClick={nextVisual} className='absolute top-1/2 right-2 transform -translate-y-1/2 bg-black/50 text-white p-2 rounded-full'>
//               &#10095;
//             </button>
//           </>
//         )}
//       </div>

//       <div className='mt-5 flex flex-col'>
//         <h4 className='text-2xl font-poppins font-semibold'>{project.name}</h4>
//         <div className='mt-2 flex flex-wrap gap-2'>
//           {project.tags.map((tag) => (
//             <span key={tag} className='text-sm text-blue-500 bg-blue-500/10 px-2 py-1 rounded-full'>
//               {tag}
//             </span>
//           ))}
//         </div>
//         <p className='mt-3 text-slate-500'>{project.oneLiner}</p>
        
//         {expanded && (
//             <div className='mt-4 text-slate-500'>
//                 <ul className='list-disc ml-5 space-y-2'>
//                     {project.description.map((point, index) => (
//                         <li key={`project-point-${index}`}>{point}</li>
//                     ))}
//                 </ul>
//             </div>
//         )}
        
//         <div className='mt-5 flex items-center gap-4 font-poppins'>
//             {/* Conditional Rendering of Links */}
//             {project.links.github && <a href={project.links.github} target='_blank' rel='noopener noreferrer' className='font-semibold text-blue-600 hover:underline'>View on GitHub</a>}
//             {project.links.demo && <a href={project.links.demo} target='_blank' rel='noopener noreferrer' className='font-semibold text-green-600 hover:underline'>Live Demo</a>}
//             {project.links.analysis && <a href={project.links.analysis} target='_blank' rel='noopener noreferrer' className='font-semibold text-purple-600 hover:underline'>Read Analysis</a>}
            
//             <button onClick={() => setExpanded(!expanded)} className='text-sm text-gray-600 hover:text-black ml-auto'>
//                 {expanded ? 'Hide Details ▲' : 'Project Details ▼'}
//             </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ProjectCard;




// // In src/components/ProjectCard.jsx
// import React, { useState } from 'react';

// const ProjectCard = ({ project }) => {
//   const [currentVisualIndex, setCurrentVisualIndex] = useState(0);
//   const [expanded, setExpanded] = useState(false);


//   // This check is the key to our solution
//   const hasVisuals = Array.isArray(project.visuals) && project.visuals.length > 0;

//   const nextVisual = () => {
//     if (hasVisuals && project.visuals.length > 1) {
//       setCurrentVisualIndex((prev) => (prev + 1) % project.visuals.length);
//     }
//   };

//   const prevVisual = () => {
//     if (hasVisuals && project.visuals.length > 1) {
//       setCurrentVisualIndex((prev) => (prev - 1 + project.visuals.length) % project.visuals.length);
//     }
//   };

//   return (
//     <div className='lg:w-3/4 w-full'>
//       {hasVisuals && (
//         // --- FIX: Removed fixed height classes (h-60 sm:h-80) from this container ---
//         // This container will now perfectly wrap your image, whatever its aspect ratio.
//         <div className='w-full relative rounded-xl overflow-hidden bg-gray-200'>
//           <video
//             src={project.visuals[currentVisualIndex]} // Path to your .mp4 file
//             autoPlay
//             loop
//             muted
//             playsInline
//             className='w-full h-full object-cover rounded-xl'
//           />
//           {project.visuals.length > 1 && (
//             <>
//               <button onClick={prevVisual} className='absolute top-1/2 left-2 transform -translate-y-1/2 bg-black/50 text-white p-2 rounded-full z-10'>
//                 &#10094;
//               </button>
//               <button onClick={nextVisual} className='absolute top-1/2 right-2 transform -translate-y-1/2 bg-black/50 text-white p-2 rounded-full z-10'>
//                 &#10095;
//               </button>
//             </>
//           )}
//         </div>
//       )}

//       {/* The rest of your code stays the same... */}
//       <div className='mt-5 flex flex-col'>
//         <h4 className='text-2xl font-poppins font-semibold'>{project.name}</h4>
//         <div className='mt-2 flex flex-wrap gap-2'>
//           {project.tags.map((tag) => (
//             <span key={tag} className='text-sm text-blue-500 bg-blue-500/10 px-2 py-1 rounded-full'>
//               {tag}
//             </span>
//           ))}
//         </div>
//         <p className='mt-3 text-slate-500'>{project.oneLiner}</p>
        
//         {expanded && (
//             <div className='mt-4 text-slate-500'>
//                 <ul className='list-disc ml-5 space-y-2'>
//                     {project.description.map((point, index) => (
//                         <li key={`project-point-${index}`}>{point}</li>
//                     ))}
//                 </ul>
//             </div>
//         )}
        
//         <div className='mt-5 flex items-center gap-4 font-poppins'>
//             {project.links.github && <a href={project.links.github} target='_blank' rel='noopener noreferrer' className='font-semibold text-blue-600 hover:underline'>View on GitHub</a>}
//             {project.links.demo && <a href={project.links.demo} target='_blank' rel='noopener noreferrer' className='font-semibold text-green-600 hover:underline'>Live Demo</a>}
//             {project.links.analysis && <a href={project.links.analysis} target='_blank' rel='noopener noreferrer' className='font-semibold text-purple-600 hover:underline'>Read Analysis</a>}
            
//             <button onClick={() => setExpanded(!expanded)} className='text-sm text-gray-600 hover:text-black ml-auto'>
//                 {expanded ? 'Hide Details ▲' : 'Project Details ▼'}
//             </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ProjectCard;



// dynamic nature for images and videos
// import React, { useState } from 'react';

// const ProjectCard = ({ project }) => {
//   const [currentVisualIndex, setCurrentVisualIndex] = useState(0);
//   const [expanded, setExpanded] = useState(false);

//   const hasVisuals = Array.isArray(project.visuals) && project.visuals.length > 0;

//   const nextVisual = () => {
//     if (hasVisuals && project.visuals.length > 1) {
//       setCurrentVisualIndex((prev) => (prev + 1) % project.visuals.length);
//     }
//   };

//   const prevVisual = () => {
//     if (hasVisuals && project.visuals.length > 1) {
//       setCurrentVisualIndex((prev) => (prev - 1 + project.visuals.length) % project.visuals.length);
//     }
//   };

//   // Get the current visual object from the array
//   const currentVisual = hasVisuals ? project.visuals[currentVisualIndex] : null;

//   return (
//     <div>
//       {hasVisuals && (
//         <div className='w-full relative rounded-xl overflow-hidden bg-gray-200'>
          
//           {/* --- This is the new logic to handle both images and videos --- */}
//           {currentVisual.type === 'video' ? (
//             <video
//               // The key forces React to re-mount the video element when the source changes
//               key={currentVisual.mp4} 
//               autoPlay
//               loop
//               muted
//               playsInline
//               // The h-auto class is crucial for maintaining the correct aspect ratio
//               className='w-full h-auto object-cover' 
//             >
//               <source src={currentVisual.webm} type="video/webm" />
//               <source src={currentVisual.mp4} type="video/mp4" />
//               Your browser does not support the video tag.
//             </video>
//           ) : (
//             <img
//               src={currentVisual.src}
//               alt={`${project.name} Visual`}
//               // The h-auto class is crucial for maintaining the correct aspect ratio
//               className='w-full h-auto object-cover'
//             />
//           )}
//           {/* --- End of new logic --- */}

//           {project.visuals.length > 1 && (
//             <>
//               <button onClick={prevVisual} className='absolute top-1/2 left-2 transform -translate-y-1/2 bg-black/50 text-white p-2 rounded-full z-10'>
//                 &#10094;
//               </button>
//               <button onClick={nextVisual} className='absolute top-1/2 right-2 transform -translate-y-1/2 bg-black/50 text-white p-2 rounded-full z-10'>
//                 &#10095;
//               </button>
//             </>
//           )}
//         </div>
//       )}

//       {/* The text content section is unchanged and will work as before */}
//       <div className='mt-5 flex flex-col'>
//         <h4 className='text-2xl font-poppins font-semibold'>{project.name}</h4>
//         <div className='mt-2 flex flex-wrap gap-2'>
//           {project.tags.map((tag) => (
//             <span key={tag} className='text-sm text-blue-500 bg-blue-500/10 px-2 py-1 rounded-full'>
//               {tag}
//             </span>
//           ))}
//         </div>
//         <p className='mt-3 text-slate-500'>{project.oneLiner}</p>
        
//         {expanded && (
//             <div className='mt-4 text-slate-500'>
//                 <ul className='list-disc ml-5 space-y-2'>
//                     {project.description.map((point, index) => (
//                         <li key={`project-point-${index}`}>{point}</li>
//                     ))}
//                 </ul>
//             </div>
//         )}
        
//         <div className='mt-5 flex items-center gap-4 font-poppins'>
//             {project.links.github && <a href={project.links.github} target='_blank' rel='noopener noreferrer' className='font-semibold text-blue-600 hover:underline'>View on GitHub</a>}
//             {project.links.demo && <a href={project.links.demo} target='_blank' rel='noopener noreferrer' className='font-semibold text-green-600 hover:underline'>Live Demo</a>}
//             {project.links.analysis && <a href={project.links.analysis} target='_blank' rel='noopener noreferrer' className='font-semibold text-purple-600 hover:underline'>Read Analysis</a>}
            
//             <button onClick={() => setExpanded(!expanded)} className='text-sm text-gray-600 hover:text-black ml-auto'>
//                 {expanded ? 'Hide Details ▲' : 'Project Details ▼'}
//             </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ProjectCard;


// lazy loading images and videos
// In src/components/ProjectCard.jsx
// import React, { useState } from 'react';

// // Accept the new 'inView' prop
// const ProjectCard = ({ project, inView }) => {
//   const [currentVisualIndex, setCurrentVisualIndex] = useState(0);
//   const [expanded, setExpanded] = useState(false);

//   const hasVisuals = Array.isArray(project.visuals) && project.visuals.length > 0;

//   const nextVisual = () => {
//     if (hasVisuals && project.visuals.length > 1) {
//       setCurrentVisualIndex((prev) => (prev + 1) % project.visuals.length);
//     }
//   };

//   const prevVisual = () => {
//     if (hasVisuals && project.visuals.length > 1) {
//       setCurrentVisualIndex((prev) => (prev - 1 + project.visuals.length) % project.visuals.length);
//     }
//   };

//   const currentVisual = hasVisuals ? project.visuals[currentVisualIndex] : null;

//   return (
//     // The root div has no width classes, which is correct.
//     // The width is controlled by the parent <InView> component.
//     <div>
//       {hasVisuals && (
//         // This placeholder div with 'aspect-video' prevents the layout from jumping
//         <div className='w-full relative rounded-xl overflow-hidden bg-gray-200 aspect-video'>
          
//           {/* This logic only renders the heavy content when the card is on screen */}
//           {inView ? (
//             <>
//               {currentVisual.type === 'video' ? (
//                 <video
//                   key={currentVisual.mp4} 
//                   autoPlay loop muted playsInline
//                   className='w-full h-full object-cover' 
//                 >
//                   <source src={currentVisual.webm} type="video/webm" />
//                   <source src={currentVisual.mp4} type="video/mp4" />
//                 </video>
//               ) : (
//                 <img
//                   src={currentVisual.src}
//                   alt={`${project.name} Visual`}
//                   className='w-full h-full object-cover'
//                 />
//               )}

//               {project.visuals.length > 1 && (
//                 <>
//                   <button onClick={prevVisual} className='absolute top-1/2 left-2 transform -translate-y-1/2 bg-black/50 text-white p-2 rounded-full z-10'>
//                     &#10094;
//                   </button>
//                   <button onClick={nextVisual} className='absolute top-1/2 right-2 transform -translate-y-1/2 bg-black/50 text-white p-2 rounded-full z-10'>
//                     &#10095;
//                   </button>
//                 </>
//               )}
//             </>
//           ) : null } 
//         </div>
//       )}

//       {/* --- This is your full, working text section, now correctly included --- */}
//       <div className='mt-5 flex flex-col'>
//         <h4 className='text-2xl font-poppins font-semibold'>{project.name}</h4>
//         <div className='mt-2 flex flex-wrap gap-2'>
//           {project.tags.map((tag) => (
//             <span key={tag} className='text-sm text-blue-500 bg-blue-500/10 px-2 py-1 rounded-full'>
//               {tag}
//             </span>
//           ))}
//         </div>
//         <p className='mt-3 text-slate-500'>{project.oneLiner}</p>
        
//         {expanded && (
//             <div className='mt-4 text-slate-500'>
//                 <ul className='list-disc ml-5 space-y-2'>
//                     {project.description.map((point, index) => (
//                         <li key={`project-point-${index}`}>{point}</li>
//                     ))}
//                 </ul>
//             </div>
//         )}
        
//         <div className='mt-5 flex items-center gap-4 font-poppins'>
//             {project.links.github && <a href={project.links.github} target='_blank' rel='noopener noreferrer' className='font-semibold text-blue-600 hover:underline'>View on GitHub</a>}
//             {project.links.demo && <a href={project.links.demo} target='_blank' rel='noopener noreferrer' className='font-semibold text-green-600 hover:underline'>Live Demo</a>}
//             {project.links.analysis && <a href={project.links.analysis} target='_blank' rel='noopener noreferrer' className='font-semibold text-purple-600 hover:underline'>Read Analysis</a>}
            
//             <button onClick={() => setExpanded(!expanded)} className='text-sm text-gray-600 hover:text-black ml-auto'>
//                 {expanded ? 'Hide Details ▲' : 'Hide Details ▼'}
//             </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ProjectCard;



// lazy loading with preloading for 2nd and 3rd and so on visuals so that they are ready when the user clicks next
// import React, { useState, useEffect } from 'react'; // 1. Make sure useEffect is imported

// const ProjectCard = ({ project, inView }) => {
//   const [currentVisualIndex, setCurrentVisualIndex] = useState(0);
//   const [expanded, setExpanded] = useState(false);

//   const hasVisuals = Array.isArray(project.visuals) && project.visuals.length > 0;

//   const nextVisual = () => {
//     if (hasVisuals && project.visuals.length > 1) {
//       setCurrentVisualIndex((prev) => (prev + 1) % project.visuals.length);
//     }
//   };

//   const prevVisual = () => {
//     if (hasVisuals && project.visuals.length > 1) {
//       setCurrentVisualIndex((prev) => (prev - 1 + project.visuals.length) % project.visuals.length);
//     }
//   };
  
//   // --- THIS IS NEW PRELOADING LOGIC ---
//   useEffect(() => {
//     // We only run this logic if the card is on screen and has multiple visuals
//     if (inView && hasVisuals && project.visuals.length > 1) {
//       // Get the data for the NEXT visual in the carousel
//       const nextVisualIndex = (currentVisualIndex + 1) % project.visuals.length;
//       const nextVisual = project.visuals[nextVisualIndex];

//       // This technique works best for preloading images.
//       // We create a new image object in memory; the browser sees the 'src' 
//       // and starts downloading it, storing it in the cache.
//       if (nextVisual.type === 'image') {
//         const img = new Image();
//         img.src = nextVisual.src;
//       }
//       // Note: Preloading videos is more complex and browsers often handle it
//       // automatically to save user data, so we focus on images for the best effect.
//     }
//   }, [inView, currentVisualIndex, project.visuals, hasVisuals]); // Re-run when these dependencies change
//   // --- END OF NEW LOGIC ---

//   const currentVisual = hasVisuals ? project.visuals[currentVisualIndex] : null;

//   return (
//     // The width is controlled by the parent <InView> component in Projects.jsx
//     <div>
//       {hasVisuals && (
//         <div className='w-full relative rounded-xl overflow-hidden bg-gray-200 aspect-video'>
//           {inView ? (
//             <>
//               {currentVisual.type === 'video' ? (
//                 <video
//                   key={currentVisual.mp4} 
//                   autoPlay loop muted playsInline
//                   className='w-full h-full object-cover'
//                 >
//                   <source src={currentVisual.webm} type="video/webm" />
//                   <source src={currentVisual.mp4} type="video/mp4" />
//                 </video>
//               ) : (
//                 <img
//                   src={currentVisual.src}
//                   alt={`${project.name} Visual`}
//                   className='w-full h-auto object-containr' //className='w-full h-auto object-contain'
//                 />
//               )}

//               {project.visuals.length > 1 && (
//                 <>
//                   <button onClick={prevVisual} className='absolute top-1/2 left-2 transform -translate-y-1/2 bg-black/50 text-white p-2 rounded-full z-10'>
//                     &#10094;
//                   </button>
//                   <button onClick={nextVisual} className='absolute top-1/2 right-2 transform -translate-y-1/2 bg-black/50 text-white p-2 rounded-full z-10'>
//                     &#10095;
//                   </button>
//                 </>
//               )}
//             </>
//           ) : null }
//         </div>
//       )}

//       {/* The text content section stays the same */}
//       <div className='mt-5 flex flex-col'>
//           <h4 className='text-2xl font-poppins font-semibold'>{project.name}</h4>
//           <div className='mt-2 flex flex-wrap gap-2'>
//               {project.tags.map((tag) => (
//                   <span key={tag} className='text-sm text-blue-500 bg-blue-500/10 px-2 py-1 rounded-full'>
//                       {tag}
//                   </span>
//               ))}
//           </div>
//           <p className='mt-3 text-slate-500'>{project.oneLiner}</p>
          
//           {expanded && (
//               <div className='mt-4 text-slate-500'>
//                   <ul className='list-disc ml-5 space-y-2'>
//                       {project.description.map((point, index) => (
//                           <li key={`project-point-${index}`}>{point}</li>
//                       ))}
//                   </ul>
//               </div>
//           )}
          
//           <div className='mt-5 flex items-center gap-4 font-poppins'>
//               {project.links.github && <a href={project.links.github} target='_blank' rel='noopener noreferrer' className='font-semibold text-blue-600 hover:underline'>View on GitHub</a>}
//               {project.links.demo && <a href={project.links.demo} target='_blank' rel='noopener noreferrer' className='font-semibold text-green-600 hover:underline'>Live Demo</a>}
//               {project.links.analysis && <a href={project.links.analysis} target='_blank' rel='noopener noreferrer' className='font-semibold text-purple-600 hover:underline'>Read Analysis</a>}
              
//               <button onClick={() => setExpanded(!expanded)} className='text-sm text-gray-600 hover:text-black ml-auto'>
//                   {expanded ? 'Hide Details ▲' : 'Project Details ▼'}
//               </button>
//           </div>
//       </div>
//     </div>
//   );
// };

// export default ProjectCard;


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
          <h4 className='text-2xl font-poppins font-semibold'>{project.name}</h4>
          <div className='mt-2 flex flex-wrap gap-2'>
              {project.tags.map((tag) => (
                  <span key={tag} className='text-sm text-blue-500 bg-blue-500/10 px-2 py-1 rounded-full'>
                      {tag}
                  </span>
              ))}
          </div>
          <p className='mt-3 text-slate-500'>{project.oneLiner}</p>
          
          {expanded && (
              <div className='mt-4 text-slate-500'>
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
              
              <button onClick={() => setExpanded(!expanded)} className='text-sm text-gray-600 hover:text-black ml-auto'>
                  {expanded ? 'Hide Details ▲' : 'Project Details ▼'}
              </button>
          </div>
      </div>
    </div>
  );
};

export default ProjectCard;