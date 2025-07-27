// import React from 'react'
// import { projects } from '../constants'
// import { Link } from 'react-router-dom'
// import { arrow } from '../assets/icons'
// import CTA from '../components/CTA'

// const Projects = () => {
//   return (
//     <section className='max-container'>
//       <h1 className='head-text'>
//         My <span className='blue-gradient_text font-semibold drop-shadow'>Projects</span>
//       </h1>

//       <div className='mt-5 flex flex-col gap-3 text-slate-500'>
//         <p>I've embarked on numerous projects throughout the years, but these are the ones I had closest to my heart. Many of them are open-source and some of them have working link.</p>
//       </div>


//       <div className='flex flex-wrap my-20 gap-16'>
//         {projects.map((project) =>(
//           <div className='lg:w-[400px] w-full' key={project.name}>
//             <div className='block-container w-12 h-12'>
//               <div className={`btn-back rounded-xl ${project.theme}`} />
//               <div className='btn-front rounded-xl flex justify-center items-center'>
//                 <img src={project.iconUrl}
//                 alt="Project Icon"
//                 className='w-1/2 h-1/2 object-contain' />
//               </div>
//             </div>
//             <div className='mt-5 flex flex-col'>
//               <h4 className='text-2xl font-poppins font-semibold'>
//                 {project.name}
//               </h4>
//               <p className='mt-2 text-slate-500'>
//                 {project.description}
//               </p>
//               <div className='mt-5 flex items-center gap-2 font-poppins'>
//                 <Link to={project.link} target='_blank' rel='noopener noreferrer' className='font-semibold text-blue-600'>Link</Link>
//                 <img src={arrow} alt="arrow" className='w-4 h-4 object-contain' />
//               </div>

//             </div>
//           </div>
//         )) }
//       </div>

//       <hr className='border-slate-200' />

//       <CTA />
        
//     </section>

//   )
// }

// export default Projects




// ----------------------------------------------  new layout but 2 page format

// // In pages/Projects.jsx
// import React, { useState } from 'react';
// import { projects } from '../constants';
// import CTA from '../components/CTA';

// const Projects = () => {
//   const [expandedProject, setExpandedProject] = useState(null);

//   const handleToggleDetails = (projectName) => {
//     setExpandedProject(expandedProject === projectName ? null : projectName);
//   };

//   return (
//     <section className='max-container'>
//       <h1 className='head-text'>
//         My <span className='blue-gradient_text font-semibold drop-shadow'>Projects</span>
//       </h1>

//       <div className='mt-5 flex flex-col gap-3 text-slate-500'>
//         <p>
//           A curated selection of my work, from foundational research in Scientific
//           Machine Learning (SciML) to the development of deployed, end-to-end
//           AI applications.
//         </p>
//       </div>

//       <div className='flex flex-wrap my-20 gap-16'>
//         {projects.map((project) => (
//           <div className='lg:w-[400px] w-full' key={project.name}>
//             {/* The Visual (GIF/Image) */}
//             <div className='block-container w-full h-60'>
//               <div className={`btn-back rounded-xl ${project.theme}`} />
//               <img
//                 src={project.visualUrl} // Use the new visualUrl
//                 alt={`${project.name} Visual`}
//                 className='w-full h-full object-cover rounded-xl'
//               />
//             </div>

//             <div className='mt-5 flex flex-col'>
//               {/* Project Title */}
//               <h4 className='text-2xl font-poppins font-semibold'>
//                 {project.name}
//               </h4>

//               {/* Tech Tags */}
//               <div className='mt-2 flex flex-wrap gap-2'>
//                 {project.tags.map((tag) => (
//                   <span key={tag} className='text-sm text-blue-500 bg-blue-500/10 px-2 py-1 rounded-full'>
//                     {tag}
//                   </span>
//                 ))}
//               </div>

//               {/* One-Liner */}
//               <p className='mt-3 text-slate-500'>{project.oneLiner}</p>

//               {/* Expanded Details Section */}
//               {expandedProject === project.name && (
//                 <div className='mt-4 text-slate-500'>
//                   <ul className='list-disc ml-5 space-y-2'>
//                     {project.description.map((point, index) => (
//                         <li key={`project-point-${index}`}>{point}</li>
//                     ))}
//                   </ul>
//                 </div>
//               )}
              
//               {/* Links and Details Button */}
//               <div className='mt-5 flex items-center gap-4 font-poppins'>
//                 {project.links.github && (
//                     <a href={project.links.github} target='_blank' rel='noopener noreferrer' className='font-semibold text-blue-600 hover:underline'>
//                         View on GitHub
//                     </a>
//                 )}
//                 {project.links.demo && (
//                      <a href={project.links.demo} target='_blank' rel='noopener noreferrer' className='font-semibold text-green-600 hover:underline'>
//                         Live Demo
//                     </a>
//                 )}
//                  {project.links.analysis && (
//                      <a href={project.links.analysis} target='_blank' rel='noopener noreferrer' className='font-semibold text-purple-600 hover:underline'>
//                         Read Analysis
//                     </a>
//                 )}
//                 <button
//                   onClick={() => handleToggleDetails(project.name)}
//                   className='text-sm text-gray-600 hover:text-black ml-auto'
//                 >
//                   {expandedProject === project.name ? 'Hide Details ▲' : 'Project Details ▼'}
//                 </button>
//               </div>
//             </div>
//           </div>
//         ))}
//       </div>

//       <hr className='border-slate-200' />

//       <CTA />
//     </section>
//   );
// };

// export default Projects;




// New layout with single column and wider cards

// import React, { useState } from 'react';
// import { projects } from '../constants';
// import CTA from '../components/CTA';

// const Projects = () => {
//   const [expandedProject, setExpandedProject] = useState(null);

//   const handleToggleDetails = (projectName) => {
//     setExpandedProject(expandedProject === projectName ? null : projectName);
//   };

//   return (
//     <section className='max-container'>
//       <h1 className='head-text'>
//         My <span className='blue-gradient_text font-semibold drop-shadow'>Projects</span>
//       </h1>

//       <div className='mt-5 flex flex-col gap-3 text-slate-500'>
//         <p>
//           A curated selection of my work, from foundational research in Scientific
//           Machine Learning (SciML) to the development of deployed, end-to-end
//           AI applications.
//         </p>
//       </div>

//       {/* --- LAYOUT FIX: Changed classes here to create a single centered column --- */}
//       <div className='mt-20 flex flex-col items-center gap-24'>
//         {projects.map((project) => (
//           // --- LAYOUT FIX: Changed width to make cards wider on large screens ---
//           <div className='lg:w-3/4 w-full' key={project.name}>

//             <div className='mt-5 flex flex-col'>
//               <h4 className='text-2xl font-poppins font-semibold'>
//                 {project.name}
//               </h4>

//               <div className='mt-2 flex flex-wrap gap-2'>
//                 {project.tags.map((tag) => (
//                   <span key={tag} className='text-sm text-blue-500 bg-blue-500/10 px-2 py-1 rounded-full'>
//                     {tag}
//                   </span>
//                 ))}
//               </div>

//               <p className='mt-3 text-slate-500'>{project.oneLiner}</p>

//               {expandedProject === project.name && (
//                 <div className='mt-4 text-slate-500'>
//                   <ul className='list-disc ml-5 space-y-2'>
//                     {project.description.map((point, index) => (
//                         <li key={`project-point-${index}`}>{point}</li>
//                     ))}
//                   </ul>
//                 </div>
//               )}
//               <div className='block-container w-full h-60 sm:h-80'>
//               {/* <div className={`btn-back rounded-xl ${project.theme}`} /> */}
//               <img
//                 src={project.visuals}
//                 alt={`${project.name} Visual`}
//                 className='w-full h-full object-cover rounded-xl'
//               />
//             </div>
              
//               <div className='mt-5 flex items-center gap-4 font-poppins'>
//                 {project.links.github && (
//                     <a href={project.links.github} target='_blank' rel='noopener noreferrer' className='font-semibold text-blue-600 hover:underline'>
//                         View on GitHub
//                     </a>
//                 )}
//                 {project.links.demo && (
//                      <a href={project.links.demo} target='_blank' rel='noopener noreferrer' className='font-semibold text-green-600 hover:underline'>
//                         Live Demo
//                     </a>
//                 )}
//                  {project.links.analysis && (
//                      <a href={project.links.analysis} target='blank' rel='noopener noreferrer' className='font-semibold text-purple-600 hover:underline'>
//                         Read Analysis
//                     </a>
//                 )}
//                 <button
//                   onClick={() => handleToggleDetails(project.name)}
//                   className='text-sm text-gray-600 hover:text-black ml-auto'
//                 >
//                   {expandedProject === project.name ? 'Hide Details ▲' : 'Project Details ▼'}
//                 </button>
//               </div>
//             </div>
//           </div>
//         ))}
//       </div>

//       <hr className='border-slate-200' />

//       <CTA />
//     </section>
//   );
// };

// export default Projects;




// multiple videos

// import React from 'react';
// import { projects } from '../constants';
// import CTA from '../components/CTA';
// import ProjectCard from '../components/ProjectCard'; // Import the new component
// import { InView } from 'react-intersection-observer';

// const Projects = () => {
//   return (
//     <section className='max-container'>
//       <h1 className='head-text'>
//         My <span className='blue-gradient_text font-semibold drop-shadow'>Projects</span>
//       </h1>
//       <div className='mt-5 flex flex-col gap-3 text-slate-500'>
//         <p>
//           A curated selection of my work, from foundational research in Scientific
//           Machine Learning (SciML) to the development of deployed, end-to-end
//           AI applications.
//         </p>
//       </div>
//       <div className='mt-20 flex flex-col items-center gap-24'>
//         {projects.map((project) => (
//           <ProjectCard key={project.name} project={project} />
//         ))}
//       </div>
//       <hr className='border-slate-200' />
//       <CTA />
//     </section>
//   );
// };

// export default Projects;




//lazy loading videos
// import React from 'react';
// import { projects } from '../constants';
// import CTA from '../components/CTA';
// import ProjectCard from '../components/ProjectCard'; // Import the new component
// import { InView } from 'react-intersection-observer';

// const Projects = () => {
//   return (
//     <section className='max-container'>
//       <h1 className='head-text'>
//         My <span className='blue-gradient_text font-semibold drop-shadow'>Projects</span>
//       </h1>
//       <div className='mt-5 flex flex-col gap-3 text-slate-500'>
//         <p>
//           A curated selection of my work, from foundational research in Scientific
//           Machine Learning (SciML) to the development of deployed, end-to-end
//           AI applications.
//         </p>
//       </div>
//       <div className='mt-20 flex flex-col items-center gap-24'>
//         {projects.map((project) => (
//           // --- FIX: Added mx-auto to forcefully center the card ---
//           <InView as="div" triggerOnce={true} key={project.name} className='w-full max-w-2xl mx-auto'>
//             {({ inView, ref }) => (
//               <div ref={ref}>
//                 <ProjectCard project={project} inView={inView} />
//               </div>
//             )}
//           </InView>
//         ))}
//       </div>
//       <hr className='border-slate-200' />
//       <CTA />
//     </section>
//   );
// };

// export default Projects;



// lazy loading 2.0
import React from 'react';
import { projects } from '../constants';
import CTA from '../components/CTA';
import ProjectCard from '../components/ProjectCard';
import { InView } from 'react-intersection-observer';

const Projects = () => {
  return (
    <section className='max-container'>
      <h1 className='head-text'>
        My <span className='blue-gradient_text font-semibold drop-shadow'>Projects</span>
      </h1>
      <div className='mt-5 flex flex-col gap-3 text-white/80'>
        <p>
          A curated selection of my work, from foundational research in Scientific
          Machine Learning (SciML) to the development of deployed, end-to-end
          AI applications.
        </p>
      </div>

      {/* --- FIX: Replaced the old div with a simpler structure --- */}
      <div className='mt-20'>
        {projects.map((project) => (
          // This new div wraps each project and controls its width and centering
          <div key={project.name} className='w-full max-w-2xl mx-auto mb-24'>
            <InView as="div" triggerOnce={true}>
              {({ inView, ref }) => (
                <div ref={ref}>
                  <ProjectCard project={project} inView={inView} />
                </div>
              )}
            </InView>
          </div>
        ))}
      </div>
      {/* --- END OF FIX --- */}

      <hr className='border-slate-200' />
      <CTA />
    </section>
  );
};

export default Projects;