// // In src/components/ParticleScene.jsx
// import React, { useState, useEffect, useRef } from 'react';
// import { useFrame } from '@react-three/fiber';
// import * as THREE from 'three';

// const ParticleScene = () => {
//     const [positions, setPositions] = useState(null);
//     const pointsRef = useRef();

//     // Step 1: This hook will run once to load our particle data
//     useEffect(() => {
//         // Fetch the blueprint file from the public folder
//         fetch('/neuron.json') 
//             .then(response => response.json())
//             .then(data => {
//                 // The JSON data is an array of arrays [[x,y,z], [x,y,z], ...].
//                 // We need to flatten it into a single array for Three.js.
//                 const flatPositions = new Float32Array(data.flat());
//                 setPositions(flatPositions);
//             })
//             .catch(error => console.error("Failed to load particle data:", error));
//     }, []); // The empty array [] means this effect runs only once

//     // This hook creates a simple rotation animation on every frame
//     useFrame(() => {
//         if (pointsRef.current) {
//             pointsRef.current.rotation.y += 0.001;
//             pointsRef.current.rotation.x += 0.0005;
//         }
//     });

//     // If the positions haven't been loaded yet, don't render anything
//     if (!positions) {
//         return null;
//     }

//     // This is the Three.js part, written in React Three Fiber's JSX
//     return (
//         <points ref={pointsRef}>
//             <bufferGeometry attach="geometry">
//                 <bufferAttribute
//                     attach="attributes-position"
//                     count={positions.length / 3} // The number of vertices
//                     array={positions} // The flat array of coordinates
//                     itemSize={3} // Each vertex has 3 components (x, y, z)
//                 />
//             </bufferGeometry>
//             <pointsMaterial
//                 attach="material"
//                 size={0.015} // You can tweak this to change the particle size
//                 color="#00ffff" // A cyan color, you can change this
//             />
//         </points>
//     );
// };

// export default ParticleScene;


// Working fine with scale

// import React, { useState, useEffect, useRef } from 'react';
// import { useFrame } from '@react-three/fiber';

// const ParticleScene = () => {
//     const [positions, setPositions] = useState(null);
//     const pointsRef = useRef();

//     useEffect(() => {
//         console.log("1. Starting to fetch particle data...");
//         fetch('/neuron_15k.json') 
//             .then(response => {
//                 console.log("2. Fetch response received:", response);
//                 if (!response.ok) {
//                     throw new Error(`HTTP error! status: ${response.status} - Make sure neuron.json is in the 'public' folder.`);
//                 }
//                 return response.json();
//             })
//             .then(data => {
//                 console.log("3. Data parsed successfully. Number of points:", data.length);
//                 const flatPositions = new Float32Array(data.flat());
//                 console.log("4. Positions flattened. Setting state...");
//                 setPositions(flatPositions);
//             })
//             .catch(error => console.error("ERROR: Failed to load or process particle data:", error));
//     }, []);

//     useFrame(() => {
//         if (pointsRef.current) {
//             pointsRef.current.rotation.y += 0.001;
//             pointsRef.current.rotation.x += 0.0005;
//         }
//     });
    
//     console.log("5. Rendering component. Positions state is:", positions);

//     if (!positions) {
//         return null;
//     }

//     return (
//         <points ref={pointsRef} scale={0.00078}> {/* <-- ADD scale={0.001} HERE */}
//             <bufferGeometry attach="geometry">
//                 <bufferAttribute
//                     attach="attributes-position"
//                     count={positions.length / 3}
//                     array={positions}
//                     itemSize={3}
//                 />
//             </bufferGeometry>
//             <pointsMaterial
//                 attach="material"
//                 size={0.015}
//                 color="#00ffff"
//             />
//         </points>
//     );
// };

// export default ParticleScene;


//---------------------------------------------------------------------has laggy error, memory usage to infinity

// import React, { useState, useEffect, useMemo, useRef } from 'react';
// import { useFrame } from '@react-three/fiber';
// import * as THREE from 'three';

// // --- GLSL SHADER CODE ---
// // This is the C-style program that runs on the GPU

// const vertexShader = `
//   // This is an "attribute" that will receive the coordinates for our target shape
//   attribute vec3 targetPosition; 
//   // This is a "uniform" that we will control from our JavaScript to animate the transition
//   uniform float progress; 

//   uniform float size;
//   uniform float scale;

//   void main() {
//     // mix() is a GLSL function that interpolates between two values.
//     // When progress is 0.0, transformed = position.
//     // When progress is 1.0, transformed = targetPosition.
//     vec3 transformed = mix(position, targetPosition, progress);

//     vec4 mvPosition = modelViewMatrix * vec4(transformed, 1.0);
//     gl_PointSize = size * (scale / -mvPosition.z);
//     gl_Position = projectionMatrix * mvPosition;
//   }
// `;

// const fragmentShader = `
//   void main() {
//     // Make the points circular and fade out at the edges
//     if (length(gl_PointCoord - vec2(0.5, 0.5)) > 0.475) discard;
    
//     // Set the color of the particles
//     gl_FragColor = vec4(0.0, 1.0, 1.0, 1.0); // Cyan color
//   }
// `;
// // --------------------

// const ParticleScene = () => {
//     const pointsRef = useRef();

//     // We now need to load and store the data for BOTH shapes
//     const [neuronPositions, setNeuronPositions] = useState(null);
//     const [brainPositions, setBrainPositions] = useState(null);

//     useEffect(() => {
//         // Use Promise.all to fetch all our blueprint files at once
//         Promise.all([
//             fetch('/neuron_15k.json').then(res => res.json()),
//             fetch('/black_dragon_15k.json').then(res => res.json()) // Make sure brain.json is in your public folder
//         ]).then(([neuronData, brainData]) => {
//             setNeuronPositions(new Float32Array(neuronData.flat()));
//             setBrainPositions(new Float32Array(brainData.flat()));
//         }).catch(error => console.error("Failed to load particle data:", error));
//     }, []);

//     // This is our animation controller
//     const uniforms = useMemo(() => ({
//         progress: { value: 0.0 }, // The progress of our transition, from 0 to 1
//         size: { value: 25.0 }, // The base size of the particles
//         scale: { value: 200.0 } // Scale for size attenuation
//     }), []);
    
//     // This hook animates the 'progress' uniform over time
//     useFrame(({ clock }) => {
//         if (pointsRef.current) {
//             // Animate the rotation
//             pointsRef.current.rotation.y = clock.getElapsedTime() * 0.1;
            
//             // Animate the morphing transition using a sine wave
//             // This will smoothly animate progress from 0 to 1 and back again
//             pointsRef.current.material.uniforms.progress.value = (Math.sin(clock.getElapsedTime() * 0.5) + 1) / 2;
//         }
//     });

//     // If the data hasn't been loaded yet, don't render anything
//     if (!neuronPositions || !brainPositions) {
//         return null;
//     }

//     return (
//         <points ref={pointsRef} scale={0.001}>
//             <bufferGeometry attach="geometry">
//                 {/* The 'position' attribute is our starting shape (neuron) */}
//                 <bufferAttribute
//                     attach="attributes-position"
//                     count={neuronPositions.length / 3}
//                     array={neuronPositions}
//                     itemSize={3}
//                 />
//                 {/* We add a new attribute for our target shape (brain) */}
//                 <bufferAttribute
//                     attach="attributes-targetPosition"
//                     count={brainPositions.length / 3}
//                     array={brainPositions}
//                     itemSize={3}
//                 />
//             </bufferGeometry>
//             {/* We now use a custom ShaderMaterial instead of pointsMaterial */}
//             <shaderMaterial
//                 attach="material"
//                 vertexShader={vertexShader}
//                 fragmentShader={fragmentShader}
//                 uniforms={uniforms}
//                 depthWrite={false} // Improves rendering of transparent particles
//                 blending={THREE.AdditiveBlending} // Creates a nice glow effect
//             />
//         </points>
//     );
// };

// export default ParticleScene;










//------------------------------------------------------------------------smooth working code with scale issue
// import React, { useState, useEffect, useMemo, useRef } from 'react';
// import { useFrame } from '@react-three/fiber';
// import * as THREE from 'three';

// const vertexShader = `
//   attribute vec3 targetPosition; 
//   uniform float progress; 
//   uniform float size;

//   void main() {
//     vec3 transformed = mix(position, targetPosition, progress);
//     vec4 mvPosition = modelViewMatrix * vec4(transformed, 1.0);
//     gl_PointSize = size;
//     gl_Position = projectionMatrix * mvPosition;
//   }
// `;

// const fragmentShader = `
//   void main() {
//     if (length(gl_PointCoord - vec2(0.5, 0.5)) > 0.475) discard;
//     gl_FragColor = vec4(0.0, 1.0, 1.0, 1.0); // Cyan color
//   }
// `;

// const ParticleScene = () => {
//     const pointsRef = useRef();

//     // Use state for the files you have: neuron and dragon
//     const [neuronPositions, setNeuronPositions] = useState(null);
//     const [dragonPositions, setDragonPositions] = useState(null);

//     useEffect(() => {
//         // --- FIX: Load the correct JSON files ---
//         Promise.all([
//             fetch('/neuron_15k.json').then(res => res.json()),
//             fetch('/black_dragon_15k.json').then(res => res.json())
//         ]).then(([neuronData, dragonData]) => {
//             // Use the correct state setters
//             setNeuronPositions(new Float32Array(neuronData.flat()));
//             setDragonPositions(new Float32Array(dragonData.flat()));
//         }).catch(error => console.error("Failed to load particle data:", error));
//     }, []);

//     const uniforms = useMemo(() => ({
//         progress: { value: 0.0 },
//         size: { value: 25.0 }
//     }), []);
    
//     useFrame(({ clock }) => {
//         if (pointsRef.current) {
//             pointsRef.current.rotation.y = clock.getElapsedTime() * 0.1;
//             pointsRef.current.material.uniforms.progress.value = (Math.sin(clock.getElapsedTime() * 0.5) + 1) / 2;
//         }
//     });

//     // Update the check to wait for both files
//     if (!neuronPositions || !dragonPositions) {
//         return null;
//     }

//     // --- FIX: Removed the 'project' variable which was causing the error ---
//     // We are hardcoding the scale here. You mentioned 0.5 works well for the dragon.
//     // The neuron is much larger, so it needs a smaller scale like 0.001.
//     // Let's start with the neuron's scale.
//     return (
//         <points ref={pointsRef} scale={0.001}> 
//             <bufferGeometry attach="geometry">
//                 <bufferAttribute
//                     attach="attributes-position"
//                     count={neuronPositions.length / 3}
//                     array={neuronPositions}
//                     itemSize={3}
//                 />
//                 {/* Use the dragon's positions as the target */}
//                 <bufferAttribute
//                     attach="attributes-targetPosition"
//                     count={dragonPositions.length / 3}
//                     array={dragonPositions}
//                     itemSize={3}
//                 />
//             </bufferGeometry>
//             <shaderMaterial
//                 attach="material"
//                 vertexShader={vertexShader}
//                 fragmentShader={fragmentShader}
//                 uniforms={uniforms}
//                 depthWrite={false}
//                 blending={THREE.AdditiveBlending}
//             />
//         </points>
//     );
// };

// export default ParticleScene;



// ---------------------------------------------------------------------------Completely working code with scale issue fixed 

// import React, { useState, useEffect, useMemo, useRef } from 'react';
// import { useFrame } from '@react-three/fiber';
// import * as THREE from 'three';

// const vertexShader = `
//   attribute vec3 targetPosition; 
//   uniform float progress; 
//   uniform float size;

//   void main() {
//     vec3 transformed = mix(position, targetPosition, progress);
//     vec4 mvPosition = modelViewMatrix * vec4(transformed, 1.0);
//     gl_PointSize = size;
//     gl_Position = projectionMatrix * mvPosition;
//   }
// `;

// const fragmentShader = `
//   void main() {
//     if (length(gl_PointCoord - vec2(0.5, 0.5)) > 0.475) discard;
//     gl_FragColor = vec4(0.0, 1.0, 1.0, 1.0); // Cyan color
//   }
// `;

// const ParticleScene = () => {
//     const pointsRef = useRef();
//     const [neuronPositions, setNeuronPositions] = useState(null);
//     const [dragonPositions, setDragonPositions] = useState(null);

//     useEffect(() => {
//         Promise.all([
//             fetch('/brain_normalized_150k.json').then(res => res.json()), // Load normalized file
//             fetch('/dragon_1_normalized_150k.json').then(res => res.json()) // Load normalized file
//         ]).then(([neuronData, dragonData]) => {
//             setNeuronPositions(new Float32Array(neuronData.flat()));
//             setDragonPositions(new Float32Array(dragonData.flat()));
//         }).catch(error => console.error("Failed to load particle data:", error));
//     }, []);

//     const uniforms = useMemo(() => ({
//         progress: { value: 0.0 },
//         // --- FIX: Drastically reduce particle size for the new normalized scale ---
//         size: { value: 2.5 } 
//     }), []);
    
//     useFrame(({ clock }) => {
//         if (pointsRef.current) {
//             pointsRef.current.rotation.y = clock.getElapsedTime() * 0.1;
//             pointsRef.current.material.uniforms.progress.value = (Math.sin(clock.getElapsedTime() * 0.5) + 1) / 2;
//         }
//     });

//     if (!neuronPositions || !dragonPositions) {
//         return null;
//     }

//     return (
//         // --- FIX: Removed the hardcoded scale prop ---
//         <points ref={pointsRef} scale={6}>
//             <bufferGeometry attach="geometry">
//                 <bufferAttribute
//                     attach="attributes-position"
//                     count={neuronPositions.length / 3}
//                     array={neuronPositions}
//                     itemSize={3}
//                 />
//                 <bufferAttribute
//                     attach="attributes-targetPosition"
//                     count={dragonPositions.length / 3}
//                     array={dragonPositions}
//                     itemSize={3}
//                 />
//             </bufferGeometry>
//             <shaderMaterial
//                 attach="material"
//                 vertexShader={vertexShader}
//                 fragmentShader={fragmentShader}
//                 uniforms={uniforms}
//                 depthWrite={false}
//                 blending={THREE.AdditiveBlending}
//             />
//         </points>
//     );
// };

// export default ParticleScene;







//----------------------------------------------------------------------adding the multi model scene 100% fine working but with static color scales

// import React, { useState, useEffect, useMemo, useRef } from 'react';
// import { useFrame } from '@react-three/fiber';
// import * as THREE from 'three';

// // --- UPDATED VERTEX SHADER ---
// const vertexShader = `
//   // We now have three positions: the start, and two targets
//   attribute vec3 targetPosition1;
//   attribute vec3 targetPosition2;

//   // We have two uniforms to control the animation
//   uniform float progress; // Progress of the current transition (0 to 1)
//   uniform float currentShape; // Which shape is the STARTING shape (0, 1, or 2)

//   uniform float size;

//   void main() {
//     vec3 finalPosition;

//     // This logic decides which transition to perform
//     if (currentShape == 0.0) { // Transition from Neuron (pos 0) to Dragon (pos 1)
//       finalPosition = mix(position, targetPosition1, progress);
//     } else if (currentShape == 1.0) { // Transition from Dragon (pos 1) to Brain (pos 2)
//       finalPosition = mix(targetPosition1, targetPosition2, progress);
//     } else { // Transition from Brain (pos 2) back to Neuron (pos 0)
//       finalPosition = mix(targetPosition2, position, progress);
//     }

//     vec4 mvPosition = modelViewMatrix * vec4(finalPosition, 1.0);
//     gl_PointSize = size;
//     gl_Position = projectionMatrix * mvPosition;
//   }
// `;

// const fragmentShader = `
//   void main() {
//     if (length(gl_PointCoord - vec2(0.5, 0.5)) > 0.475) discard;
//     // You can change the color here or even make it a uniform to change it with JS!
//     gl_FragColor = vec4(0.0, 0.8, 0.7, 1.0); // A teal color
//   }
// `;

// // --- MAIN COMPONENT ---
// const ParticleScene = () => {
//     const pointsRef = useRef();

//     // Load all three blueprint files
//     const [neuronPositions, setNeuronPositions] = useState(null);
//     const [dragonPositions, setDragonPositions] = useState(null);
//     const [brainPositions, setBrainPositions] = useState(null);

    // useEffect(() => {
    //     Promise.all([
    //         // Fetch the new .bin files
    //         fetch('/neuron_normalized_150k.bin'),
    //         fetch('/dragon_normalized_150k.bin'),
    //         fetch('/brain_normalized_150k.bin')
    //     ])
    //     // Convert all responses to ArrayBuffers
    //     .then(responses => Promise.all(responses.map(res => res.arrayBuffer())))
    //     .then(buffers => {
    //         // Create Float32Arrays directly from the binary data
    //         setNeuronPositions(new Float32Array(buffers[0]));
    //         setDragonPositions(new Float32Array(buffers[1]));
    //         setBrainPositions(new Float32Array(buffers[2]));
    //     })
    //     .catch(error => console.error("Failed to load particle data:", error));
    // }, []);

//     // Add our new 'currentShape' uniform
//     const uniforms = useMemo(() => ({
//         progress: { value: 0.0 },
//         currentShape: { value: 0.0 },
//         size: { value: 2 } 
//     }), []);
    
//     // This is the new, more advanced animation loop
//     useFrame(({ clock }) => {
//         if (pointsRef.current) {
//             pointsRef.current.rotation.y += 0.002;

//             // --- Animation Choreography ---
//             const time = clock.getElapsedTime();
//             const transitionDuration = 4; // 4 seconds for each morph
//             const holdDuration = 2; // Hold each shape for 2 seconds
//             const totalCycleDuration = (transitionDuration + holdDuration) * 3; // 3 shapes

//             const cycleTime = time % totalCycleDuration;
//             const currentPhase = Math.floor(cycleTime / (transitionDuration + holdDuration));
            
//             const timeInPhase = cycleTime % (transitionDuration + holdDuration);
//             let progress = 0;
//             if (timeInPhase < transitionDuration) {
//                 // Animate progress from 0 to 1 during the transition duration
//                 progress = timeInPhase / transitionDuration;
//             } else {
//                 // Hold the final shape
//                 progress = 1;
//             }
            
//             pointsRef.current.material.uniforms.currentShape.value = currentPhase;
//             pointsRef.current.material.uniforms.progress.value = progress;
//         }
//     });

//     if (!neuronPositions || !dragonPositions || !brainPositions) {
//         return null;
//     }

//     return (
//         <points ref={pointsRef} scale={6}>
//             <bufferGeometry attach="geometry">
//                 {/* Attribute 0: Neuron */}
//                 <bufferAttribute
//                     attach="attributes-position"
//                     count={neuronPositions.length / 3}
//                     array={neuronPositions}
//                     itemSize={3}
//                 />
//                 {/* Attribute 1: Dragon */}
//                 <bufferAttribute
//                     attach="attributes-targetPosition1"
//                     count={dragonPositions.length / 3}
//                     array={dragonPositions}
//                     itemSize={3}
//                 />
//                 {/* Attribute 2: Brain */}
//                 <bufferAttribute
//                     attach="attributes-targetPosition2"
//                     count={brainPositions.length / 3}
//                     array={brainPositions}
//                     itemSize={3}
//                 />
//             </bufferGeometry>
//             <shaderMaterial
//                 attach="material"
//                 vertexShader={vertexShader}
//                 fragmentShader={fragmentShader}
//                 uniforms={uniforms}
//                 depthWrite={false}
//                 blending={THREE.AdditiveBlending}
//             />
//         </points>
//     );
// };

// export default ParticleScene;





// ---------------------------------------------------------------------------100% working with multiple colors

// import React, { useState, useEffect, useMemo, useRef } from 'react';
// import { useFrame } from '@react-three/fiber';
// import * as THREE from 'three';

// // --- UPDATED SHADERS WITH COLOR TRANSITIONS ---
// const vertexShader = `
//   attribute vec3 targetPosition1;
//   attribute vec3 targetPosition2;
//   uniform float progress;
//   uniform float currentShape;
//   uniform float size;

//   void main() {
//     vec3 finalPosition;
//     if (currentShape == 0.0) {
//       finalPosition = mix(position, targetPosition1, progress);
//     } else if (currentShape == 1.0) {
//       finalPosition = mix(targetPosition1, targetPosition2, progress);
//     } else {
//       finalPosition = mix(targetPosition2, position, progress);
//     }
//     vec4 mvPosition = modelViewMatrix * vec4(finalPosition, 1.0);
//     gl_PointSize = size;
//     gl_Position = projectionMatrix * mvPosition;
//   }
// `;

// const fragmentShader = `
//   // Uniforms to hold the colors for the transition
//   uniform vec3 color1;
//   uniform vec3 color2;
//   uniform float progress;

//   void main() {
//     if (length(gl_PointCoord - vec2(0.5, 0.5)) > 0.475) discard;
    
//     // Mix between two colors based on the same progress value
//     vec3 finalColor = mix(color1, color2, progress);
    
//     gl_FragColor = vec4(finalColor, 1.0);
//   }
// `;

// // --- MAIN COMPONENT ---
// const ParticleScene = () => {
//     const pointsRef = useRef();
//     const [neuronPositions, setNeuronPositions] = useState(null);
//     const [dragonPositions, setDragonPositions] = useState(null);
//     const [brainPositions, setBrainPositions] = useState(null);

//     // --- FIX: Define our colors here ---
//     const colors = [
//         new THREE.Color('#ff00ff'), // Neuron color (Magenta)
//         new THREE.Color('#00ffff'), // Dragon color (Cyan)
//         new THREE.Color('#ffff00'), // Brain color (Yellow)
//     ];

    // useEffect(() => {
    //     Promise.all([
    //         // Fetch the new .bin files
    //         fetch('/neuron_normalized_150k.bin'),
    //         fetch('/dragon_normalized_150k.bin'),
    //         fetch('/brain_normalized_150k.bin')
    //     ])
    //     // Convert all responses to ArrayBuffers
    //     .then(responses => Promise.all(responses.map(res => res.arrayBuffer())))
    //     .then(buffers => {
    //         // Create Float32Arrays directly from the binary data
    //         setNeuronPositions(new Float32Array(buffers[0]));
    //         setDragonPositions(new Float32Array(buffers[1]));
    //         setBrainPositions(new Float32Array(buffers[2]));
    //     })
    //     .catch(error => console.error("Failed to load particle data:", error));
    // }, []);

//     const uniforms = useMemo(() => ({
//         progress: { value: 0.0 },
//         currentShape: { value: 0.0 },
//         // --- FIX: Increase the size to fill space, instead of adding more points ---
//         size: { value: 1.0 }, // Experiment with this value! Try 5, 8, or 10.
//         color1: { value: colors[0] },
//         color2: { value: colors[1] }
//     }), [colors]);
    
//     useFrame(({ clock }) => {
//         if (pointsRef.current) {
//             pointsRef.current.rotation.y += 0.002;

//             const time = clock.getElapsedTime();
//             const transitionDuration = 4;
//             const holdDuration = 2;
//             const totalCycleDuration = (transitionDuration + holdDuration) * colors.length;

//             const cycleTime = time % totalCycleDuration;
//             const currentPhase = Math.floor(cycleTime / (transitionDuration + holdDuration));
            
//             const timeInPhase = cycleTime % (transitionDuration + holdDuration);
//             let progress = 0;
//             if (timeInPhase < transitionDuration) {
//                 progress = timeInPhase / transitionDuration;
//             } else {
//                 progress = 1;
//             }
            
//             // Update the uniforms
//             pointsRef.current.material.uniforms.currentShape.value = currentPhase;
//             pointsRef.current.material.uniforms.progress.value = progress;
            
//             // --- FIX: Update colors for the transition ---
//             const colorIndex1 = currentPhase;
//             const colorIndex2 = (currentPhase + 1) % colors.length;
//             pointsRef.current.material.uniforms.color1.value = colors[colorIndex1];
//             pointsRef.current.material.uniforms.color2.value = colors[colorIndex2];
//         }
//     });

//     if (!neuronPositions || !dragonPositions || !brainPositions) {
//         return null;
//     }

//     return (
//         // --- FIX: Removed the scale prop. We control size with the camera now. ---
//         <points ref={pointsRef} scale={6}>
//             <bufferGeometry attach="geometry">
//                 <bufferAttribute attach="attributes-position" count={neuronPositions.length / 3} array={neuronPositions} itemSize={3}/>
//                 <bufferAttribute attach="attributes-targetPosition1" count={dragonPositions.length / 3} array={dragonPositions} itemSize={3}/>
//                 <bufferAttribute attach="attributes-targetPosition2" count={brainPositions.length / 3} array={brainPositions} itemSize={3}/>
//             </bufferGeometry>
//             <shaderMaterial
//                 attach="material"
//                 vertexShader={vertexShader}
//                 fragmentShader={fragmentShader}
//                 uniforms={uniforms}
//                 depthWrite={false}
//                 blending={THREE.AdditiveBlending}
//             />
//         </points>
//     );
// };

// export default ParticleScene;









// //-------------------------------------------adding sine and tan wave
// import React, { useState, useEffect, useMemo, useRef } from 'react';
// import { useFrame } from '@react-three/fiber';
// import * as THREE from 'three';

// // --- Helper functions to generate waves ---
// const generateSineWavePoints = (numPoints, cycles = 2) => { // Default to 2 cycles
//     const points = [];
//     const width = 2.5; 
//     const height = 0.5; // Reduced height to match other waves better
//     for (let i = 0; i < numPoints; i++) {
//         const x = (Math.random() - 0.5) * width;
//         // --- FIX: Multiplied by 'cycles' to control frequency ---
//         const y = Math.sin(x * Math.PI * cycles) * height;
//         const z = (Math.random() - 0.5) * 0.5;
//         points.push(x, y, z);
//     }
//     return new Float32Array(points);
// };
// const generateTangentWavePoints = (numPoints) => {
//     const points = [];
//     const width = 1.5; const height = 0.25;
//     // const width = 2.0; const height = 0.5;
//     for (let i = 0; i < numPoints; i++) {
//         const x = (Math.random() * width) - (width / 2);
//         const y = Math.max(-2, Math.min(2, Math.tan(x * Math.PI))) * height;
//         const z = (Math.random() - 0.5) * 0.5;
//         points.push(x, y, z);
//     }
//     return new Float32Array(points);
// };

// // --- SHADERS with correct attribute names ---
// const vertexShader = `
//   // The shader now expects 4 target positions
//   attribute vec3 targetPosition1;
//   attribute vec3 targetPosition2;
//   attribute vec3 targetPosition3;
//   attribute vec3 targetPosition4;

//   uniform float progress;
//   uniform float currentShape;
//   uniform float size;

//   void main() {
//     vec3 pos1;
//     vec3 pos2;

//     // This logic correctly selects the start and end shape for the transition
//     if (currentShape < 1.0) { pos1 = position; pos2 = targetPosition1; }
//     else if (currentShape < 2.0) { pos1 = targetPosition1; pos2 = targetPosition2; }
//     else if (currentShape < 3.0) { pos1 = targetPosition2; pos2 = targetPosition3; }
//     else if (currentShape < 4.0) { pos1 = targetPosition3; pos2 = targetPosition4; }
//     else { pos1 = targetPosition4; pos2 = position; } // Loop back to the start

//     vec3 finalPosition = mix(pos1, pos2, progress);
    
//     vec4 mvPosition = modelViewMatrix * vec4(finalPosition, 1.0);
//     gl_PointSize = size;
//     gl_Position = projectionMatrix * mvPosition;
//   }
// `;

// const fragmentShader = `
//   uniform vec3 color1;
//   uniform vec3 color2;
//   uniform float progress;

//   void main() {
//     if (length(gl_PointCoord - vec2(0.5, 0.5)) > 0.475) discard;
//     vec3 finalColor = mix(color1, color2, progress);
//     gl_FragColor = vec4(finalColor, 1.0);
//   }
// `;

// // --- MAIN COMPONENT ---
// const ParticleScene = ({ setCurrentStage }) => {
//     const pointsRef = useRef();
//     const geometryRef = useRef();

//     // State for all 5 blueprints
//     const [allPositions, setAllPositions] = useState([]);
//     const numPoints = 150000; // Using your preferred dense particle count

//     const colors = useMemo(() => [
//         new THREE.Color('#ff00ff'), // Neuron
//         new THREE.Color('#00ffff'), // Dragon
//         new THREE.Color('#ffff00'), // Brain
//         new THREE.Color('#00ff00'), // Sine
//         new THREE.Color('#ff7f00'), // Tan
//     ], []);

//     useEffect(() => {
//         // --- FIX: Load the correct .bin files ---
//         Promise.all([
//             fetch('/neuron_normalized_150k.bin').then(res => res.arrayBuffer()),
//             fetch('/dragon_normalized_150k.bin').then(res => res.arrayBuffer()),
//             fetch('/brain_normalized_150k.bin').then(res => res.arrayBuffer()),
//         ]).then(buffers => {
//             const loadedPositions = buffers.map(buffer => new Float32Array(buffer));
//             const sinePos = generateSineWavePoints(numPoints,4);
//             const tanPos = generateTangentWavePoints(numPoints);
//             setAllPositions([...loadedPositions, sinePos, tanPos]);
//         }).catch(error => console.error("Failed to load particle data:", error));
//     }, [numPoints]);

//     const uniforms = useMemo(() => ({
//         progress: { value: 0.0 },
//         currentShape: { value: 0.0 },
//         size: { value: 1.75 },
//         color1: { value: colors[0] },
//         color2: { value: colors[1] }
//     }), [colors]);
    
//     useFrame(({ clock }) => {
//         if (pointsRef.current) {
//             pointsRef.current.rotation.y += 0.002;

    //         const transitionDuration = 3;
    //         const holdDuration = 5;
    //         const numShapes = colors.length;
    //         const cycleDuration = transitionDuration + holdDuration;
    //         const totalCycleDuration = cycleDuration * numShapes;
            
    //         const time = clock.getElapsedTime();
    //         const currentPhase = Math.floor(time / cycleDuration) % numShapes;
            
    //         setCurrentStage(currentPhase + 1); // This will cycle from 1 to 5

    //         const timeInPhase = time % cycleDuration;
    //         let progress = (timeInPhase < transitionDuration) ? timeInPhase / transitionDuration : 1;

    //         // --- FIX: Conditional Rotation Logic ---
    //         const isSineWavePhase = currentPhase === 3; // 3 is the index for the Sine Wave
    //         const isHolding = timeInPhase >= transitionDuration;

    //         if (isSineWavePhase && isHolding) {
    //             // If we are holding the sine wave, lock it to a nice front-on angle
    //             pointsRef.current.rotation.y = 0.5; // You can tweak this value
    //             pointsRef.current.rotation.x = 0;
    //             pointsRef.current.rotation.z = 0;
    //         } else {
    //             // For all other shapes and all transitions, do the normal rotation
    //             pointsRef.current.rotation.y += 0.002;
    //         }
    //         // --- END OF FIX ---
            
    //         pointsRef.current.material.uniforms.currentShape.value = currentPhase;
    //         pointsRef.current.material.uniforms.progress.value = progress;
            
    //         const colorIndex1 = currentPhase;
    //         const colorIndex2 = (currentPhase + 1) % numShapes;
    //         pointsRef.current.material.uniforms.color1.value = colors[colorIndex1];
    //         pointsRef.current.material.uniforms.color2.value = colors[colorIndex2];
    //     }
    // });
    
//     // Check if all 5 data arrays are ready
//     if (allPositions.length < 5) {
//         return null;
//     }

//     return (
//         <points ref={pointsRef} position={[0, -0.2, 0]} scale={2.5} >
//             <bufferGeometry ref={geometryRef} attach="geometry">
//                 {/* --- FIX: Use the correct attribute names expected by the shader --- */}
//                 <bufferAttribute attach="attributes-position" count={allPositions[0].length / 3} array={allPositions[0]} itemSize={3}/>
//                 <bufferAttribute attach="attributes-targetPosition1" count={allPositions[1].length / 3} array={allPositions[1]} itemSize={3}/>
//                 <bufferAttribute attach="attributes-targetPosition2" count={allPositions[2].length / 3} array={allPositions[2]} itemSize={3}/>
//                 <bufferAttribute attach="attributes-targetPosition3" count={allPositions[3].length / 3} array={allPositions[3]} itemSize={3}/>
//                 <bufferAttribute attach="attributes-targetPosition4" count={allPositions[4].length / 3} array={allPositions[4]} itemSize={3}/>
//             </bufferGeometry>
//             <shaderMaterial
//                 attach="material"
//                 vertexShader={vertexShader}
//                 fragmentShader={fragmentShader}
//                 uniforms={uniforms}
//                 depthWrite={false}
//                 blending={THREE.AdditiveBlending}
//             />
//         </points>
//     );
// };

// export default ParticleScene;




// In src/components/ParticleScene.jsx

// ---------------------------------------------------------------------------------------------------------------------------------------> FINAL, CORRECTED VERSION ---

// import React, { useState, useEffect, useMemo, useRef } from 'react';
// import { useFrame } from '@react-three/fiber';
// import * as THREE from 'three';
// // --- Helper functions to generate waves ---
// const generateSineWavePoints = (numPoints, cycles = 2) => { // Default to 2 cycles
//     const points = [];
//     const width = 2.5; 
//     const height = 0.5; // Reduced height to match other waves better
//     for (let i = 0; i < numPoints; i++) {
//         const x = (Math.random() - 0.5) * width;
//         // --- FIX: Multiplied by 'cycles' to control frequency ---
//         const y = Math.sin(x * Math.PI * cycles) * height;
//         const z = (Math.random() - 0.5) * 0.5;
//         points.push(x, y, z);
//     }
//     return new Float32Array(points);
// };
// const generateTangentWavePoints = (numPoints) => {
//     const points = [];
//     const width = 1.5; const height = 0.25;
//     // const width = 2.0; const height = 0.5;
//     for (let i = 0; i < numPoints; i++) {
//         const x = (Math.random() * width) - (width / 2);
//         const y = Math.max(-2, Math.min(2, Math.tan(x * Math.PI))) * height;
//         const z = (Math.random() - 0.5) * 0.5;
//         points.push(x, y, z);
//     }
//     return new Float32Array(points);
// };

// // --- CORRECTED SHADERS ---
// const vertexShader = `
//   // Use the standard 'position' and consistent 'targetPosition' names
//   attribute vec3 targetPosition1;
//   attribute vec3 targetPosition2;
//   attribute vec3 targetPosition3;
//   attribute vec3 targetPosition4;

//   uniform float progress;
//   uniform float currentShape;
//   uniform float size;

//   void main() {
//     vec3 pos1;
//     vec3 pos2;

//     if (currentShape < 1.0) { pos1 = position; pos2 = targetPosition1; }
//     else if (currentShape < 2.0) { pos1 = targetPosition1; pos2 = targetPosition2; }
//     else if (currentShape < 3.0) { pos1 = targetPosition2; pos2 = targetPosition3; }
//     else if (currentShape < 4.0) { pos1 = targetPosition3; pos2 = targetPosition4; }
//     else { pos1 = targetPosition4; pos2 = position; } // Loop back to the start (position)

//     vec3 finalPosition = mix(pos1, pos2, progress);
    
//     vec4 mvPosition = modelViewMatrix * vec4(finalPosition, 1.0);
//     gl_PointSize = size;
//     gl_Position = projectionMatrix * mvPosition;
//   }
// `;

// const fragmentShader = `
//   uniform vec3 color1;
//   uniform vec3 color2;
//   uniform float progress;

//   void main() {
//     if (length(gl_PointCoord - vec2(0.5, 0.5)) > 0.475) discard;
//     vec3 finalColor = mix(color1, color2, progress);
//     gl_FragColor = vec4(finalColor, 1.0);
//   }
// `;

// // --- MAIN COMPONENT ---
// const ParticleScene = ({ setCurrentStage }) => {
//     const pointsRef = useRef();
//     const [allPositions, setAllPositions] = useState([]);
//     const numPoints = 150000;

//     const colors = useMemo(() => [
//         new THREE.Color('#ff00ff'), // Neuron
//         new THREE.Color('#00ffff'), // Dragon
//         new THREE.Color('#ffff00'), // Brain
//         new THREE.Color('#00ff00'), // Sine
//         new THREE.Color('#ff7f00'), // Tan
//     ], []);

//     useEffect(() => {
//         Promise.all([
//             fetch('/neuron_normalized_150k.bin').then(res => res.arrayBuffer()),
//             fetch('/dragon_normalized_150k.bin').then(res => res.arrayBuffer()),
//             fetch('/brain_normalized_150k.bin').then(res => res.arrayBuffer()),
//         ]).then(buffers => {
//             const loadedPositions = buffers.map(buffer => new Float32Array(buffer));
//             const sinePos = generateSineWavePoints(numPoints, 4);
//             const tanPos = generateTangentWavePoints(numPoints);
//             setAllPositions([...loadedPositions, sinePos, tanPos]);
//         }).catch(error => console.error("Failed to load particle data:", error));
//     }, [numPoints]);

//     const uniforms = useMemo(() => ({
//         progress: { value: 0.0 },
//         currentShape: { value: 0.0 },
//         size: { value: 1.75 },
//         color1: { value: colors[0] },
//         color2: { value: colors[1] }
//     }), [colors]);
    
//     useFrame(({ clock }) => {
//         if (pointsRef.current) {
//             pointsRef.current.rotation.y += 0.002;

//             const transitionDuration = 3;
//             const holdDuration = 5; // Set your desired hold time
//             const numShapes = colors.length;
//             const cycleDuration = transitionDuration + holdDuration;
//             const totalCycleDuration = cycleDuration * numShapes;
            
//             const time = clock.getElapsedTime();
//             const currentPhase = Math.floor(time / cycleDuration) % numShapes;
            
//             // Set stage for HomeInfo box (cycles 1 through 4)
//             if (setCurrentStage) {
//                 const infoStage = (currentPhase % 4) + 1;
//                 setCurrentStage(infoStage);
//             }

//             const timeInPhase = time % cycleDuration;
//             let progress = (timeInPhase < transitionDuration) ? timeInPhase / transitionDuration : 1;
            
//             pointsRef.current.material.uniforms.currentShape.value = currentPhase;
//             pointsRef.current.material.uniforms.progress.value = progress;
            
//             const colorIndex1 = currentPhase;
//             const colorIndex2 = (currentPhase + 1) % numShapes;
//             pointsRef.current.material.uniforms.color1.value = colors[colorIndex1];
//             pointsRef.current.material.uniforms.color2.value = colors[colorIndex2];
//         }
//     });
    
//     if (allPositions.length < 5) return null;

//     return (
//         <points ref={pointsRef} position={[0, -0.2, 0]} scale={2.5}>
//             <bufferGeometry attach="geometry">
//                 {/* --- FIX: Use consistent attribute names --- */}
//                 <bufferAttribute attach="attributes-position" count={allPositions[0].length / 3} array={allPositions[0]} itemSize={3}/>
//                 <bufferAttribute attach="attributes-targetPosition1" count={allPositions[1].length / 3} array={allPositions[1]} itemSize={3}/>
//                 <bufferAttribute attach="attributes-targetPosition2" count={allPositions[2].length / 3} array={allPositions[2]} itemSize={3}/>
//                 <bufferAttribute attach="attributes-targetPosition3" count={allPositions[3].length / 3} array={allPositions[3]} itemSize={3}/>
//                 <bufferAttribute attach="attributes-targetPosition4" count={allPositions[4].length / 3} array={allPositions[4]} itemSize={3}/>
//             </bufferGeometry>
//             <shaderMaterial
//                 attach="material"
//                 vertexShader={vertexShader}
//                 fragmentShader={fragmentShader}
//                 uniforms={uniforms}
//                 depthWrite={false}
//                 blending={THREE.AdditiveBlending}
//             />
//         </points>
//     );
// };

// export default ParticleScene;

//------------------------------------------------------------------------------------------------------------------------------


// adding more shapes
// ---------------------------------------------------------------------------- UPDATED SHADERS to handle 22shapes ---
// import React, { useState, useEffect, useMemo, useRef } from 'react';
// import { useFrame } from '@react-three/fiber';
// import * as THREE from 'three';
// // --- Helper functions to generate waves ---
// const generateSineWavePoints = (numPoints, cycles = 2) => { // Default to 2 cycles
//     const points = [];
//     const width = 2.5; 
//     const height = 0.5; // Reduced height to match other waves better
//     for (let i = 0; i < numPoints; i++) {
//         const x = (Math.random() - 0.5) * width;
//         // --- FIX: Multiplied by 'cycles' to control frequency ---
//         const y = Math.sin(x * Math.PI * cycles) * height;
//         const z = (Math.random() - 0.5) * 0.5;
//         points.push(x, y, z);
//     }
//     return new Float32Array(points);
// };
// const generateTangentWavePoints = (numPoints) => {
//     const points = [];
//     const width = 1.5; const height = 0.25;
//     // const width = 2.0; const height = 0.5;
//     for (let i = 0; i < numPoints; i++) {
//         const x = (Math.random() * width) - (width / 2);
//         const y = Math.max(-2, Math.min(2, Math.tan(x * Math.PI))) * height;
//         const z = (Math.random() - 0.5) * 0.5;
//         points.push(x, y, z);
//     }
//     return new Float32Array(points);
// };

// const generateSinhWavePoints = (numPoints) => {
//   const points = [];
//   const width = 2.0;
//   const height = 0.3;
  
//   for (let i = 0; i < numPoints; i++) {
//     const x = (Math.random() - 0.5) * width;
//     const y = Math.sinh(x) * height; // Exponential curves!
//     const z = (Math.random() - 0.5) * 0.5;
//     points.push(x, y, z);
//   }
//   return new Float32Array(points);
// };

// const generateTanhWavePoints = (numPoints) => {
//   const points = [];
//   const width = 3.0;
//   const height = 0.5;
  
//   for (let i = 0; i < numPoints; i++) {
//     const x = (Math.random() - 0.5) * width;
//     const y = Math.tanh(x * 2) * height; // Smooth S-curve
//     const z = (Math.random() - 0.5) * 0.5;
//     points.push(x, y, z);
//   }
//   return new Float32Array(points);
// };


// const generateLogSpiralPoints = (numPoints) => {
//   const points = [];
//   const scale = 0.5;
  
//   for (let i = 0; i < numPoints; i++) {
//     const t = (Math.random() * 6 * Math.PI) - (3 * Math.PI); // -3π to 3π
//     const r = Math.exp(0.2 * t) * scale; // Golden ratio growth
//     const x = r * Math.cos(t);
//     const y = r * Math.sin(t);
//     const z = (Math.random() - 0.5) * 0.5;
//     points.push(x, y, z);
//   }
//   return new Float32Array(points);
// };

// const generateCardioidPoints = (numPoints) => {
//   const points = [];
//   const scale = 0.3;
  
//   for (let i = 0; i < numPoints; i++) {
//     const t = Math.random() * 2 * Math.PI;
//     const r = scale * (1 - Math.cos(t)); // Heart equation
//     const x = r * Math.cos(t);
//     const y = r * Math.sin(t);
//     const z = (Math.random() - 0.5) * 0.3;
//     points.push(x, y, z);
//   }
//   return new Float32Array(points);
// };

// const generateButterflyPoints = (numPoints) => {
//   const points = [];
//   const scale = 0.4;
  
//   for (let i = 0; i < numPoints; i++) {
//     const t = Math.random() * 12 * Math.PI;
//     const r = Math.exp(Math.cos(t)) - 2*Math.cos(4*t) + Math.pow(Math.sin(t/12), 5);
//     const x = scale * r * Math.cos(t);
//     const y = scale * r * Math.sin(t);
//     const z = (Math.random() - 0.5) * 0.4;
//     points.push(x, y, z);
//   }
//   return new Float32Array(points);
// };

// const generateRosePoints = (numPoints, petals = 5) => {
//   const points = [];
//   const scale = 0.5;
  
//   for (let i = 0; i < numPoints; i++) {
//     const t = Math.random() * 2 * Math.PI;
//     const r = scale * Math.cos(petals * t); // Petals parameter
//     const x = r * Math.cos(t);
//     const y = r * Math.sin(t);
//     const z = (Math.random() - 0.5) * 0.3;
//     points.push(x, y, z);
//   }
//   return new Float32Array(points);
// };

// const generateTorusPoints = (numPoints) => {
//   const points = [];
//   const R = 0.8; // Major radius
//   const r = 0.3; // Minor radius
  
//   for (let i = 0; i < numPoints; i++) {
//     const u = Math.random() * 2 * Math.PI;
//     const v = Math.random() * 2 * Math.PI;
    
//     const x = (R + r * Math.cos(v)) * Math.cos(u);
//     const y = (R + r * Math.cos(v)) * Math.sin(u);
//     const z = r * Math.sin(v);
//     points.push(x, y, z);
//   }
//   return new Float32Array(points);
// };


// const generateMobiusPoints = (numPoints) => {
//   const points = [];
//   const scale = 0.6;
  
//   for (let i = 0; i < numPoints; i++) {
//     const u = Math.random() * 2 * Math.PI;
//     const v = (Math.random() - 0.5) * 0.4;
    
//     const x = scale * (1 + v * Math.cos(u/2)) * Math.cos(u);
//     const y = scale * (1 + v * Math.cos(u/2)) * Math.sin(u);
//     const z = scale * v * Math.sin(u/2);
//     points.push(x, y, z);
//   }
//   return new Float32Array(points);
// };

// const generateLorenzPoints = (numPoints) => {
//   const points = [];
//   const scale = 0.03;
//   const dt = 0.01;
  
//   let x = 1, y = 1, z = 1;
//   const sigma = 10, rho = 28, beta = 8/3;
  
//   for (let i = 0; i < numPoints; i++) {
//     // Lorenz equations
//     const dx = sigma * (y - x) * dt;
//     const dy = (x * (rho - z) - y) * dt;
//     const dz = (x * y - beta * z) * dt;
    
//     x += dx; y += dy; z += dz;
    
//     points.push(x * scale, y * scale, z * scale);
//   }
//   return new Float32Array(points);
// };


// const generateRosslerPoints = (numPoints) => {
//   const points = [];
//   const scale = 0.1;
//   const dt = 0.02;
  
//   let x = 1, y = 1, z = 1;
//   const a = 0.2, b = 0.2, c = 5.7;
  
//   for (let i = 0; i < numPoints; i++) {
//     const dx = (-y - z) * dt;
//     const dy = (x + a * y) * dt;
//     const dz = (b + z * (x - c)) * dt;
    
//     x += dx; y += dy; z += dz;
//     points.push(x * scale, y * scale, z * scale);
//   }
//   return new Float32Array(points);
// };

// const generateAizawaPoints = (numPoints) => {
//   const points = [];
//   const scale = 0.15;
//   const dt = 0.01;
  
//   let x = 0.1, y = 0, z = 0;
//   const a = 0.95, b = 0.7, c = 0.6, d = 3.5, e = 0.25, f = 0.1;
  
//   for (let i = 0; i < numPoints; i++) {
//     const dx = ((z - b) * x - d * y) * dt;
//     const dy = (d * x + (z - b) * y) * dt;
//     const dz = (c + a * z - (z * z * z) / 3 - (x * x + y * y) * (1 + e * z) + f * z * (x * x * x)) * dt;
    
//     x += dx; y += dy; z += dz;
//     points.push(x * scale, y * scale, z * scale);
//   }
//   return new Float32Array(points);
// };
// const generateMaurerRosePoints = (numPoints) => {
//   const points = [];
//   const scale = 0.4;
//   const n = 6; // Petals
//   const d = 71; // Step angle
  
//   for (let i = 0; i < numPoints; i++) {
//     const k = Math.floor(Math.random() * 360);
//     const theta = k * d * Math.PI / 180;
//     const r = scale * Math.sin(n * k * Math.PI / 180);
    
//     const x = r * Math.cos(theta);
//     const y = r * Math.sin(theta);
//     const z = (Math.random() - 0.5) * 0.3;
//     points.push(x, y, z);
//   }
//   return new Float32Array(points);
// };
// const generateRhodoneaPoints = (numPoints, k = 5/2) => {
//   const points = [];
//   const scale = 0.5;
  
//   for (let i = 0; i < numPoints; i++) {
//     const theta = Math.random() * 4 * Math.PI;
//     const r = scale * Math.cos(k * theta);
    
//     const x = r * Math.cos(theta);
//     const y = r * Math.sin(theta);
//     const z = (Math.random() - 0.5) * 0.2;
//     points.push(x, y, z);
//   }
//   return new Float32Array(points);
// };
// const generateKleinBottlePoints = (numPoints) => {
//   const points = [];
//   const scale = 0.3;
  
//   for (let i = 0; i < numPoints; i++) {
//     const u = Math.random() * 2 * Math.PI;
//     const v = Math.random() * 2 * Math.PI;
    
//     const x = scale * (Math.cos(u) * (Math.cos(u/2) * (Math.sqrt(2) + Math.cos(v)) + Math.sin(u/2) * Math.sin(v) * Math.cos(v)));
//     const y = scale * (Math.sin(u) * (Math.cos(u/2) * (Math.sqrt(2) + Math.cos(v)) + Math.sin(u/2) * Math.sin(v) * Math.cos(v)));
//     const z = scale * (-Math.sin(u/2) * (Math.sqrt(2) + Math.cos(v)) + Math.cos(u/2) * Math.sin(v) * Math.cos(v));
    
//     points.push(x, y, z);
//   }
//   return new Float32Array(points);
// };
// const generateTrefoilKnotPoints = (numPoints) => {
//   const points = [];
//   const scale = 0.4;
  
//   for (let i = 0; i < numPoints; i++) {
//     const t = Math.random() * 2 * Math.PI;
    
//     const x = scale * Math.sin(t) + 2 * Math.sin(2 * t);
//     const y = scale * Math.cos(t) - 2 * Math.cos(2 * t);
//     const z = scale * -Math.sin(3 * t);
    
//     points.push(x * 0.1, y * 0.1, z * 0.1);
//   }
//   return new Float32Array(points);
// };
// const generateHelicoidPoints = (numPoints) => {
//   const points = [];
//   const scale = 0.5;
  
//   for (let i = 0; i < numPoints; i++) {
//     const u = (Math.random() - 0.5) * 2;
//     const v = Math.random() * 4 * Math.PI;
    
//     const x = scale * u * Math.cos(v);
//     const y = scale * u * Math.sin(v);
//     const z = scale * v * 0.2;
    
//     points.push(x, y, z);
//   }
//   return new Float32Array(points);
// };
// const generateSierpinskiPoints = (numPoints) => {
//   const points = [];
//   const scale = 0.8;
  
//   // Three vertices of triangle
//   const vertices = [
//     [0, scale, 0],
//     [-scale * 0.866, -scale * 0.5, 0],
//     [scale * 0.866, -scale * 0.5, 0]
//   ];
  
//   let x = 0, y = 0, z = 0;
  
//   for (let i = 0; i < numPoints; i++) {
//     const vertex = vertices[Math.floor(Math.random() * 3)];
//     x = (x + vertex[0]) / 2;
//     y = (y + vertex[1]) / 2;
//     z = (z + vertex[2]) / 2 + (Math.random() - 0.5) * 0.1;
    
//     points.push(x, y, z);
//   }
//   return new Float32Array(points);
// };
// const generateDragonCurvePoints = (numPoints) => {
//   const points = [];
//   const scale = 0.02;
  
//   let sequence = "F";
//   for (let i = 0; i < 12; i++) {
//     sequence = sequence.replace(/F/g, "F+G");
//     sequence = sequence.replace(/G/g, "F-G");
//   }
  
//   let x = 0, y = 0;
//   let angle = 0;
//   let pointCount = 0;
  
//   for (let char of sequence) {
//     if (pointCount >= numPoints) break;
    
//     if (char === 'F' || char === 'G') {
//       x += Math.cos(angle) * scale;
//       y += Math.sin(angle) * scale;
//       const z = (Math.random() - 0.5) * 0.1;
//       points.push(x, y, z);
//       pointCount++;
//     } else if (char === '+') {
//       angle += Math.PI / 2;
//     } else if (char === '-') {
//       angle -= Math.PI / 2;
//     }
//   }
  
//   return new Float32Array(points);
// };
// const generateInterferencePoints = (numPoints) => {
//   const points = [];
//   const scale = 1.5;
  
//   for (let i = 0; i < numPoints; i++) {
//     const x = (Math.random() - 0.5) * scale;
//     const z = (Math.random() - 0.5) * scale;
    
//     const r1 = Math.sqrt((x - 0.3) * (x - 0.3) + z * z);
//     const r2 = Math.sqrt((x + 0.3) * (x + 0.3) + z * z);
    
//     const y = 0.1 * (Math.sin(10 * r1) + Math.sin(10 * r2));
    
//     points.push(x, y, z);
//   }
//   return new Float32Array(points);
// };
// const generateQuantumOrbitalPoints = (numPoints) => {
//   const points = [];
//   const scale = 0.8;
  
//   for (let i = 0; i < numPoints; i++) {
//     const theta = Math.random() * Math.PI;
//     const phi = Math.random() * 2 * Math.PI;
    
//     // Simplified hydrogen orbital wave function
//     const r = scale * Math.random() * Math.exp(-Math.random() * 2);
//     const probability = Math.pow(Math.cos(theta), 2);
    
//     if (Math.random() < probability) {
//       const x = r * Math.sin(theta) * Math.cos(phi);
//       const y = r * Math.sin(theta) * Math.sin(phi);
//       const z = r * Math.cos(theta);
      
//       points.push(x, y, z);
//     } else {
//       i--; // Try again
//     }
//   }
//   return new Float32Array(points);
// };
// const generateEpitrochoidPoints = (numPoints) => {
//   const points = [];
//   const R = 0.3, r = 0.1, d = 0.2;
  
//   for (let i = 0; i < numPoints; i++) {
//     const t = Math.random() * 20 * Math.PI;
    
//     const x = (R + r) * Math.cos(t) - d * Math.cos(((R + r) / r) * t);
//     const y = (R + r) * Math.sin(t) - d * Math.sin(((R + r) / r) * t);
//     const z = (Math.random() - 0.5) * 0.2;
    
//     points.push(x, y, z);
//   }
//   return new Float32Array(points);
// };
// const generateLissajous3DPoints = (numPoints) => {
//   const points = [];
//   const scale = 0.5;
//   const a = 3, b = 2, c = 1;
  
//   for (let i = 0; i < numPoints; i++) {
//     const t = Math.random() * 4 * Math.PI;
    
//     const x = scale * Math.sin(a * t + Math.PI / 2);
//     const y = scale * Math.sin(b * t);
//     const z = scale * Math.sin(c * t + Math.PI / 4);
    
//     points.push(x, y, z);
//   }
//   return new Float32Array(points);
// };


// // --------------------------------------------------------------------------trying to load all 22 functions at once 
// const vertexShader = `
//   // The shader now expects 21 target positions for 22 total shapes
//   attribute vec3 targetPosition1;
//   attribute vec3 targetPosition2;
//   attribute vec3 targetPosition3;
//   attribute vec3 targetPosition4;
//   attribute vec3 targetPosition5;
//   attribute vec3 targetPosition6;
//   attribute vec3 targetPosition7;
//   attribute vec3 targetPosition8;
//   attribute vec3 targetPosition9;
//   attribute vec3 targetPosition10;
//   attribute vec3 targetPosition11;
//   attribute vec3 targetPosition12;
//   attribute vec3 targetPosition13;
//   attribute vec3 targetPosition14;
//   attribute vec3 targetPosition15;
//   attribute vec3 targetPosition16;
//   attribute vec3 targetPosition17;
//   attribute vec3 targetPosition18;
//   attribute vec3 targetPosition19;
//   attribute vec3 targetPosition20;
//   attribute vec3 targetPosition21;

//   uniform float progress;
//   uniform float currentShape;
//   uniform float size;

//   void main() {
//     vec3 pos1;
//     vec3 pos2;

//     // Extended logic chain for 22 shapes
//     if (currentShape < 1.0) { pos1 = position; pos2 = targetPosition1; }
//     else if (currentShape < 2.0) { pos1 = targetPosition1; pos2 = targetPosition2; }
//     else if (currentShape < 3.0) { pos1 = targetPosition2; pos2 = targetPosition3; }
//     else if (currentShape < 4.0) { pos1 = targetPosition3; pos2 = targetPosition4; }
//     else if (currentShape < 5.0) { pos1 = targetPosition4; pos2 = targetPosition5; }
//     else if (currentShape < 6.0) { pos1 = targetPosition5; pos2 = targetPosition6; }
//     else if (currentShape < 7.0) { pos1 = targetPosition6; pos2 = targetPosition7; }
//     else if (currentShape < 8.0) { pos1 = targetPosition7; pos2 = targetPosition8; }
//     else if (currentShape < 9.0) { pos1 = targetPosition8; pos2 = targetPosition9; }
//     else if (currentShape < 10.0) { pos1 = targetPosition9; pos2 = targetPosition10; }
//     else if (currentShape < 11.0) { pos1 = targetPosition10; pos2 = targetPosition11; }
//     else if (currentShape < 12.0) { pos1 = targetPosition11; pos2 = targetPosition12; }
//     else if (currentShape < 13.0) { pos1 = targetPosition12; pos2 = targetPosition13; }
//     else if (currentShape < 14.0) { pos1 = targetPosition13; pos2 = targetPosition14; }
//     else if (currentShape < 15.0) { pos1 = targetPosition14; pos2 = targetPosition15; }
//     else if (currentShape < 16.0) { pos1 = targetPosition15; pos2 = targetPosition16; }
//     else if (currentShape < 17.0) { pos1 = targetPosition16; pos2 = targetPosition17; }
//     else if (currentShape < 18.0) { pos1 = targetPosition17; pos2 = targetPosition18; }
//     else if (currentShape < 19.0) { pos1 = targetPosition18; pos2 = targetPosition19; }
//     else if (currentShape < 20.0) { pos1 = targetPosition19; pos2 = targetPosition20; }
//     else if (currentShape < 21.0) { pos1 = targetPosition20; pos2 = targetPosition21; }
//     else { pos1 = targetPosition21; pos2 = position; } // Loop back to start

//     vec3 finalPosition = mix(pos1, pos2, progress);
    
//     vec4 mvPosition = modelViewMatrix * vec4(finalPosition, 1.0);
//     gl_PointSize = size;
//     gl_Position = projectionMatrix * mvPosition;
//   }
// `;

// const fragmentShader = `
//   uniform vec3 color1;
//   uniform vec3 color2;
//   uniform float progress;

//   void main() {
//     if (length(gl_PointCoord - vec2(0.5, 0.5)) > 0.475) discard;
//     vec3 finalColor = mix(color1, color2, progress);
//     gl_FragColor = vec4(finalColor, 1.0);
//   }
// `;

// // --- MAIN COMPONENT ---
// const ParticleScene = ({ setCurrentStage }) => {
//     const pointsRef = useRef();
//     const geometryRef = useRef(); // ← ADD THIS LINE
//     const [allPositions, setAllPositions] = useState([]); // ← ADD THIS LINE
//     const numPoints = 50000;
//     // --- Generate all shape data once using useMemo ---
//     useEffect(() => {
//         Promise.all([
//             fetch('/neuron_normalized_150k.bin').then(res => res.arrayBuffer()),
//             fetch('/dragon_normalized_150k.bin').then(res => res.arrayBuffer()),
//             fetch('/brain_normalized_150k.bin').then(res => res.arrayBuffer()),
//         ]).then(buffers => {
//             const loadedPositions = buffers.map(buffer => new Float32Array(buffer));
            
//             // Your existing 2 mathematical functions
//             const sinePos = generateSineWavePoints(numPoints, 4);
//             const tanPos = generateTangentWavePoints(numPoints);
            
//             // NEW: Add all 20 mathematical functions I provided
//             const sinhPos = generateSinhWavePoints(numPoints);
//             const tanhPos = generateTanhWavePoints(numPoints);
//             const spiralPos = generateLogSpiralPoints(numPoints);
//             const butterflyPos = generateButterflyPoints(numPoints);
//             const rosePos = generateRosePoints(numPoints, 7);
//             const cardioidPos = generateCardioidPoints(numPoints);
//             const torusPos = generateTorusPoints(numPoints);
//             const mobiusPos = generateMobiusPoints(numPoints);
//             const lorenzPos = generateLorenzPoints(numPoints);
//             const rosslerPos = generateRosslerPoints(numPoints);
//             const aizawaPos = generateAizawaPoints(numPoints);
//             const maurerRosePos = generateMaurerRosePoints(numPoints);
//             const rhodoneaPos = generateRhodoneaPoints(numPoints);
//             const kleinBottlePos = generateKleinBottlePoints(numPoints);
//             const trefoilPos = generateTrefoilKnotPoints(numPoints);
//             const helicoidPos = generateHelicoidPoints(numPoints);
//             const sierpinskiPos = generateSierpinskiPoints(numPoints);
//             const dragonCurvePos = generateDragonCurvePoints(numPoints);
//             const interferencePos = generateInterferencePoints(numPoints);
//             const quantumPos = generateQuantumOrbitalPoints(numPoints);
//             const epitrochoidPos = generateEpitrochoidPoints(numPoints);
//             const lissajousPos = generateLissajous3DPoints(numPoints);
            
//             // Combine all 22 positions
//             setAllPositions([
//                 ...loadedPositions,  // 3 .bin models
//                 sinePos, tanPos,     // Your existing 2
//                 sinhPos, tanhPos, spiralPos, butterflyPos, rosePos,          // 5 more
//                 cardioidPos, torusPos, mobiusPos, lorenzPos, rosslerPos,     // 5 more
//                 aizawaPos, maurerRosePos, rhodoneaPos, kleinBottlePos,       // 4 more
//                 trefoilPos, helicoidPos, sierpinskiPos, dragonCurvePos,      // 4 more
//                 interferencePos, quantumPos, epitrochoidPos, lissajousPos    // 4 more
//             ]);
//         }).catch(error => console.error("Failed to load particle data:", error));
//     }, [numPoints]);


//     const colors = useMemo(() => [
//         // Your existing 5 colors
//         new THREE.Color('#ff00ff'), // 0: Neuron (Magenta)
//         new THREE.Color('#00ffff'), // 1: Dragon (Cyan)
//         new THREE.Color('#ffff00'), // 2: Brain (Yellow)
//         new THREE.Color('#00ff00'), // 3: Sine (Green)
//         new THREE.Color('#ff7f00'), // 4: Tan (Orange)
        
//         // NEW: 17 more colors for mathematical functions
//         new THREE.Color('#ff1493'), // 5: Sinh (Deep Pink)
//         new THREE.Color('#00ced1'), // 6: Tanh (Dark Turquoise)
//         new THREE.Color('#ffd700'), // 7: Log Spiral (Gold)
//         new THREE.Color('#ff6347'), // 8: Butterfly (Tomato)
//         new THREE.Color('#32cd32'), // 9: Rose (Lime Green)
//         new THREE.Color('#ff69b4'), // 10: Cardioid (Hot Pink)
//         new THREE.Color('#1e90ff'), // 11: Torus (Dodger Blue)
//         new THREE.Color('#ff4500'), // 12: Mobius (Orange Red)
//         new THREE.Color('#9370db'), // 13: Lorenz (Medium Purple)
//         new THREE.Color('#00fa9a'), // 14: Rossler (Medium Spring Green)
//         new THREE.Color('#ff1493'), // 15: Aizawa (Deep Pink)
//         new THREE.Color('#00bfff'), // 16: Maurer Rose (Deep Sky Blue)
//         new THREE.Color('#adff2f'), // 17: Rhodonea (Green Yellow)
//         new THREE.Color('#dc143c'), // 18: Klein Bottle (Crimson)
//         new THREE.Color('#00ff7f'), // 19: Trefoil Knot (Spring Green)
//         new THREE.Color('#ff8c00'), // 20: Helicoid (Dark Orange)
//         new THREE.Color('#8a2be2'), // 21: More functions (Blue Violet)
//     ], []);

//     const uniforms = useMemo(() => ({
//         progress: { value: 0.0 },
//         currentShape: { value: 0.0 },
//         size: { value: 1.75 },
//         color1: { value: colors[0] },
//         color2: { value: colors[1] }
//     }), [colors]);
    
//     useFrame(({ clock }) => {
//         if (pointsRef.current) {
//             pointsRef.current.rotation.y += 0.002;

//             // --- Updated animation choreography for 7 shapes ---
//             const transitionDuration = 3;
//             const holdDuration = 2;
//             const numShapes = colors.length;
//             const cycleDuration = transitionDuration + holdDuration;
//             const totalCycleDuration = cycleDuration * numShapes;
            
//             const time = clock.getElapsedTime();
//             const currentPhase = Math.floor(time / cycleDuration) % numShapes;
            
//             // We can now remove the setCurrentStage logic as it's not needed for the text boxes
//             // setCurrentStage(currentPhase + 1);

//             const timeInPhase = time % cycleDuration;
//             let progress = (timeInPhase < transitionDuration) ? timeInPhase / transitionDuration : 1;
            
//             pointsRef.current.material.uniforms.currentShape.value = currentPhase;
//             pointsRef.current.material.uniforms.progress.value = progress;
            
//             const colorIndex1 = currentPhase;
//             const colorIndex2 = (currentPhase + 1) % numShapes;
//             pointsRef.current.material.uniforms.color1.value = colors[colorIndex1];
//             pointsRef.current.material.uniforms.color2.value = colors[colorIndex2];
//         }
//     });
    
//     if (allPositions.length < 22) {
//     return null;
//     }

//     return (
//     <points ref={pointsRef} position={[0, -0.2, 0]} scale={2.5} >
//         <bufferGeometry ref={geometryRef} attach="geometry">
//             {/* Original position + 21 target positions */}
//             <bufferAttribute attach="attributes-position" count={allPositions[0].length / 3} array={allPositions[0]} itemSize={3}/>
//             <bufferAttribute attach="attributes-targetPosition1" count={allPositions[1].length / 3} array={allPositions[1]} itemSize={3}/>
//             <bufferAttribute attach="attributes-targetPosition2" count={allPositions[2].length / 3} array={allPositions[2]} itemSize={3}/>
//             <bufferAttribute attach="attributes-targetPosition3" count={allPositions[3].length / 3} array={allPositions[3]} itemSize={3}/>
//             <bufferAttribute attach="attributes-targetPosition4" count={allPositions[4].length / 3} array={allPositions[4]} itemSize={3}/>
//             <bufferAttribute attach="attributes-targetPosition5" count={allPositions[5].length / 3} array={allPositions[5]} itemSize={3}/>
//             <bufferAttribute attach="attributes-targetPosition6" count={allPositions[6].length / 3} array={allPositions[6]} itemSize={3}/>
//             <bufferAttribute attach="attributes-targetPosition7" count={allPositions[7].length / 3} array={allPositions[7]} itemSize={3}/>
//             <bufferAttribute attach="attributes-targetPosition8" count={allPositions[8].length / 3} array={allPositions[8]} itemSize={3}/>
//             <bufferAttribute attach="attributes-targetPosition9" count={allPositions[9].length / 3} array={allPositions[9]} itemSize={3}/>
//             <bufferAttribute attach="attributes-targetPosition10" count={allPositions[10].length / 3} array={allPositions[10]} itemSize={3}/>
//             <bufferAttribute attach="attributes-targetPosition11" count={allPositions[11].length / 3} array={allPositions[11]} itemSize={3}/>
//             <bufferAttribute attach="attributes-targetPosition12" count={allPositions[12].length / 3} array={allPositions[12]} itemSize={3}/>
//             <bufferAttribute attach="attributes-targetPosition13" count={allPositions[13].length / 3} array={allPositions[13]} itemSize={3}/>
//             <bufferAttribute attach="attributes-targetPosition14" count={allPositions[14].length / 3} array={allPositions[14]} itemSize={3}/>
//             <bufferAttribute attach="attributes-targetPosition15" count={allPositions[15].length / 3} array={allPositions[15]} itemSize={3}/>
//             <bufferAttribute attach="attributes-targetPosition16" count={allPositions[16].length / 3} array={allPositions[16]} itemSize={3}/>
//             <bufferAttribute attach="attributes-targetPosition17" count={allPositions[17].length / 3} array={allPositions[17]} itemSize={3}/>
//             <bufferAttribute attach="attributes-targetPosition18" count={allPositions[18].length / 3} array={allPositions[18]} itemSize={3}/>
//             <bufferAttribute attach="attributes-targetPosition19" count={allPositions[19].length / 3} array={allPositions[19]} itemSize={3}/>
//             <bufferAttribute attach="attributes-targetPosition20" count={allPositions[20].length / 3} array={allPositions[20]} itemSize={3}/>
//             <bufferAttribute attach="attributes-targetPosition21" count={allPositions[21].length / 3} array={allPositions[21]} itemSize={3}/>
//         </bufferGeometry>
//         <shaderMaterial
//             attach="material"
//             vertexShader={vertexShader}
//             fragmentShader={fragmentShader}
//             uniforms={uniforms}
//             depthWrite={false}
//             blending={THREE.AdditiveBlending}
//         />
//     </points>
// );

// };

// export default ParticleScene;




// // ----------------------------------------------------------------------------scalability



import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// --- Helper functions to generate waves ---
const generateSineWavePoints = (numPoints, cycles = 2) => { // Default to 2 cycles
    const points = [];
    const width = 2.5; 
    const height = 0.5; // Reduced height to match other waves better
    for (let i = 0; i < numPoints; i++) {
        const x = (Math.random() - 0.5) * width;
        // --- FIX: Multiplied by 'cycles' to control frequency ---
        const y = Math.sin(x * Math.PI * cycles) * height;
        const z = (Math.random() - 0.5) * 0.5;
        points.push(x, y, z);
    }
    return new Float32Array(points);
};


const generateLorenzPoints = (numPoints) => {
  const points = [];
  const scale = 0.03;
  const dt = 0.01;
  
  let x = 1, y = 1, z = 1;
  const sigma = 10, rho = 28, beta = 8/3;
  
  for (let i = 0; i < numPoints; i++) {
    // Lorenz equations
    const dx = sigma * (y - x) * dt;
    const dy = (x * (rho - z) - y) * dt;
    const dz = (x * y - beta * z) * dt;
    
    x += dx; y += dy; z += dz;
    
    points.push(x * scale, y * scale, z * scale);
  }
  return new Float32Array(points);
};


const generateAizawaPoints = (numPoints) => {
  const points = [];
  const scale = 0.15;
  const dt = 0.01;
  
  let x = 0.1, y = 0, z = 0;
  const a = 0.95, b = 0.7, c = 0.6, d = 3.5, e = 0.25, f = 0.1;
  
  for (let i = 0; i < numPoints; i++) {
    const dx = ((z - b) * x - d * y) * dt;
    const dy = (d * x + (z - b) * y) * dt;
    const dz = (c + a * z - (z * z * z) / 3 - (x * x + y * y) * (1 + e * z) + f * z * (x * x * x)) * dt;
    
    x += dx; y += dy; z += dz;
    points.push(x * scale, y * scale, z * scale);
  }
  return new Float32Array(points);
};
const generateMaurerRosePoints = (numPoints) => {
  const points = [];
  const scale = 0.4;
  const n = 6; // Petals
  const d = 71; // Step angle
  
  for (let i = 0; i < numPoints; i++) {
    const k = Math.floor(Math.random() * 360);
    const theta = k * d * Math.PI / 180;
    const r = scale * Math.sin(n * k * Math.PI / 180);
    
    const x = r * Math.cos(theta);
    const y = r * Math.sin(theta);
    const z = (Math.random() - 0.5) * 0.3;
    points.push(x, y, z);
  }
  return new Float32Array(points);
};


const generateSierpinskiPoints = (numPoints) => {
  const points = [];
  const scale = 0.8;
  
  // Three vertices of triangle
  const vertices = [
    [0, scale, 0],
    [-scale * 0.866, -scale * 0.5, 0],
    [scale * 0.866, -scale * 0.5, 0]
  ];
  
  let x = 0, y = 0, z = 0;
  
  for (let i = 0; i < numPoints; i++) {
    const vertex = vertices[Math.floor(Math.random() * 3)];
    x = (x + vertex[0]) / 2;
    y = (y + vertex[1]) / 2;
    z = (z + vertex[2]) / 2 + (Math.random() - 0.5) * 0.1;
    
    points.push(x, y, z);
  }
  return new Float32Array(points);
};

const generateInterferencePoints = (numPoints) => {
  const points = [];
  const scale = 1.5;
  
  for (let i = 0; i < numPoints; i++) {
    const x = (Math.random() - 0.5) * scale;
    const z = (Math.random() - 0.5) * scale;
    
    const r1 = Math.sqrt((x - 0.3) * (x - 0.3) + z * z);
    const r2 = Math.sqrt((x + 0.3) * (x + 0.3) + z * z);
    
    const y = 0.1 * (Math.sin(10 * r1) + Math.sin(10 * r2));
    
    points.push(x, y, z);
  }
  return new Float32Array(points);
};


//----------new



const generateDadrasPoints = (numPoints) => {
  const points = [];
  const scale = 0.05;
  const dt = 0.005;
  
  let x = 1, y = 1, z = 1;
  const a = 3, b = 2.7, c = 1.7, d = 2, e = 9;
  
  for (let i = 0; i < numPoints; i++) {
    const dx = (y - a * x + b * y * z) * dt;
    const dy = (c * y - x * z + z) * dt;
    const dz = (d * x * y - e * z) * dt;
    
    x += dx; y += dy; z += dz;
    points.push(x * scale, y * scale, z * scale);
  }
  return new Float32Array(points);
};

const generateThomasPoints = (numPoints) => {
  const points = [];
  const scale = 0.5;
  const dt = 0.05;
  
  let x = 0.1, y = 0, z = 0;
  const b = 0.208186;
  
  for (let i = 0; i < numPoints; i++) {
    const dx = (Math.sin(y) - b * x) * dt;
    const dy = (Math.sin(z) - b * y) * dt;
    const dz = (Math.sin(x) - b * z) * dt;
    
    x += dx; y += dy; z += dz;
    points.push(x * scale, y * scale, z * scale);
  }
  return new Float32Array(points);
};


const generateChenPoints = (numPoints) => {
  const points = [];
  const scale = 0.04;
  const dt = 0.002;
  
  let x = 1, y = 1, z = 1;
  const a = 5, b = -10, c = -0.38;
  
  for (let i = 0; i < numPoints; i++) {
    const dx = (a * x - y * z) * dt;
    const dy = (b * y + x * z) * dt;
    const dz = (c * z + x * y / 3) * dt;
    
    x += dx; y += dy; z += dz;
    points.push(x * scale, y * scale, z * scale);
  }
  return new Float32Array(points);
};

const generateLuChenPoints = (numPoints) => {
  const points = [];
  const scale = 0.02;
  const dt = 0.001;
  
  let x = 1, y = 1, z = 1;
  const a = 36, b = 3, c = 20;
  
  for (let i = 0; i < numPoints; i++) {
    const dx = (a * (y - x)) * dt;
    const dy = (x - x * z + c * y) * dt;
    const dz = (x * y - b * z) * dt;
    
    x += dx; y += dy; z += dz;
    points.push(x * scale, y * scale, z * scale);
  }
  return new Float32Array(points);
};


const generateQiPoints = (numPoints) => {
  const points = [];
  const scale = 0.15;
  const dt = 0.01;
  
  let x = 1, y = 1, z = 1;
  const a = 50, b = 24, c = 13;
  
  for (let i = 0; i < numPoints; i++) {
    const dx = (a * (y - x) + y * z) * dt;
    const dy = (b * x + y - x * z) * dt;
    const dz = (x * y - c * z) * dt;
    
    x += dx; y += dy; z += dz;
    points.push(x * scale, y * scale, z * scale);
  }
  return new Float32Array(points);
};


// const vertexShader = `
//   attribute vec3 targetPosition1, targetPosition2, targetPosition3, targetPosition4, targetPosition5, targetPosition6,
//                  targetPosition7, targetPosition8, targetPosition9, targetPosition10, targetPosition11, targetPosition12;
//   uniform float progress, currentShape, size;
//   uniform vec2 uMouse; // <-- NEW: The mouse position uniform

//   void main() {
//     vec3 pos1, pos2;
//     if (currentShape < 1.0) { pos1 = position; pos2 = targetPosition1; }
//     else if (currentShape < 2.0) { pos1 = targetPosition1; pos2 = targetPosition2; }
//     else if (currentShape < 3.0) { pos1 = targetPosition2; pos2 = targetPosition3; }
//     else if (currentShape < 4.0) { pos1 = targetPosition3; pos2 = targetPosition4; }
//     else if (currentShape < 5.0) { pos1 = targetPosition4; pos2 = targetPosition5; }
//     else if (currentShape < 6.0) { pos1 = targetPosition5; pos2 = targetPosition6; }
//     else if (currentShape < 7.0) { pos1 = targetPosition6; pos2 = targetPosition7; }
//     else if (currentShape < 8.0) { pos1 = targetPosition7; pos2 = targetPosition8; }
//     else if (currentShape < 9.0) { pos1 = targetPosition8; pos2 = targetPosition9; }
//     else if (currentShape < 10.0) { pos1 = targetPosition9; pos2 = targetPosition10; }
//     else if (currentShape < 11.0) { pos1 = targetPosition10; pos2 = targetPosition11; }
//     else if (currentShape < 12.0) { pos1 = targetPosition11; pos2 = targetPosition12; }
//     else { pos1 = targetPosition12; pos2 = position; }


//     // First, calculate the morphed position
//     vec3 finalPosition = mix(pos1, pos2, progress);

//     // --- NEW: Add the mouse interaction effect ---
//     // Calculate the distance between the particle and the mouse
//     float dist = distance(finalPosition.xy, uMouse);
//     float radius = 0.3; // The radius of influence for the mouse
    
//     // If the particle is within the radius, apply a force
//     if (dist < radius) {
//         // The force is strongest at the center and fades to zero
//         float force = (radius - dist) / radius;
//         // Push the particle away from the mouse in the Z direction
//         finalPosition.z += force * 0.2; // 0.2 is the strength of the push
//     }
//     // --- END of mouse effect ---


//     vec4 mvPosition = modelViewMatrix * vec4(finalPosition, 1.0);
//     gl_PointSize = size;
//     gl_Position = projectionMatrix * mvPosition;
//   }
// `;

const vertexShader = `
  precision highp float;
  attribute vec3 targetPosition1, targetPosition2, targetPosition3, targetPosition4, targetPosition5, targetPosition6,
                 targetPosition7, targetPosition8, targetPosition9, targetPosition10, targetPosition11;
  uniform float progress, currentShape, size;
  uniform vec2 uMouse;

  // ✅ ADD THE SCALES ARRAY UNIFORM (The number must match the number of shapes)
  uniform float uScales[13];

  void main() {
    vec3 pos1, pos2;
    // This part is the same
    if (currentShape < 1.0) { pos1 = position; pos2 = targetPosition1; }
    else if (currentShape < 2.0) { pos1 = targetPosition1; pos2 = targetPosition2; }
    else if (currentShape < 3.0) { pos1 = targetPosition2; pos2 = targetPosition3; }
    else if (currentShape < 4.0) { pos1 = targetPosition3; pos2 = targetPosition4; }
    else if (currentShape < 5.0) { pos1 = targetPosition4; pos2 = targetPosition5; }
    else if (currentShape < 6.0) { pos1 = targetPosition5; pos2 = targetPosition6; }
    else if (currentShape < 7.0) { pos1 = targetPosition6; pos2 = targetPosition7; }
    else if (currentShape < 8.0) { pos1 = targetPosition7; pos2 = targetPosition8; }
    else if (currentShape < 9.0) { pos1 = targetPosition8; pos2 = targetPosition9; }
    else if (currentShape < 10.0) { pos1 = targetPosition9; pos2 = targetPosition10; }
    else if (currentShape < 11.0) { pos1 = targetPosition10; pos2 = targetPosition11; }
    else { pos1 = targetPosition11; pos2 = position; }

    // --- ✨ NEW SCALING LOGIC ---
    // Get the integer index for the current and next shapes
    int index1 = int(currentShape);
    int index2 = (index1 + 1) % 12; // Use modulo to wrap around from 11 to 0

    // Look up the scales from our uniform array
    float scale1 = uScales[index1];
    float scale2 = uScales[index2];

    // Apply the individual scales
    vec3 scaled_pos1 = pos1 * scale1;
    vec3 scaled_pos2 = pos2 * scale2;
    // --- END OF NEW LOGIC ---

    // Calculate the morphed position using the SCALED vectors
    vec3 finalPosition = mix(scaled_pos1, scaled_pos2, progress);

    // The mouse effect part is the same
    float dist = distance(finalPosition.xy, uMouse);
    float radius = 0.3;
    if (dist < radius) {
        float force = (radius - dist) / radius;
        finalPosition.z += force * 0.2;
    }

    vec4 mvPosition = modelViewMatrix * vec4(finalPosition, 1.0);
    gl_PointSize = size;
    gl_Position = projectionMatrix * mvPosition;
  }
`;

const fragmentShader = `
  precision highp float;
  uniform vec3 color1, color2;
  uniform float progress;
  void main() {
    if (length(gl_PointCoord - vec2(0.5, 0.5)) > 0.475) discard;
    vec3 finalColor = mix(color1, color2, progress);
    gl_FragColor = vec4(finalColor, 1.0);
  }
`;


// sine
//
// --- 3. Main React Component ---
const ParticleScene = ({ setCurrentStage }) => {
    const pointsRef = useRef();
    const [allPositions, setAllPositions] = useState([]);
    const numPoints = 45000;

    // This is your main control panel. Add or remove shapes and colors here.
    // const shapes = useMemo(() => [
    //     { name: "Brain", type: "bin", path: "/brain_normalized_150k.bin", color: new THREE.Color('#ffff00') },
    //     { name: "SineWave", type: "procedural", generator: generateSineWavePoints, color: new THREE.Color('#00ff00') },
    //     { name: "Interference", type: "procedural", generator: generateInterferencePoints, color: new THREE.Color('#00ffff'), scale: 1.5 },
    //     { name: "QuantumOrbital", type: "procedural", generator: generateThomasPoints, color: new THREE.Color('#ff7f00'), position: [0, -1, 0] },
    //     { name: "Lorenz", type: "procedural", generator: generateLorenzPoints, color: new THREE.Color('#ff4500'), scale: 1.5, position: [0, -0.5, 0] },
    //     { name: "Butterfly", type: "procedural", generator: generateChenPoints, color: new THREE.Color('#ff6347') },
    //     { name: "MaurerRose", type: "procedural", generator: generateMaurerRosePoints, color: new THREE.Color('#00bfff'), scale: 2 },
    //     { name: "Aizawa", type: "procedural", generator: generateAizawaPoints, color: new THREE.Color('#9370db'), scale: 3 },
    //     { name: "Sierpinski", type: "procedural", generator: generateSierpinskiPoints, color: new THREE.Color('#adff2f') },
    //     { name: "TrefoilKnot", type: "procedural", generator: generateLuChenPoints, color: new THREE.Color('#dc143c'), scale: 1.5 },
    //     { name: "Dadras", type: "procedural", generator: generateDadrasPoints, color: new THREE.Color('#7B68EE') , scale: 1.5},
    //     { name: "Cardioid", type: "procedural", generator: generateQiPoints, color: new THREE.Color('#FF69B4')}
    // ], []);
      const shapes = useMemo(() => [
        // --- UPDATED NAMES AND COLORS FOR THE FIRST 10 ---
        { name: "Neuron", type: "bin", path: "/brain_normalized_150k.bin", color: new THREE.Color('#00ffff') },
        { name: "Brain", type: "procedural", generator: generateSineWavePoints, color: new THREE.Color('#4d00ff') },
        { name: "SineWave", type: "procedural", generator: generateInterferencePoints, color: new THREE.Color('#ff00ff'), scale: 1.5 },
        { name: "TangentWave", type: "procedural", generator: generateThomasPoints, color: new THREE.Color('#ff0055'), position: [0, -1, 0] },
        { name: "Lorenz", type: "procedural", generator: generateLorenzPoints, color: new THREE.Color('#ff4500'), scale: 1.5, position: [0, -0.5, 0] },
        { name: "Torus", type: "procedural", generator: generateChenPoints, color: new THREE.Color('#ff7f00') },
        { name: "Mobius", type: "procedural", generator: generateMaurerRosePoints, color: new THREE.Color('#ffff00'), scale: 2 },
        { name: "Butterfly", type: "procedural", generator: generateAizawaPoints, color: new THREE.Color('#9370db'), scale: 3 },
        { name: "MaurerRose", type: "procedural", generator: generateSierpinskiPoints, color: new THREE.Color('#00ff00') },
        { name: "DeepSkyBlueShape", type: "procedural", generator: generateLuChenPoints, color: new THREE.Color('#00bfff'), scale: 1.5 },
        
        // --- REST ARE KEPT AS IS ---
        { name: "Dadras", type: "procedural", generator: generateDadrasPoints, color: new THREE.Color('#7B68EE') , scale: 1.5},
        { name: "Cardioid", type: "procedural", generator: generateQiPoints, color: new THREE.Color('#FF69B4')}
        ], []);

    useEffect(() => {
        const binFiles = shapes.filter(s => s.type === 'bin').map(s => fetch(s.path).then(res => res.arrayBuffer()));
        
        Promise.all(binFiles).then(buffers => {
            const loadedPositions = {};
            shapes.filter(s => s.type === 'bin').forEach((shape, index) => {
                loadedPositions[shape.name] = new Float32Array(buffers[index]);
            });

            const finalPositions = shapes.map(shape => {
                if (shape.type === 'bin') return loadedPositions[shape.name];
                return shape.generator(numPoints);
            });
            setAllPositions(finalPositions);
        }).catch(error => console.error("Failed to load particle data:", error));
    }, [shapes, numPoints]);

    const colors = useMemo(() => shapes.map(s => s.color), [shapes]);
    // ADD THIS LINE to create an array of scale values
    const scales = useMemo(() => shapes.map(s => s.scale || 1.0), [shapes]);

    const uniforms = useMemo(() => ({
        progress: { value: 0.0 },
        currentShape: { value: 0.0 },
        size: { value: 1.75 },
        color1: { value: colors[0] },
        color2: { value: colors[1] },
        uMouse: { value: new THREE.Vector2(0, 0) },
        uScales: { value: scales } // 
    }), [colors, scales]); // 
    
    useFrame(({ clock , mouse}) => {
        if (pointsRef.current && allPositions.length > 0) {
            pointsRef.current.rotation.y += 0.002;
            
            
            // --- NEW: Update the mouse uniform on every frame ---
            // We use .lerp() to smoothly animate the mouse position
            pointsRef.current.material.uniforms.uMouse.value.lerp(mouse, 0.1);

            const transitionDuration = 2, holdDuration = 5, numShapes = colors.length;
            const cycleDuration = transitionDuration + holdDuration;
            const totalCycleDuration = cycleDuration * numShapes;
            
            const time = clock.getElapsedTime() % totalCycleDuration;
            const currentPhase = Math.floor(time / cycleDuration);
            
            if (setCurrentStage) setCurrentStage((currentPhase % 4) + 1);

            const timeInPhase = time % cycleDuration;
            let progress = (timeInPhase < transitionDuration) ? timeInPhase / transitionDuration : 1;
            
            pointsRef.current.material.uniforms.currentShape.value = currentPhase;
            pointsRef.current.material.uniforms.progress.value = progress;
            
            const colorIndex1 = currentPhase;
            const colorIndex2 = (currentPhase + 1) % numShapes;
            pointsRef.current.material.uniforms.color1.value = colors[colorIndex1];
            pointsRef.current.material.uniforms.color2.value = colors[colorIndex2];
        }
    });
    
    if (allPositions.length < shapes.length) return null;

    return (
        <points ref={pointsRef} position={[0, 0.1, 0]} scale={1.65}>
            <bufferGeometry attach="geometry">
                <bufferAttribute attach="attributes-position" count={allPositions[0].length / 3} array={allPositions[0]} itemSize={3}/>
                <bufferAttribute attach="attributes-targetPosition1" count={allPositions[1].length / 3} array={allPositions[1]} itemSize={3}/>
                <bufferAttribute attach="attributes-targetPosition2" count={allPositions[2].length / 3} array={allPositions[2]} itemSize={3}/>
                <bufferAttribute attach="attributes-targetPosition3" count={allPositions[3].length / 3} array={allPositions[3]} itemSize={3}/>
                <bufferAttribute attach="attributes-targetPosition4" count={allPositions[4].length / 3} array={allPositions[4]} itemSize={3}/>
                <bufferAttribute attach="attributes-targetPosition5" count={allPositions[5].length / 3} array={allPositions[5]} itemSize={3}/>
                <bufferAttribute attach="attributes-targetPosition6" count={allPositions[6].length / 3} array={allPositions[6]} itemSize={3}/>
                <bufferAttribute attach="attributes-targetPosition7" count={allPositions[7].length / 3} array={allPositions[7]} itemSize={3}/>
                <bufferAttribute attach="attributes-targetPosition8" count={allPositions[8].length / 3} array={allPositions[8]} itemSize={3}/>
                <bufferAttribute attach="attributes-targetPosition9" count={allPositions[9].length / 3} array={allPositions[9]} itemSize={3}/>
                <bufferAttribute attach="attributes-targetPosition10" count={allPositions[10].length / 3} array={allPositions[10]} itemSize={3}/>
                <bufferAttribute attach="attributes-targetPosition11" count={allPositions[11].length / 3} array={allPositions[11]} itemSize={3}/>
                {/* <bufferAttribute attach="attributes-targetPosition12" count={allPositions[12].length / 3} array={allPositions[12]} itemSize={3}/> */}
            </bufferGeometry>
            <shaderMaterial
                attach="material"
                vertexShader={vertexShader}
                fragmentShader={fragmentShader}
                uniforms={uniforms}
                depthWrite={false}
                blending={THREE.AdditiveBlending}
            />
        </points>
    );
};

export default ParticleScene;