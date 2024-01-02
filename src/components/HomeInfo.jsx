import React from 'react'
import { Link } from 'react-router-dom'
import {arrow} from '../assets/icons'

const InfoBox =( {text, link, btnText}) => (

    <div className='info-box'>
        {text}
        {/* <p className="font-medium sm:text-xl text-center">{text}</p> */}
        <Link to={link} className="neo-brutalism-white neo-btn">
            {btnText}
            <img src={arrow} className='w-4 h-4 object-contain'/>
        </Link>
    </div>
)

const renserContent = {

    1: (
        <h1 className='sm:text-xl sm:leading-snug text-center
         neo-brutalism-blue py-4 px-8 text-white mx-5'>
            Hi, I am <span className="font-semibold">Shivansh</span>👋
            <br/>
            A DataScientist from India.
            <h5 className="text-sm">Use Arrow keys to explore the island</h5>
         </h1>
    ),
    2: (
        <InfoBox
            text="Curious about the impact? Projects"
            link="/projects"
            btnText="See my Projects"
        />
        ),
        3: (
            <InfoBox
                text="Worked with many companies and gained a tons of skills"
                link="/about"
                btnText="Learn More"
            />
            ),
            4: (
                <InfoBox
                    text="Need a Project done or need a dev? I'm just a few keystrokes away."
                    link="/contact"
                    btnText="Let's Talk"
                />
    )
}



const HomeInfo = ( {currentStage} ) => {
  return renserContent[currentStage] || null;
}

export default HomeInfo