//---------------------------------------------------------------------for the 3d mesh
import React from 'react';
import { Link } from 'react-router-dom';
import { arrow } from '../assets/icons';

const InfoBox = ({ text, link, btnText }) => (
    <div className='info-box'>
        <p className="font-medium sm:text-xl text-center">{text}</p>
        <Link to={link} className="neo-brutalism-white neo-btn">
            {btnText}
            <img src={arrow} className='w-4 h-4 object-contain'/>
        </Link>
    </div>
);

const renderContent = {
    1: (
        <h1 className='sm:text-xl sm:leading-snug text-center neo-brutalism-blue py-4 px-8 text-white mx-5'>
            Hi, I am <span className="font-semibold">Shivansh</span> 👋
            <br/>
            I build and deploy advanced AI models that solve challenges in science and engineering.
        </h1>
    ),
    2: (
        <InfoBox
            text="With experience in both startup environments and as a freelance consultant, I'm adept at delivering high-impact solutions."
            link="/about"
            btnText="Learn More"
        />
    ),
    3: (
        <InfoBox
            text="Dive into my portfolio of featured projects, from scientific machine learning to end-to-end applications."
            link="/projects"
            btnText="See My Projects"
        />
    ),
    4: (
        <InfoBox
            text="Need a project done or looking to collaborate? I'm just a few keystrokes away."
            link="/contact"
            btnText="Let's Talk"
        />
    )
};

const HomeInfo = ({ currentStage }) => {
  return renderContent[currentStage] || null;
};

export default HomeInfo;