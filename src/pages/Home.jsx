
// background scrolling      ===========================100% working
import React from 'react';
import { skills, experiences } from '../constants';
import CTA from '../components/CTA';

const Home = () => {
  return (
    <>
      {/* --- Hero Section (Full Screen Animation) --- */}
      <section className="w-full h-dvh relative">
        <div className='hero-content'>
          <h1 className='hero-title'>
            Hi, I'm <span className='blue-gradient_text'>Shivansh</span> 👋
          </h1>
          
          {/* AI Chat Prompt Box */}
          <div className="prompt-container max-w-3xl mx-auto mt-8">
            <div className="prompt-box bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-1 shadow-2xl">
              <div className="flex items-center gap-3 p-4">
                <div className="flex-1">
                  <div className="relative">
                    <input 
                      type="text" 
                      placeholder="Ask me anything about AI, ML, or my projects..."
                      className="w-full bg-transparent text-white placeholder-white/60 text-lg border-none outline-none resize-none"
                      style={{ fontFamily: 'inherit' }}
                    />
                  </div>
                </div>
                <button className="send-button bg-blue-600 hover:bg-blue-700 transition-colors duration-200 rounded-xl p-3 flex items-center justify-center">
                  <svg 
                    width="20" 
                    height="20" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="2" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                    className="text-white"
                  >
                    <path d="M22 2L11 13" />
                    <path d="M22 2L15 22L11 13L2 9L22 2Z" />
                  </svg>
                </button>
              </div>
              
              {/* Suggested prompts */}
              <div className="px-4 pb-4">
                <div className="flex flex-wrap gap-2">
                  <button className="suggestion-pill bg-white/5 hover:bg-white/10 border border-white/20 rounded-full px-4 py-2 text-sm text-white/80 hover:text-white transition-all duration-200">
                    💡 Tell me about your AI projects
                  </button>
                  <button className="suggestion-pill bg-white/5 hover:bg-white/10 border border-white/20 rounded-full px-4 py-2 text-sm text-white/80 hover:text-white transition-all duration-200">
                    🚀 What technologies do you use?
                  </button>
                  <button className="suggestion-pill bg-white/5 hover:bg-white/10 border border-white/20 rounded-full px-4 py-2 text-sm text-white/80 hover:text-white transition-all duration-200">
                    📊 Show me your experience
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* ✅ REMOVED: Canvas and ParticleScene - now handled in App.jsx */}

        <div className='scroll-down-arrow'>
          <span>↓</span>
        </div>
      </section>

      {/* --- "About Me" and Skills Section (Below the fold) --- */}
      <section className="max-container about-section">
        <div className='py-16'>
            <h3 className="subhead-text " style={{ color: '#004ac0ff' }}>About Me</h3>
            <div className="mt-5 flex flex-col gap-3 text-white/80">
                <p>
                I am an AI Engineer specializing in Scientific Machine Learning (SciML) and end-to-end application development. My work focuses on bridging the gap between complex mathematical theory and practical, high-performance software.
                </p>
                <p>
                I am a "T-shaped" engineer: deep expertise in one area (Scientific ML) with a strong breadth of practical skills (end-to-end app development). As a <b>Kaggle Notebooks Expert (top 4%)</b>, I thrive on solving challenging problems.
                </p>
            </div>
        </div>

        <h3 className="subhead-text" style={{ color: '#004ac0ff' }}>My Skills</h3>
        <div className="mt-16 flex flex-wrap gap-12 justify-center">
          {skills.map((skill) => (
            <div className="block-container w-28 h-28" key={skill.name} title={skill.name}>
              <div className="btn-back rounded-xl" />
              <div className="btn-front rounded-xl flex flex-col justify-center items-center p-2">
                <img
                  src={skill.imageUrl}
                  alt={skill.name}
                  className="w-1/2 h-1/2 object-contain"
                />
                <p className='mt-2 text-sm text-blue-500 font-poppins font-semibold text-center'>
                  {skill.name}
                </p>
              </div>
            </div>
          ))}
        </div>
        
        <div className="py-16">
          <h3 className="subhead-text" style={{ color: '#004ac0ff' }}>Work Experience</h3>
          <div className="mt-12 flex flex-col gap-12">
            {experiences.map((experience) => (
              <div key={experience.company_name} className="flex gap-5">
                <div className="flex justify-center items-center w-20 h-12 rounded-lg ">
                    <img 
                        src={experience.icon} 
                        alt={experience.company_name} 
                        className="w-[100%] h-[60%] object-contain" 
                    />
                </div>
                <div>
                  <h4 className="text-xl font-poppins font-semibold text-white">
                    {experience.title}
                  </h4>
                  <p className="text-base font-medium text-white/80" style={{ margin: 0 }}>
                    {experience.company_name} | {experience.date}
                  </p>
                  <ul className="my-5 list-disc ml-5 space-y-2">
                    {experience.points.map((point, index) => (
                      <li key={`experience-point-${index}`} className="text-white/80 font-normal pl-1 text-sm">
                        {point}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>

        <hr className="border-slate-200" />
        <CTA />
      </section>
    </>
  );
};

export default Home;