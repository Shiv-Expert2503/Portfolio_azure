// import { Route, BrowserRouter as Router, Routes  } from "react-router-dom";
// import Navbar from "./components/navbar";

// import {Home, About, Projects, Contact} from "./pages";
// const App = () => {
//   return (
//     <main className="bg-slate-300/20 h-full">
//       <Router>
//         <Navbar />
//         <Routes>
//           <Route path="/" element={<Home />} />
//           <Route path="/about" element={<About />} />
//           <Route path="/projects" element={<Projects />} />
//           <Route path="/contact" element={<Contact />} />
//         </Routes>
//       </Router>
//     </main>
//   );
// }

// export default App;



// import { Route, BrowserRouter as Router, Routes  } from "react-router-dom";
// import Navbar from "./components/navbar";

// import {Home, About, Projects, Contact} from "./pages";
// const App = () => {
//   return (
//     <main className="h-full">
//       <Router>
//         <Navbar />
//         <Routes>
//           <Route path="/" element={<Home />} />
//           <Route path="/about" element={<About />} />
//           <Route path="/projects" element={<Projects />} />
//           <Route path="/contact" element={<Contact />} />
//         </Routes>
//       </Router>
//     </main>
//   );
// }

// export default App;



// for scrolling background ==================================================working
// import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
// import { Canvas } from '@react-three/fiber';
// import Navbar from "./components/navbar";
// import ParticleScene from "./components/ParticleScene";
// import {Home, About, Projects, Contact} from "./pages";

// const App = () => {
//   return (
//     <div className="app-container">
//       {/* ✅ FIXED PARTICLE BACKGROUND */}
//       <div className="particle-background">
//         <Canvas camera={{ position: [0, 0, 5], fov: 60 }}
//         style={{ pointerEvents: 'auto' }}>

//           <ParticleScene />
//         </Canvas>
//       </div>

//       {/* ✅ SCROLLABLE CONTENT OVERLAY */}
//       <div className="content-overlay">
//         <Router>
//           <Navbar />
//           <Routes>
//             <Route path='/' element={<Home />} />
//             <Route path='/about' element={<About />} />
//             <Route path='/projects' element={<Projects />} />
//             <Route path='/contact' element={<Contact />} />
//           </Routes>
//         </Router>
//       </div>
//     </div>
//   );
// }

// export default App;



// Replace your entire App.jsx with this definitive version

// This is the final and correct App.jsx structure

import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import { Canvas } from '@react-three/fiber';
import { Suspense } from 'react';

import Navbar from "./components/navbar";
import ParticleScene from "./components/ParticleScene";
import { Home, About, Projects, Contact } from "./pages";

const App = () => {
  return (
    <main>
      
      {/* The Canvas is in the background container */}
      <div className='canvas-container'>
        <Canvas eventSource={document.getElementById('root')}>
          <Suspense fallback={null}>
            <directionalLight position={[0, 0, 2]} intensity={3} />
            <ambientLight intensity={1} />
            <ParticleScene />
          </Suspense>
        </Canvas>
      </div>

      {/* The page content is in the foreground container */}
      <div className="scroll-content">
        <Router>
          <Navbar />
          <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/about' element={<About />} />
            <Route path='/projects' element={<Projects />} />
            <Route path='/contact' element={<Contact />} />
          </Routes>
        </Router>
      </div>
      
    </main>
  );
};

export default App;