// import { useState, Suspense, useEffect, useRef } from 'react'
// import { Canvas } from '@react-three/fiber'
// import Loader from '../components/Loader'

// import Island from '../models/Island'
// import Sky from '../models/Sky'
// import Bird from '../models/Bird'
// import Plane from '../models/Plane'
// import HomeInfo from '../components/HomeInfo'

// // import sakura from '../assets/sakura.mp3'
// import { soundoff, soundon } from '../assets/icons'

// const Home = () => {

//   // const audioRef = useRef(new Audio(sakura))
//   // audioRef.current.volume = 0.2
//   // audioRef.current.loop = true
  
//   const [ isRotating, setIsRotating ] = useState(false)
//   const [currentStage, setCurrentStage] = useState(1)

//   // const [isPlayingMusic, setIsPlayingMusic] = useState(false)

//   // //This sate is for music
//   // useEffect(() => {

//   //   if(isPlayingMusic) {
//   //     audioRef.current.play()
//   //   }

//   //   return () => {
//   //     audioRef.current.pause()
//   //   }
//   // },[isPlayingMusic])
  
//   const adjustIslandForScreenSize =() => { 
    
//     let screenScale = null;
//     let scrrenPosition = [0, -6.5, -43];
//     let rotation = [0.1, 4.7, 0];
    
//     if(window.innerWidth < 768) {
//       screenScale = [0.9, 0.9, 0.9];
//     }else{
//       screenScale = [1, 1, 1];
//     }
    
//     return [screenScale, scrrenPosition, rotation]
//   }
  
//   const adjustPlaneForScreenSize =() => { 
    
//     let screenScale, screenPosition;
    
//     if(window.innerWidth < 768) {
//       screenScale = [1.5, 1.5, 1.5];
//       screenPosition = [0, -1.5, 0];
//     }else{
//       screenScale = [3, 3, 3];
//       screenPosition = [0, -4, -4];
//     }
    
//     return [screenScale, screenPosition]
//   }
  
//   const [islandScale, islandPosition, islandrotation] = adjustIslandForScreenSize();
//   const [planeScal, planePos] = adjustPlaneForScreenSize();
  
//   return (
//     <section className = "w-full h-screen relative">
//     {<div className="absolute top-28 left-0 right-0 z-10 flex
//       items-center justify-center">
//         {/* Popup */}
//       {currentStage && <HomeInfo currentStage={currentStage}/>}
//     </div> }
//       <Canvas 
//           className={`w-full h-screen bg-transparent ${isRotating ? 'cursor-grabbing' : 'cursor-grab'}`}
//           camera={{ near: 0.1, far: 1000}}
//           >
//         <Suspense fallback={<Loader />}>
  
//           <directionalLight position={[1,1,1]} intensity={2}  /> 
//           <ambientLight intensity={0.2} />
//           <hemisphereLight skyColor="#b1e1ff" groundColor="#000000" intensity={1} />

//           <Sky 
//             isRotating={isRotating}
//           />
//           <Bird />

//           <Island 
//             isRotating={isRotating}
//             setIsRotating={setIsRotating}
//             position={islandPosition}
//             scale={islandScale} 
//             rotation={islandrotation}
//             setCurrentStage={setCurrentStage}
//           />
//           <Plane
//             isRotating={isRotating}
//             scale={planeScal}
//             position={planePos}
//             rotation={[0, 20, 0]}
//           />
//         </Suspense>
//       </Canvas>

//       {/* <div className='absolute bottom-2 left-2'>
//         <img src={!isPlayingMusic? soundoff: soundon}
//              alt="sound" 
//              className='w-10 h-10 cursor-pointer object-contain'
//              onClick={() => setIsPlayingMusic(!isPlayingMusic)}
//              />
//       </div> */}
//     </section>
//   )
// }

// export default Home



// lazy loading the models and components
// import React from 'react';
// import { useState, Suspense, useEffect, useRef } from 'react';
// import { Canvas } from '@react-three/fiber';
// import Loader from '../components/Loader';
// import HomeInfo from '../components/HomeInfo';

// // --- FIX: Lazy load all heavy 3D model components ---
// const Island = React.lazy(() => import('../models/Island'));
// const Sky = React.lazy(() => import('../models/Sky'));
// const Bird = React.lazy(() => import('../models/Bird'));
// const Plane = React.lazy(() => import('../models/Plane'));

// const Home = () => {
//   const [isRotating, setIsRotating] = useState(false);
//   const [currentStage, setCurrentStage] = useState(1);

//   const adjustIslandForScreenSize = () => {
//     let screenScale = null;
//     let scrrenPosition = [0, -6.5, -43];
//     let rotation = [0.1, 4.7, 0];
    
//     if (window.innerWidth < 768) {
//       screenScale = [0.9, 0.9, 0.9];
//     } else {
//       screenScale = [1, 1, 1];
//     }
    
//     return [screenScale, scrrenPosition, rotation];
//   };

//   const adjustPlaneForScreenSize = () => {
//     let screenScale, screenPosition;
    
//     if (window.innerWidth < 768) {
//       screenScale = [1.5, 1.5, 1.5];
//       screenPosition = [0, -1.5, 0];
//     } else {
//       screenScale = [3, 3, 3];
//       screenPosition = [0, -4, -4];
//     }
    
//     return [screenScale, screenPosition];
//   };
  
//   const [islandScale, islandPosition, islandrotation] = adjustIslandForScreenSize();
//   const [planeScal, planePos] = adjustPlaneForScreenSize();
  
//   return (
//     <section className="w-full h-screen relative">
//       <div className="absolute top-28 left-0 right-0 z-10 flex items-center justify-center">
//         {currentStage && <HomeInfo currentStage={currentStage} />}
//       </div>
      
//       <Canvas 
//           className={`w-full h-screen bg-transparent ${isRotating ? 'cursor-grabbing' : 'cursor-grab'}`}
//           camera={{ near: 0.1, far: 1000 }}
//       >
//         <Suspense fallback={<Loader />}>
//           <directionalLight position={[1, 1, 1]} intensity={2} /> 
//           <ambientLight intensity={0.5} />
//           <hemisphereLight skyColor="#b1e1ff" groundColor="#000000" intensity={1} />

//           <Sky isRotating={isRotating} />
//           <Bird />
//           <Island 
//             isRotating={isRotating}
//             setIsRotating={setIsRotating}
//             position={islandPosition}
//             scale={islandScale} 
//             rotation={islandrotation}
//             setCurrentStage={setCurrentStage}
//           />
//           <Plane
//             isRotating={isRotating}
//             scale={planeScal}
//             position={planePos}
//             rotation={[0, 20, 0]}
//           />
//         </Suspense>
//       </Canvas>
//     </section>
//   );
// };

// export default Home;




// // 3d meshing animation

// // lazy loading the models and components
// import React, { useState, Suspense, useEffect, useRef } from 'react';
// import { Canvas } from '@react-three/fiber';
// import Loader from '../components/Loader';
// import HomeInfo from '../components/HomeInfo';

// // --- REMOVE THE OLD 3D MODEL IMPORTS ---
// // const Island = React.lazy(() => import('../models/Island'));
// // const Sky = React.lazy(() => import('../models/Sky'));
// // const Bird = React.lazy(() => import('../models/Bird'));
// // const Plane = React.lazy(() => import('../models/Plane'));

// // --- IMPORT OUR NEW PARTICLE SCENE INSTEAD ---
// const ParticleScene = React.lazy(() => import('../components/ParticleScene'));


// const Home = () => {
//   // You can remove the state and functions related to the old models
//   // like isRotating, currentStage, adjustIslandForScreenSize, etc. for now
//   // to keep the file clean.

//   return (
//     <section className="w-full h-screen relative">
//       {/* This HomeInfo can stay if you want it */}
//       {/* <div className="absolute top-28 left-0 right-0 z-10 flex items-center justify-center">
//         {currentStage && <HomeInfo currentStage={currentStage} />}
//       </div> */}
      
//       <Canvas 
//           // Adjust the camera to better view the particle system
//           camera={{ position: [0, 0, 3], fov: 75, near: 0.1, far: 1000 }}
//       >
//         <Suspense fallback={<Loader />}>
//           {/* We can use simpler lighting for now */}
//           <ambientLight intensity={1.5} />
          
//           <ParticleScene />

//         </Suspense>
//       </Canvas>
//     </section>
//   );
// };

// export default Home;


//-----------------Debuging code

// import React from 'react';
// import { Canvas } from '@react-three/fiber';

// const Home = () => {
//   return (
//     <section className="w-full h-screen relative">
//       <Canvas>
//         <ambientLight intensity={1} />
//         <mesh>
//           <boxGeometry />
//           <meshStandardMaterial color="hotpink" />
//         </mesh>
//       </Canvas>
//     </section>
//   );
// };

// export default Home;


// ------------------------------------------------------------------working code for 3d meshing animation
// import React, { Suspense } from 'react';
// import { Canvas } from '@react-three/fiber';
// import Loader from '../components/Loader';

// // Lazy load the particle scene
// const ParticleScene = React.lazy(() => import('../components/ParticleScene'));

// const Home = () => {
//   return (
//     <section className="w-full h-screen relative">
//       <Canvas 
//           // camera={{ position: [0, 0, 3], fov: 75, near: 0.1, far: 1000 }}
//           camera={{ position: [0, 0, 5], fov: 75, near: 0.1, far: 1000 }}
//       >
//         <Suspense fallback={<Loader />}>
//           <ambientLight intensity={1.5} />
//           <ParticleScene />
//         </Suspense>
//       </Canvas>
//     </section>
//   );
// };

// export default Home;



// ----------------------------------------------------------------------------background to black for 3d meshing animation
// import React, { Suspense } from 'react';
// import { Canvas } from '@react-three/fiber';
// import Loader from '../components/Loader';

// const ParticleScene = React.lazy(() => import('../components/ParticleScene'));

// const Home = () => {
//   return (
//     <section className="w-full h-screen relative">
//       <Canvas 
//           // --- FIX: Moved camera closer to make objects appear larger ---
//           camera={{ position: [0, 0, 5], fov: 75, near: 0.1, far: 1000 }}
//       >
//         {/* --- FIX: Set the background color to black --- */}
//         <color attach="background" args={['#000000']} />
        
//         <Suspense fallback={<Loader />}>
//           <ParticleScene />
//         </Suspense>
//       </Canvas>
//     </section>
//   );
// };

// export default Home;


// -------------------------------------------------------------------adding info to homepage
// import React, { useState, Suspense } from 'react';
// import { Canvas } from '@react-three/fiber';
// import Loader from '../components/Loader';
// import HomeInfo from '../components/HomeInfo';

// const ParticleScene = React.lazy(() => import('../components/ParticleScene'));

// const Home = () => {
//   // We need currentStage to show the correct info box
//   const [currentStage, setCurrentStage] = useState(1);

//   return (
//     <section className="w-full h-screen relative">
//       {/* Re-enabled the HomeInfo component */}
//       <div className="absolute top-28 left-0 right-0 z-10 flex items-center justify-center">
//         {currentStage && <HomeInfo currentStage={currentStage} />}
//       </div>
      
//       <Canvas 
//           camera={{ position: [0, 0, 2], fov: 75, near: 0.1, far: 1000 }}
//       >
//         <color attach="background" args={['#000000']} />
//         <Suspense fallback={<Loader />}>
//           {/* We pass setCurrentStage to our particle scene now */}
//           <ParticleScene setCurrentStage={setCurrentStage} />
//         </Suspense>
//       </Canvas>
//     </section>
//   );
// };

// export default Home;


// ---------------------------------------------------current deployed
// import React, { useState, Suspense } from 'react';
// import { Canvas } from '@react-three/fiber';
// import Loader from '../components/Loader';
// import HomeInfo from '../components/HomeInfo';

// const ParticleScene = React.lazy(() => import('../components/ParticleScene'));

// const Home = () => {
//   const [currentStage, setCurrentStage] = useState(null); // Set initial stage to null

//   return (
//     <section className="w-full h-screen relative">
//       <div className="absolute top-28 left-0 right-0 z-10 flex items-center justify-center">
//         {/* Only show the info box if the stage is not null */}
//         {currentStage && <HomeInfo currentStage={currentStage} />}
//       </div>
      
//       <Canvas 
//           camera={{ position: [0, 0, 2], fov: 75, near: 0.1, far: 1000 }}
//       >
//         <color attach="background" args={['#000000']} />
//         <Suspense fallback={<Loader />}>
//           {/* We now pass setCurrentStage as a prop here */}
//           <ParticleScene setCurrentStage={setCurrentStage} />
//         </Suspense>
//       </Canvas>
//     </section>
//   );
// };

// export default Home;




//---------------for 3d mesh 100% working

// import React, { Suspense, useState } from 'react';
// import { Canvas } from '@react-three/fiber';
// import Loader from '../components/Loader';
// import { skills, experiences } from '../constants'; // Import skills and experiences
// import { Link } from 'react-router-dom';
// import CTA from '../components/CTA';

// const ParticleScene = React.lazy(() => import('../components/ParticleScene'));

// const Home = () => {
//   return (
//     <>
//       {/* --- Hero Section (Full Screen Animation) --- */}
//       <section className="w-full h-screen relative">
//         <div className='hero-content'>
//           <h1 className='hero-title'>
//             Hi, I'm <span className='blue-gradient_text'>Shivansh</span> 👋
//           </h1>
//           <p className='hero-subtitle' style={{ color: '#00ffffff', fontWeight: 'bold' }}>
//             I build and deploy advanced AI models that solve challenges in science and engineering.
//           </p>
//         </div>
        
//         <Canvas camera={{ position: [0, 0, 2], fov: 75, near: 0.1, far: 1000 }}>
//           <color attach="background" args={['#000000']} />
//           <Suspense fallback={<Loader />}>
//             <ParticleScene />
//           </Suspense>
//         </Canvas>

//         <div className='scroll-down-arrow'>
//           <span>↓</span>
//         </div>
//       </section>

//       {/* --- New "About Me" Section (Below the fold) --- */}
//       <section className="max-container about-section">
//         <h3 className="subhead-text">My Skills</h3>
//         <div className="mt-16 flex flex-wrap gap-12 justify-center">
//           {skills.map((skill) => (
//             // FIX: Added the title attribute for the hover tooltip
//             <div className="block-container w-28 h-28" key={skill.name} title={skill.name}>
//               <div className="btn-back rounded-xl" />
//               {/* FIX: Changed flex direction to stack the icon and name */}
//               <div className="btn-front rounded-xl flex flex-col justify-center items-center p-2">
//                 <img
//                   src={skill.imageUrl}
//                   alt={skill.name}
//                   className="w-1/2 h-1/2 object-contain"
//                 />
//                 {/* FIX: Added the skill name back below the icon */}
//                 <p className='mt-2 text-sm text-black font-poppins font-semibold text-center'>
//                   {skill.name}
//                 </p>
//               </div>
//             </div>
//           ))}
//         </div>
        
//         <div className="py-16">
//           <h3 className="subhead-text">Work Experience</h3>
//           <div className="mt-12 flex flex-col gap-12">
//             {experiences.map((experience) => (
//               <div key={experience.company_name} className="flex gap-5">
//                 <div className="flex justify-center items-center">
//                    <div className='w-12 h-12 rounded-lg bg-white flex justify-center items-center'>
//                      <img src={experience.icon} alt={experience.company_name} className="w-[60%] h-[60%] object-contain" />
//                    </div>
//                 </div>
//                 <div>
//                   <h4 className="text-xl font-poppins font-semibold text-white">
//                     {experience.title}
//                   </h4>
//                   <p className="text-base font-medium text-white/80" style={{ margin: 0 }}>
//                     {experience.company_name} | {experience.date}
//                   </p>
//                   <ul className="my-5 list-disc ml-5 space-y-2">
//                     {experience.points.map((point, index) => (
//                       <li key={`experience-point-${index}`} className="text-white/80 font-normal pl-1 text-sm">
//                         {point}
//                       </li>
//                     ))}
//                   </ul>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>

//         <hr className="border-slate-200" />
//         <CTA />
//       </section>
//     </>
//   );
// };

// export default Home;


// // about me
// import React, { Suspense, useState } from 'react';
// import { Canvas } from '@react-three/fiber';
// import Loader from '../components/Loader';
// import { skills, experiences } from '../constants'; // Import skills and experiences
// import CTA from '../components/CTA';

// // const ParticleScene = React.lazy(() => import('../components/ParticleScene'));

// const Home = () => {
//   return (
//     <>
//       {/* --- Hero Section (Full Screen Animation) --- */}
//       <section className="w-full h-screen relative">
//         <div className='hero-content'>
//           <h1 className='hero-title'>
//             Hi, I'm <span className='blue-gradient_text'>Shivansh</span> 👋
//           </h1>
//           {/* <p className='hero-subtitle' style={{ color: '#FFFFFF', fontWeight: 'normal' }}> */}
//           <p className='hero-subtitle' style={{ color: '#00ffffff', fontWeight: 'bold' }}>
//             I build and deploy advanced AI models that solve challenges in science and engineering.
//           </p>
//         </div>
        
//         <Canvas camera={{ position: [0, 0, 2], fov: 75, near: 0.1, far: 1000 }}>
//           <color attach="background" args={['#000000']} />
//           <Suspense fallback={<Loader />}>
//             <ParticleScene />
//           </Suspense>
//         </Canvas>

//         <div className='scroll-down-arrow'>
//           <span>↓</span>
//         </div>
//       </section>

//       {/* --- "About Me" and Skills Section (Below the fold) --- */}
//       <section className="max-container about-section">

//         {/* --- ADD THIS "ABOUT ME" SECTION --- */}
//         <div className='py-16'>
//             <h3 className="subhead-text text-white">About Me</h3>
//             <div className="mt-5 flex flex-col gap-3 text-white/80">
//                 <p>
//                 I am an AI Engineer specializing in Scientific Machine Learning (SciML) and end-to-end application development. My work focuses on bridging the gap between complex mathematical theory and practical, high-performance software.
//                 </p>
//                 <p>
//                 I am a "T-shaped" engineer: deep expertise in one area (Scientific ML) with a strong breadth of practical skills (end-to-end app development). I thrive on solving challenging problems. As a **Kaggle Notebooks Expert (top 4%)**, I am passionate about building robust, reproducible, and insightful AI solutions.
//                 </p>
//             </div>
//         </div>
//         {/* --- END OF ADDED SECTION --- */}

//         <h3 className="subhead-text">My Skills</h3>
//         <div className="mt-16 flex flex-wrap gap-12 justify-center">
//           {skills.map((skill) => (
//             <div className="block-container w-28 h-28" key={skill.name} title={skill.name}>
//               <div className="btn-back rounded-xl" />
//               <div className="btn-front rounded-xl flex flex-col justify-center items-center p-2">
//                 <img
//                   src={skill.imageUrl}
//                   alt={skill.name}
//                   className="w-1/2 h-1/2 object-contain"
//                 />
//                 <p className='mt-2 text-sm text-blue-500 font-poppins font-semibold text-center'>
//                   {skill.name}
//                 </p>
//               </div>
//             </div>
//           ))}
//         </div>
        
//         <div className="py-16">
//           <h3 className="subhead-text">Work Experience</h3>
//           <div className="mt-12 flex flex-col gap-12">
//             {experiences.map((experience) => (
//               <div key={experience.company_name} className="flex gap-5">
//                 <div className="flex justify-center items-center">
//                    <div className='w-12 h-12 rounded-lg bg-white flex justify-center items-center'>
//                      <img src={experience.icon} alt={experience.company_name} className="w-[60%] h-[60%] object-contain" />
//                    </div>
//                 </div>
//                 <div>
//                   <h4 className="text-xl font-poppins font-semibold text-white">
//                     {experience.title}
//                   </h4>
//                   <p className="text-base font-medium text-white/80" style={{ margin: 0 }}>
//                     {experience.company_name} | {experience.date}
//                   </p>
//                   <ul className="my-5 list-disc ml-5 space-y-2">
//                     {experience.points.map((point, index) => (
//                       <li key={`experience-point-${index}`} className="text-white/80 font-normal pl-1 text-sm">
//                         {point}
//                       </li>
//                     ))}
//                   </ul>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>

//         <hr className="border-slate-200" />
//         <CTA />
//       </section>
//     </>
//   );
// };

// export default Home;










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
          <p className='hero-subtitle' style={{ color: '#00ffffff', fontWeight: 'bold' }}>
            I build and deploy advanced AI models that solve challenges in science and engineering.
          </p>
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
                I am a "T-shaped" engineer: deep expertise in one area (Scientific ML) with a strong breadth of practical skills (end-to-end app development). I thrive on solving challenging problems. As a **Kaggle Notebooks Expert (top 4%)**, I am passionate about building robust, reproducible, and insightful AI solutions.
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