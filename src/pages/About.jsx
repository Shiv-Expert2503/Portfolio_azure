import React from 'react'
import { skills, experiences, socialLinks } from '../constants'
import { im } from "../assets/images";

import { VerticalTimeline, VerticalTimelineElement }  from 'react-vertical-timeline-component';
import 'react-vertical-timeline-component/style.min.css';
import CTA from '../components/CTA';

const About = () => {
  return (
    <section className='max-container'>
      <h1 className='head-text'>
        Hello, I'm <span className='blue-gradient_text font-semibold drop-shadow'>Shivansh</span>
      </h1>

      <div className='mt-5 flex flex-col gap-3 text-slate-500'>
        <p>Data Scientist based in India, As a budding data scientist, I love building ML models and solve real world problems. My Intrest is mainly in Computer-Vision and CoreML, also I can host models using pipelinies. In addition to my project work, I am in the process of constructing a dedicated <b><i><a href="http://www.blogsexpert.me">blog website</a></i></b> focusing on machine learning. The blog, currently under construction, will soon be a hub for exploring the intersection of technology and creativity.  I am excited to share my expertise and contribute to the discourse surrounding the latest trends in data science.</p>

        {/* <p>And there is one thing for you as well! You can also contribute to my portfolio by letting me know if I am the right person you need. I look forward to the opportunity to collaborate with you and after contributing with you, your status will be displayed down below. It's beneficial to both of us. You will get your work done, and I will get my portfolio bigger! 😄</p> */}
      </div>

       {/* ----------------------------------------->This div is for skills icons */}
       
      <div className='py-10 flex flex-col'>
        <h3 className='subhead-text'>My Skills</h3>

        <div className='mt-16 flex flex-wrap gap-12'>
          {skills.map((skill)=> (
            <div className='block-container w-40 h-20'>
              <div className='btn-back rounded-xl'/>
              <div className='btn-front rounded-xl flex justify-center items-center'>
                <img
                  src={skill.imageUrl}
                  alt={skill.name}
                  title={skill.name}
                  className='w-1/2 h-1/2 onject-contain'
                />
                <br />
                <p className='text-black font-poppins font-semibold'>
                  {skill.name}
                </p>
              </div>
              <div>
              </div>
            </div>
          ))}
        </div>

      </div> 

      


      <div className='py-16'>
        <h3 className='subhead-text'>Work Experience</h3>
          {/* <div className='mt-5 flex flex-col gap-3 text-slate-500'>
            <p>I've hands-on projects that showcase my dedication to mastering this dynamic domain. From creating predictive models to extracting meaningful insights from complex datasets, my project portfolio reflects my commitment to pushing the boundaries of what's possible. </p>
          </div> */}
        
        <div className='mt-12 flex'>
            <VerticalTimeline>
              {experiences.map((experience) => (
                <VerticalTimelineElement
                  key={experience.company_name}
                  date={experience.date}
                  icon={<div className="flex justify-center items-center w-full h-full">
                    <img 
                      src={experience.icon} 
                      alt={experience.company_name}
                      className="w-[60%] h-[60%] object-contain" />
                  </div>
                    }
                    iconStyle={{
                      borderBottom: '8px',
                      borderStyle: 'solid',
                      borderBottomColor: experience.iconBg,
                      boxShadow: 'none'
                    }}
                    // iconStyle={{background: experience.iconBg}}
                    contentStyle={{
                      borderBottom: '8px',
                      borderStyle: 'solid',
                      borderBottomColor: experience.iconBg,
                      boxShadow: 'none'
                    }}
                >
                  <div>
                    <h3 className='text-black text-xl font-poppins font-semibold'>
                      {experience.title}
                    </h3>
                    <p className='text-black-500 font-medium font-base'stye={{margin:0}}> 
                      {experience.company_name}
                    </p>
                  </div>

                  <ul className='my-5 list-disc ml-5 space-y-2'>
                    {experience.points.map((point,index) => (
                      <li key={`experience-point-${index}`} className='text-black-500/80 font-normal pl-1 text-sm'>
                        {point}
                      </li>
                    ))}
                  </ul>
                </VerticalTimelineElement>
              ))}
            </VerticalTimeline>
        </div>



        
      
      {/* This is for social links need to be completed*/}

      {/* </div>
      <div className='py-10 flex flex-col'>
        <h3 className='subhead-text'>My Socials</h3>

        <div className='mt-16 flex flex-wrap gap-12'>
          {socialLinks.map((sociallink)=> (
            <div className='block-container w-20 h-20'>
              <div className='btn-back rounded-xl'/>
              <div className='btn-front rounded-xl flex justify-center items-center'>
                <img
                  src={sociallink.imageUrl}
                  alt={sociallink.name}
                  className='w-1/2 h-1/2 onject-contain'
                />
                <div>
                  <h3 className='text-black text-xl font-poppins font-semibold'>
                    {sociallink.link}
                  </h3>
                </div>
              </div>
            </div>
          ))}
        </div> */}



      </div>

      <hr className='border-slate-200' />

      <CTA />

    </section>
  )
}

export default About