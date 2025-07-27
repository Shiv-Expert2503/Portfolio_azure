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