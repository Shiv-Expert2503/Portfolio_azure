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




// // ----------------------------------------------------------------------------scalability      100% working git pushed



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


// //----------new



// const generateDadrasPoints = (numPoints) => {
//   const points = [];
//   const scale = 0.05;
//   const dt = 0.005;
  
//   let x = 1, y = 1, z = 1;
//   const a = 3, b = 2.7, c = 1.7, d = 2, e = 9;
  
//   for (let i = 0; i < numPoints; i++) {
//     const dx = (y - a * x + b * y * z) * dt;
//     const dy = (c * y - x * z + z) * dt;
//     const dz = (d * x * y - e * z) * dt;
    
//     x += dx; y += dy; z += dz;
//     points.push(x * scale, y * scale, z * scale);
//   }
//   return new Float32Array(points);
// };

// const generateThomasPoints = (numPoints) => {
//   const points = [];
//   const scale = 0.5;
//   const dt = 0.05;
  
//   let x = 0.1, y = 0, z = 0;
//   const b = 0.208186;
  
//   for (let i = 0; i < numPoints; i++) {
//     const dx = (Math.sin(y) - b * x) * dt;
//     const dy = (Math.sin(z) - b * y) * dt;
//     const dz = (Math.sin(x) - b * z) * dt;
    
//     x += dx; y += dy; z += dz;
//     points.push(x * scale, y * scale, z * scale);
//   }
//   return new Float32Array(points);
// };


// const generateChenPoints = (numPoints) => {
//   const points = [];
//   const scale = 0.04;
//   const dt = 0.002;
  
//   let x = 1, y = 1, z = 1;
//   const a = 5, b = -10, c = -0.38;
  
//   for (let i = 0; i < numPoints; i++) {
//     const dx = (a * x - y * z) * dt;
//     const dy = (b * y + x * z) * dt;
//     const dz = (c * z + x * y / 3) * dt;
    
//     x += dx; y += dy; z += dz;
//     points.push(x * scale, y * scale, z * scale);
//   }
//   return new Float32Array(points);
// };

// const generateLuChenPoints = (numPoints) => {
//   const points = [];
//   const scale = 0.02;
//   const dt = 0.001;
  
//   let x = 1, y = 1, z = 1;
//   const a = 36, b = 3, c = 20;
  
//   for (let i = 0; i < numPoints; i++) {
//     const dx = (a * (y - x)) * dt;
//     const dy = (x - x * z + c * y) * dt;
//     const dz = (x * y - b * z) * dt;
    
//     x += dx; y += dy; z += dz;
//     points.push(x * scale, y * scale, z * scale);
//   }
//   return new Float32Array(points);
// };


// const generateQiPoints = (numPoints) => {
//   const points = [];
//   const scale = 0.15;
//   const dt = 0.01;
  
//   let x = 1, y = 1, z = 1;
//   const a = 50, b = 24, c = 13;
  
//   for (let i = 0; i < numPoints; i++) {
//     const dx = (a * (y - x) + y * z) * dt;
//     const dy = (b * x + y - x * z) * dt;
//     const dz = (x * y - c * z) * dt;
    
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


// // A "Seashell" or Nautilus Shape - Based on a 3D logarithmic spiral
// const generateSeashellPoints = (numPoints) => {
//     const points = [];
//     const scale = 0.1;
//     for (let i = 0; i < numPoints; i++) {
//         const theta = Math.random() * 8 * Math.PI; // How many turns
//         const phi = Math.random() * 2 * Math.PI;   // Angle around the tube
//         const radius = 0.2 * Math.exp(0.1 * theta); // Growing radius of the main spiral
//         const tubeRadius = 0.05 * Math.exp(0.08 * theta); // Growing radius of the tube
        
//         const r = radius + tubeRadius * Math.cos(phi);
//         const x = scale * r * Math.cos(theta);
//         const y = scale * r * Math.sin(theta);
//         const z = scale * tubeRadius * Math.sin(phi);
//         points.push(x, y, z);
//     }
//     return new Float32Array(points);
// };



// const generateCliffordPoints = (n) => {
//   const pts = [];
//   const a = -1.4, b = 1.6, c = 1.0, d = 0.7;   // classic “butterfly” params
//   let x = 0.1, y = 0.1;
//   const s = 0.55;                              // scene scale
//   for (let i = 0; i < n; i++) {
//     const x1 = Math.sin(a * y) + c * Math.cos(a * x);
//     const y1 = Math.sin(b * x) + d * Math.cos(b * y);
//     x = x1; y = y1;
//     pts.push(x * s, y * s, (Math.random() - .5) * .05);
//   }
//   return new Float32Array(pts);
// };



// const generateSuperformula = (n, m = 7, a=1, b=1, n1=0.3, n2=0.3, n3=0.3) => {
//   const pts = [];
//   const R = 0.5;
//   for (let i = 0; i < n; i++) {
//     const φ = (i / n) * Math.PI * 2;
//     const r = Math.pow(
//       Math.pow(Math.abs(Math.cos(m*φ/4)/a), n2) +
//       Math.pow(Math.abs(Math.sin(m*φ/4)/b), n3),
//     -1/n1);
//     const x = R * r * Math.cos(φ);
//     const y = R * r * Math.sin(φ);
//     pts.push(x, y, (Math.random()-.5)*.1);
//   }
//   return new Float32Array(pts);
// };


// const generateBarthPoints = (n) => {
//   const pts = [];
//   const φ = (1 + Math.sqrt(5)) / 2;
//   const scale = 0.8;
//   for (let i = 0; i < n; i++) {
//     const θ = (Math.random()-0.5)*Math.PI;
//     const ψ = Math.random()*2*Math.PI;
//     const r = 1.4;                       // sampling radius
//     const x = r*Math.cosθ*Math.cosψ;
//     const y = r*Math.cosθ*Math.sinψ;
//     const z = r*Math.sinθ;
//     // evaluate polynomial ≈0 surface
//     const F = ( (φ*φ)*(x*x) - y*y ) * ( (φ*φ)*(y*y) - z*z ) *
//               ( (φ*φ)*(z*z) - x*x ) + 2*(x*y*z) - ( (φ+1) );
//     if (Math.abs(F) < 0.3) pts.push(x*scale, y*scale, z*scale);
//   }
//   return new Float32Array(pts);
// };

// const generateDuffing = (n) => {
//   const pts = [];
//   let x = 1, y = 0;
//   const a = -1, b = 1, δ = 0.3, γ = 0.37, ω = 1.4;
//   const dt = 0.02, scale = 0.25;
//   for (let i = 0; i < n; i++) {
//     const t = i*dt;
//     const dx = y * dt;
//     const dy = (-δ*y - a*x - b*x*x*x + γ*Math.cos(ω*t)) * dt;
//     x += dx; y += dy;
//     pts.push(x*scale, y*scale, (Math.random()-.5)*.05);
//   }
//   return new Float32Array(pts);
// };

// const generateRennard = (n) => {
//   const pts = [];
//   const scale = 0.4;
//   for (let i = 0; i < n; i++) {
//     const t = Math.random()*2*Math.PI;
//     const r = Math.sin(4*t) + Math.cos(7*t);
//     const x = scale*r*Math.cos(t);
//     const y = scale*r*Math.sin(t);
//     pts.push(x, y, (Math.random()-.5)*.1);
//   }
//   return new Float32Array(pts);
// };

// const generateViviani = (n) => {
//   const pts = [];
//   const R = 1, a = R/2, s = 0.5;
//   for (let i = 0; i < n; i++) {
//     const t = (i/n)*2*Math.PI;
//     const x = R*(1 + Math.cos(t));
//     const y = R*Math.sin(t);
//     const z = 2*a*Math.sin(t/2);
//     pts.push(x*s, y*s, z*s);
//   }
//   return new Float32Array(pts);
// };


// const generateTornado = (n) => {
//   const pts = [];
//   const turns = 5, s = 0.35;
//   for (let i = 0; i < n; i++) {
//     const t = (i/n)*2*Math.PI*turns;
//     const k = 3;                         // number of cusps
//     const r = 0.4 + 0.02*t;              // growing radius
//     const x = (r)*(Math.cos(t) + Math.cos(k*t)/k);
//     const y = (r)*(Math.sin(t) - Math.sin(k*t)/k);
//     const z = 0.05*t;
//     pts.push(x*s, y*s, z*s);
//   }
//   return new Float32Array(pts);
// };


// const vertexShader = `
//   precision highp float;
//   // We have 1 starting position + 13 targets = 14 shapes.
//   // So we only need targetPosition1 to targetPosition13.
//   attribute vec3 targetPosition1, targetPosition2, targetPosition3, targetPosition4, targetPosition5, targetPosition6,
//                  targetPosition7, targetPosition8, targetPosition9, targetPosition10, targetPosition11, targetPosition12, targetPosition13;
//   uniform float progress, currentShape, size;
//   uniform vec2 uMouse;

//   // The array size must match the number of shapes EXACTLY.
//   uniform float uScales[14]; // ✅ CHANGED to 14

//   void main() {
//     vec3 pos1, pos2;
//     // We only go up to 13, since that's our last target attribute
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
//     else { pos1 = targetPosition13; pos2 = position; } // ✅ Last shape transitions back to first

//     // Get the integer index for the current and next shapes
//     int index1 = int(currentShape);
//     // Use modulo 14 to wrap around correctly
//     int index2 = (index1 + 1) % 14; // ✅ CHANGED to 14

//     // Look up the scales from our uniform array
//     float scale1 = uScales[index1];
//     float scale2 = uScales[index2];

//     // Apply the individual scales
//     vec3 scaled_pos1 = pos1 * scale1;
//     vec3 scaled_pos2 = pos2 * scale2;
//     // --- END OF NEW LOGIC ---

//     // Calculate the morphed position using the SCALED vectors
//     vec3 finalPosition = mix(scaled_pos1, scaled_pos2, progress);

//     // The mouse effect part is the same
//     float dist = distance(finalPosition.xy, uMouse);
//     float radius = 0.3;
//     if (dist < radius) {
//         float force = (radius - dist) / radius;
//         finalPosition.z += force * 0.2;
//     }

//     vec4 mvPosition = modelViewMatrix * vec4(finalPosition, 1.0);
//     gl_PointSize = size;
//     gl_Position = projectionMatrix * mvPosition;
//   }
// `;

// const fragmentShader = `
//   precision highp float;
//   uniform vec3 color1, color2;
//   uniform float progress;
//   void main() {
//     if (length(gl_PointCoord - vec2(0.5, 0.5)) > 0.475) discard;
//     vec3 finalColor = mix(color1, color2, progress);
//     gl_FragColor = vec4(finalColor, 1.0);
//   }
// `;


//         // { name: "SineWave", type: "procedural", generator: generateSineWavePoints, color: new THREE.Color('#4d00ff') },
//         // { name: "Interference", type: "procedural", generator: generateInterferencePoints, color: new THREE.Color('#ff00ff'), scale: 1.5 },
//         // { name: "ThomasPoint", type: "procedural", generator: generateThomasPoints, color: new THREE.Color('#ff0055'), position: [0, -1, 0] },        
//         // { name: "Rossler", type: "procedural", generator: generateRosslerPoints, color: new THREE.Color('#ff1493'), scale: 1.5 },
//         // { name: "Seashell", type: "procedural", generator: generateSeashellPoints, color: new THREE.Color('#ff4500'), scale: 4 },
//         // { name: "Lorenz", type: "procedural", generator: generateLorenzPoints, color: new THREE.Color('#ff4500'), scale: 1.5, position: [0, -0.5, 0] },
//         // { name: "Chen", type: "procedural", generator: generateChenPoints, color: new THREE.Color('#ff7f00') },
//         // { name: "MaurerRose", type: "procedural", generator: generateMaurerRosePoints, color: new THREE.Color('#ffff00'), scale: 2 },
//         // { name: "Aizawa", type: "procedural", generator: generateAizawaPoints, color: new THREE.Color('#9370db'), scale: 3 },
//         // { name: "Sierpinski", type: "procedural", generator: generateSierpinskiPoints, color: new THREE.Color('#00ff00') },
//         // { name: "LuChen", type: "procedural", generator: generateLuChenPoints, color: new THREE.Color('#00bfff'), scale: 1.5 },
//         // { name: "Dadras", type: "procedural", generator: generateDadrasPoints, color: new THREE.Color('#7B68EE') , scale: 1.5},
//         // { name: "Qi", type: "procedural", generator: generateQiPoints, color: new THREE.Color('#FF69B4')},
//         // { name: "Superformula", type: "procedural", generator: generateSuperformula, color: new THREE.Color('#8a2be2'), scale: 3 },





//         // Low priority shapes to add later
//         // { name: "Clifford", type: "procedural", generator: generateCliffordPoints, color: new THREE.Color('#00ff7f') },



// //
// // --- 3. Main React Component ---
// const ParticleScene = ({ setCurrentStage }) => {
//     const pointsRef = useRef();
//     const [allPositions, setAllPositions] = useState([]);
//     const numPoints = 150000;

//     // This is your main control panel. Add or remove shapes and colors here.
//     // const shapes = useMemo(() => [
//     //     { name: "Brain", type: "bin", path: "/brain_normalized_150k.bin", color: new THREE.Color('#ffff00') },
//     //     { name: "SineWave", type: "procedural", generator: generateSineWavePoints, color: new THREE.Color('#00ff00') },
//     //     { name: "Interference", type: "procedural", generator: generateInterferencePoints, color: new THREE.Color('#00ffff'), scale: 1.5 },
//     //     { name: "QuantumOrbital", type: "procedural", generator: generateThomasPoints, color: new THREE.Color('#ff7f00'), position: [0, -1, 0] },
//     //     { name: "Lorenz", type: "procedural", generator: generateLorenzPoints, color: new THREE.Color('#ff4500'), scale: 1.5, position: [0, -0.5, 0] },
//     //     { name: "Butterfly", type: "procedural", generator: generateChenPoints, color: new THREE.Color('#ff6347') },
//     //     { name: "MaurerRose", type: "procedural", generator: generateMaurerRosePoints, color: new THREE.Color('#00bfff'), scale: 2 },
//     //     { name: "Aizawa", type: "procedural", generator: generateAizawaPoints, color: new THREE.Color('#9370db'), scale: 3 },
//     //     { name: "Sierpinski", type: "procedural", generator: generateSierpinskiPoints, color: new THREE.Color('#adff2f') },
//     //     { name: "TrefoilKnot", type: "procedural", generator: generateLuChenPoints, color: new THREE.Color('#dc143c'), scale: 1.5 },
//     //     { name: "Dadras", type: "procedural", generator: generateDadrasPoints, color: new THREE.Color('#7B68EE') , scale: 1.5},
//     //     { name: "Cardioid", type: "procedural", generator: generateQiPoints, color: new THREE.Color('#FF69B4')}
//     // ], []);
//       const shapes = useMemo(() => [
//         // --- UPDATED NAMES AND COLORS FOR THE FIRST 10 ---
//         // { name: "Neuron", type: "bin", path: "/brain_normalized_150k.bin", color: new THREE.Color('#00ffff') },
//         { name: "SineWave", type: "procedural", generator: generateSineWavePoints, color: new THREE.Color('#4d00ff') },
//         { name: "Interference", type: "procedural", generator: generateInterferencePoints, color: new THREE.Color('#ff00ff'), scale: 1.5 },
//         { name: "Chen", type: "procedural", generator: generateChenPoints, color: new THREE.Color('#ff7f00') },
        
        
//         { name: "Rennard", type: "procedural", generator: generateRennard, color: new THREE.Color('#00ff7f'), scale: 1.5 },
//         { name: "Clifford", type: "procedural", generator: generateCliffordPoints, color: new THREE.Color('#00ff7f'), position:[-10, 0, 0] },
//         { name: "Superformula", type: "procedural", generator: generateSuperformula, color: new THREE.Color('#8a2be2'), scale: 3 },
//         { name: "Seashell", type: "procedural", generator: generateSeashellPoints, color: new THREE.Color('#ff4500'), scale: 4 },
        
//         { name: "Lorenz", type: "procedural", generator: generateLorenzPoints, color: new THREE.Color('#ff4500'), scale: 1.5, position: [0, -0.5, 0] },
//         { name: "ThomasPoint", type: "procedural", generator: generateThomasPoints, color: new THREE.Color('#ff0055'), position: [0, -1, 0] },
//         { name: "MaurerRose", type: "procedural", generator: generateMaurerRosePoints, color: new THREE.Color('#00bfff'), scale: 2 },
//         { name: "Aizawa", type: "procedural", generator: generateAizawaPoints, color: new THREE.Color('#9370db'), scale: 3, position: [-3, 0, 0] },
//         { name: "Sierpinski", type: "procedural", generator: generateSierpinskiPoints, color: new THREE.Color('#00ff00') },
//         { name: "LuChen", type: "procedural", generator: generateLuChenPoints, color: new THREE.Color('#ffff00'), scale: 1.5 },
//         { name: "Dadras", type: "procedural", generator: generateDadrasPoints, color: new THREE.Color('#7B68EE') , scale: 1.5},
//         // { name: "Qi", type: "procedural", generator: generateQiPoints, color: new THREE.Color('#FF69B4')},

//         // --- REST ARE KEPT AS IS ---
//         ], []);

//     useEffect(() => {
//         const binFiles = shapes.filter(s => s.type === 'bin').map(s => fetch(s.path).then(res => res.arrayBuffer()));
        
//         Promise.all(binFiles).then(buffers => {
//             const loadedPositions = {};
//             shapes.filter(s => s.type === 'bin').forEach((shape, index) => {
//                 loadedPositions[shape.name] = new Float32Array(buffers[index]);
//             });

//             const finalPositions = shapes.map(shape => {
//                 if (shape.type === 'bin') return loadedPositions[shape.name];
//                 return shape.generator(numPoints);
//             });
//             setAllPositions(finalPositions);
//         }).catch(error => console.error("Failed to load particle data:", error));
//     }, [shapes, numPoints]);

//     const colors = useMemo(() => shapes.map(s => s.color), [shapes]);
//     // ADD THIS LINE to create an array of scale values
//     const scales = useMemo(() => shapes.map(s => s.scale || 1.0), [shapes]);

//     const uniforms = useMemo(() => ({
//         progress: { value: 0.0 },
//         currentShape: { value: 0.0 },
//         size: { value: 1.75 },
//         color1: { value: colors[0] },
//         color2: { value: colors[1] },
//         uMouse: { value: new THREE.Vector2(0, 0) },
//         uScales: { value: scales } // 
//     }), [colors, scales]); // 
    
//     useFrame(({ clock , mouse}) => {
//         if (pointsRef.current && allPositions.length > 0) {
//             pointsRef.current.rotation.y += 0.002;
            
            
//             // --- NEW: Update the mouse uniform on every frame ---
//             // We use .lerp() to smoothly animate the mouse position
//             pointsRef.current.material.uniforms.uMouse.value.lerp(mouse, 0.1);

//             const transitionDuration = 2, holdDuration = 5, numShapes = colors.length;
//             const cycleDuration = transitionDuration + holdDuration;
//             const totalCycleDuration = cycleDuration * numShapes;
            
//             const time = clock.getElapsedTime() % totalCycleDuration;
//             const currentPhase = Math.floor(time / cycleDuration);
            
//             if (setCurrentStage) setCurrentStage((currentPhase % 4) + 1);

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
    
//     if (allPositions.length < shapes.length) return null;

//     return (
//         <points ref={pointsRef} position={[0, 0.1, 0]} scale={1.65}>
//             <bufferGeometry attach="geometry">
//                 <bufferAttribute attach="attributes-position" count={allPositions[0].length / 3} array={allPositions[0]} itemSize={3}/>
//                 <bufferAttribute attach="attributes-targetPosition1" count={allPositions[1].length / 3} array={allPositions[1]} itemSize={3}/>
//                 <bufferAttribute attach="attributes-targetPosition2" count={allPositions[2].length / 3} array={allPositions[2]} itemSize={3}/>
//                 <bufferAttribute attach="attributes-targetPosition3" count={allPositions[3].length / 3} array={allPositions[3]} itemSize={3}/>
//                 <bufferAttribute attach="attributes-targetPosition4" count={allPositions[4].length / 3} array={allPositions[4]} itemSize={3}/>
//                 <bufferAttribute attach="attributes-targetPosition5" count={allPositions[5].length / 3} array={allPositions[5]} itemSize={3}/>
//                 <bufferAttribute attach="attributes-targetPosition6" count={allPositions[6].length / 3} array={allPositions[6]} itemSize={3}/>
//                 <bufferAttribute attach="attributes-targetPosition7" count={allPositions[7].length / 3} array={allPositions[7]} itemSize={3}/>
//                 <bufferAttribute attach="attributes-targetPosition8" count={allPositions[8].length / 3} array={allPositions[8]} itemSize={3}/>
//                 <bufferAttribute attach="attributes-targetPosition9" count={allPositions[9].length / 3} array={allPositions[9]} itemSize={3}/>
//                 <bufferAttribute attach="attributes-targetPosition10" count={allPositions[10].length / 3} array={allPositions[10]} itemSize={3}/>
//                 <bufferAttribute attach="attributes-targetPosition11" count={allPositions[11].length / 3} array={allPositions[11]} itemSize={3}/>
//                 <bufferAttribute attach="attributes-targetPosition12" count={allPositions[12].length / 3} array={allPositions[12]} itemSize={3}/>
//                 <bufferAttribute attach="attributes-targetPosition13" count={allPositions[13].length / 3} array={allPositions[13]} itemSize={3}/>
//                 {/* <bufferAttribute attach="attributes-targetPosition14" count={allPositions[14].length / 3} array={allPositions[14]} itemSize={3}/> */}
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





// -------------------------------GPGPU on hold-------------------------------
// import React, { useMemo, useRef, useEffect, useState } from 'react';
// import { useFrame, createPortal } from '@react-three/fiber';
// import { useFBO } from '@react-three/drei';
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


// // const generateLorenzPoints = (numPoints) => {
// //   const points = [];
// //   const scale = 0.03;
// //   const dt = 0.01;
  
// //   let x = 1, y = 1, z = 1;
// //   const sigma = 10, rho = 28, beta = 8/3;
  
// //   for (let i = 0; i < numPoints; i++) {
// //     // Lorenz equations
// //     const dx = sigma * (y - x) * dt;
// //     const dy = (x * (rho - z) - y) * dt;
// //     const dz = (x * y - beta * z) * dt;
    
// //     x += dx; y += dy; z += dz;
    
// //     points.push(x * scale, y * scale, z * scale);
// //   }
// //   return new Float32Array(points);
// // };



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


// //----------new



// const generateDadrasPoints = (numPoints) => {
//   const points = [];
//   const scale = 0.05;
//   const dt = 0.005;
  
//   let x = 1, y = 1, z = 1;
//   const a = 3, b = 2.7, c = 1.7, d = 2, e = 9;
  
//   for (let i = 0; i < numPoints; i++) {
//     const dx = (y - a * x + b * y * z) * dt;
//     const dy = (c * y - x * z + z) * dt;
//     const dz = (d * x * y - e * z) * dt;
    
//     x += dx; y += dy; z += dz;
//     points.push(x * scale, y * scale, z * scale);
//   }
//   return new Float32Array(points);
// };

// const generateThomasPoints = (numPoints) => {
//   const points = [];
//   const scale = 0.5;
//   const dt = 0.05;
  
//   let x = 0.1, y = 0, z = 0;
//   const b = 0.208186;
  
//   for (let i = 0; i < numPoints; i++) {
//     const dx = (Math.sin(y) - b * x) * dt;
//     const dy = (Math.sin(z) - b * y) * dt;
//     const dz = (Math.sin(x) - b * z) * dt;
    
//     x += dx; y += dy; z += dz;
//     points.push(x * scale, y * scale, z * scale);
//   }
//   return new Float32Array(points);
// };


// const generateChenPoints = (numPoints) => {
//   const points = [];
//   const scale = 0.04;
//   const dt = 0.002;
  
//   let x = 1, y = 1, z = 1;
//   const a = 5, b = -10, c = -0.38;
  
//   for (let i = 0; i < numPoints; i++) {
//     const dx = (a * x - y * z) * dt;
//     const dy = (b * y + x * z) * dt;
//     const dz = (c * z + x * y / 3) * dt;
    
//     x += dx; y += dy; z += dz;
//     points.push(x * scale, y * scale, z * scale);
//   }
//   return new Float32Array(points);
// };

// const generateLuChenPoints = (numPoints) => {
//   const points = [];
//   const scale = 0.02;
//   const dt = 0.001;
  
//   let x = 1, y = 1, z = 1;
//   const a = 36, b = 3, c = 20;
  
//   for (let i = 0; i < numPoints; i++) {
//     const dx = (a * (y - x)) * dt;
//     const dy = (x - x * z + c * y) * dt;
//     const dz = (x * y - b * z) * dt;
    
//     x += dx; y += dy; z += dz;
//     points.push(x * scale, y * scale, z * scale);
//   }
//   return new Float32Array(points);
// };


// const generateQiPoints = (numPoints) => {
//   const points = [];
//   const scale = 0.15;
//   const dt = 0.01;
  
//   let x = 1, y = 1, z = 1;
//   const a = 50, b = 24, c = 13;
  
//   for (let i = 0; i < numPoints; i++) {
//     const dx = (a * (y - x) + y * z) * dt;
//     const dy = (b * x + y - x * z) * dt;
//     const dz = (x * y - c * z) * dt;
    
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


// // A "Seashell" or Nautilus Shape - Based on a 3D logarithmic spiral
// const generateSeashellPoints = (numPoints) => {
//     const points = [];
//     const scale = 0.1;
//     for (let i = 0; i < numPoints; i++) {
//         const theta = Math.random() * 8 * Math.PI; // How many turns
//         const phi = Math.random() * 2 * Math.PI;   // Angle around the tube
//         const radius = 0.2 * Math.exp(0.1 * theta); // Growing radius of the main spiral
//         const tubeRadius = 0.05 * Math.exp(0.08 * theta); // Growing radius of the tube
        
//         const r = radius + tubeRadius * Math.cos(phi);
//         const x = scale * r * Math.cos(theta);
//         const y = scale * r * Math.sin(theta);
//         const z = scale * tubeRadius * Math.sin(phi);
//         points.push(x, y, z);
//     }
//     return new Float32Array(points);
// };



// const generateCliffordPoints = (n) => {
//   const pts = [];
//   const a = -1.4, b = 1.6, c = 1.0, d = 0.7;   // classic “butterfly” params
//   let x = 0.1, y = 0.1;
//   const s = 0.55;                              // scene scale
//   for (let i = 0; i < n; i++) {
//     const x1 = Math.sin(a * y) + c * Math.cos(a * x);
//     const y1 = Math.sin(b * x) + d * Math.cos(b * y);
//     x = x1; y = y1;
//     pts.push(x * s, y * s, (Math.random() - .5) * .05);
//   }
//   return new Float32Array(pts);
// };



// const generateSuperformula = (n, m = 7, a=1, b=1, n1=0.3, n2=0.3, n3=0.3) => {
//   const pts = [];
//   const R = 0.5;
//   for (let i = 0; i < n; i++) {
//     const φ = (i / n) * Math.PI * 2;
//     const r = Math.pow(
//       Math.pow(Math.abs(Math.cos(m*φ/4)/a), n2) +
//       Math.pow(Math.abs(Math.sin(m*φ/4)/b), n3),
//     -1/n1);
//     const x = R * r * Math.cos(φ);
//     const y = R * r * Math.sin(φ);
//     pts.push(x, y, (Math.random()-.5)*.1);
//   }
//   return new Float32Array(pts);
// };


// const generateBarthPoints = (n) => {
//   const pts = [];
//   const φ = (1 + Math.sqrt(5)) / 2;
//   const scale = 0.8;
//   for (let i = 0; i < n; i++) {
//     const θ = (Math.random()-0.5)*Math.PI;
//     const ψ = Math.random()*2*Math.PI;
//     const r = 1.4;                       // sampling radius
//     const x = r*Math.cosθ*Math.cosψ;
//     const y = r*Math.cosθ*Math.sinψ;
//     const z = r*Math.sinθ;
//     // evaluate polynomial ≈0 surface
//     const F = ( (φ*φ)*(x*x) - y*y ) * ( (φ*φ)*(y*y) - z*z ) *
//               ( (φ*φ)*(z*z) - x*x ) + 2*(x*y*z) - ( (φ+1) );
//     if (Math.abs(F) < 0.3) pts.push(x*scale, y*scale, z*scale);
//   }
//   return new Float32Array(pts);
// };

// const generateDuffing = (n) => {
//   const pts = [];
//   let x = 1, y = 0;
//   const a = -1, b = 1, δ = 0.3, γ = 0.37, ω = 1.4;
//   const dt = 0.02, scale = 0.25;
//   for (let i = 0; i < n; i++) {
//     const t = i*dt;
//     const dx = y * dt;
//     const dy = (-δ*y - a*x - b*x*x*x + γ*Math.cos(ω*t)) * dt;
//     x += dx; y += dy;
//     pts.push(x*scale, y*scale, (Math.random()-.5)*.05);
//   }
//   return new Float32Array(pts);
// };

// // const generateRennard = (n) => {
// //   const pts = [];
// //   const scale = 0.4;
// //   for (let i = 0; i < n; i++) {
// //     const t = Math.random()*2*Math.PI;
// //     const r = Math.sin(4*t) + Math.cos(7*t);
// //     const x = scale*r*Math.cos(t);
// //     const y = scale*r*Math.sin(t);
// //     pts.push(x, y, (Math.random()-.5)*.1);
// //   }
// //   return new Float32Array(pts);
// // };

// // const generateViviani = (n) => {
// //   const pts = [];
// //   const R = 1, a = R/2, s = 0.5;
// //   for (let i = 0; i < n; i++) {
// //     const t = (i/n)*2*Math.PI;
// //     const x = R*(1 + Math.cos(t));
// //     const y = R*Math.sin(t);
// //     const z = 2*a*Math.sin(t/2);
// //     pts.push(x*s, y*s, z*s);
// //   }
// //   return new Float32Array(pts);
// // };


// // const generateTornado = (n) => {
// //   const pts = [];
// //   const turns = 5, s = 0.35;
// //   for (let i = 0; i < n; i++) {
// //     const t = (i/n)*2*Math.PI*turns;
// //     const k = 3;                         // number of cusps
// //     const r = 0.4 + 0.02*t;              // growing radius
// //     const x = (r)*(Math.cos(t) + Math.cos(k*t)/k);
// //     const y = (r)*(Math.sin(t) - Math.sin(k*t)/k);
// //     const z = 0.05*t;
// //     pts.push(x*s, y*s, z*s);
// //   }
// //   return new Float32Array(pts);
// // };


// // const generateLorenzPoints = (numPoints) => {
// //   const points = [];
// //   const scale = 0.03;
// //   const dt = 0.01;
  
// //   let x = 1, y = 1, z = 1;
// //   const sigma = 10, rho = 28, beta = 8/3;
  
// //   for (let i = 0; i < numPoints; i++) {
// //     // Lorenz equations
// //     const dx = sigma * (y - x) * dt;
// //     const dy = (x * (rho - z) - y) * dt;
// //     const dz = (x * y - beta * z) * dt;
    
// //     x += dx; y += dy; z += dz;
    
// //     points.push(x * scale, y * scale, z * scale);
// //   }
// //   return new Float32Array(points);
// // };


// const generateLorenzPoints = (numPoints) => {
//   // Create a fixed-size array for RGBA data
//   const points = new Float32Array(numPoints * 4);
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
    
//     // Set the 4 values directly
//     points[i * 4 + 0] = x * scale; // R (Red channel stores X)
//     points[i * 4 + 1] = y * scale; // G (Green channel stores Y)
//     points[i * 4 + 2] = z * scale; // B (Blue channel stores Z)
//     points[i * 4 + 3] = 1.0;         // A (Alpha channel)
//   }
//   // Return the typed array directly
//   return points;
// };

// const generateRennard = (n) => {
//   const pts = new Float32Array(n * 4);
//   const scale = 0.4;
//   for (let i = 0; i < n; i++) {
//     const t = Math.random() * 2 * Math.PI;
//     const r = Math.sin(4 * t) + Math.cos(7 * t);
//     const x = scale * r * Math.cos(t);
//     const y = scale * r * Math.sin(t);
    
//     pts[i * 4 + 0] = x;
//     pts[i * 4 + 1] = y;
//     pts[i * 4 + 2] = (Math.random() - 0.5) * 0.1;
//     pts[i * 4 + 3] = 1.0;
//   }
//   return pts;
// };

// const generateViviani = (n) => {
//   const pts = new Float32Array(n * 4);
//   const R = 1, a = R / 2, s = 0.5;
//   for (let i = 0; i < n; i++) {
//     const t = (i / n) * 2 * Math.PI;
//     const x = R * (1 + Math.cos(t));
//     const y = R * Math.sin(t);
//     const z = 2 * a * Math.sin(t / 2);
    
//     pts[i * 4 + 0] = x * s;
//     pts[i * 4 + 1] = y * s;
//     pts[i * 4 + 2] = z * s;
//     pts[i * 4 + 3] = 1.0;
//   }
//   return pts;
// };

// const generateTornado = (n) => {
//   const pts = new Float32Array(n * 4);
//   const turns = 5, s = 0.35;
//   for (let i = 0; i < n; i++) {
//     const t = (i / n) * 2 * Math.PI * turns;
//     const k = 3;                         // number of cusps
//     const r = 0.4 + 0.02 * t;              // growing radius
//     const x = (r) * (Math.cos(t) + Math.cos(k * t) / k);
//     const y = (r) * (Math.sin(t) - Math.sin(k * t) / k);
//     const z = 0.05 * t;
    
//     pts[i * 4 + 0] = x * s;
//     pts[i * 4 + 1] = y * s;
//     pts[i * 4 + 2] = z * s;
//     pts[i * 4 + 3] = 1.0;
//   }
//   return pts;
// };
// // =================================================================
// // --- SHADER DEFINITIONS ---
// // =================================================================

// // 1. Simulation Shader: This runs "off-screen" to calculate the next position of each particle.
// // It does the morphing and scaling.
// const simulationVertexShader = `
//   varying vec2 vUv;
//   void main() {
//     vUv = uv;
//     gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
//   }
// `;

// const simulationFragmentShader = `
//   varying vec2 vUv;
//   // Textures containing the positions for the start and end shapes of the current morph
//   uniform sampler2D uStartPositions;
//   uniform sampler2D uEndPositions;
  
//   // The individual scales for the start and end shapes
//   uniform float uStartScale;
//   uniform float uEndScale;
  
//   // The progress of the morph (0.0 to 1.0)
//   uniform float uProgress;

//   void main() {
//     // Look up the start and end positions from the textures
//     vec3 pos1 = texture2D(uStartPositions, vUv).rgb;
//     vec3 pos2 = texture2D(uEndPositions, vUv).rgb;

//     // Apply the individual scales
//     vec3 scaled_pos1 = pos1 * uStartScale;
//     vec3 scaled_pos2 = pos2 * uEndScale;
    
//     // Morph between the scaled positions
//     vec3 finalPosition = mix(scaled_pos1, scaled_pos2, uProgress);
    
//     // Write the final calculated position to the output texture
//     gl_FragColor = vec4(finalPosition, 1.0);
//   }
// `;

// // 2. Render Shader: This runs on-screen to draw the final particles.
// // It handles the mouse interaction and coloring.
// const renderVertexShader = `
//   uniform sampler2D uPositions; // The FINAL positions from the simulation
//   uniform float uSize;
//   uniform vec2 uMouse;

//   void main() {
//     // Look up the particle's position from the simulation texture
//     vec3 pos = texture2D(uPositions, uv).rgb;
    
//     // Apply mouse interaction effect
//     float dist = distance(pos.xy, uMouse);
//     float radius = 0.3; 
//     if (dist < radius) {
//         float force = (radius - dist) / radius;
//         pos.z += force * 0.2;
//     }
    
//     vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
//     gl_PointSize = uSize;
//     gl_Position = projectionMatrix * mvPosition;
//   }
// `;

// const renderFragmentShader = `
//   uniform vec3 uColor1;
//   uniform vec3 uColor2;
//   uniform float uProgress;

//   void main() {
//     // Discard the pixel if it's outside the circle, creating a round particle
//     if (length(gl_PointCoord - vec2(0.5, 0.5)) > 0.475) discard;
    
//     // Mix the colors based on the morph progress
//     vec3 finalColor = mix(uColor1, uColor2, uProgress);
//     gl_FragColor = vec4(finalColor, 1.0);
//   }
// `;


// // =================================================================
// // --- MAIN REACT COMPONENT ---
// // =================================================================
// const ParticleScene = ({ setCurrentStage }) => {
//     const pointsRef = useRef();
//     const renderMaterialRef = useRef();
//     const simulationMaterialRef = useRef();

//     // --- 1. DATA SETUP ---
//     // Use a power of 2 for texture size for performance. 256*256 = 65,536 particles
//     const textureSize = 256;
//     const numPoints = textureSize * textureSize;
    

//     // const shapes = useMemo(() => [
//     //     // Your full list of shapes goes here. Make sure they have a scale property.
//     //     { name: "Lorenz", type: "procedural", generator: generateLorenzPoints, color: new THREE.Color('#ff4500'), scale: 1.5, position: [0, -0.5, 0] },
//     //     { name: "Aizawa", type: "procedural", generator: generateAizawaPoints, color: new THREE.Color('#9370db'), scale: 3.0 },
//     //     // ... add all your other shapes here ...
//     // ], []);
//     const shapes = useMemo(() => [
//         // --- UPDATED NAMES AND COLORS FOR THE FIRST 10 ---
//         // { name: "Neuron", type: "bin", path: "/brain_normalized_150k.bin", color: new THREE.Color('#00ffff') },
//         // { name: "SineWave", type: "procedural", generator: generateSineWavePoints, color: new THREE.Color('#4d00ff') },
//         // { name: "Interference", type: "procedural", generator: generateInterferencePoints, color: new THREE.Color('#ff00ff'), scale: 1.5 },
//         // { name: "Chen", type: "procedural", generator: generateChenPoints, color: new THREE.Color('#ff7f00') },
        
        
//         // { name: "Rennard", type: "procedural", generator: generateRennard, color: new THREE.Color('#00ff7f'), scale: 1.5 },
//         // { name: "Clifford", type: "procedural", generator: generateCliffordPoints, color: new THREE.Color('#00ff7f'), position:[-10, 0, 0] },
//         // { name: "Superformula", type: "procedural", generator: generateSuperformula, color: new THREE.Color('#8a2be2'), scale: 3 },
//         // { name: "Seashell", type: "procedural", generator: generateSeashellPoints, color: new THREE.Color('#ff4500'), scale: 4 },
        
//         { name: "Lorenz", type: "procedural", generator: generateLorenzPoints, color: new THREE.Color('#ff4500'), scale: 1.5, position: [0, -0.5, 0] },
//         { name: "Rennard", type: "procedural", generator: generateRennard, color: new THREE.Color('#00ff7f'), scale: 1.5 },

//         // { name: "ThomasPoint", type: "procedural", generator: generateThomasPoints, color: new THREE.Color('#ff0055'), position: [0, -1, 0] },
//         // { name: "MaurerRose", type: "procedural", generator: generateMaurerRosePoints, color: new THREE.Color('#00bfff'), scale: 2 },
//         // { name: "Aizawa", type: "procedural", generator: generateAizawaPoints, color: new THREE.Color('#9370db'), scale: 3, position: [-3, 0, 0] },
//         // { name: "Sierpinski", type: "procedural", generator: generateSierpinskiPoints, color: new THREE.Color('#00ff00') },
//         // { name: "LuChen", type: "procedural", generator: generateLuChenPoints, color: new THREE.Color('#ffff00'), scale: 1.5 },
//         // { name: "Dadras", type: "procedural", generator: generateDadrasPoints, color: new THREE.Color('#7B68EE') , scale: 1.5},
//         // { name: "Qi", type: "procedural", generator: generateQiPoints, color: new THREE.Color('#FF69B4')},
//     ], []);

//     // Create the data textures for each shape's positions
//     const shapeTextures = useMemo(() => {
//         return shapes.map(shape => {
//             // We need to make sure the generator provides 4 values (RGBA)
//             const positions = shape.generator(numPoints);
//             // --- FIX: Change format to RGBAFormat ---
//             const texture = new THREE.DataTexture(positions, textureSize, textureSize, THREE.RGBAFormat, THREE.FloatType);
//             texture.needsUpdate = true;
//             return texture;
//         });
//     }, [shapes, numPoints, textureSize]);

//     const colors = useMemo(() => shapes.map(s => s.color), [shapes]);
//     const scales = useMemo(() => shapes.map(s => s.scale || 1.0), [shapes]);

//     // --- Create our FBO render targets ---
//     let renderTarget1 = useFBO(textureSize, textureSize, { format: THREE.RGBAFormat, type: THREE.FloatType });
//     let renderTarget2 = useFBO(textureSize, textureSize, { format: THREE.RGBAFormat, type: THREE.FloatType });
    
//     // --- Create the dummy scene for the simulation ---
//     const simulationScene = useMemo(() => new THREE.Scene(), []);
//     const simulationCamera = useMemo(() => new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1), []);

//     // --- The Main Animation Loop ---
//     useFrame(({ gl, clock, mouse }) => {
//         if (!renderMaterialRef.current || !simulationMaterialRef.current || shapeTextures.length === 0) return;

//         const time = clock.getElapsedTime();
//         const transitionDuration = 3, holdDuration = 2, numShapes = shapes.length;
//         const cycleDuration = transitionDuration + holdDuration;
//         const totalCycleDuration = cycleDuration * numShapes;
//         const cycleTime = time % totalCycleDuration;
//         const currentPhase = Math.floor(cycleTime / cycleDuration);
//         const timeInPhase = cycleTime % cycleDuration;
//         const progress = Math.min(timeInPhase / transitionDuration, 1.0);
//         const index1 = currentPhase;
//         const index2 = (currentPhase + 1) % numShapes;

//         // Update uniforms for the SIMULATION shader
//         const simUniforms = simulationMaterialRef.current.uniforms;
//         simUniforms.uStartPositions.value = shapeTextures[index1];
//         simUniforms.uEndPositions.value = shapeTextures[index2];
//         simUniforms.uStartScale.value = scales[index1];
//         simUniforms.uEndScale.value = scales[index2];
//         simUniforms.uProgress.value = progress;
        
//         // Run the GPU Simulation
//         gl.setRenderTarget(renderTarget1);
//         gl.render(simulationScene, simulationCamera);
//         gl.setRenderTarget(null);
        
//         // Update uniforms for the RENDER shader
//         const renderUniforms = renderMaterialRef.current.uniforms;
//         renderUniforms.uPositions.value = renderTarget1.texture;
//         renderUniforms.uProgress.value = progress;
//         renderUniforms.uColor1.value = colors[index1];
//         renderUniforms.uColor2.value = colors[index2];
//         renderUniforms.uMouse.value.lerp(mouse, 0.1);

//         // Ping-pong for next frame
//         [renderTarget1, renderTarget2] = [renderTarget2, renderTarget1];

//         pointsRef.current.rotation.y += 0.002;
//     });

//     if (shapeTextures.length !== shapes.length) {
//         return null; // Don't render anything until all textures are created
//     }

//     // const particleUVs = useMemo(() => {
//     //     // ... (This function is correct)
//     // }, [numPoints, textureSize]);
//     const particleUVs = useMemo(() => {

//       const uvs = new Float32Array(numPoints * 2);
//       for (let i = 0; i < textureSize; i++) {
//       for (let j = 0; j < textureSize; j++) {
//           const index = i * textureSize + j;
//           uvs[index * 2 + 0] = j / (textureSize - 1);
//           uvs[index * 2 + 1] = i / (textureSize - 1);
//       }
//   }
//       return uvs;
//     }, [numPoints, textureSize]);


//     return (
//         <>
//             {/* --- This createPortal runs our simulation off-screen --- */}
//             {createPortal(
//                 <mesh>
//                     <planeGeometry args={[2, 2]} />
//                     <shaderMaterial
//                         ref={simulationMaterialRef}
//                         vertexShader={simulationVertexShader}
//                         fragmentShader={simulationFragmentShader}
//                         uniforms={{
//                             uStartPositions: { value: null },
//                             uEndPositions: { value: null },
//                             uStartScale: { value: 1.0 },
//                             uEndScale: { value: 1.0 },
//                             uProgress: { value: 0.0 },
//                         }}
//                     />
//                 </mesh>,
//                 simulationScene
//             )}
            
//             {/* --- This is what gets rendered on-screen --- */}
//             <points ref={pointsRef}>
//                 <bufferGeometry>
//                     <bufferAttribute attach="attributes-uv" count={particleUVs.length / 2} array={particleUVs} itemSize={2} />
//                 </bufferGeometry>
//                 <shaderMaterial
//                     ref={renderMaterialRef}
//                     vertexShader={renderVertexShader}
//                     fragmentShader={renderFragmentShader}
//                     uniforms={{
//                         uPositions: { value: null },
//                         uSize: { value: 1.75 },
//                         uMouse: { value: new THREE.Vector2(0, 0) },
//                         uColor1: { value: colors[0] },
//                         uColor2: { value: colors[1] },
//                         uProgress: { value: 0.0 }
//                     }}
//                     transparent={true}
//                     blending={THREE.AdditiveBlending}
//                     depthWrite={false}
//                 />
//             </points>
//         </>
//     );
// };

// export default ParticleScene;




// ---------------------------=====================================================================///////////////GPGPU Particle Simulation with only one shape morphing

// import React, { useMemo, useRef } from 'react';
// import { useFrame, createPortal } from '@react-three/fiber';
// import { useFBO } from '@react-three/drei';
// import * as THREE from 'three';

// // --- Generator for our test shape ---
// const generateLorenzPoints = (numPoints) => {
//   const points = new Float32Array(numPoints * 4); // RGBA
//   const scale = 0.04;
//   const dt = 0.01;
//   let x = 1, y = 1, z = 1;
//   const sigma = 10, rho = 28, beta = 8/3;
//   for (let i = 0; i < numPoints; i++) {
//     const dx = sigma * (y - x) * dt;
//     const dy = (x * (rho - z) - y) * dt;
//     const dz = (x * y - beta * z) * dt;
//     x += dx; y += dy; z += dz;
//     points[i * 4 + 0] = x * scale;
//     points[i * 4 + 1] = y * scale;
//     points[i * 4 + 2] = z * scale;
//     points[i * 4 + 3] = 1.0;
//   }
//   return points;
// };

// // --- SHADERS ---
// // Simulation shader just passes data through for now
// const simulationVertexShader = `
//   varying vec2 vUv;
//   void main() { vUv = uv; gl_Position = vec4(position, 1.0); }
// `;
// const simulationFragmentShader = `
//   varying vec2 vUv;
//   uniform sampler2D uPositions;
//   void main() { gl_FragColor = texture2D(uPositions, vUv); }
// `;

// // Render shader reads from the texture and draws the points
// const renderVertexShader = `
//   uniform sampler2D uPositions;
//   uniform float uSize;
//   void main() {
//     vec3 pos = texture2D(uPositions, uv).rgb;
//     vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
//     gl_PointSize = uSize;
//     gl_Position = projectionMatrix * mvPosition;
//   }
// `;
// const renderFragmentShader = `
//   void main() {
//     if (length(gl_PointCoord - vec2(0.5, 0.5)) > 0.475) discard;
//     gl_FragColor = vec4(1.0, 0.0, 0.55, 1.0); // Hot Pink
//   }
// `;

// // --- MAIN COMPONENT ---
// const ParticleScene = () => {
//     const pointsRef = useRef();
//     const simulationMaterialRef = useRef();
//     const renderMaterialRef = useRef();
    
//     // Use a power of 2 for texture size. 256*256 = 65,536 particles
//     const textureSize = 256;
//     const numPoints = textureSize * textureSize;

//     // Create the initial data texture for our shape
//     const initialPositions = useMemo(() => generateLorenzPoints(numPoints), [numPoints]);
//     const positionsTexture = useMemo(() => {
//         const texture = new THREE.DataTexture(initialPositions, textureSize, textureSize, THREE.RGBAFormat, THREE.FloatType);
//         texture.needsUpdate = true;
//         return texture;
//     }, [initialPositions, textureSize]);

//     // These are our off-screen "canvases" for the GPU simulation
//     let renderTarget1 = useFBO(textureSize, textureSize, { format: THREE.RGBAFormat, type: THREE.FloatType });
//     let renderTarget2 = useFBO(textureSize, textureSize, { format: THREE.RGBAFormat, type: THREE.FloatType });
    
//     // A dummy scene that just contains a flat plane to run the simulation shader
//     const simulationScene = useMemo(() => new THREE.Scene(), []);
//     const simulationCamera = useMemo(() => new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1), []);

//     // The main animation loop
//     useFrame(({ gl }) => {
//         if (simulationMaterialRef.current && renderMaterialRef.current) {
//             // Set the input texture for the simulation
//             simulationMaterialRef.current.uniforms.uPositions.value = renderTarget2.texture;

//             // Run the simulation and write the result to renderTarget1
//             gl.setRenderTarget(renderTarget1);
//             gl.render(simulationScene, simulationCamera);
//             gl.setRenderTarget(null);

//             // "Ping-pong": swap the targets for the next frame
//             const temp = renderTarget1;
//             renderTarget1 = renderTarget2;
//             renderTarget2 = temp;
            
//             // Pass the final positions to the on-screen render material
//             renderMaterialRef.current.uniforms.uPositions.value = renderTarget1.texture;
            
//             pointsRef.current.rotation.y += 0.002;
//         }
//     });

//     // This creates the UV map needed to look up data from the textures
//     const particleUVs = useMemo(() => {
//         const uvs = new Float32Array(numPoints * 2);
//         for (let i = 0; i < textureSize; i++) {
//             for (let j = 0; j < textureSize; j++) {
//                 const index = i * textureSize + j;
//                 uvs[index * 2 + 0] = j / (textureSize - 1);
//                 uvs[index * 2 + 1] = i / (textureSize - 1);
//             }
//         }
//         return uvs;
//     }, [numPoints, textureSize]);

//     return (
//         <>
//             {/* This runs our simulation off-screen. It is never visible. */}
//             {createPortal(
//                 <mesh>
//                     <planeGeometry args={[2, 2]} />
//                     <shaderMaterial
//                         ref={simulationMaterialRef}
//                         vertexShader={simulationVertexShader}
//                         fragmentShader={simulationFragmentShader}
//                         uniforms={{ uPositions: { value: positionsTexture } }}
//                     />
//                 </mesh>,
//                 simulationScene
//             )}
            
//             {/* This is what gets rendered on-screen */}
//             <points ref={pointsRef}scale={20}>
//                 <bufferGeometry>
//                     <bufferAttribute attach="attributes-uv" count={particleUVs.length / 2} array={particleUVs} itemSize={2} />
//                 </bufferGeometry>
//                 <shaderMaterial
//                     ref={renderMaterialRef}
//                     vertexShader={renderVertexShader}
//                     fragmentShader={renderFragmentShader}
//                     uniforms={{
//                         uPositions: { value: positionsTexture },
//                         uSize: { value: 1.5 },
//                         uMouse: { value: new THREE.Vector2(0, 0) },
//                     }}
//                     transparent={true}
//                     blending={THREE.AdditiveBlending}
//                     depthWrite={false}
//                 />
//             </points>
//         </>
//     );
// };

// export default ParticleScene;


// perplexity ai -----------> working but slow and error at end of the animation

// import React, { useMemo, useRef } from 'react';
// import { useFrame, createPortal } from '@react-three/fiber';
// import { useFBO } from '@react-three/drei';
// import * as THREE from 'three';

// // --- Generator for our test shape ---
// const generateLorenzPoints = (numPoints) => {
//   const points = new Float32Array(numPoints * 4); // RGBA
//   const scale = 0.04;
//   const dt = 0.01;
//   let x = 1, y = 1, z = 1;
//   const sigma = 10, rho = 28, beta = 8/3;
  
//   for (let i = 0; i < numPoints; i++) {
//     const dx = sigma * (y - x) * dt;
//     const dy = (x * (rho - z) - y) * dt;
//     const dz = (x * y - beta * z) * dt;
//     x += dx; y += dy; z += dz;
    
//     points[i * 4 + 0] = x * scale;
//     points[i * 4 + 1] = y * scale;
//     points[i * 4 + 2] = z * scale;
//     points[i * 4 + 3] = 1.0;
//   }
//   return points;
// };

// // --- SIMULATION SHADERS ---
// const simulationVertexShader = `
//   varying vec2 vUv;
//   void main() {
//     vUv = uv;
//     gl_Position = vec4(position, 1.0);
//   }
// `;

// const simulationFragmentShader = `
//   varying vec2 vUv;
//   uniform sampler2D uPositions;
//   uniform float uTime;
  
//   void main() {
//     vec4 position = texture2D(uPositions, vUv);
    
//     // For now, just pass through the position (no animation yet)
//     // Later you can add morphing logic here
    
//     gl_FragColor = position;
//   }
// `;

// // --- RENDER SHADERS ---
// const renderVertexShader = `
//   uniform sampler2D uPositions;
//   uniform float uSize;
  
//   void main() {
//     // Get position from texture using UV coordinates
//     vec3 pos = texture2D(uPositions, uv).rgb;
    
//     vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
//     gl_PointSize = uSize;
//     gl_Position = projectionMatrix * mvPosition;
//   }
// `;

// const renderFragmentShader = `
//   void main() {
//     if (length(gl_PointCoord - vec2(0.5, 0.5)) > 0.475) discard;
//     gl_FragColor = vec4(1.0, 0.0, 0.55, 1.0); // Hot Pink
//   }
// `;

// // --- MAIN COMPONENT ---
// const ParticleScene = () => {
//     const pointsRef = useRef();
//     const simulationMaterialRef = useRef();
//     const renderMaterialRef = useRef();
    
//     // Use a smaller texture for testing first
//     const textureSize = 256; // 128*128 = 16,384 particles
//     const numPoints = textureSize * textureSize;

//     // Create initial data texture
//     const initialData = useMemo(() => generateLorenzPoints(numPoints), [numPoints]);
    
//     const initialTexture = useMemo(() => {
//         const texture = new THREE.DataTexture(
//             initialData, 
//             textureSize, 
//             textureSize, 
//             THREE.RGBAFormat, 
//             THREE.FloatType
//         );
//         texture.needsUpdate = true;
//         texture.magFilter = THREE.NearestFilter;
//         texture.minFilter = THREE.NearestFilter;
//         return texture;
//     }, [initialData, textureSize]);

//     // Create render targets for ping-pong
//     const renderTarget1 = useFBO(textureSize, textureSize, {
//         format: THREE.RGBAFormat,
//         type: THREE.FloatType,
//         magFilter: THREE.NearestFilter,
//         minFilter: THREE.NearestFilter,
//     });
    
//     const renderTarget2 = useFBO(textureSize, textureSize, {
//         format: THREE.RGBAFormat,
//         type: THREE.FloatType,
//         magFilter: THREE.NearestFilter,
//         minFilter: THREE.NearestFilter,
//     });

//     // Keep track of current/previous targets
//     const targets = useRef({ current: renderTarget1, previous: renderTarget2 });

//     // Simulation scene
//     const simulationScene = useMemo(() => new THREE.Scene(), []);
//     const simulationCamera = useMemo(() => new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1), []);

//     // Initialize render targets with initial data
//     const initialized = useRef(false);

//     // Create particle geometry with positions and UVs
//     const particleGeometry = useMemo(() => {
//         const geometry = new THREE.BufferGeometry();
        
//         // Create positions (will be overridden by shader, but needed for Three.js)
//         const positions = new Float32Array(numPoints * 3);
        
//         // Create UV coordinates for texture lookup
//         const uvs = new Float32Array(numPoints * 2);
        
//         for (let i = 0; i < textureSize; i++) {
//             for (let j = 0; j < textureSize; j++) {
//                 const index = i * textureSize + j;
                
//                 // Position (placeholder - will be set by shader)
//                 positions[index * 3 + 0] = 0;
//                 positions[index * 3 + 1] = 0;
//                 positions[index * 3 + 2] = 0;
                
//                 // UV coordinates for texture lookup
//                 uvs[index * 2 + 0] = j / (textureSize - 1);
//                 uvs[index * 2 + 1] = i / (textureSize - 1);
//             }
//         }
        
//         geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
//         geometry.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
        
//         return geometry;
//     }, [numPoints, textureSize]);

//     useFrame(({ gl, clock }) => {
//         // Initialize render targets on first frame
//         if (!initialized.current && simulationMaterialRef.current) {
//             // Copy initial data to both render targets
//             simulationMaterialRef.current.uniforms.uPositions.value = initialTexture;
            
//             // Render to target1
//             gl.setRenderTarget(targets.current.current);
//             gl.render(simulationScene, simulationCamera);
            
//             // Render to target2  
//             gl.setRenderTarget(targets.current.previous);
//             gl.render(simulationScene, simulationCamera);
            
//             gl.setRenderTarget(null);
//             initialized.current = true;
//             return;
//         }

//         if (simulationMaterialRef.current && renderMaterialRef.current && initialized.current) {
//             // Update simulation uniforms
//             simulationMaterialRef.current.uniforms.uTime.value = clock.elapsedTime;
//             simulationMaterialRef.current.uniforms.uPositions.value = targets.current.previous.texture;

//             // Run simulation (write to current target)
//             gl.setRenderTarget(targets.current.current);
//             gl.render(simulationScene, simulationCamera);
//             gl.setRenderTarget(null);

//             // Update render material with current positions
//             renderMaterialRef.current.uniforms.uPositions.value = targets.current.current.texture;

//             // Swap targets for next frame
//             const temp = targets.current.current;
//             targets.current.current = targets.current.previous;
//             targets.current.previous = temp;

//             // Rotate for visual effect
//             if (pointsRef.current) {
//                 pointsRef.current.rotation.y += 0.002;
//             }
//         }
//     });

//     return (
//         <>
//             {/* Off-screen simulation */}
//             {createPortal(
//                 <mesh>
//                     <planeGeometry args={[2, 2]} />
//                     <shaderMaterial
//                         ref={simulationMaterialRef}
//                         vertexShader={simulationVertexShader}
//                         fragmentShader={simulationFragmentShader}
//                         uniforms={{
//                             uPositions: { value: initialTexture },
//                             uTime: { value: 0 }
//                         }}
//                     />
//                 </mesh>,
//                 simulationScene
//             )}
            
//             {/* On-screen particles */}
//             <points ref={pointsRef} scale={15}>
//                 <bufferGeometry attach="geometry" {...particleGeometry} />
//                 <shaderMaterial
//                     ref={renderMaterialRef}
//                     vertexShader={renderVertexShader}
//                     fragmentShader={renderFragmentShader}
//                     uniforms={{
//                         uPositions: { value: initialTexture },
//                         uSize: { value: 2.0 }
//                     }}
//                     transparent={true}
//                     blending={THREE.AdditiveBlending}
//                     depthWrite={false}
//                 />
//             </points>
//         </>
//     );
// };

// export default ParticleScene;


// =========================================================== sine wave working but only 1 dot is visible
// import React, { useMemo, useRef, useEffect } from 'react';
// import { useFrame } from '@react-three/fiber';
// import { useFBO } from '@react-three/drei';
// import * as THREE from 'three';

// // --- ✅ UPDATED SINE WAVE GENERATOR (RGBA FORMAT) ---
// const generateSineWavePoints = (numPoints, cycles = 4) => {
//     const points = new Float32Array(numPoints * 4);
//     const width = 4.0;    // ✅ Increased width
//     const height = 1.0;   // ✅ Increased height
    
//     for (let i = 0; i < numPoints; i++) {
//         // ✅ ORDERED X positions instead of random
//         const t = (i / numPoints) * width - (width / 2); // -2 to +2
//         const x = t;
//         const y = Math.sin(x * Math.PI * cycles / width) * height;
//         const z = (Math.random() - 0.5) * 0.2; // ✅ Reduced Z scatter
        
//         points[i * 4 + 0] = x;
//         points[i * 4 + 1] = y;
//         points[i * 4 + 2] = z;
//         points[i * 4 + 3] = 1.0;
//     }
//     return points;
// };

// // --- SHADERS (Same as before) ---
// const simulationVertexShader = `
//   varying vec2 vUv;
//   void main() {
//     vUv = uv;
//     gl_Position = vec4(position, 1.0);
//   }
// `;

// const simulationFragmentShader = `
//   varying vec2 vUv;
//   uniform sampler2D uPositions;
//   uniform float uTime;
  
//   void main() {
//     vec4 position = texture2D(uPositions, vUv);
    
//     // Add gentle wave motion to the sine wave
//     position.y += sin(uTime * 1.5 + position.x * 3.0) * 0.01;
//     position.z += cos(uTime * 1.0 + position.x * 2.0) * 0.005;
    
//     gl_FragColor = position;
//   }
// `;

// const renderVertexShader = `
//   uniform sampler2D uPositions;
//   uniform float uSize;
  
//   void main() {
//     vec3 pos = texture2D(uPositions, uv).rgb;
//     vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
//     gl_PointSize = uSize;
//     gl_Position = projectionMatrix * mvPosition;
//   }
// `;

// const renderFragmentShader = `
//   void main() {
//     if (length(gl_PointCoord - vec2(0.5, 0.5)) > 0.475) discard;
//     gl_FragColor = vec4(0.0, 1.0, 0.0, 1.0); // ✅ Green color for sine wave
//   }
// `;

// // --- MAIN COMPONENT ---
// const ParticleScene = () => {
//     const pointsRef = useRef();
//     const renderMaterialRef = useRef();
    
//     const textureSize = 256;
//     const numPoints = textureSize * textureSize;

//     // ✅ CREATE RENDER TARGETS
//     const renderTargetA = useFBO(textureSize, textureSize, {
//         format: THREE.RGBAFormat,
//         type: THREE.FloatType,
//         magFilter: THREE.NearestFilter,
//         minFilter: THREE.NearestFilter,
//     });
    
//     const renderTargetB = useFBO(textureSize, textureSize, {
//         format: THREE.RGBAFormat,
//         type: THREE.FloatType,
//         magFilter: THREE.NearestFilter,
//         minFilter: THREE.NearestFilter,
//     });

//     // ✅ SIMULATION SCENE WITH SINE WAVE DATA
//     const simulationScene = useMemo(() => {
//         const scene = new THREE.Scene();
        
//         const geometry = new THREE.PlaneGeometry(2, 2);
//         const material = new THREE.ShaderMaterial({
//             vertexShader: simulationVertexShader,
//             fragmentShader: simulationFragmentShader,
//             uniforms: {
//                 uPositions: { value: null },
//                 uTime: { value: 0 }
//             }
//         });
        
//         const mesh = new THREE.Mesh(geometry, material);
//         scene.add(mesh);
        
//         return { scene, mesh };
//     }, []);
    
//     const simulationCamera = useMemo(() => new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1), []);

//     // ✅ SINE WAVE INITIAL TEXTURE
//     const initialTexture = useMemo(() => {
//         const data = generateSineWavePoints(numPoints, 4); // 4 cycles for more detail
//         const texture = new THREE.DataTexture(
//             data, 
//             textureSize, 
//             textureSize, 
//             THREE.RGBAFormat, 
//             THREE.FloatType
//         );
//         texture.needsUpdate = true;
//         texture.magFilter = THREE.NearestFilter;
//         texture.minFilter = THREE.NearestFilter;
//         return texture;
//     }, [numPoints, textureSize]);

//     // ✅ PARTICLE GEOMETRY
//     const particleGeometry = useMemo(() => {
//         const geometry = new THREE.BufferGeometry();
        
//         const positions = new Float32Array(numPoints * 3);
//         const uvs = new Float32Array(numPoints * 2);
        
//         let index = 0;
//         for (let i = 0; i < textureSize; i++) {
//             for (let j = 0; j < textureSize; j++) {
//                 positions[index * 3] = 0;
//                 positions[index * 3 + 1] = 0;
//                 positions[index * 3 + 2] = 0;
                
//                 uvs[index * 2] = j / (textureSize - 1);
//                 uvs[index * 2 + 1] = i / (textureSize - 1);
                
//                 index++;
//             }
//         }
        
//         geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
//         geometry.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
        
//         return geometry;
//     }, [numPoints, textureSize]);

//     // ✅ PING-PONG STATE
//     const currentTarget = useRef(0);

//     // ✅ INITIALIZE BOTH TARGETS
//     useEffect(() => {
//         if (!simulationScene) return;
        
//         const gl = renderTargetA.texture.source.data ? window.gl : null;
//         if (!gl) return;

//         simulationScene.mesh.material.uniforms.uPositions.value = initialTexture;
        
//         gl.setRenderTarget(renderTargetA);
//         gl.clear();
//         gl.render(simulationScene.scene, simulationCamera);
        
//         gl.setRenderTarget(renderTargetB);
//         gl.clear();
//         gl.render(simulationScene.scene, simulationCamera);
        
//         gl.setRenderTarget(null);
        
//         console.log("GPGPU Sine Wave initialized");
//     }, [simulationScene, simulationCamera, initialTexture, renderTargetA, renderTargetB]);

//     useFrame(({ gl, clock }) => {
//         if (!simulationScene?.mesh || !renderMaterialRef.current) return;
        
//         // ✅ PING-PONG LOGIC
//         const readTarget = currentTarget.current === 0 ? renderTargetA : renderTargetB;
//         const writeTarget = currentTarget.current === 0 ? renderTargetB : renderTargetA;

//         // ✅ UPDATE SIMULATION
//         simulationScene.mesh.material.uniforms.uPositions.value = readTarget.texture;
//         simulationScene.mesh.material.uniforms.uTime.value = clock.elapsedTime;

//         // ✅ RENDER TO WRITE TARGET
//         gl.setRenderTarget(writeTarget);
//         gl.clear();
//         gl.render(simulationScene.scene, simulationCamera);
//         gl.setRenderTarget(null);

//         // ✅ UPDATE RENDER MATERIAL
//         renderMaterialRef.current.uniforms.uPositions.value = writeTarget.texture;

//         // ✅ SWAP TARGETS
//         currentTarget.current = 1 - currentTarget.current;

//         // Visual rotation
//         if (pointsRef.current) {
//             pointsRef.current.rotation.y += 0.005;
//         }
//     });

//     return (
//     <points ref={pointsRef} scale={1} position={[0, 0, 0]}> {/* ✅ Reduced scale */}
//         <bufferGeometry attach="geometry" {...particleGeometry} />
//         <shaderMaterial
//             ref={renderMaterialRef}
//             vertexShader={renderVertexShader}
//             fragmentShader={renderFragmentShader}
//             uniforms={{
//                 uPositions: { value: initialTexture },
//                 uSize: { value: 8.0 } // ✅ Larger point size for visibility
//             }}
//             transparent={true}
//             blending={THREE.AdditiveBlending}
//             depthWrite={false}
//         />
//     </points>
// );

// };

// export default ParticleScene;




// --------------------------------------------------------------------->gemeini no errors and no visible particles 
// import React, { useState, useEffect, useMemo, useRef } from 'react';
// import { useFrame, createPortal } from '@react-three/fiber';
// import { useFBO } from '@react-three/drei';
// import * as THREE from 'three';

// // --- 1. All Generator Functions ---
// const generateLorenzPoints = (numPoints) => {
//   const points = new Float32Array(numPoints * 4);
//   const scale = 0.03; const dt = 0.01;
//   let x = 1, y = 1, z = 1;
//   const sigma = 10, rho = 28, beta = 8/3;
//   for (let i = 0; i < numPoints; i++) {
//     const dx = sigma * (y - x) * dt;
//     const dy = (x * (rho - z) - y) * dt;
//     const dz = (x * y - beta * z) * dt;
//     x += dx; y += dy; z += dz;
//     points[i * 4 + 0] = x * scale;
//     points[i * 4 + 1] = y * scale;
//     points[i * 4 + 2] = z * scale;
//     points[i * 4 + 3] = 1.0;
//   }
//   return points;
// };
// const generateRennard = (numPoints) => {
//   const points = new Float32Array(numPoints * 4);
//   const scale = 0.4;
//   for (let i = 0; i < numPoints; i++) {
//     const t = Math.random() * 2 * Math.PI;
//     const r = Math.sin(4 * t) + Math.cos(7 * t);
//     const x = scale * r * Math.cos(t);
//     const y = scale * r * Math.sin(t);
//     points[i * 4 + 0] = x;
//     points[i * 4 + 1] = y;
//     points[i * 4 + 2] = (Math.random() - 0.5) * 0.1;
//     points[i * 4 + 3] = 1.0;
//   }
//   return points;
// };
// // ... (Include all your other generator functions here)

// // --- 2. Shader Definitions ---
// const simulationVertexShader = `
//   varying vec2 vUv;
//   void main() {
//     vUv = uv;
//     gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
//   }
// `;
// const simulationFragmentShader = `
//   varying vec2 vUv;
//   uniform sampler2D uStartPositions;
//   uniform sampler2D uEndPositions;
//   uniform float uStartScale;
//   uniform float uEndScale;
//   uniform float uProgress;

//   void main() {
//     vec3 pos1 = texture2D(uStartPositions, vUv).rgb;
//     vec3 pos2 = texture2D(uEndPositions, vUv).rgb;
//     vec3 scaled_pos1 = pos1 * uStartScale;
//     vec3 scaled_pos2 = pos2 * uEndScale;
//     vec3 finalPosition = mix(scaled_pos1, scaled_pos2, uProgress);
//     gl_FragColor = vec4(finalPosition, 1.0);
//   }
// `;
// const renderVertexShader = `
//   uniform sampler2D uPositions;
//   uniform float uSize;
//   uniform vec2 uMouse;

//   void main() {
//     vec3 pos = texture2D(uPositions, uv).rgb;
//     float dist = distance(pos.xy, uMouse);
//     float radius = 0.3; 
//     if (dist < radius) {
//         float force = (radius - dist) / radius;
//         pos.z += force * 0.2;
//     }
//     vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
//     gl_PointSize = uSize;
//     gl_Position = projectionMatrix * mvPosition;
//   }
// `;
// const renderFragmentShader = `
//   uniform vec3 uColor1;
//   uniform vec3 uColor2;
//   uniform float uProgress;
//   void main() {
//     if (length(gl_PointCoord - vec2(0.5, 0.5)) > 0.475) discard;
//     vec3 finalColor = mix(uColor1, uColor2, uProgress);
//     gl_FragColor = vec4(finalColor, 1.0);
//   }
// `;


// // --- 3. Main React Component ---
// const ParticleScene = ({ setCurrentStage }) => {
//     const pointsRef = useRef();
//     const renderMaterialRef = useRef();
//     const simulationMaterialRef = useRef();
    
//     const textureSize = 256;
//     const numPoints = textureSize * textureSize;

    
//     const shapes = useMemo(() => [
//         { name: "Rennard", type: "procedural", generator: generateRennard, color: new THREE.Color('#00ff7f'), scale: 1.5 },
//         { name: "Lorenz", type: "procedural", generator: generateLorenzPoints, color: new THREE.Color('#ff4500'), scale: 1.5, position: [0, -0.5, 0] },
//     ], []);

//     const shapeTextures = useMemo(() => {
//         if (shapes.length === 0) return [];
//         return shapes.map(shape => {
//             const positions = shape.generator(numPoints);
//             const texture = new THREE.DataTexture(positions, textureSize, textureSize, THREE.RGBAFormat, THREE.FloatType);
//             texture.needsUpdate = true;
//             return texture;
//         });
//     }, [shapes, numPoints, textureSize]);

//     const colors = useMemo(() => shapes.map(s => s.color), [shapes]);
//     const scales = useMemo(() => shapes.map(s => s.scale || 1.0), [shapes]);

//     let renderTarget1 = useFBO(textureSize, textureSize, { format: THREE.RGBAFormat, type: THREE.FloatType });
//     let renderTarget2 = useFBO(textureSize, textureSize, { format: THREE.RGBAFormat, type: THREE.FloatType });
    
//     const { scene, camera } = useMemo(() => {
//         const scene = new THREE.Scene();
//         const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
//         return { scene, camera };
//     }, []);

//     const particleUVs = useMemo(() => {
//         const uvs = new Float32Array(numPoints * 2);
//         for (let i = 0; i < textureSize; i++) {
//             for (let j = 0; j < textureSize; j++) {
//                 const index = i * textureSize + j;
//                 uvs[index * 2 + 0] = j / (textureSize - 1);
//                 uvs[index * 2 + 1] = i / (textureSize - 1);
//             }
//         }
//         return uvs;
//     }, [numPoints, textureSize]);

//     // This guard clause is very important now
//     if (shapeTextures.length === 0) {
//         return null;
//     }

//     useFrame(({ gl, clock, mouse }) => {
//         if (!renderMaterialRef.current || !simulationMaterialRef.current || shapeTextures.length === 0) return;

//         const transitionDuration = 2, holdDuration = 5, numShapes = shapes.length;
//         const cycleDuration = transitionDuration + holdDuration;
//         const totalCycleDuration = cycleDuration * numShapes;
        
//         const time = clock.getElapsedTime() % totalCycleDuration;
//         const currentPhase = Math.floor(time / cycleDuration);
        
//         const timeInPhase = time % cycleDuration;
//         const progress = (timeInPhase < transitionDuration) ? timeInPhase / transitionDuration : 1;

//         const index1 = currentPhase;
//         const index2 = (currentPhase + 1) % numShapes;

//         const simUniforms = simulationMaterialRef.current.uniforms;
//         simUniforms.uStartPositions.value = shapeTextures[index1];
//         simUniforms.uEndPositions.value = shapeTextures[index2];
//         simUniforms.uStartScale.value = scales[index1];
//         simUniforms.uEndScale.value = scales[index2];
//         simUniforms.uProgress.value = progress;

//         gl.setRenderTarget(renderTarget1);
//         gl.render(scene, camera);
//         gl.setRenderTarget(null);

//         const renderUniforms = renderMaterialRef.current.uniforms;
//         renderUniforms.uPositions.value = renderTarget1.texture;
//         renderUniforms.uProgress.value = progress;
//         renderUniforms.uColor1.value = colors[index1];
//         renderUniforms.uColor2.value = colors[index2];
//         renderUniforms.uMouse.value.lerp(mouse, 0.1);

//         [renderTarget1, renderTarget2] = [renderTarget2, renderTarget1];

//         pointsRef.current.rotation.y += 0.002;
//     });

//     return (
//         <points ref={pointsRef}>
//             <bufferGeometry>
//                 <bufferAttribute attach="attributes-uv" count={particleUVs.length / 2} array={particleUVs} itemSize={2} />
//             </bufferGeometry>
//             <shaderMaterial
//                 ref={renderMaterialRef}
//                 vertexShader={renderVertexShader}
//                 fragmentShader={renderFragmentShader}
//                 uniforms={{
//                     uPositions: { value: shapeTextures[0] },
//                     uSize: { value: 1.75 },
//                     uMouse: { value: new THREE.Vector2(0, 0) },
//                     uColor1: { value: colors[0] },
//                     uColor2: { value: colors[1] },
//                     uProgress: { value: 0.0 }
//                 }}
//                 transparent={true}
//                 blending={THREE.AdditiveBlending}
//                 depthWrite={false}
//             />
//         </points>
//     );
// };

// export default ParticleScene;


// -----------------------------------------------basic GPGPU working 100% with no errors for one shape
// import React, { useMemo, useRef } from 'react';
// import { useFrame } from '@react-three/fiber';
// import * as THREE from 'three';

// // --- Generator Function (outputs 3 values: X, Y, Z) ---
// const generateLorenzPoints = (numPoints) => {
//   const points = new Float32Array(numPoints * 3); // Create array for XYZ
//   const scale = 0.04;
//   const dt = 0.01;
//   let x = 1, y = 1, z = 1;
//   const sigma = 10, rho = 28, beta = 8/3;
  
//   for (let i = 0; i < numPoints; i++) {
//     const dx = sigma * (y - x) * dt;
//     const dy = (x * (rho - z) - y) * dt;
//     const dz = (x * y - beta * z) * dt;
//     x += dx; y += dy; z += dz;
    
//     // Set the 3 values directly
//     points[i * 3 + 0] = x * scale;
//     points[i * 3 + 1] = y * scale;
//     points[i * 3 + 2] = z * scale;
//   }
//   return points;
// };

// // --- Simple Shaders for Rendering ---
// const vertexShader = `
//   uniform float uSize;
//   void main() {
//     vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
//     gl_PointSize = uSize;
//     gl_Position = projectionMatrix * mvPosition;
//   }
// `;
// const fragmentShader = `
//   void main() {
//     if (length(gl_PointCoord - vec2(0.5, 0.5)) > 0.475) discard;
//     gl_FragColor = vec4(1.0, 0.0, 0.55, 1.0); // Hot Pink
//   }
// `;

// // --- MAIN COMPONENT ---
// const ParticleScene = () => {
//     const pointsRef = useRef();
//     const numPoints = 65536; // 256*256

//     // Generate the positions directly and only once
//     const positions = useMemo(() => generateLorenzPoints(numPoints), [numPoints]);

//     // Simple rotation animation
//     useFrame(() => {
//         if (pointsRef.current) {
//             pointsRef.current.rotation.y += 0.002;
//             pointsRef.current.rotation.x += 0.001;
//         }
//     });

//     return (
//         <points ref={pointsRef}>
//             <bufferGeometry>
//                 <bufferAttribute
//                     attach="attributes-position"
//                     count={positions.length / 3}
//                     array={positions}
//                     itemSize={3}
//                 />
//             </bufferGeometry>
//             <shaderMaterial
//                 vertexShader={vertexShader}
//                 fragmentShader={fragmentShader}
//                 uniforms={{ uSize: { value: 1.5 } }}
//                 transparent={true}
//                 blending={THREE.AdditiveBlending}
//                 depthWrite={false}
//             />
//         </points>
//     );
// };

// export default ParticleScene;



 //     ==================================================================================100 % working code for GPGPU ===============================================================

// import React, { useMemo, useRef } from 'react';
// import { useFrame, createPortal } from '@react-three/fiber';
// import { useFBO } from '@react-three/drei';
// import * as THREE from 'three';

// const generateLorenzPoints = (numPoints) => {
//   const points = new Float32Array(numPoints * 4);
//   const scale = 0.04; const dt = 0.01;
//   let x = 1, y = 1, z = 1;
//   const sigma = 10, rho = 28, beta = 8/3;
//   for (let i = 0; i < numPoints; i++) {
//     const dx = sigma * (y - x) * dt;
//     const dy = (x * (rho - z) - y) * dt;
//     const dz = (x * y - beta * z) * dt;
//     x += dx; y += dy; z += dz;
//     points[i * 4 + 0] = x * scale;
//     points[i * 4 + 1] = y * scale;
//     points[i * 4 + 2] = z * scale;
//     points[i * 4 + 3] = 1.0;
//   }
//   return points;
// };

// const generateMaurerRosePoints = (numPoints) => {
//   const points = new Float32Array(numPoints * 4);
//   const scale = 0.8; const n = 6; const d = 71;
//   for (let i = 0; i < numPoints; i++) {
//     const t = (i / numPoints) * 360; // Loop sequentially through degrees
//     const k = t * d;
//     const r = scale * Math.sin(n * k * Math.PI / 180);
//     const theta = k * Math.PI / 180;
//     const x = r * Math.cos(theta);
//     const y = r * Math.sin(theta);
//     const z = (Math.random() - 0.5) * 0.3;
//     points[i * 4 + 0] = x;
//     points[i * 4 + 1] = y;
//     points[i * 4 + 2] = z;
//     points[i * 4 + 3] = 1.0;
//   }
//   return points;
// };

// const generateTrefoilKnotPoints = (numPoints) => {
//   const points = new Float32Array(numPoints * 4);
//   const scale = 0.2;
//   for (let i = 0; i < numPoints; i++) {
//     const t = (i / numPoints) * 2 * Math.PI; // Loop sequentially
//     const x = scale * (Math.sin(t) + 2 * Math.sin(2 * t));
//     const y = scale * (Math.cos(t) - 2 * Math.cos(2 * t));
//     const z = scale * -Math.sin(3 * t);
//     points[i * 4 + 0] = x;
//     points[i * 4 + 1] = y;
//     points[i * 4 + 2] = z;
//     points[i * 4 + 3] = 1.0;
//   }
//   return points;
// };


// const generateMobiusPoints = (numPoints) => {
//   const points = new Float32Array(numPoints * 4);
//   const scale = 0.8;
//   for (let i = 0; i < numPoints; i++) {
//     const u = Math.random() * 2 * Math.PI;
//     const v = (Math.random() - 0.5) * 0.4;
//     const x = scale * (1 + v * Math.cos(u/2)) * Math.cos(u);
//     const y = scale * (1 + v * Math.cos(u/2)) * Math.sin(u);
//     const z = scale * v * Math.sin(u/2);
//     points[i * 4 + 0] = x;
//     points[i * 4 + 1] = y;
//     points[i * 4 + 2] = z;
//     points[i * 4 + 3] = 1.0;
//   }
//   return points;
// };
// const generateButterflyPoints = (numPoints) => {
//   const points = new Float32Array(numPoints * 4);
//   const scale = 0.15;
//   for (let i = 0; i < numPoints; i++) {
//     const t = Math.random() * 12 * Math.PI;
//     const r = Math.exp(Math.cos(t)) - 2*Math.cos(4*t) + Math.pow(Math.sin(t/12), 5);
//     const x = scale * r * Math.cos(t);
//     const y = scale * r * Math.sin(t);
//     const z = (Math.random() - 0.5) * 0.4;
//     points[i * 4 + 0] = x;
//     points[i * 4 + 1] = y;
//     points[i * 4 + 2] = z;
//     points[i * 4 + 3] = 1.0;
//   }
//   return points;
// };
// const generateLissajous3DPoints = (numPoints) => {
//   const points = new Float32Array(numPoints * 4);
//   const scale = 0.5; const a = 3, b = 2, c = 1;
//   for (let i = 0; i < numPoints; i++) {
//     const t = Math.random() * 4 * Math.PI;
//     const x = scale * Math.sin(a * t + Math.PI / 2);
//     const y = scale * Math.sin(b * t);
//     const z = scale * Math.sin(c * t + Math.PI / 4);
//     points[i * 4 + 0] = x;
//     points[i * 4 + 1] = y;
//     points[i * 4 + 2] = z;
//     points[i * 4 + 3] = 1.0;
//   }
//   return points;
// };
// const generateSierpinskiPoints = (numPoints) => {
//   const points = new Float32Array(numPoints * 4);
//   const scale = 1.0;
//   const vertices = [[0, scale, 0], [-scale * 0.866, -scale * 0.5, 0], [scale * 0.866, -scale * 0.5, 0]];
//   let x = 0, y = 0, z = 0;
//   for (let i = 0; i < numPoints; i++) {
//     const vertex = vertices[Math.floor(Math.random() * 3)];
//     x = (x + vertex[0]) / 2;
//     y = (y + vertex[1]) / 2;
//     z = (z + vertex[2]) / 2 + (Math.random() - 0.5) * 0.1;
//     points[i * 4 + 0] = x;
//     points[i * 4 + 1] = y;
//     points[i * 4 + 2] = z;
//     points[i * 4 + 3] = 1.0;
//   }
//   return points;
// };

// Working 100% fine------------------------------------------------------------------

// // --- 1. Simulation Shaders (The "Engine") ---
// const simulationVertexShader = `
//   varying vec2 vUv;
//   void main() {
//     vUv = uv;
//     gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
//   }
// `;
// const simulationFragmentShader = `
//   varying vec2 vUv;
//   uniform sampler2D uStartPositions;
//   uniform sampler2D uEndPositions;
//   uniform float uProgress;

//   void main() {
//     vec3 pos1 = texture2D(uStartPositions, vUv).rgb;
//     vec3 pos2 = texture2D(uEndPositions, vUv).rgb;
//     vec3 finalPosition = mix(pos1, pos2, uProgress);
//     gl_FragColor = vec4(finalPosition, 1.0);
//   }
// `;

// // --- 2. Render Shaders (The "Display") ---
// const renderVertexShader = `
//   uniform sampler2D uPositions;
//   uniform float uSize;
  
//   void main() {
//     // We use the 'uv' attribute to look up our particle's
//     // final position from the texture calculated by the simulation.
//     vec3 pos = texture2D(uPositions, uv).rgb;
    
//     vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
//     gl_PointSize = uSize;
//     gl_Position = projectionMatrix * mvPosition;
//   }
// `;

// const renderFragmentShader = `
//   uniform vec3 uColor1;
//   uniform vec3 uColor2;
//   uniform float uProgress;
//   void main() {
//     if (length(gl_PointCoord - vec2(0.5, 0.5)) > 0.475) discard;
//     vec3 finalColor = mix(uColor1, uColor2, uProgress);
//     gl_FragColor = vec4(finalColor, 1.0);
//   }
// `;

// // --- MAIN REACT COMPONENT ---
// const ParticleScene = () => {
//     const pointsRef = useRef();
//     const simulationMaterialRef = useRef();
//     const renderMaterialRef = useRef();
    
//     const textureSize = 512;
//     const numPoints = textureSize * textureSize;


//     // This is our "control panel" of shapes
//     const shapes = useMemo(() => [
//         { name: "Mobius", generator: generateMobiusPoints, color: new THREE.Color('#ffff00'), scale: 1.3 },
//         { name: "Lorenz", generator: generateLorenzPoints, color: new THREE.Color('#ff4500'), scale: 1.5 },
//         { name: "MaurerRose", generator: generateMaurerRosePoints, color: new THREE.Color('#00ff00'), scale: 1.0 },
//         { name: "TrefoilKnot", generator: generateTrefoilKnotPoints, color: new THREE.Color('#0000ff'), scale: 1.2 },
//         { name: "Butterfly", generator: generateButterflyPoints, color: new THREE.Color('#ff00ff'), scale: 1.4 },
//         { name: "Lissajous", generator: generateLissajous3DPoints, color: new THREE.Color('#00ffff'), scale: 1.1 },
//         { name: "Sierpinski", generator: generateSierpinskiPoints, color: new THREE.Color('#ffffff'), scale: 1.0 },
//     ], []);

//     // This hook generates the data for each shape and creates a DataTexture "blueprint" for it.
//     const shapeTextures = useMemo(() => {
//         console.log("Generating shape textures...");
//         return shapes.map(shape => {
//             const positions = shape.generator(numPoints);
//             const texture = new THREE.DataTexture(positions, textureSize, textureSize, THREE.RGBAFormat, THREE.FloatType);
//             texture.needsUpdate = true;
//             return texture;
//         });
//     }, [shapes, numPoints, textureSize]);

    
//     // --- 2. GPGPU Render Targets (FBOs) Setup ---
//     // These are our "off-screen canvases" that the simulation will draw to.
//     const colors = useMemo(() => shapes.map(s => s.color), [shapes]);
//     const scales = useMemo(() => shapes.map(s => s.scale || 1.0), [shapes]); // <-- ADD THIS LINE

//     let renderTarget1 = useFBO(textureSize, textureSize, { format: THREE.RGBAFormat, type: THREE.FloatType });
//     let renderTarget2 = useFBO(textureSize, textureSize, { format: THREE.RGBAFormat, type: THREE.FloatType });
    
//     const { scene, camera } = useMemo(() => {
//         const scene = new THREE.Scene();
//         const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
//         console.log("Step 2: GPGPU Engine created.");
//         return { scene, camera };
//     }, []);

//     const particleUVs = useMemo(() => {
//         const uvs = new Float32Array(numPoints * 2);
//         for (let i = 0; i < textureSize; i++) {
//             for (let j = 0; j < textureSize; j++) {
//                 const index = i * textureSize + j;
//                 uvs[index * 2 + 0] = j / (textureSize - 1);
//                 uvs[index * 2 + 1] = i / (textureSize - 1);
//             }
//         }
//         return uvs;
//     }, [numPoints, textureSize]);

    

//     // --- 3. The Animation Loop ---
//     useFrame(({ gl, clock, mouse }) => {
//         // Wait until all the data and refs are ready
//         if (!renderMaterialRef.current || !simulationMaterialRef.current || shapeTextures.length === 0) return;

//         // --- Calculate the current state of the animation ---
//         const time = clock.getElapsedTime();
//         const transitionDuration = 3, holdDuration = 2, numShapes = shapes.length;
//         const cycleDuration = transitionDuration + holdDuration;
//         const totalCycleDuration = cycleDuration * numShapes;
        
//         const cycleTime = time % totalCycleDuration;
//         const currentPhase = Math.floor(cycleTime / cycleDuration);
        
//         const timeInPhase = cycleTime % cycleDuration;
//         // Calculate the progress from 0.0 to 1.0, and hold at 1.0
//         const progress = Math.min(timeInPhase / transitionDuration, 1.0);

//         const index1 = currentPhase;
//         const index2 = (currentPhase + 1) % numShapes;

//         // --- Update the uniforms for the off-screen SIMULATION shader ---
//         const simUniforms = simulationMaterialRef.current.uniforms;
//         simUniforms.uStartPositions.value = shapeTextures[index1];
//         simUniforms.uEndPositions.value = shapeTextures[index2];
//         simUniforms.uProgress.value = progress;
//         simUniforms.uStartScale.value = scales[index1];
//         simUniforms.uEndScale.value = scales[index2];

//         // --- Run the GPU Simulation ---
//         gl.setRenderTarget(renderTarget1);
//         gl.render(scene, camera);
//         gl.setRenderTarget(null);

//         // --- Update the uniforms for the on-screen RENDER shader ---
//         const renderUniforms = renderMaterialRef.current.uniforms;
//         renderUniforms.uPositions.value = renderTarget1.texture; // Use the texture we just rendered to
//         renderUniforms.uProgress.value = progress;
//         renderUniforms.uColor1.value = colors[index1];
//         renderUniforms.uColor2.value = colors[index2];
//         renderUniforms.uMouse.value.lerp(mouse, 0.1);

//         // --- FIX: Add the missing continuous rotation ---
//         pointsRef.current.rotation.y += 0.002;
//     });

//     const particlePositions = useMemo(() => new Float32Array(numPoints * 3), [numPoints]);

    
//     if (shapeTextures.length === 0) return null;

//     return (
//         <>
//             {createPortal(
//                 <mesh>
//                     <planeGeometry args={[2, 2]} />
//                     <shaderMaterial
//                         ref={simulationMaterialRef}
//                         vertexShader={simulationVertexShader}
//                         fragmentShader={simulationFragmentShader}
//                         uniforms={{
//                             uStartPositions: { value: shapeTextures[0] },
//                             uEndPositions: { value: shapeTextures[1] },
//                             uStartScale: { value: 1.0 },
//                             uEndScale: { value: 1.0 },
//                             uProgress: { value: 0.0 },
//                         }}
//                     />
//                 </mesh>,
//                 scene
//             )}
            
//             <points ref={pointsRef}>
//                 <bufferGeometry>
//                     {/* --- FIX: Add the essential position attribute --- */}
//                     <bufferAttribute attach="attributes-position" count={particlePositions.length / 3} array={particlePositions} itemSize={3} />
//                     <bufferAttribute attach="attributes-uv" count={particleUVs.length / 2} array={particleUVs} itemSize={2} />
//                 </bufferGeometry>
//                 <shaderMaterial
//                     ref={renderMaterialRef}
//                     vertexShader={renderVertexShader}
//                     fragmentShader={renderFragmentShader}
//                     uniforms={{
//                         uPositions: { value: shapeTextures[0] },
//                         uSize: { value: 1.5 },
//                         uMouse: { value: new THREE.Vector2(0, 0) },
//                         uColor1: { value: colors[0] },
//                         uColor2: { value: colors[1] },
//                         uProgress: { value: 0.0 }
//                     }}
//                     transparent={true}
//                     blending={THREE.AdditiveBlending}
//                     depthWrite={false}
//                 />
//             </points>
//         </>
//     );
// };

// export default ParticleScene;

//     ==================================================================================100 % working code for GPGPU ===============================================================





//     ==================================================================================100 % working code for GPGPU  for multiple shapes perplexity ===============================================================

// // perplexity fix for shapes
// import React, { useMemo, useRef } from 'react';
// import { useFrame, createPortal } from '@react-three/fiber';
// import { useFBO } from '@react-three/drei';
// import * as THREE from 'three';
// // ✅ CONVERTED: Sine Wave
// const generateSineWavePoints = (numPoints, cycles = 2) => {
//     const points = new Float32Array(numPoints * 4);
//     const width = 2.5; 
//     const height = 0.5;
//     for (let i = 0; i < numPoints; i++) {
//         const x = (Math.random() - 0.5) * width;
//         const y = Math.sin(x * Math.PI * cycles) * height;
//         const z = (Math.random() - 0.5) * 0.5;
//         points[i * 4 + 0] = x;
//         points[i * 4 + 1] = y;
//         points[i * 4 + 2] = z;
//         points[i * 4 + 3] = 1.0;
//     }
//     return points;
// };

// // ✅ CONVERTED: Lorenz Attractor
// const generateLorenzPoints = (numPoints) => {
//     const points = new Float32Array(numPoints * 4);
//     const scale = 0.03;
//     const dt = 0.01;
//     let x = 1, y = 1, z = 1;
//     const sigma = 10, rho = 28, beta = 8/3;
//     for (let i = 0; i < numPoints; i++) {
//         const dx = sigma * (y - x) * dt;
//         const dy = (x * (rho - z) - y) * dt;
//         const dz = (x * y - beta * z) * dt;
//         x += dx; y += dy; z += dz;
//         points[i * 4 + 0] = x * scale;
//         points[i * 4 + 1] = y * scale;
//         points[i * 4 + 2] = z * scale;
//         points[i * 4 + 3] = 1.0;
//     }
//     return points;
// };

// // ✅ CONVERTED: Aizawa Attractor
// const generateAizawaPoints = (numPoints) => {
//     const points = new Float32Array(numPoints * 4);
//     const scale = 0.15;
//     const dt = 0.01;
//     let x = 0.1, y = 0, z = 0;
//     const a = 0.95, b = 0.7, c = 0.6, d = 3.5, e = 0.25, f = 0.1;
//     for (let i = 0; i < numPoints; i++) {
//         const dx = ((z - b) * x - d * y) * dt;
//         const dy = (d * x + (z - b) * y) * dt;
//         const dz = (c + a * z - (z * z * z) / 3 - (x * x + y * y) * (1 + e * z) + f * z * (x * x * x)) * dt;
//         x += dx; y += dy; z += dz;
//         points[i * 4 + 0] = x * scale;
//         points[i * 4 + 1] = y * scale;
//         points[i * 4 + 2] = z * scale;
//         points[i * 4 + 3] = 1.0;
//     }
//     return points;
// };

// // ✅ CONVERTED: Maurer Rose
// const generateMaurerRosePoints = (numPoints) => {
//     const points = new Float32Array(numPoints * 4);
//     const scale = 0.4;
//     const n = 6, d = 71;
//     for (let i = 0; i < numPoints; i++) {
//         const k = Math.floor(Math.random() * 360);
//         const theta = k * d * Math.PI / 180;
//         const r = scale * Math.sin(n * k * Math.PI / 180);
//         const x = r * Math.cos(theta);
//         const y = r * Math.sin(theta);
//         const z = (Math.random() - 0.5) * 0.3;
//         points[i * 4 + 0] = x;
//         points[i * 4 + 1] = y;
//         points[i * 4 + 2] = z;
//         points[i * 4 + 3] = 1.0;
//     }
//     return points;
// };

// // ✅ CONVERTED: Sierpinski Triangle
// const generateSierpinskiPoints = (numPoints) => {
//     const points = new Float32Array(numPoints * 4);
//     const scale = 0.8;
//     const vertices = [
//         [0, scale, 0],
//         [-scale * 0.866, -scale * 0.5, 0],
//         [scale * 0.866, -scale * 0.5, 0]
//     ];
//     let x = 0, y = 0, z = 0;
//     for (let i = 0; i < numPoints; i++) {
//         const vertex = vertices[Math.floor(Math.random() * 3)];
//         x = (x + vertex[0]) / 2;
//         y = (y + vertex[1]) / 2;
//         z = (z + vertex[2]) / 2 + (Math.random() - 0.5) * 0.1;
//         points[i * 4 + 0] = x;
//         points[i * 4 + 1] = y;
//         points[i * 4 + 2] = z;
//         points[i * 4 + 3] = 1.0;
//     }
//     return points;
// };

// // ✅ CONVERTED: Wave Interference
// const generateInterferencePoints = (numPoints) => {
//     const points = new Float32Array(numPoints * 4);
//     const scale = 1.5;
//     for (let i = 0; i < numPoints; i++) {
//         const x = (Math.random() - 0.5) * scale;
//         const z = (Math.random() - 0.5) * scale;
//         const r1 = Math.sqrt((x - 0.3) * (x - 0.3) + z * z);
//         const r2 = Math.sqrt((x + 0.3) * (x + 0.3) + z * z);
//         const y = 0.1 * (Math.sin(10 * r1) + Math.sin(10 * r2));
//         points[i * 4 + 0] = x;
//         points[i * 4 + 1] = y;
//         points[i * 4 + 2] = z;
//         points[i * 4 + 3] = 1.0;
//     }
//     return points;
// };

// // ✅ CONVERTED: Dadras Attractor
// const generateDadrasPoints = (numPoints) => {
//     const points = new Float32Array(numPoints * 4);
//     const scale = 0.05;
//     const dt = 0.005;
//     let x = 1, y = 1, z = 1;
//     const a = 3, b = 2.7, c = 1.7, d = 2, e = 9;
//     for (let i = 0; i < numPoints; i++) {
//         const dx = (y - a * x + b * y * z) * dt;
//         const dy = (c * y - x * z + z) * dt;
//         const dz = (d * x * y - e * z) * dt;
//         x += dx; y += dy; z += dz;
//         points[i * 4 + 0] = x * scale;
//         points[i * 4 + 1] = y * scale;
//         points[i * 4 + 2] = z * scale;
//         points[i * 4 + 3] = 1.0;
//     }
//     return points;
// };

// // ✅ CONVERTED: Thomas Attractor
// const generateThomasPoints = (numPoints) => {
//     const points = new Float32Array(numPoints * 4);
//     const scale = 0.5;
//     const dt = 0.05;
//     let x = 0.1, y = 0, z = 0;
//     const b = 0.208186;
//     for (let i = 0; i < numPoints; i++) {
//         const dx = (Math.sin(y) - b * x) * dt;
//         const dy = (Math.sin(z) - b * y) * dt;
//         const dz = (Math.sin(x) - b * z) * dt;
//         x += dx; y += dy; z += dz;
//         points[i * 4 + 0] = x * scale;
//         points[i * 4 + 1] = y * scale;
//         points[i * 4 + 2] = z * scale;
//         points[i * 4 + 3] = 1.0;
//     }
//     return points;
// };

// // ✅ CONVERTED: Chen Attractor
// const generateChenPoints = (numPoints) => {
//     const points = new Float32Array(numPoints * 4);
//     const scale = 0.04;
//     const dt = 0.002;
//     let x = 1, y = 1, z = 1;
//     const a = 5, b = -10, c = -0.38;
//     for (let i = 0; i < numPoints; i++) {
//         const dx = (a * x - y * z) * dt;
//         const dy = (b * y + x * z) * dt;
//         const dz = (c * z + x * y / 3) * dt;
//         x += dx; y += dy; z += dz;
//         points[i * 4 + 0] = x * scale;
//         points[i * 4 + 1] = y * scale;
//         points[i * 4 + 2] = z * scale;
//         points[i * 4 + 3] = 1.0;
//     }
//     return points;
// };

// // ✅ CONVERTED: Lu Chen Attractor
// const generateLuChenPoints = (numPoints) => {
//     const points = new Float32Array(numPoints * 4);
//     const scale = 0.02;
//     const dt = 0.001;
//     let x = 1, y = 1, z = 1;
//     const a = 36, b = 3, c = 20;
//     for (let i = 0; i < numPoints; i++) {
//         const dx = (a * (y - x)) * dt;
//         const dy = (x - x * z + c * y) * dt;
//         const dz = (x * y - b * z) * dt;
//         x += dx; y += dy; z += dz;
//         points[i * 4 + 0] = x * scale;
//         points[i * 4 + 1] = y * scale;
//         points[i * 4 + 2] = z * scale;
//         points[i * 4 + 3] = 1.0;
//     }
//     return points;
// };

// // ✅ CONVERTED: Qi Attractor
// const generateQiPoints = (numPoints) => {
//     const points = new Float32Array(numPoints * 4);
//     const scale = 0.15;
//     const dt = 0.01;
//     let x = 1, y = 1, z = 1;
//     const a = 50, b = 24, c = 13;
//     for (let i = 0; i < numPoints; i++) {
//         const dx = (a * (y - x) + y * z) * dt;
//         const dy = (b * x + y - x * z) * dt;
//         const dz = (x * y - c * z) * dt;
//         x += dx; y += dy; z += dz;
//         points[i * 4 + 0] = x * scale;
//         points[i * 4 + 1] = y * scale;
//         points[i * 4 + 2] = z * scale;
//         points[i * 4 + 3] = 1.0;
//     }
//     return points;
// };

// // ✅ CONVERTED: Rossler Attractor
// const generateRosslerPoints = (numPoints) => {
//     const points = new Float32Array(numPoints * 4);
//     const scale = 0.1;
//     const dt = 0.02;
//     let x = 1, y = 1, z = 1;
//     const a = 0.2, b = 0.2, c = 5.7;
//     for (let i = 0; i < numPoints; i++) {
//         const dx = (-y - z) * dt;
//         const dy = (x + a * y) * dt;
//         const dz = (b + z * (x - c)) * dt;
//         x += dx; y += dy; z += dz;
//         points[i * 4 + 0] = x * scale;
//         points[i * 4 + 1] = y * scale;
//         points[i * 4 + 2] = z * scale;
//         points[i * 4 + 3] = 1.0;
//     }
//     return points;
// };

// // ✅ CONVERTED: Seashell (Nautilus)
// const generateSeashellPoints = (numPoints) => {
//     const points = new Float32Array(numPoints * 4);
//     const scale = 0.1;
//     for (let i = 0; i < numPoints; i++) {
//         const theta = Math.random() * 8 * Math.PI;
//         const phi = Math.random() * 2 * Math.PI;
//         const radius = 0.2 * Math.exp(0.1 * theta);
//         const tubeRadius = 0.05 * Math.exp(0.08 * theta);
//         const r = radius + tubeRadius * Math.cos(phi);
//         const x = scale * r * Math.cos(theta);
//         const y = scale * r * Math.sin(theta);
//         const z = scale * tubeRadius * Math.sin(phi);
//         points[i * 4 + 0] = x;
//         points[i * 4 + 1] = y;
//         points[i * 4 + 2] = z;
//         points[i * 4 + 3] = 1.0;
//     }
//     return points;
// };

// // ✅ CONVERTED: Clifford Attractor
// const generateCliffordPoints = (numPoints) => {
//     const points = new Float32Array(numPoints * 4);
//     const a = -1.4, b = 1.6, c = 1.0, d = 0.7;
//     let x = 0.1, y = 0.1;
//     const s = 0.55;
//     for (let i = 0; i < numPoints; i++) {
//         const x1 = Math.sin(a * y) + c * Math.cos(a * x);
//         const y1 = Math.sin(b * x) + d * Math.cos(b * y);
//         x = x1; y = y1;
//         points[i * 4 + 0] = x * s;
//         points[i * 4 + 1] = y * s;
//         points[i * 4 + 2] = (Math.random() - 0.5) * 0.05;
//         points[i * 4 + 3] = 1.0;
//     }
//     return points;
// };

// // ✅ CONVERTED: Superformula
// const generateSuperformula = (numPoints, m = 7, a = 1, b = 1, n1 = 0.3, n2 = 0.3, n3 = 0.3) => {
//     const points = new Float32Array(numPoints * 4);
//     const R = 0.5;
//     for (let i = 0; i < numPoints; i++) {
//         const φ = (i / numPoints) * Math.PI * 2;
//         const r = Math.pow(
//             Math.pow(Math.abs(Math.cos(m * φ / 4) / a), n2) +
//             Math.pow(Math.abs(Math.sin(m * φ / 4) / b), n3),
//             -1 / n1
//         );
//         const x = R * r * Math.cos(φ);
//         const y = R * r * Math.sin(φ);
//         const z = (Math.random() - 0.5) * 0.1;
//         points[i * 4 + 0] = x;
//         points[i * 4 + 1] = y;
//         points[i * 4 + 2] = z;
//         points[i * 4 + 3] = 1.0;
//     }
//     return points;
// };

// // ✅ CONVERTED: Barth Sextic (Fixed syntax)
// const generateBarthPoints = (numPoints) => {
//     const points = new Float32Array(numPoints * 4);
//     const φ = (1 + Math.sqrt(5)) / 2;
//     const scale = 0.8;
//     for (let i = 0; i < numPoints; i++) {
//         const θ = (Math.random() - 0.5) * Math.PI;
//         const ψ = Math.random() * 2 * Math.PI;
//         const r = 1.4;
//         const x = r * Math.cos(θ) * Math.cos(ψ);
//         const y = r * Math.cos(θ) * Math.sin(ψ);
//         const z = r * Math.sin(θ);
//         const F = ((φ * φ) * (x * x) - y * y) * ((φ * φ) * (y * y) - z * z) *
//                   ((φ * φ) * (z * z) - x * x) + 2 * (x * y * z) - (φ + 1);
//         if (Math.abs(F) < 0.3) {
//             points[i * 4 + 0] = x * scale;
//             points[i * 4 + 1] = y * scale;
//             points[i * 4 + 2] = z * scale;
//             points[i * 4 + 3] = 1.0;
//         } else {
//             i--; // Try again
//         }
//     }
//     return points;
// };

// // ✅ CONVERTED: Duffing Attractor
// const generateDuffing = (numPoints) => {
//     const points = new Float32Array(numPoints * 4);
//     let x = 1, y = 0;
//     const a = -1, b = 1, δ = 0.3, γ = 0.37, ω = 1.4;
//     const dt = 0.02, scale = 0.25;
//     for (let i = 0; i < numPoints; i++) {
//         const t = i * dt;
//         const dx = y * dt;
//         const dy = (-δ * y - a * x - b * x * x * x + γ * Math.cos(ω * t)) * dt;
//         x += dx; y += dy;
//         points[i * 4 + 0] = x * scale;
//         points[i * 4 + 1] = y * scale;
//         points[i * 4 + 2] = (Math.random() - 0.5) * 0.05;
//         points[i * 4 + 3] = 1.0;
//     }
//     return points;
// };

// // ✅ CONVERTED: Rennard Flower
// const generateRennard = (numPoints) => {
//     const points = new Float32Array(numPoints * 4);
//     const scale = 0.4;
//     for (let i = 0; i < numPoints; i++) {
//         const t = Math.random() * 2 * Math.PI;
//         const r = Math.sin(4 * t) + Math.cos(7 * t);
//         const x = scale * r * Math.cos(t);
//         const y = scale * r * Math.sin(t);
//         const z = (Math.random() - 0.5) * 0.1;
//         points[i * 4 + 0] = x;
//         points[i * 4 + 1] = y;
//         points[i * 4 + 2] = z;
//         points[i * 4 + 3] = 1.0;
//     }
//     return points;
// };

// // ✅ CONVERTED: Viviani's Window
// const generateViviani = (numPoints) => {
//     const points = new Float32Array(numPoints * 4);
//     const R = 1, a = R / 2, s = 0.5;
//     for (let i = 0; i < numPoints; i++) {
//         const t = (i / numPoints) * 2 * Math.PI;
//         const x = R * (1 + Math.cos(t));
//         const y = R * Math.sin(t);
//         const z = 2 * a * Math.sin(t / 2);
//         points[i * 4 + 0] = x * s;
//         points[i * 4 + 1] = y * s;
//         points[i * 4 + 2] = z * s;
//         points[i * 4 + 3] = 1.0;
//     }
//     return points;
// };

// // ✅ CONVERTED: Tornado (Epicycloid)
// const generateTornado = (numPoints) => {
//     const points = new Float32Array(numPoints * 4);
//     const turns = 5, s = 0.35;
//     for (let i = 0; i < numPoints; i++) {
//         const t = (i / numPoints) * 2 * Math.PI * turns;
//         const k = 3;
//         const r = 0.4 + 0.02 * t;
//         const x = r * (Math.cos(t) + Math.cos(k * t) / k);
//         const y = r * (Math.sin(t) - Math.sin(k * t) / k);
//         const z = 0.05 * t;
//         points[i * 4 + 0] = x * s;
//         points[i * 4 + 1] = y * s;
//         points[i * 4 + 2] = z * s;
//         points[i * 4 + 3] = 1.0;
//     }
//     return points;
// };


// // ✅ FIXED: Keep your shape generators exactly as they are - they're perfect!
// // const generateLorenzPoints = (numPoints) => {
// //   const points = new Float32Array(numPoints * 4);
// //   const scale = 0.04; const dt = 0.01;
// //   let x = 1, y = 1, z = 1;
// //   const sigma = 10, rho = 28, beta = 8/3;
// //   for (let i = 0; i < numPoints; i++) {
// //     const dx = sigma * (y - x) * dt;
// //     const dy = (x * (rho - z) - y) * dt;
// //     const dz = (x * y - beta * z) * dt;
// //     x += dx; y += dy; z += dz;
// //     points[i * 4 + 0] = x * scale;
// //     points[i * 4 + 1] = y * scale;
// //     points[i * 4 + 2] = z * scale;
// //     points[i * 4 + 3] = 1.0;
// //   }
// //   return points;
// // };

// // const generateMaurerRosePoints = (numPoints) => {
// //   const points = new Float32Array(numPoints * 4);
// //   const scale = 0.8; const n = 6; const d = 71;
// //   for (let i = 0; i < numPoints; i++) {
// //     const t = (i / numPoints) * 360;
// //     const k = t * d;
// //     const r = scale * Math.sin(n * k * Math.PI / 180);
// //     const theta = k * Math.PI / 180;
// //     const x = r * Math.cos(theta);
// //     const y = r * Math.sin(theta);
// //     const z = (Math.random() - 0.5) * 0.3;
// //     points[i * 4 + 0] = x;
// //     points[i * 4 + 1] = y;
// //     points[i * 4 + 2] = z;
// //     points[i * 4 + 3] = 1.0;
// //   }
// //   return points;
// // };

// const generateTrefoilKnotPoints = (numPoints) => {
//   const points = new Float32Array(numPoints * 4);
//   const scale = 0.2;
//   for (let i = 0; i < numPoints; i++) {
//     const t = (i / numPoints) * 2 * Math.PI;
//     const x = scale * (Math.sin(t) + 2 * Math.sin(2 * t));
//     const y = scale * (Math.cos(t) - 2 * Math.cos(2 * t));
//     const z = scale * -Math.sin(3 * t);
//     points[i * 4 + 0] = x;
//     points[i * 4 + 1] = y;
//     points[i * 4 + 2] = z;
//     points[i * 4 + 3] = 1.0;
//   }
//   return points;
// };

// const generateMobiusPoints = (numPoints) => {
//   const points = new Float32Array(numPoints * 4);
//   const scale = 0.8;
//   for (let i = 0; i < numPoints; i++) {
//     const u = Math.random() * 2 * Math.PI;
//     const v = (Math.random() - 0.5) * 0.4;
//     const x = scale * (1 + v * Math.cos(u/2)) * Math.cos(u);
//     const y = scale * (1 + v * Math.cos(u/2)) * Math.sin(u);
//     const z = scale * v * Math.sin(u/2);
//     points[i * 4 + 0] = x;
//     points[i * 4 + 1] = y;
//     points[i * 4 + 2] = z;
//     points[i * 4 + 3] = 1.0;
//   }
//   return points;
// };

// const generateButterflyPoints = (numPoints) => {
//   const points = new Float32Array(numPoints * 4);
//   const scale = 0.15;
//   for (let i = 0; i < numPoints; i++) {
//     const t = Math.random() * 12 * Math.PI;
//     const r = Math.exp(Math.cos(t)) - 2*Math.cos(4*t) + Math.pow(Math.sin(t/12), 5);
//     const x = scale * r * Math.cos(t);
//     const y = scale * r * Math.sin(t);
//     const z = (Math.random() - 0.5) * 0.4;
//     points[i * 4 + 0] = x;
//     points[i * 4 + 1] = y;
//     points[i * 4 + 2] = z;
//     points[i * 4 + 3] = 1.0;
//   }
//   return points;
// };

// const generateLissajous3DPoints = (numPoints) => {
//   const points = new Float32Array(numPoints * 4);
//   const scale = 0.5; const a = 3, b = 2, c = 1;
//   for (let i = 0; i < numPoints; i++) {
//     const t = Math.random() * 4 * Math.PI;
//     const x = scale * Math.sin(a * t + Math.PI / 2);
//     const y = scale * Math.sin(b * t);
//     const z = scale * Math.sin(c * t + Math.PI / 4);
//     points[i * 4 + 0] = x;
//     points[i * 4 + 1] = y;
//     points[i * 4 + 2] = z;
//     points[i * 4 + 3] = 1.0;
//   }
//   return points;
// };

// // const generateSierpinskiPoints = (numPoints) => {
// //   const points = new Float32Array(numPoints * 4);
// //   const scale = 1.0;
// //   const vertices = [[0, scale, 0], [-scale * 0.866, -scale * 0.5, 0], [scale * 0.866, -scale * 0.5, 0]];
// //   let x = 0, y = 0, z = 0;
// //   for (let i = 0; i < numPoints; i++) {
// //     const vertex = vertices[Math.floor(Math.random() * 3)];
// //     x = (x + vertex[0]) / 2;
// //     y = (y + vertex[1]) / 2;
// //     z = (z + vertex[2]) / 2 + (Math.random() - 0.5) * 0.1;
// //     points[i * 4 + 0] = x;
// //     points[i * 4 + 1] = y;
// //     points[i * 4 + 2] = z;
// //     points[i * 4 + 3] = 1.0;
// //   }
// //   return points;
// // };

// // ✅ FIXED: Updated simulation shaders with proper scaling
// const simulationVertexShader = `
//   varying vec2 vUv;
//   void main() {
//     vUv = uv;
//     gl_Position = vec4(position, 1.0);
//   }
// `;

// const simulationFragmentShader = `
//   varying vec2 vUv;
//   uniform sampler2D uStartPositions;
//   uniform sampler2D uEndPositions;
//   uniform float uProgress;
//   uniform float uStartScale;
//   uniform float uEndScale;

//   void main() {
//     vec4 pos1 = texture2D(uStartPositions, vUv);
//     vec4 pos2 = texture2D(uEndPositions, vUv);
    
//     // ✅ Apply scaling during interpolation
//     float currentScale = mix(uStartScale, uEndScale, uProgress);
//     vec3 finalPosition = mix(pos1.rgb, pos2.rgb, uProgress) * currentScale;
    
//     gl_FragColor = vec4(finalPosition, 1.0);
//   }
// `;

// // ✅ FIXED: Updated render shaders
// const renderVertexShader = `
//   uniform sampler2D uPositions;
//   uniform float uSize;
  
//   void main() {
//     vec3 pos = texture2D(uPositions, uv).rgb;
//     vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
//     gl_PointSize = uSize;
//     gl_Position = projectionMatrix * mvPosition;
//   }
// `;

// const renderFragmentShader = `
//   uniform vec3 uColor1;
//   uniform vec3 uColor2;
//   uniform float uProgress;
  
//   void main() {
//     if (length(gl_PointCoord - vec2(0.5, 0.5)) > 0.475) discard;
//     vec3 finalColor = mix(uColor1, uColor2, uProgress);
//     gl_FragColor = vec4(finalColor, 1.0);
//   }
// `;

// // --- MAIN COMPONENT ---
// const ParticleScene = () => {
//     const pointsRef = useRef();
//     const simulationMaterialRef = useRef();
//     const renderMaterialRef = useRef();
    
//     // ✅ REDUCED: Smaller texture size for clearer shapes
//     const textureSize = 128; // Instead of 512 - gives 65k particles
//     const numPoints = textureSize * textureSize;

//     // const shapes = useMemo(() => [
//         // { name: "Lorenz", generator: generateLorenzPoints, color: new THREE.Color('#ff4500'), scale: 3.0 , position: [0,5,0]},
//     //     { name: "MaurerRose", generator: generateMaurerRosePoints, color: new THREE.Color('#00ff00'), scale: 1.2 },
//     //     { name: "TrefoilKnot", generator: generateTrefoilKnotPoints, color: new THREE.Color('#0000ff'), scale: 1.0 },
//     //     { name: "Mobius", generator: generateMobiusPoints, color: new THREE.Color('#ffff00'), scale: 1.0 },
//     //     { name: "Butterfly", generator: generateButterflyPoints, color: new THREE.Color('#ff00ff'), scale: 1.0 },
//     //     { name: "Lissajous", generator: generateLissajous3DPoints, color: new THREE.Color('#00ffff'), scale: 2.0 },
//     //     { name: "Sierpinski", generator: generateSierpinskiPoints, color: new THREE.Color('#ffffff'), scale: 0.5 },
//     // ], [])
//     const shapes = useMemo(() => [
//     // Existing + New Mathematical Masterpieces
//     { name: "SineWave", generator: generateSineWavePoints, color: new THREE.Color('#00ff00'), scale: 4.0 },
//     { name: "Lorenz", generator: generateLorenzPoints, color: new THREE.Color('#ff4500'), scale: 2 , position: [0,5,0]},

//     { name: "Aizawa", generator: generateAizawaPoints, color: new THREE.Color('#ff6347'), scale: 3.0 },
//     { name: "MaurerRose", generator: generateMaurerRosePoints, color: new THREE.Color('#ff69b4'), scale: 2.5 },
//     { name: "Sierpinski", generator: generateSierpinskiPoints, color: new THREE.Color('#ffffff'), scale: 1.2 },
//     { name: "Interference", generator: generateInterferencePoints, color: new THREE.Color('#00ced1'), scale: 1.5 },
//     { name: "Dadras", generator: generateDadrasPoints, color: new THREE.Color('#9370db'), scale: 2.0 },
//     { name: "Thomas", generator: generateThomasPoints, color: new THREE.Color('#ffd700'), scale: 2.0 },
//     { name: "Chen", generator: generateChenPoints, color: new THREE.Color('#adff2f'), scale: 1.0 },
//     { name: "LuChen", generator: generateLuChenPoints, color: new THREE.Color('#ff1493'), scale: 1.0 },
//     { name: "Qi", generator: generateQiPoints, color: new THREE.Color('#00fa9a'), scale: 1.0 },
//     { name: "Rossler", generator: generateRosslerPoints, color: new THREE.Color('#00bfff'), scale: 1 },
//     { name: "Seashell", generator: generateSeashellPoints, color: new THREE.Color('#ff8c00'), scale: 5.0 },
//     { name: "Clifford", generator: generateCliffordPoints, color: new THREE.Color('#dc143c'), scale: 1.8 },
//     { name: "Superformula", generator: generateSuperformula, color: new THREE.Color('#8a2be2'), scale: 2.0 },
//     // { name: "Barth", generator: generateBarthPoints, color: new THREE.Color('#32cd32'), scale: 1.2 },
//     // { name: "Duffing", generator: generateDuffing, color: new THREE.Color('#ff4500'), scale: 4.0 },
//     // { name: "Rennard", generator: generateRennard, color: new THREE.Color('#00ffff'), scale: 2.5 },
//     // { name: "Viviani", generator: generateViviani, color: new THREE.Color('#ff00ff'), scale: 2.0 },
//     // { name: "Tornado", generator: generateTornado, color: new THREE.Color('#ffff00'), scale: 3.0 },
// ], []);


//     // ✅ FIXED: Better texture creation with proper filtering
//     const shapeTextures = useMemo(() => {
//         console.log("Generating shape textures...");
//         return shapes.map(shape => {
//             const positions = shape.generator(numPoints);
//             const texture = new THREE.DataTexture(
//                 positions, 
//                 textureSize, 
//                 textureSize, 
//                 THREE.RGBAFormat, 
//                 THREE.FloatType
//             );
//             texture.needsUpdate = true;
//             texture.magFilter = THREE.NearestFilter;
//             texture.minFilter = THREE.NearestFilter;
//             texture.wrapS = THREE.ClampToEdgeWrapping;
//             texture.wrapT = THREE.ClampToEdgeWrapping;
//             return texture;
//         });
//     }, [shapes, numPoints, textureSize]);

//     const colors = useMemo(() => shapes.map(s => s.color), [shapes]);
//     const scales = useMemo(() => shapes.map(s => s.scale || 1.0), [shapes]);

//     // ✅ FIXED: Better FBO setup
//     let renderTarget1 = useFBO(textureSize, textureSize, { 
//         format: THREE.RGBAFormat, 
//         type: THREE.FloatType,
//         magFilter: THREE.NearestFilter,
//         minFilter: THREE.NearestFilter
//     });

//     const { scene, camera } = useMemo(() => {
//         const scene = new THREE.Scene();
//         const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
//         return { scene, camera };
//     }, []);

//     // ✅ FIXED: Proper UV generation
//     const particleUVs = useMemo(() => {
//         const uvs = new Float32Array(numPoints * 2);
//         for (let i = 0; i < textureSize; i++) {
//             for (let j = 0; j < textureSize; j++) {
//                 const index = i * textureSize + j;
//                 uvs[index * 2 + 0] = j / (textureSize - 1);
//                 uvs[index * 2 + 1] = i / (textureSize - 1);
//             }
//         }
//         return uvs;
//     }, [numPoints, textureSize]);

//     useFrame(({ gl, clock, mouse }) => {
//         if (!renderMaterialRef.current || !simulationMaterialRef.current || shapeTextures.length === 0) return;

//         const time = clock.getElapsedTime();
//         const transitionDuration = 3, holdDuration = 2, numShapes = shapes.length;
//         const cycleDuration = transitionDuration + holdDuration;
//         const totalCycleDuration = cycleDuration * numShapes;
        
//         const cycleTime = time % totalCycleDuration;
//         const currentPhase = Math.floor(cycleTime / cycleDuration);
        
//         const timeInPhase = cycleTime % cycleDuration;
//         const progress = Math.min(timeInPhase / transitionDuration, 1.0);

//         const index1 = currentPhase;
//         const index2 = (currentPhase + 1) % numShapes;

//         // ✅ FIXED: Proper uniform updates
//         const simUniforms = simulationMaterialRef.current.uniforms;
//         simUniforms.uStartPositions.value = shapeTextures[index1];
//         simUniforms.uEndPositions.value = shapeTextures[index2];
//         simUniforms.uProgress.value = progress;
//         simUniforms.uStartScale.value = scales[index1];
//         simUniforms.uEndScale.value = scales[index2];

//         // Run simulation
//         gl.setRenderTarget(renderTarget1);
//         gl.clear();
//         gl.render(scene, camera);
//         gl.setRenderTarget(null);

//         // ✅ FIXED: Update render uniforms
//         const renderUniforms = renderMaterialRef.current.uniforms;
//         renderUniforms.uPositions.value = renderTarget1.texture;
//         renderUniforms.uProgress.value = progress;
//         renderUniforms.uColor1.value = colors[index1];
//         renderUniforms.uColor2.value = colors[index2];

//         // Rotation
//         pointsRef.current.rotation.y += 0.002;
//     });

//     const particlePositions = useMemo(() => new Float32Array(numPoints * 3), [numPoints]);
    
//     if (shapeTextures.length === 0) return null;

//     return (
//         <>
//             {createPortal(
//                 <mesh>
//                     <planeGeometry args={[2, 2]} />
//                     <shaderMaterial
//                         ref={simulationMaterialRef}
//                         vertexShader={simulationVertexShader}
//                         fragmentShader={simulationFragmentShader}
//                         uniforms={{
//                             uStartPositions: { value: shapeTextures[0] },
//                             uEndPositions: { value: shapeTextures[1] },
//                             uStartScale: { value: 1.0 },
//                             uEndScale: { value: 1.0 },
//                             uProgress: { value: 0.0 },
//                         }}
//                     />
//                 </mesh>,
//                 scene
//             )}
            
//             <points ref={pointsRef} scale={1}> {/* ✅ Added scale back */}
//                 <bufferGeometry>
//                     <bufferAttribute attach="attributes-position" count={particlePositions.length / 3} array={particlePositions} itemSize={3} />
//                     <bufferAttribute attach="attributes-uv" count={particleUVs.length / 2} array={particleUVs} itemSize={2} />
//                 </bufferGeometry>
//                 <shaderMaterial
//                     ref={renderMaterialRef}
//                     vertexShader={renderVertexShader}
//                     fragmentShader={renderFragmentShader}
//                     uniforms={{
//                         uPositions: { value: shapeTextures[0] },
//                         uSize: { value: 2.0 }, // ✅ Larger point size
//                         uColor1: { value: colors[0] },
//                         uColor2: { value: colors[1] },
//                         uProgress: { value: 0.0 }
//                     }}
//                     transparent={true}
//                     blending={THREE.AdditiveBlending}
//                     depthWrite={false}
//                 />
//             </points>
//         </>
//     );
// };

// export default ParticleScene;

//     ==================================================================================100 % working code for GPGPU  for multiple shapes perplexity ===============================================================



//     ==================================================================================Progressive loading with memory management with perplexity 100% working but issue is disruption so lets fix that ===============================================================
// import React, { useMemo, useRef, useState, useEffect } from 'react';
// import { useFrame, createPortal } from '@react-three/fiber';
// import { useFBO, Html } from '@react-three/drei';
// import * as THREE from 'three';

// // ✅ CONVERTED: Sine Wave
// const generateSineWavePoints = (numPoints, cycles = 2) => {
//     const points = new Float32Array(numPoints * 4);
//     const width = 2.5; 
//     const height = 0.5;
//     for (let i = 0; i < numPoints; i++) {
//         const x = (Math.random() - 0.5) * width;
//         const y = Math.sin(x * Math.PI * cycles) * height;
//         const z = (Math.random() - 0.5) * 0.5;
//         points[i * 4 + 0] = x;
//         points[i * 4 + 1] = y;
//         points[i * 4 + 2] = z;
//         points[i * 4 + 3] = 1.0;
//     }
//     return points;
// };

// // ✅ CONVERTED: Lorenz Attractor
// const generateLorenzPoints = (numPoints) => {
//     const points = new Float32Array(numPoints * 4);
//     const scale = 0.03;
//     const dt = 0.01;
//     let x = 1, y = 1, z = 1;
//     const sigma = 10, rho = 28, beta = 8/3;
//     for (let i = 0; i < numPoints; i++) {
//         const dx = sigma * (y - x) * dt;
//         const dy = (x * (rho - z) - y) * dt;
//         const dz = (x * y - beta * z) * dt;
//         x += dx; y += dy; z += dz;
//         points[i * 4 + 0] = x * scale;
//         points[i * 4 + 1] = y * scale;
//         points[i * 4 + 2] = z * scale;
//         points[i * 4 + 3] = 1.0;
//     }
//     return points;
// };

// // ✅ ADD MORE SHAPE GENERATORS HERE (placeholder functions for your 50+ shapes)
// const generateAizawaPoints = (numPoints) => {
//     const points = new Float32Array(numPoints * 4);
//     const scale = 0.15;
//     const dt = 0.01;
//     let x = 0.1, y = 0, z = 0;
//     const a = 0.95, b = 0.7, c = 0.6, d = 3.5, e = 0.25, f = 0.1;
//     for (let i = 0; i < numPoints; i++) {
//         const dx = ((z - b) * x - d * y) * dt;
//         const dy = (d * x + (z - b) * y) * dt;
//         const dz = (c + a * z - (z * z * z) / 3 - (x * x + y * y) * (1 + e * z) + f * z * (x * x * x)) * dt;
//         x += dx; y += dy; z += dz;
//         points[i * 4 + 0] = x * scale;
//         points[i * 4 + 1] = y * scale;
//         points[i * 4 + 2] = z * scale;
//         points[i * 4 + 3] = 1.0;
//     }
//     return points;
// };

// const generateButterflyPoints = (numPoints) => {
//     const points = new Float32Array(numPoints * 4);
//     const scale = 0.15;
//     for (let i = 0; i < numPoints; i++) {
//         const t = Math.random() * 12 * Math.PI;
//         const r = Math.exp(Math.cos(t)) - 2*Math.cos(4*t) + Math.pow(Math.sin(t/12), 5);
//         const x = scale * r * Math.cos(t);
//         const y = scale * r * Math.sin(t);
//         const z = (Math.random() - 0.5) * 0.4;
//         points[i * 4 + 0] = x;
//         points[i * 4 + 1] = y;
//         points[i * 4 + 2] = z;
//         points[i * 4 + 3] = 1.0;
//     }
//     return points;
// };

// // Add more generators here... (I'll provide the rest separately if needed)

// const simulationVertexShader = `
//   varying vec2 vUv;
//   void main() {
//     vUv = uv;
//     gl_Position = vec4(position, 1.0);
//   }
// `;

// const simulationFragmentShader = `
//   varying vec2 vUv;
//   uniform sampler2D uStartPositions;
//   uniform sampler2D uEndPositions;
//   uniform float uProgress;
//   uniform float uStartScale;
//   uniform float uEndScale;

//   void main() {
//     vec4 pos1 = texture2D(uStartPositions, vUv);
//     vec4 pos2 = texture2D(uEndPositions, vUv);
    
//     float currentScale = mix(uStartScale, uEndScale, uProgress);
//     vec3 finalPosition = mix(pos1.rgb, pos2.rgb, uProgress) * currentScale;
    
//     gl_FragColor = vec4(finalPosition, 1.0);
//   }
// `;

// const renderVertexShader = `
//   uniform sampler2D uPositions;
//   uniform float uSize;
  
//   void main() {
//     vec3 pos = texture2D(uPositions, uv).rgb;
//     vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
//     gl_PointSize = uSize;
//     gl_Position = projectionMatrix * mvPosition;
//   }
// `;

// const renderFragmentShader = `
//   uniform vec3 uColor1;
//   uniform vec3 uColor2;
//   uniform float uProgress;
  
//   void main() {
//     if (length(gl_PointCoord - vec2(0.5, 0.5)) > 0.475) discard;
//     vec3 finalColor = mix(uColor1, uColor2, uProgress);
//     gl_FragColor = vec4(finalColor, 1.0);
//   }
// `;

// // --- MAIN COMPONENT ---
// const ParticleScene = () => {
//     const pointsRef = useRef();
//     const simulationMaterialRef = useRef();
//     const renderMaterialRef = useRef();
    
//     // ✅ UPGRADED: 256x256 for high quality (65,536 particles per shape)
//     const textureSize = 256;
//     const numPoints = textureSize * textureSize;

//     // ✅ PROGRESSIVE LOADING STATE
//     const [loadedShapes, setLoadedShapes] = useState([]);
//     const [loadingProgress, setLoadingProgress] = useState(0);
//     const [isLoading, setIsLoading] = useState(true);
//     const [loadingStatus, setLoadingStatus] = useState('Initializing...');

//     // ✅ MEMORY MANAGEMENT SETTINGS
//     const MAX_SHAPES_IN_MEMORY = 20; // Keep 20 shapes max in memory
//     const LOADING_DELAY = 30; // 30ms between each shape load

//     // ✅ DEFINE ALL YOUR SHAPES (Add your 50+ shapes here)
//     const shapeDefinitions = useMemo(() => [
//         { name: "SineWave", generator: generateSineWavePoints, color: new THREE.Color('#00ff00'), scale: 1.0 },
//         { name: "Lorenz", generator: generateLorenzPoints, color: new THREE.Color('#ff4500'), scale: 1.0 },
//         { name: "Aizawa", generator: generateAizawaPoints, color: new THREE.Color('#ff6347'), scale: 1.0 },
//         { name: "Butterfly", generator: generateButterflyPoints, color: new THREE.Color('#ff00ff'), scale: 1.0 },
//         // ✅ ADD YOUR 46+ MORE SHAPES HERE
//         // { name: "Rose", generator: generateRosePoints, color: new THREE.Color('#ff69b4'), scale: 2.5 },
//         // { name: "Torus", generator: generateTorusPoints, color: new THREE.Color('#1e90ff'), scale: 1.5 },
//         // { name: "Klein", generator: generateKleinBottlePoints, color: new THREE.Color('#dc143c'), scale: 3.0 },
//         // ... add all your shape definitions here
//     ], []);

//     // ✅ PROGRESSIVE LOADING WITH MEMORY MANAGEMENT
//     useEffect(() => {
//         const loadShapesProgressively = async () => {
//             setIsLoading(true);
//             setLoadingProgress(0);
            
//             try {
//                 for (let i = 0; i < shapeDefinitions.length; i++) {
//                     const shapeDef = shapeDefinitions[i];
                    
//                     setLoadingStatus(`Loading ${shapeDef.name}... (${i + 1}/${shapeDefinitions.length})`);
                    
//                     // ✅ GENERATE SHAPE DATA
//                     const positions = shapeDef.generator(numPoints);
                    
//                     // ✅ CREATE OPTIMIZED TEXTURE
//                     const texture = new THREE.DataTexture(
//                         positions, 
//                         textureSize, 
//                         textureSize, 
//                         THREE.RGBAFormat, 
//                         THREE.FloatType
//                     );
//                     texture.needsUpdate = true;
//                     texture.magFilter = THREE.NearestFilter;
//                     texture.minFilter = THREE.NearestFilter;
//                     texture.wrapS = THREE.ClampToEdgeWrapping;
//                     texture.wrapT = THREE.ClampToEdgeWrapping;
//                     texture.generateMipmaps = false; // Memory optimization
//                     texture.flipY = false; // Performance optimization
                    
//                     // ✅ ADD SHAPE WITH MEMORY MANAGEMENT
//                     setLoadedShapes(prev => {
//                         const newShape = {
//                             ...shapeDef,
//                             texture: texture,
//                             data: positions,
//                             loadedAt: Date.now(),
//                             id: `${shapeDef.name}_${i}`
//                         };
                        
//                         const updated = [...prev, newShape];
                        
//                         // ✅ MEMORY MANAGEMENT: Keep only latest shapes
//                         if (updated.length > MAX_SHAPES_IN_MEMORY) {
//                             const shapesToKeep = updated.slice(-MAX_SHAPES_IN_MEMORY);
                            
//                             // Clean up old textures to free GPU memory
//                             const shapesToRemove = updated.slice(0, updated.length - MAX_SHAPES_IN_MEMORY);
//                             shapesToRemove.forEach(shape => {
//                                 if (shape.texture) {
//                                     shape.texture.dispose();
//                                 }
//                             });
                            
//                             console.log(`Memory management: Keeping ${shapesToKeep.length} shapes, removed ${shapesToRemove.length} old shapes`);
//                             return shapesToKeep;
//                         }
                        
//                         return updated;
//                     });
                    
//                     // ✅ UPDATE PROGRESS
//                     const progress = ((i + 1) / shapeDefinitions.length) * 100;
//                     setLoadingProgress(progress);
                    
//                     console.log(`✅ Loaded ${i + 1}/${shapeDefinitions.length}: ${shapeDef.name} (${progress.toFixed(1)}%)`);
                    
//                     // ✅ YIELD TO BROWSER (prevents hanging)
//                     await new Promise(resolve => setTimeout(resolve, LOADING_DELAY));
//                 }
                
//                 setIsLoading(false);
//                 setLoadingStatus('All shapes loaded!');
//                 console.log(`🎉 Successfully loaded ${shapeDefinitions.length} shapes with memory management!`);
                
//             } catch (error) {
//                 console.error('❌ Error during progressive loading:', error);
//                 setLoadingStatus(`Error: ${error.message}`);
//                 setIsLoading(false);
//             }
//         };

//         loadShapesProgressively();
        
//         // ✅ CLEANUP ON UNMOUNT
//         return () => {
//             setLoadedShapes(prev => {
//                 prev.forEach(shape => {
//                     if (shape.texture) {
//                         shape.texture.dispose();
//                     }
//                 });
//                 return [];
//             });
//         };
//     }, [shapeDefinitions, numPoints, textureSize]);

//     // ✅ EXTRACT DATA FROM LOADED SHAPES
//     const shapeTextures = useMemo(() => {
//         return loadedShapes.map(shape => shape.texture).filter(Boolean);
//     }, [loadedShapes]);

//     const colors = useMemo(() => {
//         return loadedShapes.map(shape => shape.color);
//     }, [loadedShapes]);

//     const scales = useMemo(() => {
//         return loadedShapes.map(shape => shape.scale || 1.0);
//     }, [loadedShapes]);

//     // ✅ FBO SETUP
//     let renderTarget1 = useFBO(textureSize, textureSize, { 
//         format: THREE.RGBAFormat, 
//         type: THREE.FloatType,
//         magFilter: THREE.NearestFilter,
//         minFilter: THREE.NearestFilter
//     });

//     const { scene, camera } = useMemo(() => {
//         const scene = new THREE.Scene();
//         const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
//         return { scene, camera };
//     }, []);

//     const particleUVs = useMemo(() => {
//         const uvs = new Float32Array(numPoints * 2);
//         for (let i = 0; i < textureSize; i++) {
//             for (let j = 0; j < textureSize; j++) {
//                 const index = i * textureSize + j;
//                 uvs[index * 2 + 0] = j / (textureSize - 1);
//                 uvs[index * 2 + 1] = i / (textureSize - 1);
//             }
//         }
//         return uvs;
//     }, [numPoints, textureSize]);

//     // ✅ ANIMATION LOGIC (Updated for progressive loading)
//     useFrame(({ gl, clock }) => {
//         // Wait until we have shapes loaded
//         if (!renderMaterialRef.current || !simulationMaterialRef.current || shapeTextures.length === 0) return;

//         const time = clock.getElapsedTime();
//         const transitionDuration = 3;
//         const holdDuration = 5;
//         const numShapes = loadedShapes.length; // Use loaded shapes count
        
//         if (numShapes === 0) return;
        
//         const cycleDuration = transitionDuration + holdDuration;
//         const cycleTime = time % (cycleDuration * numShapes);
//         const currentPhase = Math.floor(cycleTime / cycleDuration);
        
//         const timeInPhase = cycleTime % cycleDuration;
//         const progress = Math.min(timeInPhase / transitionDuration, 1.0);

//         const index1 = currentPhase % numShapes;
//         const index2 = (currentPhase + 1) % numShapes;

//         // ✅ UPDATE SIMULATION UNIFORMS
//         const simUniforms = simulationMaterialRef.current.uniforms;
//         simUniforms.uStartPositions.value = shapeTextures[index1];
//         simUniforms.uEndPositions.value = shapeTextures[index2];
//         simUniforms.uProgress.value = progress;
//         simUniforms.uStartScale.value = scales[index1];
//         simUniforms.uEndScale.value = scales[index2];

//         // Run simulation
//         gl.setRenderTarget(renderTarget1);
//         gl.clear();
//         gl.render(scene, camera);
//         gl.setRenderTarget(null);

//         // ✅ UPDATE RENDER UNIFORMS
//         const renderUniforms = renderMaterialRef.current.uniforms;
//         renderUniforms.uPositions.value = renderTarget1.texture;
//         renderUniforms.uProgress.value = progress;
//         renderUniforms.uColor1.value = colors[index1];
//         renderUniforms.uColor2.value = colors[index2];

//         // Rotation
//         if (pointsRef.current) {
//             pointsRef.current.rotation.y += 0.002;
//         }
//     });

//     const particlePositions = useMemo(() => new Float32Array(numPoints * 3), [numPoints]);
    
//     // ✅ LOADING UI
//     if (isLoading || loadedShapes.length === 0) {
//         // return (
//         //     <group>
//         //         {/* Loading indicator */}
//         //         <Html center>
//         //             <div style={{ 
//         //                 textAlign: 'center', 
//         //                 color: 'white', 
//         //                 fontFamily: 'Arial, sans-serif',
//         //                 background: 'rgba(0,0,0,0.8)',
//         //                 padding: '20px',
//         //                 borderRadius: '10px',
//         //                 minWidth: '300px'
//         //             }}>
//         //                 <div style={{ fontSize: '18px', marginBottom: '15px' }}>
//         //                     🚀 Loading Mathematical Shapes
//         //                 </div>
//         //                 <div style={{ fontSize: '14px', marginBottom: '10px', opacity: 0.8 }}>
//         //                     {loadingStatus}
//         //                 </div>
//         //                 <div style={{ 
//         //                     width: '100%', 
//         //                     height: '6px', 
//         //                     backgroundColor: '#333', 
//         //                     borderRadius: '3px',
//         //                     overflow: 'hidden',
//         //                     marginBottom: '10px'
//         //                 }}>
//         //                     <div style={{ 
//         //                         width: `${loadingProgress}%`, 
//         //                         height: '100%', 
//         //                         backgroundColor: '#00ff88',
//         //                         borderRadius: '3px',
//         //                         transition: 'width 0.3s ease'
//         //                     }}></div>
//         //                 </div>
//         //                 <div style={{ fontSize: '12px', opacity: 0.6 }}>
//         //                     {loadingProgress.toFixed(1)}% Complete
//         //                 </div>
//         //                 <div style={{ fontSize: '10px', marginTop: '10px', opacity: 0.5 }}>
//         //                     Memory: {loadedShapes.length}/{MAX_SHAPES_IN_MEMORY} shapes loaded
//         //                 </div>
//         //             </div>
//         //         </Html>
//         //     </group>
//         // );
//         return null; // Return null to avoid rendering anything while loading
//     }

//     // ✅ MAIN RENDER (Only when shapes are loaded)
//     return (
//         <>
//             {createPortal(
//                 <mesh>
//                     <planeGeometry args={[2, 2]} />
//                     <shaderMaterial
//                         ref={simulationMaterialRef}
//                         vertexShader={simulationVertexShader}
//                         fragmentShader={simulationFragmentShader}
//                         uniforms={{
//                             uStartPositions: { value: shapeTextures[0] || null },
//                             uEndPositions: { value: shapeTextures[1] || shapeTextures[0] || null },
//                             uStartScale: { value: 1.0 },
//                             uEndScale: { value: 1.0 },
//                             uProgress: { value: 0.0 },
//                         }}
//                     />
//                 </mesh>,
//                 scene
//             )}
            
//             <points ref={pointsRef} scale={1}>
//                 <bufferGeometry>
//                     <bufferAttribute attach="attributes-position" count={particlePositions.length / 3} array={particlePositions} itemSize={3} />
//                     <bufferAttribute attach="attributes-uv" count={particleUVs.length / 2} array={particleUVs} itemSize={2} />
//                 </bufferGeometry>
//                 <shaderMaterial
//                     ref={renderMaterialRef}
//                     vertexShader={renderVertexShader}
//                     fragmentShader={renderFragmentShader}
//                     uniforms={{
//                         uPositions: { value: shapeTextures[0] || null },
//                         uSize: { value: 2.0 },
//                         uColor1: { value: colors[0] || new THREE.Color('#ffffff') },
//                         uColor2: { value: colors[1] || colors[0] || new THREE.Color('#ffffff') },
//                         uProgress: { value: 0.0 }
//                     }}
//                     transparent={true}
//                     blending={THREE.AdditiveBlending}
//                     depthWrite={false}
//                 />
//             </points>
//         </>
//     );
// };

// export default ParticleScene;

//     ==================================================================================Progressive loading with memory management with perplexity 100% working but issue is disruption so lets fix that ===============================================================


// import React, { useMemo, useRef, useState, useEffect } from 'react';
// import { useFrame, createPortal } from '@react-three/fiber';
// import { useFBO, Html } from '@react-three/drei';
// import * as THREE from 'three';

// // ✅ CONVERTED: Sine Wave
// const generateSineWavePoints = (numPoints, cycles = 2) => {
//     const points = new Float32Array(numPoints * 4);
//     const width = 2.5; 
//     const height = 0.5;
//     for (let i = 0; i < numPoints; i++) {
//         const x = (Math.random() - 0.5) * width;
//         const y = Math.sin(x * Math.PI * cycles) * height;
//         const z = (Math.random() - 0.5) * 0.5;
//         points[i * 4 + 0] = x;
//         points[i * 4 + 1] = y;
//         points[i * 4 + 2] = z;
//         points[i * 4 + 3] = 1.0;
//     }
//     return points;
// };

// // ✅ CONVERTED: Lorenz Attractor
// const generateLorenzPoints = (numPoints) => {
//     const points = new Float32Array(numPoints * 4);
//     const scale = 0.03;
//     const dt = 0.01;
//     let x = 1, y = 1, z = 1;
//     const sigma = 10, rho = 28, beta = 8/3;
//     for (let i = 0; i < numPoints; i++) {
//         const dx = sigma * (y - x) * dt;
//         const dy = (x * (rho - z) - y) * dt;
//         const dz = (x * y - beta * z) * dt;
//         x += dx; y += dy; z += dz;
//         points[i * 4 + 0] = x * scale;
//         points[i * 4 + 1] = y * scale;
//         points[i * 4 + 2] = z * scale;
//         points[i * 4 + 3] = 1.0;
//     }
//     return points;
// };

// // ✅ ADD MORE SHAPE GENERATORS HERE (placeholder functions for your 50+ shapes)
// const generateAizawaPoints = (numPoints) => {
//     const points = new Float32Array(numPoints * 4);
//     const scale = 0.15;
//     const dt = 0.01;
//     let x = 0.1, y = 0, z = 0;
//     const a = 0.95, b = 0.7, c = 0.6, d = 3.5, e = 0.25, f = 0.1;
//     for (let i = 0; i < numPoints; i++) {
//         const dx = ((z - b) * x - d * y) * dt;
//         const dy = (d * x + (z - b) * y) * dt;
//         const dz = (c + a * z - (z * z * z) / 3 - (x * x + y * y) * (1 + e * z) + f * z * (x * x * x)) * dt;
//         x += dx; y += dy; z += dz;
//         points[i * 4 + 0] = x * scale;
//         points[i * 4 + 1] = y * scale;
//         points[i * 4 + 2] = z * scale;
//         points[i * 4 + 3] = 1.0;
//     }
//     return points;
// };

// const generateButterflyPoints = (numPoints) => {
//     const points = new Float32Array(numPoints * 4);
//     const scale = 0.15;
//     for (let i = 0; i < numPoints; i++) {
//         const t = Math.random() * 12 * Math.PI;
//         const r = Math.exp(Math.cos(t)) - 2*Math.cos(4*t) + Math.pow(Math.sin(t/12), 5);
//         const x = scale * r * Math.cos(t);
//         const y = scale * r * Math.sin(t);
//         const z = (Math.random() - 0.5) * 0.4;
//         points[i * 4 + 0] = x;
//         points[i * 4 + 1] = y;
//         points[i * 4 + 2] = z;
//         points[i * 4 + 3] = 1.0;
//     }
//     return points;
// };

// // Add more generators here... (I'll provide the rest separately if needed)

// const simulationVertexShader = `
//   varying vec2 vUv;
//   void main() {
//     vUv = uv;
//     gl_Position = vec4(position, 1.0);
//   }
// `;

// const simulationFragmentShader = `
//   varying vec2 vUv;
//   uniform sampler2D uStartPositions;
//   uniform sampler2D uEndPositions;
//   uniform float uProgress;
//   uniform float uStartScale;
//   uniform float uEndScale;

//   void main() {
//     // ✅ ENSURE PROPER TEXTURE SAMPLING
//     vec4 pos1 = texture2D(uStartPositions, vUv);
//     vec4 pos2 = texture2D(uEndPositions, vUv);
    
//     // ✅ VALIDATE INPUT DATA
//     if (pos1.a < 0.5 || pos2.a < 0.5) {
//         // Invalid data - use fallback
//         gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);
//         return;
//     }
    
//     // ✅ APPLY SCALING
//     float currentScale = mix(uStartScale, uEndScale, uProgress);
//     vec3 finalPosition = mix(pos1.rgb, pos2.rgb, uProgress) * currentScale;
    
//     // ✅ ENSURE VALID OUTPUT
//     gl_FragColor = vec4(finalPosition, 1.0);
//   }
// `;


// const renderVertexShader = `
//   uniform sampler2D uPositions;
//   uniform float uSize;
  
//   void main() {
//     vec3 pos = texture2D(uPositions, uv).rgb;
//     vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
//     gl_PointSize = uSize;
//     gl_Position = projectionMatrix * mvPosition;
//   }
// `;

// const renderFragmentShader = `
//   uniform vec3 uColor1;
//   uniform vec3 uColor2;
//   uniform float uProgress;
  
//   void main() {
//     if (length(gl_PointCoord - vec2(0.5, 0.5)) > 0.475) discard;
//     vec3 finalColor = mix(uColor1, uColor2, uProgress);
//     gl_FragColor = vec4(finalColor, 1.0);
//   }
// `;

// // --- MAIN COMPONENT ---
// // --- MAIN COMPONENT ---
// const ParticleScene = () => {
//     const pointsRef = useRef();
//     const simulationMaterialRef = useRef();
//     const renderMaterialRef = useRef();
    
//     // ✅ ADD THESE MISSING TIMING REFS HERE
//     const startTimeRef = useRef(Date.now());
//     const currentPhaseRef = useRef(0);
//     const isFirstRenderRef = useRef(true);
//     const lastRenderTimeRef = useRef(Date.now());
//     const frameSkipCounterRef = useRef(0);
    
//     // ✅ UPGRADED: 256x256 for high quality (65,536 particles per shape)
//     const textureSize = 256;
//     const numPoints = textureSize * textureSize;

//     // ✅ PROGRESSIVE LOADING STATE
//     const [loadedShapes, setLoadedShapes] = useState([]);
//     const [loadingProgress, setLoadingProgress] = useState(0);
//     const [isLoading, setIsLoading] = useState(true);
//     const [loadingStatus, setLoadingStatus] = useState('Initializing...');

//     // ✅ MEMORY MANAGEMENT SETTINGS
//     const MAX_SHAPES_IN_MEMORY = 20; // Keep 20 shapes max in memory
//     const LOADING_DELAY = 30; // 30ms between each shape load

//     // ✅ DEFINE ALL YOUR SHAPES (Add your 50+ shapes here)
//     const shapeDefinitions = useMemo(() => [
//         { name: "SineWave", generator: generateSineWavePoints, color: new THREE.Color('#00ff00'), scale: 1.0 },
//         { name: "Lorenz", generator: generateLorenzPoints, color: new THREE.Color('#ff4500'), scale: 1.0 },
//         { name: "Aizawa", generator: generateAizawaPoints, color: new THREE.Color('#ff6347'), scale: 1.0 },
//         { name: "Butterfly", generator: generateButterflyPoints, color: new THREE.Color('#ff00ff'), scale: 1.0 },
//         // ✅ ADD YOUR 46+ MORE SHAPES HERE
//         // { name: "Rose", generator: generateRosePoints, color: new THREE.Color('#ff69b4'), scale: 2.5 },
//         // { name: "Torus", generator: generateTorusPoints, color: new THREE.Color('#1e90ff'), scale: 1.5 },
//         // { name: "Klein", generator: generateKleinBottlePoints, color: new THREE.Color('#dc143c'), scale: 3.0 },
//         // ... add all your shape definitions here
//     ], []);

//     // ✅ PROGRESSIVE LOADING WITH MEMORY MANAGEMENT
//     useEffect(() => {
//         const loadShapesProgressively = async () => {
//             setIsLoading(true);
//             setLoadingProgress(0);
            
//             try {
//                 for (let i = 0; i < shapeDefinitions.length; i++) {
//                     const shapeDef = shapeDefinitions[i];
                    
//                     setLoadingStatus(`Loading ${shapeDef.name}... (${i + 1}/${shapeDefinitions.length})`);
                    
//                     // ✅ GENERATE SHAPE DATA
//                     const positions = shapeDef.generator(numPoints);
                    
//                     // ✅ CREATE OPTIMIZED TEXTURE
//                     const texture = new THREE.DataTexture(
//                         positions, 
//                         textureSize, 
//                         textureSize, 
//                         THREE.RGBAFormat, 
//                         THREE.FloatType
//                     );
//                     texture.needsUpdate = true;
//                     texture.magFilter = THREE.NearestFilter;
//                     texture.minFilter = THREE.NearestFilter;
//                     texture.wrapS = THREE.ClampToEdgeWrapping;
//                     texture.wrapT = THREE.ClampToEdgeWrapping;
//                     texture.generateMipmaps = false;
//                     texture.flipY = false; // Performance optimization

//                     texture.onUpdate = () => {
//                         console.log(`✅ Texture updated: ${shapeDef.name} (${texture.uuid.slice(0, 8)})`);
//                     };

//                     const sampleData = positions.slice(0, 12); // First 3 particles
//                     console.log(`📊 ${shapeDef.name} sample data:`, sampleData);
                                        
//                     // ✅ ADD SHAPE WITH MEMORY MANAGEMENT
//                     setLoadedShapes(prev => {
//                         const newShape = {
//                             ...shapeDef,
//                             texture: texture,
//                             data: positions,
//                             loadedAt: Date.now(),
//                             id: `${shapeDef.name}_${i}`
//                         };
                        
//                         const updated = [...prev, newShape];
                        
//                         // ✅ MEMORY MANAGEMENT: Keep only latest shapes
//                         if (updated.length > MAX_SHAPES_IN_MEMORY) {
//                             const shapesToKeep = updated.slice(-MAX_SHAPES_IN_MEMORY);
                            
//                             // Clean up old textures to free GPU memory
//                             const shapesToRemove = updated.slice(0, updated.length - MAX_SHAPES_IN_MEMORY);
//                             shapesToRemove.forEach(shape => {
//                                 if (shape.texture) {
//                                     shape.texture.dispose();
//                                 }
//                             });
                            
//                             console.log(`Memory management: Keeping ${shapesToKeep.length} shapes, removed ${shapesToRemove.length} old shapes`);
//                             return shapesToKeep;
//                         }
                        
//                         return updated;
//                     });
                    
//                     // ✅ UPDATE PROGRESS
//                     const progress = ((i + 1) / shapeDefinitions.length) * 100;
//                     setLoadingProgress(progress);
                    
//                     console.log(`✅ Loaded ${i + 1}/${shapeDefinitions.length}: ${shapeDef.name} (${progress.toFixed(1)}%)`);
                    
//                     // ✅ YIELD TO BROWSER (prevents hanging)
//                     await new Promise(resolve => setTimeout(resolve, LOADING_DELAY));
//                 }
                
//                 setIsLoading(false);
//                 setLoadingStatus('All shapes loaded!');
//                 console.log(`🎉 Successfully loaded ${shapeDefinitions.length} shapes with memory management!`);
                
//             } catch (error) {
//                 console.error('❌ Error during progressive loading:', error);
//                 setLoadingStatus(`Error: ${error.message}`);
//                 setIsLoading(false);
//             }
//         };

//         loadShapesProgressively();
        
//         // ✅ CLEANUP ON UNMOUNT
//         return () => {
//             setLoadedShapes(prev => {
//                 prev.forEach(shape => {
//                     if (shape.texture) {
//                         shape.texture.dispose();
//                     }
//                 });
//                 return [];
//             });
//         };
//     }, [shapeDefinitions, numPoints, textureSize]);

//     // ✅ EXTRACT DATA FROM LOADED SHAPES
//     const shapeTextures = useMemo(() => {
//         return loadedShapes.map(shape => shape.texture).filter(Boolean);
//     }, [loadedShapes]);

//     const colors = useMemo(() => {
//         return loadedShapes.map(shape => shape.color);
//     }, [loadedShapes]);

//     const scales = useMemo(() => {
//         return loadedShapes.map(shape => shape.scale || 1.0);
//     }, [loadedShapes]);

//     // ✅ FBO SETUP
//     // ✅ ENHANCED FBO SETUP
//       let renderTarget1 = useFBO(textureSize, textureSize, { 
//           format: THREE.RGBAFormat, 
//           type: THREE.FloatType,
//           magFilter: THREE.NearestFilter,
//           minFilter: THREE.NearestFilter,
//           wrapS: THREE.ClampToEdgeWrapping,
//           wrapT: THREE.ClampToEdgeWrapping,
//           generateMipmaps: false,
//           stencilBuffer: false,
//           depthBuffer: false
//       });


//     const { scene, camera } = useMemo(() => {
//         const scene = new THREE.Scene();
//         const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
//         return { scene, camera };
//     }, []);

//     const particleUVs = useMemo(() => {
//         const uvs = new Float32Array(numPoints * 2);
//         for (let i = 0; i < textureSize; i++) {
//             for (let j = 0; j < textureSize; j++) {
//                 const index = i * textureSize + j;
//                 uvs[index * 2 + 0] = j / (textureSize - 1);
//                 uvs[index * 2 + 1] = i / (textureSize - 1);
//             }
//         }
//         return uvs;
//     }, [numPoints, textureSize]);

//     // ✅ CANVAS DISRUPTION HANDLER
//     useEffect(() => {
//         let resizeTimeout;
        
//         const handleResize = () => {
//             clearTimeout(resizeTimeout);
//             resizeTimeout = setTimeout(() => {
//                 startTimeRef.current = Date.now();
//                 isFirstRenderRef.current = true;
//                 frameSkipCounterRef.current = 0;
//                 console.log("📏 Window resize completed - resetting animation");
//             }, 300);
//         };

//         const handleVisibilityChange = () => {
//             if (!document.hidden) {
//                 startTimeRef.current = Date.now();
//                 isFirstRenderRef.current = true;
//                 frameSkipCounterRef.current = 0;
//                 console.log("👁️ Tab visible again - resetting animation");
//             }
//         };

//         const handleDevTools = () => {
//             // Detect dev tools opening (window size change without resize event)
//             const checkDevTools = () => {
//                 const threshold = 160; // DevTools typical height
//                 if (window.outerHeight - window.innerHeight > threshold) {
//                     startTimeRef.current = Date.now();
//                     isFirstRenderRef.current = true;
//                     frameSkipCounterRef.current = 0;
//                     console.log("🔧 Dev tools detected - resetting animation");
//                 }
//             };
            
//             setTimeout(checkDevTools, 100);
//         };

//         window.addEventListener('resize', handleResize);
//         window.addEventListener('resize', handleDevTools);
//         document.addEventListener('visibilitychange', handleVisibilityChange);
        
//         // Check for dev tools periodically
//         const devToolsInterval = setInterval(() => {
//             const threshold = 160;
//             if (window.outerHeight - window.innerHeight > threshold && document.hasFocus()) {
//                 // Dev tools might be open
//                 isFirstRenderRef.current = true;
//             }
//         }, 1000);

//         return () => {
//             clearTimeout(resizeTimeout);
//             clearInterval(devToolsInterval);
//             window.removeEventListener('resize', handleResize);
//             window.removeEventListener('resize', handleDevTools);
//             document.removeEventListener('visibilitychange', handleVisibilityChange);
//         };
//     }, []);

//     // ✅ DISRUPTION-RESISTANT ANIMATION
//     useFrame(({ gl, clock }) => {
//         if (!renderMaterialRef.current || !simulationMaterialRef.current || shapeTextures.length === 0) return;

//         const now = Date.now();
        
//         // ✅ DETECT FRAME SKIPS (indicates canvas disruption)
//         const timeSinceLastRender = now - lastRenderTimeRef.current;
//         if (timeSinceLastRender > 100) {
//             frameSkipCounterRef.current++;
//             console.log(`⚠️ Frame skip detected: ${timeSinceLastRender}ms gap (skip #${frameSkipCounterRef.current})`);
//             startTimeRef.current = now;
//             isFirstRenderRef.current = true;
//         }
//         lastRenderTimeRef.current = now;

//         // ✅ COMPLETE TIMING CALCULATIONS
//         const realElapsedTime = (now - startTimeRef.current) / 1000;
        
//         const transitionDuration = 3;
//         const holdDuration = 5; 
//         const numShapes = loadedShapes.length;
        
//         if (numShapes === 0) return;
        
//         const cycleDuration = transitionDuration + holdDuration;
//         const cycleTime = realElapsedTime % (cycleDuration * numShapes);
//         const currentPhase = Math.floor(cycleTime / cycleDuration);
        
//         // ✅ FORCE RE-SYNC: Always reset on first render or phase mismatch
//         if (isFirstRenderRef.current || Math.abs(currentPhase - currentPhaseRef.current) > 1) {
//             if (Math.abs(currentPhase - currentPhaseRef.current) > 1) {
//                 console.log(`🔄 Phase jump detected: ${currentPhaseRef.current} → ${currentPhase}, re-syncing...`);
//                 startTimeRef.current = now - (currentPhase * cycleDuration * 1000);
//             }
//             isFirstRenderRef.current = false;
//             console.log("🎯 Animation synchronized");
//         }
        
//         // ✅ CRITICAL FIX: Handle phase transitions and force updates TOGETHER
//         let forceUpdate = false;
//         if (currentPhase !== currentPhaseRef.current) {
//             const expectedNext = (currentPhaseRef.current + 1) % numShapes;
//             if (currentPhase === expectedNext || currentPhase === 0) {
//                 console.log(`✅ Natural transition: ${currentPhase} → ${(currentPhase + 1) % numShapes}`);
//                 forceUpdate = true; // ✅ Set force update flag BEFORE updating phase
//             } else {
//                 console.log(`🚨 Unexpected phase jump: ${currentPhaseRef.current} → ${currentPhase}, forcing sync...`);
//                 startTimeRef.current = now - (currentPhase * cycleDuration * 1000);
//                 forceUpdate = true;
//             }
//             currentPhaseRef.current = currentPhase; // ✅ Update phase AFTER setting force flag
//         }
        
//         const timeInPhase = cycleTime % cycleDuration;
//         const progress = Math.min(timeInPhase / transitionDuration, 1.0);

//         const index1 = currentPhase % numShapes;
//         const index2 = (currentPhase + 1) % numShapes;

//         if (!shapeTextures[index1] || !shapeTextures[index2]) {
//             console.log(`❌ Invalid indices: ${index1}, ${index2} for ${numShapes} shapes`);
//             return;
//         }

//         // ✅ DETAILED DEBUGGING: Log everything that matters
//         if (frameSkipCounterRef.current % 60 === 0) {
//             console.log('🔍 GPGPU Debug:', {
//                 phase: `${index1} → ${index2}`,
//                 progress: progress.toFixed(3),
//                 timeInPhase: timeInPhase.toFixed(2),
//                 textures: {
//                     texture1_exists: !!shapeTextures[index1],
//                     texture2_exists: !!shapeTextures[index2],
//                     texture1_uuid: shapeTextures[index1]?.uuid?.slice(0, 8),
//                     texture2_uuid: shapeTextures[index2]?.uuid?.slice(0, 8),
//                 },
//                 renderTarget: {
//                     exists: !!renderTarget1,
//                     size: `${renderTarget1.width}x${renderTarget1.height}`,
//                     format: renderTarget1.texture?.format,
//                     type: renderTarget1.texture?.type
//                 }
//             });
//         }

//         try {
//             const simUniforms = simulationMaterialRef.current.uniforms;
            
//             const currentTexture = shapeTextures[index1];
//             const nextTexture = shapeTextures[index2];
            
//             if (!currentTexture || !nextTexture || currentTexture === nextTexture) {
//                 return;
//             }
            
//             // ✅ FORCE UNIFORM UPDATES
//             simUniforms.uStartPositions.value = currentTexture;
//             simUniforms.uEndPositions.value = nextTexture;
//             simUniforms.uProgress.value = progress;
//             simUniforms.uStartScale.value = scales[index1] || 1.0;
//             simUniforms.uEndScale.value = scales[index2] || 1.0;

//             // ✅ CRITICAL FIX: Force material update when phase changes
//             if (forceUpdate) {
//                 simulationMaterialRef.current.needsUpdate = true;
//                 console.log(`🔄 Forcing material update for phase ${currentPhase}`);
//             }

//             // ✅ ENHANCED RENDER TARGET CLEARING
//             gl.setRenderTarget(renderTarget1);
            
//             // Force complete clear
//             gl.clearColor(0, 0, 0, 0);
//             gl.clear(gl.COLOR_BUFFER_BIT);
            
//             // ✅ FORCE SHADER RECOMPILATION ON PHASE CHANGE
//             if (forceUpdate) {
//                 // Force shader recompilation
//                 simulationMaterialRef.current.visible = false;
//                 simulationMaterialRef.current.visible = true;
//             }
            
//             gl.render(scene, camera);
//             gl.setRenderTarget(null);

//             // ✅ VERIFY RENDER TARGET: Add back the pixel check
//             if (frameSkipCounterRef.current % 120 === 0) {
//                 try {
//                     const pixels = new Float32Array(4);
//                     gl.readRenderTargetPixels(renderTarget1, 0, 0, 1, 1, pixels);
//                     console.log('🎯 Render target pixel check (FLOAT):', Array.from(pixels));
                    
//                     const hasData = pixels.some(val => Math.abs(val) > 0.001);
//                     console.log('🔍 Simulation active:', hasData);
//                 } catch (error) {
//                     console.error('❌ ReadPixels error:', error);
//                 }
//             }

//             // ✅ ENSURE RENDER MATERIAL GETS UPDATED TEXTURE
//             const renderUniforms = renderMaterialRef.current.uniforms;
//             renderUniforms.uPositions.value = renderTarget1.texture;
//             renderUniforms.uPositions.needsUpdate = true;
//             renderUniforms.uProgress.value = progress;
//             renderUniforms.uColor1.value = colors[index1] || new THREE.Color('#ffffff');
//             renderUniforms.uColor2.value = colors[index2] || new THREE.Color('#ffffff');

//             if (pointsRef.current) {
//                 pointsRef.current.rotation.y += 0.002;
//             }
            
//         } catch (error) {
//             console.error("❌ Render error:", error);
//             isFirstRenderRef.current = true;
//         }
        
//         // ✅ INCREMENT FRAME COUNTER
//         frameSkipCounterRef.current++;
//     });


//     const particlePositions = useMemo(() => new Float32Array(numPoints * 3), [numPoints]);
    
//     // ✅ LOADING UI
//     if (isLoading || loadedShapes.length === 0) {
//         return null; // Return null to avoid rendering anything while loading
//     }

//     // ✅ MAIN RENDER (Only when shapes are loaded)
//     return (
//         <>
//             {createPortal(
//                 <mesh>
//                     <planeGeometry args={[2, 2]} />
//                     <shaderMaterial
//                         ref={simulationMaterialRef}
//                         vertexShader={simulationVertexShader}
//                         fragmentShader={`
//                             varying vec2 vUv;
//                             uniform sampler2D uStartPositions;
//                             uniform sampler2D uEndPositions;
//                             uniform float uProgress;
//                             uniform float uStartScale;
//                             uniform float uEndScale;

//                             void main() {
//                                 vec4 pos1 = texture2D(uStartPositions, vUv);
//                                 vec4 pos2 = texture2D(uEndPositions, vUv);
                                
//                                 // ✅ DEBUG: Force different output based on progress
//                                 if (uProgress < 0.5) {
//                                     // During transition - use mixed position
//                                     vec3 finalPosition = mix(pos1.rgb, pos2.rgb, uProgress) * uStartScale;
//                                     gl_FragColor = vec4(finalPosition, 1.0);
//                                 } else {
//                                     // After transition - force end position
//                                     vec3 finalPosition = pos2.rgb * uEndScale;
//                                     gl_FragColor = vec4(finalPosition, 1.0);
//                                 }
                                
//                                 // ✅ DEBUG: Add a small random offset to detect if this is running
//                                 gl_FragColor.xyz += vec3(0.001, 0.001, 0.001) * sin(vUv.x * 100.0);
//                             }
//                         `}
//                         uniforms={{
//                             uStartPositions: { value: shapeTextures[0] || null },
//                             uEndPositions: { value: shapeTextures[1] || shapeTextures[0] || null },
//                             uStartScale: { value: 1.0 },
//                             uEndScale: { value: 1.0 },
//                             uProgress: { value: 0.0 },
//                         }}
//                         transparent={false}
//                         depthTest={false}
//                         depthWrite={false}
//                     />
//                 </mesh>,
//                 scene
//             )}

            
//             <points ref={pointsRef} scale={1}>
//                 <bufferGeometry>
//                     <bufferAttribute attach="attributes-position" count={particlePositions.length / 3} array={particlePositions} itemSize={3} />
//                     <bufferAttribute attach="attributes-uv" count={particleUVs.length / 2} array={particleUVs} itemSize={2} />
//                 </bufferGeometry>
//                 <shaderMaterial
//                     ref={renderMaterialRef}
//                     vertexShader={renderVertexShader}
//                     fragmentShader={renderFragmentShader}
//                     uniforms={{
//                         uPositions: { value: shapeTextures[0] || null },
//                         uSize: { value: 2.0 },
//                         uColor1: { value: colors[0] || new THREE.Color('#ffffff') },
//                         uColor2: { value: colors[1] || colors[0] || new THREE.Color('#ffffff') },
//                         uProgress: { value: 0.0 }
//                     }}
//                     transparent={true}
//                     blending={THREE.AdditiveBlending}
//                     depthWrite={false}
//                 />
//             </points>
//         </>
//     );
// };

// export default ParticleScene;









// =============================================================================working with memory managemet issue

// import React, { useMemo, useRef, useState, useEffect } from 'react';
// import { useFrame, createPortal } from '@react-three/fiber';
// import { useFBO } from '@react-three/drei';
// import * as THREE from 'three';
// import { RenderTexture } from '@react-three/drei';    

// // --- YOUR SHAPE GENERATORS (place them here) ---
// // ✅ CONVERTED: Sine Wave
// const generateSineWavePoints = (numPoints, cycles = 2) => {
//     const points = new Float32Array(numPoints * 4);
//     const width = 2.5; 
//     const height = 0.5;
//     for (let i = 0; i < numPoints; i++) {
//         const x = (Math.random() - 0.5) * width;
//         const y = Math.sin(x * Math.PI * cycles) * height;
//         const z = (Math.random() - 0.5) * 0.5;
//         points[i * 4 + 0] = x;
//         points[i * 4 + 1] = y;
//         points[i * 4 + 2] = z;
//         points[i * 4 + 3] = 1.0;
//     }
//     return points;
// };

// // ✅ CONVERTED: Lorenz Attractor
// const generateLorenzPoints = (numPoints) => {
//     const points = new Float32Array(numPoints * 4);
//     const scale = 0.03;
//     const dt = 0.01;
//     let x = 1, y = 1, z = 1;
//     const sigma = 10, rho = 28, beta = 8/3;
//     for (let i = 0; i < numPoints; i++) {
//         const dx = sigma * (y - x) * dt;
//         const dy = (x * (rho - z) - y) * dt;
//         const dz = (x * y - beta * z) * dt;
//         x += dx; y += dy; z += dz;
//         points[i * 4 + 0] = x * scale;
//         points[i * 4 + 1] = y * scale;
//         points[i * 4 + 2] = z * scale;
//         points[i * 4 + 3] = 1.0;
//     }
//     return points;
// };

// const generateAizawaPoints = (numPoints) => {
//     const points = new Float32Array(numPoints * 4);
//     const scale = 0.15;
//     const dt = 0.01;
//     let x = 0.1, y = 0, z = 0;
//     const a = 0.95, b = 0.7, c = 0.6, d = 3.5, e = 0.25, f = 0.1;
//     for (let i = 0; i < numPoints; i++) {
//         const dx = ((z - b) * x - d * y) * dt;
//         const dy = (d * x + (z - b) * y) * dt;
//         const dz = (c + a * z - (z * z * z) / 3 - (x * x + y * y) * (1 + e * z) + f * z * (x * x * x)) * dt;
//         x += dx; y += dy; z += dz;
//         points[i * 4 + 0] = x * scale;
//         points[i * 4 + 1] = y * scale;
//         points[i * 4 + 2] = z * scale;
//         points[i * 4 + 3] = 1.0;
//     }
//     return points;
// };

// const generateButterflyPoints = (numPoints) => {
//     const points = new Float32Array(numPoints * 4);
//     const scale = 0.15;
//     for (let i = 0; i < numPoints; i++) {
//         const t = Math.random() * 12 * Math.PI;
//         const r = Math.exp(Math.cos(t)) - 2*Math.cos(4*t) + Math.pow(Math.sin(t/12), 5);
//         const x = scale * r * Math.cos(t);
//         const y = scale * r * Math.sin(t);
//         const z = (Math.random() - 0.5) * 0.4;
//         points[i * 4 + 0] = x;
//         points[i * 4 + 1] = y;
//         points[i * 4 + 2] = z;
//         points[i * 4 + 3] = 1.0;
//     }
//     return points;
// };
// // --- (Keep all your shape generator functions exactly as they are) ---
// // generateSineWavePoints, generateLorenzPoints, etc.

// // --- SHAPE GENERATOR FUNCTIONS ---

// // ✅ Thomas' Cyclically Symmetric Attractor
// const generateThomasAttractorPoints = (numPoints) => {
//     const points = new Float32Array(numPoints * 4);
//     let x = 0.1, y = 0, z = 0.1;
//     const b = 0.208186, dt = 0.05;
//     for (let i = 0; i < numPoints; i++) {
//         const dx = Math.sin(y) - b * x;
//         const dy = Math.sin(z) - b * y;
//         const dz = Math.sin(x) - b * z;
//         x += dx * dt; y += dy * dt; z += dz * dt;
//         points[i * 4 + 0] = x;
//         points[i * 4 + 1] = y;
//         points[i * 4 + 2] = z;
//         points[i * 4 + 3] = 1.0;
//     }
//     return points;
// };


// // ✅ Dadras Attractor
// const generateDadrasAttractorPoints = (numPoints) => {
//     const points = new Float32Array(numPoints * 4);
//     let x = 1, y = 1, z = 1;
//     const a = 3, b = 2.7, c = 1.7, d = 2, e = 9, dt = 0.01;
//     for (let i = 0; i < numPoints; i++) {
//         const dx = y - a*x + b*y*z;
//         const dy = c*y - x*z + z;
//         const dz = d*x*y - e*z;
//         x += dx * dt; y += dy * dt; z += dz * dt;
//         points[i * 4 + 0] = x;
//         points[i * 4 + 1] = y;
//         points[i * 4 + 2] = z;
//         points[i * 4 + 3] = 1.0;
//     }
//     return points;
// };

// // ✅ Chen-Lee Attractor
// const generateChenLeeAttractorPoints = (numPoints) => {
//     const points = new Float32Array(numPoints * 4);
//     let x = 0.1, y = 0.2, z = -0.1;
//     const a = 5, b = -10, c = -0.38, dt = 0.005;
//      for (let i=0; i<100; i++) {
//         const dx = a*x - y*z;
//         const dy = b*y + x*z;
//         const dz = c*z + (x*y)/3;
//         x += dx * dt; y += dy * dt; z += dz * dt;
//     }
//     for (let i = 0; i < numPoints; i++) {
//         const dx = a*x - y*z;
//         const dy = b*y + x*z;
//         const dz = c*z + (x*y)/3;
//         x += dx * dt; y += dy * dt; z += dz * dt;
//         points[i * 4 + 0] = x;
//         points[i * 4 + 1] = y;
//         points[i * 4 + 2] = z;
//         points[i * 4 + 3] = 1.0;
//     }
//     return points;
// };

// // ✅ Halvorsen Attractor
// const generateHalvorsenAttractorPoints = (numPoints) => {
//     const points = new Float32Array(numPoints * 4);
//     let x = -1, y = 0, z = 0;
//     const a = 1.89, dt = 0.005;
//     for (let i = 0; i < numPoints; i++) {
//         const dx = -a*x - 4*y - 4*z - y*y;
//         const dy = -a*y - 4*z - 4*x - z*z;
//         const dz = -a*z - 4*x - 4*y - x*x;
//         x += dx * dt; y += dy * dt; z += dz * dt;
//         points[i * 4 + 0] = x;
//         points[i * 4 + 1] = y;
//         points[i * 4 + 2] = z;
//         points[i * 4 + 3] = 1.0;
//     }
//     return points;
// };

// // ✅ Torus Knot (p=2, q=3)
// const generateTorusKnotPoints = (numPoints) => {
//     const points = new Float32Array(numPoints * 4);
//     const p = 2, q = 3, R = 1;
//     for (let i = 0; i < numPoints; i++) {
//         const t = (i / numPoints) * 2 * Math.PI;
//         const r = Math.cos(q * t) + 2;
//         const x = r * Math.cos(p * t);
//         const y = r * Math.sin(p * t);
//         const z = -Math.sin(q * t);
//         points[i * 4 + 0] = x;
//         points[i * 4 + 1] = y;
//         points[i * 4 + 2] = z;
//         points[i * 4 + 3] = 1.0;
//     }
//     return points;
// };

// // ✅ Sphere
// const generateSpherePoints = (numPoints) => {
//     const points = new Float32Array(numPoints * 4);
//     for (let i = 0; i < numPoints; i++) {
//         const u = Math.random();
//         const v = Math.random();
//         const theta = 2 * Math.PI * u;
//         const phi = Math.acos(2 * v - 1);
//         const x = Math.sin(phi) * Math.cos(theta);
//         const y = Math.sin(phi) * Math.sin(theta);
//         const z = Math.cos(phi);
//         points[i * 4 + 0] = x;
//         points[i * 4 + 1] = y;
//         points[i * 4 + 2] = z;
//         points[i * 4 + 3] = 1.0;
//     }
//     return points;
// };

// // ✅ Viviani's Curve (Sphere intersecting a Cylinder)
// const generateVivianiPoints = (numPoints) => {
//     const points = new Float32Array(numPoints * 4);
//     const a = 1.0; // radius
//     for (let i = 0; i < numPoints; i++) {
//         const t = (i / numPoints) * 4 * Math.PI - 2 * Math.PI;
//         const x = a * (1 + Math.cos(t));
//         const y = a * Math.sin(t);
//         const z = 2 * a * Math.sin(t / 2);
//         points[i * 4 + 0] = x;
//         points[i * 4 + 1] = y;
//         points[i * 4 + 2] = z;
//         points[i * 4 + 3] = 1.0;
//     }
//     return points;
// };

// // ✅ Spiral on a Sphere (Loxodrome)
// const generateLoxodromePoints = (numPoints) => {
//     const points = new Float32Array(numPoints * 4);
//     const a = 0.2; // tightness
//     for (let i = 0; i < numPoints; i++) {
//         const t = (i / numPoints) * 20 * Math.PI - 10 * Math.PI;
//         const k = 1 / Math.sqrt(1 + a * a);
//         const x = k * Math.cos(t) / Math.cosh(a * t);
//         const y = k * Math.sin(t) / Math.cosh(a * t);
//         const z = k * Math.tanh(a * t);
//         points[i * 4 + 0] = x;
//         points[i * 4 + 1] = y;
//         points[i * 4 + 2] = z;
//         points[i * 4 + 3] = 1.0;
//     }
//     return points;
// };

// // ✅ Butterfly Curve in 3D
// const generateButterfly3DPoints = (numPoints) => {
//     const points = new Float32Array(numPoints * 4);
//     for (let i = 0; i < numPoints; i++) {
//         const t = (i / numPoints) * 24 * Math.PI;
//         const r = Math.exp(Math.cos(t)) - 2 * Math.cos(4 * t) + Math.pow(Math.sin(t / 12), 5);
//         const x = r * Math.sin(t);
//         const y = r * Math.cos(t);
//         const z = Math.sin(t/2) * 1.5;
//         points[i * 4 + 0] = x;
//         points[i * 4 + 1] = y;
//         points[i * 4 + 2] = z;
//         points[i * 4 + 3] = 1.0;
//     }
//     return points;
// };

// // ✅ Double Helix
// const generateDoubleHelixPoints = (numPoints) => {
//     const points = new Float32Array(numPoints * 4);
//     for (let i = 0; i < numPoints; i++) {
//         const t = (i / numPoints) * 6 * Math.PI;
//         const offset = (i % 2 === 0) ? 0 : Math.PI;
//         const x = Math.cos(t + offset);
//         const y = Math.sin(t + offset);
//         const z = t / (2 * Math.PI) - 1.5;
//         points[i * 4 + 0] = x;
//         points[i * 4 + 1] = y;
//         points[i * 4 + 2] = z;
//         points[i * 4 + 3] = 1.0;
//     }
//     return points;
// };

// const generateRosslerPoints = (numPoints) => {
//     const points = new Float32Array(numPoints * 4);
//     const scale = 0.08;
//     const dt = 0.01;
//     let x = 1, y = 1, z = 1;
//     const a = 0.2, b = 0.2, c = 5.7;
    
//     for (let i = 0; i < numPoints; i++) {
//         const dx = (-y - z) * dt;
//         const dy = (x + a * y) * dt;
//         const dz = (b + z * (x - c)) * dt;
//         x += dx; y += dy; z += dz;
        
//         points[i * 4 + 0] = x * scale;
//         points[i * 4 + 1] = y * scale;
//         points[i * 4 + 2] = z * scale;
//         points[i * 4 + 3] = 1.0;
//     }
//     return points;
// };


// const generateMobiusPoints = (numPoints) => {
//     const points = new Float32Array(numPoints * 4);
//     const scale = 0.5;
    
//     for (let i = 0; i < numPoints; i++) {
//         const u = (Math.random() - 0.5) * 4 * Math.PI;
//         const v = (Math.random() - 0.5) * 0.4;
        
//         const x = (1 + v * Math.cos(u / 2)) * Math.cos(u);
//         const y = (1 + v * Math.cos(u / 2)) * Math.sin(u);
//         const z = v * Math.sin(u / 2);
        
//         points[i * 4 + 0] = x * scale;
//         points[i * 4 + 1] = y * scale;
//         points[i * 4 + 2] = z * scale;
//         points[i * 4 + 3] = 1.0;
//     }
//     return points;
// };

// const generateKleinBottlePoints = (numPoints) => {
//     const points = new Float32Array(numPoints * 4);
//     const scale = 0.3;
    
//     for (let i = 0; i < numPoints; i++) {
//         const u = Math.random() * 2 * Math.PI;
//         const v = Math.random() * 2 * Math.PI;
        
//         const x = (2.5 + 1.5 * Math.cos(v)) * Math.cos(u);
//         const y = (2.5 + 1.5 * Math.cos(v)) * Math.sin(u);
//         const z = -2.5 * Math.sin(v);
//         const w = 1.5 * Math.sin(v) * Math.cos(u / 2);
        
//         points[i * 4 + 0] = (x + w) * scale;
//         points[i * 4 + 1] = y * scale;
//         points[i * 4 + 2] = z * scale;
//         points[i * 4 + 3] = 1.0;
//     }
//     return points;
// };

// const generateRose7Points = (numPoints) => {
//     const points = new Float32Array(numPoints * 4);
//     const scale = 0.4;
    
//     for (let i = 0; i < numPoints; i++) {
//         const t = (i / numPoints) * 14 * Math.PI + Math.random() * 0.2;
//         const r = Math.cos(7 * t);
//         const height = Math.sin(3 * t) * 0.3;
        
//         const x = r * Math.cos(t) * scale;
//         const y = r * Math.sin(t) * scale;
//         const z = height * scale;
        
//         points[i * 4 + 0] = x;
//         points[i * 4 + 1] = y;
//         points[i * 4 + 2] = z;
//         points[i * 4 + 3] = 1.0;
//     }
//     return points;
// };

// const generateRhodoneaPoints = (numPoints) => {
//     const points = new Float32Array(numPoints * 4);
//     const scale = 0.35;
    
//     for (let i = 0; i < numPoints; i++) {
//         const t = (i / numPoints) * 32 * Math.PI;
//         const r = Math.sin(16 * t);
//         const spiral = t * 0.02;
        
//         const x = r * Math.cos(t) * scale;
//         const y = r * Math.sin(t) * scale;
//         const z = Math.sin(8 * t) * spiral * scale;
        
//         points[i * 4 + 0] = x;
//         points[i * 4 + 1] = y;
//         points[i * 4 + 2] = z;
//         points[i * 4 + 3] = 1.0;
//     }
//     return points;
// };

// const generateDNAHelixPoints = (numPoints) => {
//     const points = new Float32Array(numPoints * 4);
//     const scale = 0.3;
    
//     for (let i = 0; i < numPoints; i++) {
//         const t = (i / numPoints) * 8 * Math.PI;
//         const strand = Math.floor(Math.random() * 2); // 0 or 1 for two strands
//         const phase = strand * Math.PI;
        
//         const radius = 1 + Math.sin(t * 2) * 0.2;
//         const x = radius * Math.cos(t + phase);
//         const y = radius * Math.sin(t + phase);
//         const z = t * 0.3;
        
//         points[i * 4 + 0] = x * scale;
//         points[i * 4 + 1] = y * scale;
//         points[i * 4 + 2] = z * scale;
//         points[i * 4 + 3] = 1.0;
//     }
//     return points;
// };

// const generateFibonacciSpherePoints = (numPoints) => {
//     const points = new Float32Array(numPoints * 4);
//     const scale = 0.5;
//     const goldenRatio = (1 + Math.sqrt(5)) / 2;
    
//     for (let i = 0; i < numPoints; i++) {
//         const theta = 2 * Math.PI * i / goldenRatio;
//         const phi = Math.acos(1 - 2 * i / numPoints);
//         const radius = 1 + Math.sin(theta * 5) * 0.1;
        
//         const x = radius * Math.sin(phi) * Math.cos(theta);
//         const y = radius * Math.sin(phi) * Math.sin(theta);
//         const z = radius * Math.cos(phi);
        
//         points[i * 4 + 0] = x * scale;
//         points[i * 4 + 1] = y * scale;
//         points[i * 4 + 2] = z * scale;
//         points[i * 4 + 3] = 1.0;
//     }
//     return points;
// };


// const generateNautilusPoints = (numPoints) => {
//     const points = new Float32Array(numPoints * 4);
//     const scale = 0.2;
//     const a = 0.1, b = 0.3;
    
//     for (let i = 0; i < numPoints; i++) {
//         const t = (i / numPoints) * 6 * Math.PI;
//         const r = a * Math.exp(b * t);
//         const height = Math.sin(t * 2) * 0.5;
        
//         const x = r * Math.cos(t);
//         const y = r * Math.sin(t);
//         const z = height * r;
        
//         points[i * 4 + 0] = x * scale;
//         points[i * 4 + 1] = y * scale;
//         points[i * 4 + 2] = z * scale;
//         points[i * 4 + 3] = 1.0;
//     }
//     return points;
// };

// const generateBoySurfacePoints = (numPoints) => {
//     const points = new Float32Array(numPoints * 4);
//     const scale = 0.3;
    
//     for (let i = 0; i < numPoints; i++) {
//         const u = (Math.random() - 0.5) * Math.PI;
//         const v = Math.random() * Math.PI;
        
//         const cu = Math.cos(u), su = Math.sin(u);
//         const cv = Math.cos(v), sv = Math.sin(v);
//         const c2v = Math.cos(2*v), s2v = Math.sin(2*v);
        
//         const x = (2/3) * (cu * c2v + Math.sqrt(2) * su * cv) * sv;
//         const y = (2/3) * (cu * s2v - Math.sqrt(2) * su * sv) * sv;
//         const z = Math.sqrt(2) * cu * sv;
        
//         points[i * 4 + 0] = x * scale;
//         points[i * 4 + 1] = y * scale;
//         points[i * 4 + 2] = z * scale;
//         points[i * 4 + 3] = 1.0;
//     }
//     return points;
// };


// const generateDiniSurfacePoints = (numPoints) => {
//     const points = new Float32Array(numPoints * 4);
//     const scale = 0.3;
//     const a = 1, b = 0.2;
    
//     for (let i = 0; i < numPoints; i++) {
//         const u = Math.random() * 4 * Math.PI;
//         const v = (Math.random() - 0.5) * 2;
        
//         const x = a * Math.cos(u) * Math.sin(v);
//         const y = a * Math.sin(u) * Math.sin(v);
//         const z = a * (Math.cos(v) + Math.log(Math.tan(v/2))) + b * u;
        
//         points[i * 4 + 0] = x * scale;
//         points[i * 4 + 1] = y * scale;
//         points[i * 4 + 2] = z * scale;
//         points[i * 4 + 3] = 1.0;
//     }
//     return points;
// };


// const generateUlamSpiralPoints = (numPoints) => {
//     const points = new Float32Array(numPoints * 4);
//     const scale = 0.02;
    
//     for (let i = 0; i < numPoints; i++) {
//         const n = i + 1;
//         const k = Math.ceil((Math.sqrt(n) - 1) / 2);
//         const t = 2 * k + 1;
//         const m = t * t;
//         const t_prev = t - 2;
        
//         let x, y;
//         if (n >= m - t + 1) {
//             x = k - (m - n);
//             y = -k;
//         } else if (n >= m - 2*t + 2) {
//             x = -k;
//             y = -k + (m - t + 1 - n);
//         } else if (n >= m - 3*t + 3) {
//             x = -k + (m - 2*t + 2 - n);
//             y = k;
//         } else {
//             x = k;
//             y = k - (m - 3*t + 3 - n);
//         }
        
//         const z = Math.sin(n * 0.1) * 10;
        
//         points[i * 4 + 0] = x * scale;
//         points[i * 4 + 1] = y * scale;
//         points[i * 4 + 2] = z * scale;
//         points[i * 4 + 3] = 1.0;
//     }
//     return points;
// };



// const generateArchimedeanSpiral3D = (numPoints) => {
//     const points = new Float32Array(numPoints * 4);
//     const scale = 0.15;
    
//     for (let i = 0; i < numPoints; i++) {
//         const t = (i / numPoints) * 10 * Math.PI;
//         const r = t * 0.1;
//         const height = Math.sin(t * 0.5) * 2;
        
//         const x = r * Math.cos(t);
//         const y = r * Math.sin(t);
//         const z = height;
        
//         points[i * 4 + 0] = x * scale;
//         points[i * 4 + 1] = y * scale;
//         points[i * 4 + 2] = z * scale;
//         points[i * 4 + 3] = 1.0;
//     }
//     return points;
// };

// const generateDragonCurve3D = (numPoints) => {
//     const points = new Float32Array(numPoints * 4);
//     const scale = 0.02;
    
//     let sequence = "1";
//     for (let i = 0; i < 15; i++) {
//         let next = "";
//         for (let j = 0; j < sequence.length; j++) {
//             if (sequence[j] === "1") next += "1R2";
//             else next += "L1R";
//         }
//         sequence = next;
//     }
    
//     let x = 0, y = 0, z = 0;
//     let direction = 0; // 0=right, 1=up, 2=left, 3=down
    
//     for (let i = 0; i < Math.min(numPoints, sequence.length); i++) {
//         const cmd = sequence[i];
//         if (cmd === "1") {
//             const dx = [1, 0, -1, 0][direction];
//             const dy = [0, 1, 0, -1][direction];
//             x += dx; y += dy; z += Math.sin(i * 0.01) * 5;
//         } else if (cmd === "R") {
//             direction = (direction + 1) % 4;
//         } else if (cmd === "L") {
//             direction = (direction + 3) % 4;
//         }
        
//         points[i * 4 + 0] = x * scale;
//         points[i * 4 + 1] = y * scale;
//         points[i * 4 + 2] = z * scale;
//         points[i * 4 + 3] = 1.0;
//     }
    
//     return points;
// };


// const generateJulia3DPoints = (numPoints) => {
//     const points = new Float32Array(numPoints * 4);
//     const scale = 0.4;
//     const c = { x: -0.7, y: 0.27015, z: 0.0 };
    
//     for (let i = 0; i < numPoints; i++) {
//         let x = (Math.random() - 0.5) * 4;
//         let y = (Math.random() - 0.5) * 4;
//         let z = (Math.random() - 0.5) * 4;
        
//         for (let iter = 0; iter < 10; iter++) {
//             const x2 = x*x, y2 = y*y, z2 = z*z;
//             if (x2 + y2 + z2 > 4) break;
            
//             const newX = x2 - y2 - z2 + c.x;
//             const newY = 2*x*y + c.y;
//             const newZ = 2*x*z + c.z;
            
//             x = newX; y = newY; z = newZ;
//         }
        
//         points[i * 4 + 0] = x * scale;
//         points[i * 4 + 1] = y * scale;
//         points[i * 4 + 2] = z * scale;
//         points[i * 4 + 3] = 1.0;
//     }
//     return points;
// };

// const generateStandingWave3D = (numPoints) => {
//     const points = new Float32Array(numPoints * 4);
//     const scale = 0.3;
    
//     for (let i = 0; i < numPoints; i++) {
//         const x = (Math.random() - 0.5) * 6;
//         const y = (Math.random() - 0.5) * 6;
//         const t = Date.now() * 0.001;
        
//         const z1 = Math.sin(x + t) * Math.cos(y + t);
//         const z2 = Math.cos(x - t) * Math.sin(y - t);
//         const z = (z1 + z2) * 2;
        
//         points[i * 4 + 0] = x * scale;
//         points[i * 4 + 1] = y * scale;
//         points[i * 4 + 2] = z * scale;
//         points[i * 4 + 3] = 1.0;
//     }
//     return points;
// };

// const generateInterferencePoints = (numPoints) => {
//     const points = new Float32Array(numPoints * 4);
//     const scale = 0.2;
    
//     for (let i = 0; i < numPoints; i++) {
//         const x = (Math.random() - 0.5) * 8;
//         const y = (Math.random() - 0.5) * 8;
        
//         const r1 = Math.sqrt((x-1)*(x-1) + y*y);
//         const r2 = Math.sqrt((x+1)*(x+1) + y*y);
        
//         const wave1 = Math.sin(r1 * 3) / (r1 + 1);
//         const wave2 = Math.sin(r2 * 3) / (r2 + 1);
//         const z = (wave1 + wave2) * 3;
        
//         points[i * 4 + 0] = x * scale;
//         points[i * 4 + 1] = y * scale;
//         points[i * 4 + 2] = z * scale;
//         points[i * 4 + 3] = 1.0;
//     }
//     return points;
// };

// const generateTrefoilKnotPoints = (numPoints) => {
//     const points = new Float32Array(numPoints * 4);
//     const scale = 0.3;
    
//     for (let i = 0; i < numPoints; i++) {
//         const t = (i / numPoints) * 4 * Math.PI + Math.random() * 0.1;
        
//         const x = Math.sin(t) + 2 * Math.sin(2*t);
//         const y = Math.cos(t) - 2 * Math.cos(2*t);
//         const z = -Math.sin(3*t);
        
//         points[i * 4 + 0] = x * scale;
//         points[i * 4 + 1] = y * scale;
//         points[i * 4 + 2] = z * scale;
//         points[i * 4 + 3] = 1.0;
//     }
//     return points;
// };

// const generateHopfFibrationPoints = (numPoints) => {
//     const points = new Float32Array(numPoints * 4);
//     const scale = 0.4;
    
//     for (let i = 0; i < numPoints; i++) {
//         const theta = Math.random() * 2 * Math.PI;
//         const phi = Math.random() * Math.PI;
//         const psi = Math.random() * 2 * Math.PI;
        
//         const z1 = Math.cos(phi/2) * Math.exp(0.5 * (theta + psi) * Math.sqrt(-1));
//         const z2 = Math.sin(phi/2) * Math.exp(0.5 * (theta - psi) * Math.sqrt(-1));
        
//         const x = 2 * (z1.real * z2.real + z1.imag * z2.imag);
//         const y = 2 * (z2.imag * z1.real - z1.imag * z2.real);
//         const z = Math.cos(phi);
        
//         // Simplified version for real numbers
//         const realX = Math.cos(theta) * Math.sin(phi);
//         const realY = Math.sin(theta) * Math.sin(phi);
//         const realZ = Math.cos(phi);
        
//         points[i * 4 + 0] = realX * scale;
//         points[i * 4 + 1] = realY * scale;
//         points[i * 4 + 2] = realZ * scale;
//         points[i * 4 + 3] = 1.0;
//     }
//     return points;
// };

// const generateLissajous3D = (numPoints) => {
//     const points = new Float32Array(numPoints * 4);
//     const scale = 0.5;
//     const A = 1, B = 1, C = 1;
//     const a = 3, b = 2, c = 1;
//     const δx = 0, δy = Math.PI/2, δz = Math.PI/4;
    
//     for (let i = 0; i < numPoints; i++) {
//         const t = (i / numPoints) * 4 * Math.PI;
        
//         const x = A * Math.sin(a * t + δx);
//         const y = B * Math.sin(b * t + δy);
//         const z = C * Math.sin(c * t + δz);
        
//         points[i * 4 + 0] = x * scale;
//         points[i * 4 + 1] = y * scale;
//         points[i * 4 + 2] = z * scale;
//         points[i * 4 + 3] = 1.0;
//     }
//     return points;
// };

// const generateChuaPoints = (numPoints) => {
//     const points = new Float32Array(numPoints * 4);
//     const scale = 0.2;
//     const dt = 0.01;
//     let x = 0.1, y = 0, z = 0;
//     const alpha = 15.6, beta = 28, gamma = -1.143;
//     const m0 = -1.143, m1 = -0.714;
    
//     for (let i = 0; i < numPoints; i++) {
//         const h = (x >= 1) ? m1 * x + m0 - m1 : 
//                  (x <= -1) ? m1 * x + m0 - m1 : m0 * x;
        
//         const dx = alpha * (y - x - h) * dt;
//         const dy = (x - y + z) * dt;
//         const dz = -beta * y * dt;
        
//         x += dx; y += dy; z += dz;
        
//         points[i * 4 + 0] = x * scale;
//         points[i * 4 + 1] = y * scale;
//         points[i * 4 + 2] = z * scale;
//         points[i * 4 + 3] = 1.0;
//     }
//     return points;
// };

// const simulationVertexShader = `
//   varying vec2 vUv;
//   void main() {
//     vUv = uv;
//     gl_Position = vec4(position, 1.0);
//   }
// `;
// const simulationFragmentShader = `
//   varying vec2 vUv;
//   uniform sampler2D uStartPositions;
//   uniform sampler2D uEndPositions;
//   uniform float uProgress;
//   uniform float uStartScale;
//   uniform float uEndScale;

//   void main() {
//     vec4 pos1 = texture2D(uStartPositions, vUv);
//     vec4 pos2 = texture2D(uEndPositions, vUv);
    
//     float currentScale = mix(uStartScale, uEndScale, uProgress);
//     vec3 finalPosition = mix(pos1.rgb, pos2.rgb, uProgress) * currentScale;
    
//     gl_FragColor = vec4(finalPosition, 1.0);
//   }
// `;
// const renderVertexShader = `
//   uniform sampler2D uPositions;
//   uniform float uSize;
  
//   void main() {
//     vec3 pos = texture2D(uPositions, uv).rgb;
//     vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
//     gl_PointSize = uSize;
//     gl_Position = projectionMatrix * mvPosition;
//   }
// `;
// const renderFragmentShader = `
//   uniform vec3 uColor1;
//   uniform vec3 uColor2;
//   uniform float uProgress;
  
//   void main() {
//     if (length(gl_PointCoord - vec2(0.5, 0.5)) > 0.475) discard;
//     vec3 finalColor = mix(uColor1, uColor2, uProgress);
//     gl_FragColor = vec4(finalColor, 1.0);
//   }
// `;


// // --- MAIN COMPONENT ---
// const ParticleScene = () => {
//     const pointsRef = useRef();
//     const simulationMaterialRef = useRef();
//     const renderMaterialRef = useRef();

//     // ✅ This ref will hold the texture generated by RenderTexture
//     const renderTargetRef = useRef();

//     const textureSize = 317;
//     const numPoints = textureSize * textureSize;

//     // --- (Progressive loading useEffect and related state remains the same) ---
//     const [loadedShapes, setLoadedShapes] = useState([]);
//     const [isLoading, setIsLoading] = useState(true);
//     const MAX_SHAPES_IN_MEMORY = 20;
//     const LOADING_DELAY = 30; 
//     const shapeDefinitions = useMemo(() => [
//         { name: "SineWave", generator: generateSineWavePoints, color: new THREE.Color('#00ff00'), scale: 1.5 },
//         { name: "Lorenz", generator: generateLorenzPoints, color: new THREE.Color('#ff4500'), scale: 1.5 },
//         { name: "Butterfly", generator: generateButterflyPoints, color: new THREE.Color('#ff00ff'), scale: 2 },
//         { name: "Torus Knot",             generator: generateTorusKnotPoints,         color: new THREE.Color('#1e90ff'), scale: 0.5 },
//         { name: "Thomas' Attractor",      generator: generateThomasAttractorPoints,   color: new THREE.Color('#32cd32'), scale: 0.5 },
//         { name: "Halvorsen Attractor",    generator: generateHalvorsenAttractorPoints,  color: new THREE.Color('#ff69b4'), scale: 0.1 },
//         { name: "Double Helix",           generator: generateDoubleHelixPoints,       color: new THREE.Color('#fafad2'), scale: 0.5 },
//         { name: "Aizawa Attractor",       generator: generateAizawaPoints,            color: new THREE.Color('#ff6347'), scale: 3},
//         { name: "Sphere",                 generator: generateSpherePoints,            color: new THREE.Color('#ffffff'), scale: 1.5 },
//         { name: "Chen-Lee Attractor",     generator: generateChenLeeAttractorPoints,  color: new THREE.Color('#f0e68c'), scale: 0.08 },
//         { name: "Loxodrome",              generator: generateLoxodromePoints,         color: new THREE.Color('#afeeee'), scale: 1.5 },
//         { name: "Dadras Attractor",       generator: generateDadrasAttractorPoints,  l color: new THREE.Color('#dda0dd'), scale: 0.15 },
//         { name: "Butterfly 3D",           generator: generateButterfly3DPoints,       color: new THREE.Color('#ba55d3'), scale: 0.3 },
//         { name: "Viviani's Curve",        generator: generateVivianiPoints,           color: new THREE.Color('#98fb98'), scale: 0.7 },
//         { name: "Rossler", generator: generateRosslerPoints, color: new THREE.Color('#ff1493'), scale: 2.0 },
//         { name: "Chua", generator: generateChuaPoints, color: new THREE.Color('#ff4500'), scale: 1.5 },
//         { name: "Julia3D", generator: generateJulia3DPoints, color: new THREE.Color('#9400d3'), scale: 1.0 },
        
//         // 🌸 Parametric Masterpieces  
//         { name: "Mobius", generator: generateMobiusPoints, color: new THREE.Color('#9370db'), scale: 1.0 },
//         { name: "KleinBottle", generator: generateKleinBottlePoints, color: new THREE.Color('#20b2aa'), scale: 1.2 },
//         { name: "BoySurface", generator: generateBoySurfacePoints, color: new THREE.Color('#8a2be2'), scale: 1.5 },
//         { name: "DiniSurface", generator: generateDiniSurfacePoints, color: new THREE.Color('#dc143c'), scale: 1.0 },
//         { name: "HopfFibration", generator: generateHopfFibrationPoints, color: new THREE.Color('#00ced1'), scale: 1.0 },
        
//         // 🌺 Rose & Flower Curves
//         { name: "Rose7", generator: generateRose7Points, color: new THREE.Color('#ff69b4'), scale: 1.0 },
//         { name: "Rhodonea", generator: generateRhodoneaPoints, color: new THREE.Color('#ff8c00'), scale: 1.0 },
        
//         // 🧬 Nature-Inspired Curves
//         { name: "DNAHelix", generator: generateDNAHelixPoints, color: new THREE.Color('#00ff7f'), scale: 1.0 },
//         { name: "FibonacciSphere", generator: generateFibonacciSpherePoints, color: new THREE.Color('#ffd700'), scale: 1.0 },
//         { name: "Nautilus", generator: generateNautilusPoints, color: new THREE.Color('#ff6347'), scale: 2.0 },
        
//         // 🌀 Hypnotic Spirals
//         { name: "UlamSpiral", generator: generateUlamSpiralPoints, color: new THREE.Color('#00ffff'), scale: 1.0 },
//         { name: "ArchimedeanSpiral", generator: generateArchimedeanSpiral3D, color: new THREE.Color('#ff1493'), scale: 1.0 },
        
//         // 🎭 Fractal & Exotic Curves
//         { name: "DragonCurve", generator: generateDragonCurve3D, color: new THREE.Color('#ff0000'), scale: 1.0 },
//         { name: "TrefoilKnot", generator: generateTrefoilKnotPoints, color: new THREE.Color('#32cd32'), scale: 1.0 },
//         { name: "Lissajous3D", generator: generateLissajous3D, color: new THREE.Color('#ffff00'), scale: 1.0 },
        
//         // 🌊 Wave Functions
//         { name: "StandingWave", generator: generateStandingWave3D, color: new THREE.Color('#00ffff'), scale: 1.0 },
//         { name: "Interference", generator: generateInterferencePoints, color: new THREE.Color('#ff69b4'), scale: 1.0 },

//     ], []);

//     useEffect(() => {
//         const loadShapesProgressively = async () => {
//             setIsLoading(true);
//             try {
//                 for (let i = 0; i < shapeDefinitions.length; i++) {
//                     const shapeDef = shapeDefinitions[i];
//                     const positions = shapeDef.generator(numPoints);
//                     const texture = new THREE.DataTexture(
//                         positions, textureSize, textureSize, THREE.RGBAFormat, THREE.FloatType
//                     );
//                     texture.needsUpdate = true;
//                     setLoadedShapes(prev => {
//                         const newShape = { ...shapeDef, texture, id: `${shapeDef.name}_${i}` };
//                         const updated = [...prev, newShape];
//                         if (updated.length > MAX_SHAPES_IN_MEMORY) {
//                             const shapesToRemove = updated.slice(0, updated.length - MAX_SHAPES_IN_MEMORY);
//                             shapesToRemove.forEach(shape => shape.texture?.dispose());
//                             return updated.slice(-MAX_SHAPES_IN_MEMORY);
//                         }
//                         return updated;
//                     });
//                     await new Promise(resolve => setTimeout(resolve, LOADING_DELAY));
//                 }
//                 setIsLoading(false);
//                 console.log(`🎉 Successfully loaded ${shapeDefinitions.length} shapes!`);
//             } catch (error) {
//                 console.error('❌ Error during progressive loading:', error);
//                 setIsLoading(false);
//             }
//         };
//         loadShapesProgressively();
//         return () => {
//             setLoadedShapes(prev => {
//                 prev.forEach(shape => shape.texture?.dispose());
//                 return [];
//             });
//         };
//     }, [shapeDefinitions, numPoints, textureSize]);
//     // --- (End of loading logic) ---

//     const shapeTextures = useMemo(() => loadedShapes.map(shape => shape.texture).filter(Boolean), [loadedShapes]);
//     const colors = useMemo(() => loadedShapes.map(shape => shape.color), [loadedShapes]);
//     const scales = useMemo(() => loadedShapes.map(shape => shape.scale || 1.0), [loadedShapes]);

//     const particleUVs = useMemo(() => {
//         const uvs = new Float32Array(numPoints * 2);
//         for (let i = 0; i < textureSize; i++) {
//             for (let j = 0; j < textureSize; j++) {
//                 const index = i * textureSize + j;
//                 uvs[index * 2 + 0] = j / (textureSize - 1);
//                 uvs[index * 2 + 1] = i / (textureSize - 1);
//             }
//         }
//         return uvs;
//     }, [numPoints, textureSize]);

//     useFrame(({ clock }) => {
//         if (!simulationMaterialRef.current || !renderMaterialRef.current || shapeTextures.length < 2) {
//             return;
//         }

//         const elapsedTime = clock.getElapsedTime();
//         const transitionDuration = 3;
//         const holdDuration = 5;
//         const cycleDuration = transitionDuration + holdDuration;
//         const numShapes = shapeTextures.length;

//         const totalCycleTime = elapsedTime % (cycleDuration * numShapes);
//         const currentPhase = Math.floor(totalCycleTime / cycleDuration);


//         const timeInPhase = totalCycleTime % cycleDuration;
//         const progress = Math.min(timeInPhase / transitionDuration, 1.0);

//         console.log(`🎨 Currently rendering: ${shapeDefinitions[currentPhase].name} (Progress: ${progress.toFixed(3)})`);
//         const index1 = currentPhase;
//         const index2 = (currentPhase + 1) % numShapes;

//         // Update the simulation material's uniforms
//         const simUniforms = simulationMaterialRef.current.uniforms;
//         simUniforms.uStartPositions.value = shapeTextures[index1];
//         simUniforms.uEndPositions.value = shapeTextures[index2];
//         simUniforms.uProgress.value = progress;
//         simUniforms.uStartScale.value = scales[index1];
//         simUniforms.uEndScale.value = scales[index2];

//         // Update the final render material's uniforms
//         const renderUniforms = renderMaterialRef.current.uniforms;
//         // ✅ The texture now comes from the RenderTexture's ref
//         if (renderTargetRef.current) {
//             renderUniforms.uPositions.value = renderTargetRef.current;
//         }
//         renderUniforms.uProgress.value = progress;
//         renderUniforms.uColor1.value = colors[index1];
//         renderUniforms.uColor2.value = colors[index2];
        
//         if (pointsRef.current) {
//             pointsRef.current.rotation.y += 0.002;
//         }
//     });

//     const particlePositions = useMemo(() => new Float32Array(numPoints * 3), [numPoints]);

//     if (isLoading || loadedShapes.length < 2) {
//         return null;
//     }

//     return (
//         <>
//             {/* ✅ This component renders our simulation to a texture for us */}
//             <RenderTexture
//               ref={renderTargetRef}
//               width={textureSize}
//               height={textureSize}
//               attach="map"
//               magFilter={THREE.NearestFilter} // Crucial for sharp data
//               minFilter={THREE.NearestFilter} // Crucial for sharp data
//               format={THREE.RGBAFormat} // Crucial for position data
//               type={THREE.FloatType}          // Crucial for position data precision
//             >
//                 <orthographicCamera attach="camera" args={[-1, 1, 1, -1, 0, 1]} />
//                 <mesh>
//                     <planeGeometry args={[2, 2]} />
//                     <shaderMaterial
//                         ref={simulationMaterialRef}
//                         vertexShader={simulationVertexShader}
//                         fragmentShader={simulationFragmentShader}
//                         uniforms={{
//                             uStartPositions: { value: shapeTextures[0] },
//                             uEndPositions: { value: shapeTextures[1] },
//                             uProgress: { value: 0.0 },
//                             uStartScale: { value: 1.0 },
//                             uEndScale: { value: 1.0 },
//                         }}
//                     />
//                 </mesh>
//             </RenderTexture>
            
//             <points ref={pointsRef} scale={1}>
//                 <bufferGeometry>
//                     <bufferAttribute attach="attributes-position" count={numPoints} array={particlePositions} itemSize={3} />
//                     <bufferAttribute attach="attributes-uv" count={numPoints} array={particleUVs} itemSize={2} />
//                 </bufferGeometry>
//                 <shaderMaterial
//                     ref={renderMaterialRef}
//                     vertexShader={renderVertexShader}
//                     fragmentShader={renderFragmentShader}
//                     uniforms={{
//                         // This will be updated in useFrame
//                         uPositions: { value: null }, 
//                         uSize: { value: 2.0 },
//                         uColor1: { value: colors[0] },
//                         uColor2: { value: colors[1] },
//                         uProgress: { value: 0.0 }
//                     }}
//                     transparent={true}
//                     blending={THREE.AdditiveBlending}
//                     depthWrite={false}
//                 />
//             </points>
//         </>
//     );
// };

// export default ParticleScene;





// ================================================memory management fix perplexity ai


import React, { useMemo, useRef, useState, useEffect, useCallback } from 'react';
import { useFrame, createPortal } from '@react-three/fiber';
import { useFBO, RenderTexture } from '@react-three/drei';
import * as THREE from 'three';
import useResponsivePerformance from '../hooks/useResponsivePerformance'; 


// Your shape generators here...
// (generateSineWavePoints, generateLorenzPoints, etc.)
const generateSineWavePoints = (numPoints, cycles = 2) => {
    const points = new Float32Array(numPoints * 4);
    const width = 2.5; 
    const height = 0.5;
    for (let i = 0; i < numPoints; i++) {
        const x = (Math.random() - 0.5) * width;
        const y = Math.sin(x * Math.PI * cycles) * height;
        const z = (Math.random() - 0.5) * 0.5;
        points[i * 4 + 0] = x;
        points[i * 4 + 1] = y;
        points[i * 4 + 2] = z;
        points[i * 4 + 3] = 1.0;
    }
    return points;
};

// ✅ CONVERTED: Lorenz Attractor
const generateLorenzPoints = (numPoints) => {
    const points = new Float32Array(numPoints * 4);
    const scale = 0.03;
    const dt = 0.01;
    let x = 1, y = 1, z = 1;
    const sigma = 10, rho = 28, beta = 8/3;
    for (let i = 0; i < numPoints; i++) {
        const dx = sigma * (y - x) * dt;
        const dy = (x * (rho - z) - y) * dt;
        const dz = (x * y - beta * z) * dt;
        x += dx; y += dy; z += dz;
        points[i * 4 + 0] = x * scale;
        points[i * 4 + 1] = y * scale;
        points[i * 4 + 2] = z * scale;
        points[i * 4 + 3] = 1.0;
    }
    return points;
};

const generateAizawaPoints = (numPoints) => {
    const points = new Float32Array(numPoints * 4);
    const scale = 0.15;
    const dt = 0.01;
    let x = 0.1, y = 0, z = 0;
    const a = 0.95, b = 0.7, c = 0.6, d = 3.5, e = 0.25, f = 0.1;
    for (let i = 0; i < numPoints; i++) {
        const dx = ((z - b) * x - d * y) * dt;
        const dy = (d * x + (z - b) * y) * dt;
        const dz = (c + a * z - (z * z * z) / 3 - (x * x + y * y) * (1 + e * z) + f * z * (x * x * x)) * dt;
        x += dx; y += dy; z += dz;
        points[i * 4 + 0] = x * scale;
        points[i * 4 + 1] = y * scale;
        points[i * 4 + 2] = z * scale;
        points[i * 4 + 3] = 1.0;
    }
    return points;
};

const generateButterflyPoints = (numPoints) => {
    const points = new Float32Array(numPoints * 4);
    const scale = 0.15;
    for (let i = 0; i < numPoints; i++) {
        const t = Math.random() * 12 * Math.PI;
        const r = Math.exp(Math.cos(t)) - 2*Math.cos(4*t) + Math.pow(Math.sin(t/12), 5);
        const x = scale * r * Math.cos(t);
        const y = scale * r * Math.sin(t);
        const z = (Math.random() - 0.5) * 0.4;
        points[i * 4 + 0] = x;
        points[i * 4 + 1] = y;
        points[i * 4 + 2] = z;
        points[i * 4 + 3] = 1.0;
    }
    return points;
};
// --- (Keep all your shape generator functions exactly as they are) ---
// generateSineWavePoints, generateLorenzPoints, etc.

// --- SHAPE GENERATOR FUNCTIONS ---

// ✅ Thomas' Cyclically Symmetric Attractor
const generateThomasAttractorPoints = (numPoints) => {
    const points = new Float32Array(numPoints * 4);
    let x = 0.1, y = 0, z = 0.1;
    const b = 0.208186, dt = 0.05;
    for (let i = 0; i < numPoints; i++) {
        const dx = Math.sin(y) - b * x;
        const dy = Math.sin(z) - b * y;
        const dz = Math.sin(x) - b * z;
        x += dx * dt; y += dy * dt; z += dz * dt;
        points[i * 4 + 0] = x;
        points[i * 4 + 1] = y;
        points[i * 4 + 2] = z;
        points[i * 4 + 3] = 1.0;
    }
    return points;
};


// ✅ Dadras Attractor
const generateDadrasAttractorPoints = (numPoints) => {
    const points = new Float32Array(numPoints * 4);
    let x = 1, y = 1, z = 1;
    const a = 3, b = 2.7, c = 1.7, d = 2, e = 9, dt = 0.01;
    for (let i = 0; i < numPoints; i++) {
        const dx = y - a*x + b*y*z;
        const dy = c*y - x*z + z;
        const dz = d*x*y - e*z;
        x += dx * dt; y += dy * dt; z += dz * dt;
        points[i * 4 + 0] = x;
        points[i * 4 + 1] = y;
        points[i * 4 + 2] = z;
        points[i * 4 + 3] = 1.0;
    }
    return points;
};

// ✅ Chen-Lee Attractor
const generateChenLeeAttractorPoints = (numPoints) => {
    const points = new Float32Array(numPoints * 4);
    let x = 0.1, y = 0.2, z = -0.1;
    const a = 5, b = -10, c = -0.38, dt = 0.005;
     for (let i=0; i<100; i++) {
        const dx = a*x - y*z;
        const dy = b*y + x*z;
        const dz = c*z + (x*y)/3;
        x += dx * dt; y += dy * dt; z += dz * dt;
    }
    for (let i = 0; i < numPoints; i++) {
        const dx = a*x - y*z;
        const dy = b*y + x*z;
        const dz = c*z + (x*y)/3;
        x += dx * dt; y += dy * dt; z += dz * dt;
        points[i * 4 + 0] = x;
        points[i * 4 + 1] = y;
        points[i * 4 + 2] = z;
        points[i * 4 + 3] = 1.0;
    }
    return points;
};

// ✅ Halvorsen Attractor
const generateHalvorsenAttractorPoints = (numPoints) => {
    const points = new Float32Array(numPoints * 4);
    let x = -1, y = 0, z = 0;
    const a = 1.89, dt = 0.005;
    for (let i = 0; i < numPoints; i++) {
        const dx = -a*x - 4*y - 4*z - y*y;
        const dy = -a*y - 4*z - 4*x - z*z;
        const dz = -a*z - 4*x - 4*y - x*x;
        x += dx * dt; y += dy * dt; z += dz * dt;
        points[i * 4 + 0] = x;
        points[i * 4 + 1] = y;
        points[i * 4 + 2] = z;
        points[i * 4 + 3] = 1.0;
    }
    return points;
};

// ✅ Torus Knot (p=2, q=3)
const generateTorusKnotPoints = (numPoints) => {
    const points = new Float32Array(numPoints * 4);
    const p = 2, q = 3, R = 1;
    for (let i = 0; i < numPoints; i++) {
        const t = (i / numPoints) * 2 * Math.PI;
        const r = Math.cos(q * t) + 2;
        const x = r * Math.cos(p * t);
        const y = r * Math.sin(p * t);
        const z = -Math.sin(q * t);
        points[i * 4 + 0] = x;
        points[i * 4 + 1] = y;
        points[i * 4 + 2] = z;
        points[i * 4 + 3] = 1.0;
    }
    return points;
};

// ✅ Sphere
const generateSpherePoints = (numPoints) => {
    const points = new Float32Array(numPoints * 4);
    for (let i = 0; i < numPoints; i++) {
        const u = Math.random();
        const v = Math.random();
        const theta = 2 * Math.PI * u;
        const phi = Math.acos(2 * v - 1);
        const x = Math.sin(phi) * Math.cos(theta);
        const y = Math.sin(phi) * Math.sin(theta);
        const z = Math.cos(phi);
        points[i * 4 + 0] = x;
        points[i * 4 + 1] = y;
        points[i * 4 + 2] = z;
        points[i * 4 + 3] = 1.0;
    }
    return points;
};

// ✅ Viviani's Curve (Sphere intersecting a Cylinder)
const generateVivianiPoints = (numPoints) => {
    const points = new Float32Array(numPoints * 4);
    const a = 1.0; // radius
    for (let i = 0; i < numPoints; i++) {
        const t = (i / numPoints) * 4 * Math.PI - 2 * Math.PI;
        const x = a * (1 + Math.cos(t));
        const y = a * Math.sin(t);
        const z = 2 * a * Math.sin(t / 2);
        points[i * 4 + 0] = x;
        points[i * 4 + 1] = y;
        points[i * 4 + 2] = z;
        points[i * 4 + 3] = 1.0;
    }
    return points;
};

// ✅ Spiral on a Sphere (Loxodrome)
const generateLoxodromePoints = (numPoints) => {
    const points = new Float32Array(numPoints * 4);
    const a = 0.2; // tightness
    for (let i = 0; i < numPoints; i++) {
        const t = (i / numPoints) * 20 * Math.PI - 10 * Math.PI;
        const k = 1 / Math.sqrt(1 + a * a);
        const x = k * Math.cos(t) / Math.cosh(a * t);
        const y = k * Math.sin(t) / Math.cosh(a * t);
        const z = k * Math.tanh(a * t);
        points[i * 4 + 0] = x;
        points[i * 4 + 1] = y;
        points[i * 4 + 2] = z;
        points[i * 4 + 3] = 1.0;
    }
    return points;
};

// ✅ Butterfly Curve in 3D
const generateButterfly3DPoints = (numPoints) => {
    const points = new Float32Array(numPoints * 4);
    for (let i = 0; i < numPoints; i++) {
        const t = (i / numPoints) * 24 * Math.PI;
        const r = Math.exp(Math.cos(t)) - 2 * Math.cos(4 * t) + Math.pow(Math.sin(t / 12), 5);
        const x = r * Math.sin(t);
        const y = r * Math.cos(t);
        const z = Math.sin(t/2) * 1.5;
        points[i * 4 + 0] = x;
        points[i * 4 + 1] = y;
        points[i * 4 + 2] = z;
        points[i * 4 + 3] = 1.0;
    }
    return points;
};

// ✅ Double Helix
const generateDoubleHelixPoints = (numPoints) => {
    const points = new Float32Array(numPoints * 4);
    for (let i = 0; i < numPoints; i++) {
        const t = (i / numPoints) * 6 * Math.PI;
        const offset = (i % 2 === 0) ? 0 : Math.PI;
        const x = Math.cos(t + offset);
        const y = Math.sin(t + offset);
        const z = t / (2 * Math.PI) - 1.5;
        points[i * 4 + 0] = x;
        points[i * 4 + 1] = y;
        points[i * 4 + 2] = z;
        points[i * 4 + 3] = 1.0;
    }
    return points;
};

const generateRosslerPoints = (numPoints) => {
    const points = new Float32Array(numPoints * 4);
    const scale = 0.08;
    const dt = 0.01;
    let x = 1, y = 1, z = 1;
    const a = 0.2, b = 0.2, c = 5.7;
    
    for (let i = 0; i < numPoints; i++) {
        const dx = (-y - z) * dt;
        const dy = (x + a * y) * dt;
        const dz = (b + z * (x - c)) * dt;
        x += dx; y += dy; z += dz;
        
        points[i * 4 + 0] = x * scale;
        points[i * 4 + 1] = y * scale;
        points[i * 4 + 2] = z * scale;
        points[i * 4 + 3] = 1.0;
    }
    return points;
};


const generateMobiusPoints = (numPoints) => {
    const points = new Float32Array(numPoints * 4);
    const scale = 0.5;
    
    for (let i = 0; i < numPoints; i++) {
        const u = (Math.random() - 0.5) * 4 * Math.PI;
        const v = (Math.random() - 0.5) * 0.4;
        
        const x = (1 + v * Math.cos(u / 2)) * Math.cos(u);
        const y = (1 + v * Math.cos(u / 2)) * Math.sin(u);
        const z = v * Math.sin(u / 2);
        
        points[i * 4 + 0] = x * scale;
        points[i * 4 + 1] = y * scale;
        points[i * 4 + 2] = z * scale;
        points[i * 4 + 3] = 1.0;
    }
    return points;
};

const generateKleinBottlePoints = (numPoints) => {
    const points = new Float32Array(numPoints * 4);
    const scale = 0.3;
    
    for (let i = 0; i < numPoints; i++) {
        const u = Math.random() * 2 * Math.PI;
        const v = Math.random() * 2 * Math.PI;
        
        const x = (2.5 + 1.5 * Math.cos(v)) * Math.cos(u);
        const y = (2.5 + 1.5 * Math.cos(v)) * Math.sin(u);
        const z = -2.5 * Math.sin(v);
        const w = 1.5 * Math.sin(v) * Math.cos(u / 2);
        
        points[i * 4 + 0] = (x + w) * scale;
        points[i * 4 + 1] = y * scale;
        points[i * 4 + 2] = z * scale;
        points[i * 4 + 3] = 1.0;
    }
    return points;
};

const generateRose7Points = (numPoints) => {
    const points = new Float32Array(numPoints * 4);
    const scale = 0.4;
    
    for (let i = 0; i < numPoints; i++) {
        const t = (i / numPoints) * 14 * Math.PI + Math.random() * 0.2;
        const r = Math.cos(7 * t);
        const height = Math.sin(3 * t) * 0.3;
        
        const x = r * Math.cos(t) * scale;
        const y = r * Math.sin(t) * scale;
        const z = height * scale;
        
        points[i * 4 + 0] = x;
        points[i * 4 + 1] = y;
        points[i * 4 + 2] = z;
        points[i * 4 + 3] = 1.0;
    }
    return points;
};

const generateRhodoneaPoints = (numPoints) => {
    const points = new Float32Array(numPoints * 4);
    const scale = 0.35;
    
    for (let i = 0; i < numPoints; i++) {
        const t = (i / numPoints) * 32 * Math.PI;
        const r = Math.sin(16 * t);
        const spiral = t * 0.02;
        
        const x = r * Math.cos(t) * scale;
        const y = r * Math.sin(t) * scale;
        const z = Math.sin(8 * t) * spiral * scale;
        
        points[i * 4 + 0] = x;
        points[i * 4 + 1] = y;
        points[i * 4 + 2] = z;
        points[i * 4 + 3] = 1.0;
    }
    return points;
};

const generateDNAHelixPoints = (numPoints) => {
    const points = new Float32Array(numPoints * 4);
    const scale = 0.3;
    
    for (let i = 0; i < numPoints; i++) {
        const t = (i / numPoints) * 8 * Math.PI;
        const strand = Math.floor(Math.random() * 2); // 0 or 1 for two strands
        const phase = strand * Math.PI;
        
        const radius = 1 + Math.sin(t * 2) * 0.2;
        const x = radius * Math.cos(t + phase);
        const y = radius * Math.sin(t + phase);
        const z = t * 0.3;
        
        points[i * 4 + 0] = x * scale;
        points[i * 4 + 1] = y * scale;
        points[i * 4 + 2] = z * scale;
        points[i * 4 + 3] = 1.0;
    }
    return points;
};

const generateFibonacciSpherePoints = (numPoints) => {
    const points = new Float32Array(numPoints * 4);
    const scale = 0.5;
    const goldenRatio = (1 + Math.sqrt(5)) / 2;
    
    for (let i = 0; i < numPoints; i++) {
        const theta = 2 * Math.PI * i / goldenRatio;
        const phi = Math.acos(1 - 2 * i / numPoints);
        const radius = 1 + Math.sin(theta * 5) * 0.1;
        
        const x = radius * Math.sin(phi) * Math.cos(theta);
        const y = radius * Math.sin(phi) * Math.sin(theta);
        const z = radius * Math.cos(phi);
        
        points[i * 4 + 0] = x * scale;
        points[i * 4 + 1] = y * scale;
        points[i * 4 + 2] = z * scale;
        points[i * 4 + 3] = 1.0;
    }
    return points;
};


const generateNautilusPoints = (numPoints) => {
    const points = new Float32Array(numPoints * 4);
    const scale = 0.2;
    const a = 0.1, b = 0.3;
    
    for (let i = 0; i < numPoints; i++) {
        const t = (i / numPoints) * 6 * Math.PI;
        const r = a * Math.exp(b * t);
        const height = Math.sin(t * 2) * 0.5;
        
        const x = r * Math.cos(t);
        const y = r * Math.sin(t);
        const z = height * r;
        
        points[i * 4 + 0] = x * scale;
        points[i * 4 + 1] = y * scale;
        points[i * 4 + 2] = z * scale;
        points[i * 4 + 3] = 1.0;
    }
    return points;
};

const generateBoySurfacePoints = (numPoints) => {
    const points = new Float32Array(numPoints * 4);
    const scale = 0.3;
    
    for (let i = 0; i < numPoints; i++) {
        const u = (Math.random() - 0.5) * Math.PI;
        const v = Math.random() * Math.PI;
        
        const cu = Math.cos(u), su = Math.sin(u);
        const cv = Math.cos(v), sv = Math.sin(v);
        const c2v = Math.cos(2*v), s2v = Math.sin(2*v);
        
        const x = (2/3) * (cu * c2v + Math.sqrt(2) * su * cv) * sv;
        const y = (2/3) * (cu * s2v - Math.sqrt(2) * su * sv) * sv;
        const z = Math.sqrt(2) * cu * sv;
        
        points[i * 4 + 0] = x * scale;
        points[i * 4 + 1] = y * scale;
        points[i * 4 + 2] = z * scale;
        points[i * 4 + 3] = 1.0;
    }
    return points;
};


const generateDiniSurfacePoints = (numPoints) => {
    const points = new Float32Array(numPoints * 4);
    const scale = 0.3;
    const a = 1, b = 0.2;
    
    for (let i = 0; i < numPoints; i++) {
        const u = Math.random() * 4 * Math.PI;
        const v = (Math.random() - 0.5) * 2;
        
        const x = a * Math.cos(u) * Math.sin(v);
        const y = a * Math.sin(u) * Math.sin(v);
        const z = a * (Math.cos(v) + Math.log(Math.tan(v/2))) + b * u;
        
        points[i * 4 + 0] = x * scale;
        points[i * 4 + 1] = y * scale;
        points[i * 4 + 2] = z * scale;
        points[i * 4 + 3] = 1.0;
    }
    return points;
};


const generateUlamSpiralPoints = (numPoints) => {
    const points = new Float32Array(numPoints * 4);
    const scale = 0.02;
    
    for (let i = 0; i < numPoints; i++) {
        const n = i + 1;
        const k = Math.ceil((Math.sqrt(n) - 1) / 2);
        const t = 2 * k + 1;
        const m = t * t;
        const t_prev = t - 2;
        
        let x, y;
        if (n >= m - t + 1) {
            x = k - (m - n);
            y = -k;
        } else if (n >= m - 2*t + 2) {
            x = -k;
            y = -k + (m - t + 1 - n);
        } else if (n >= m - 3*t + 3) {
            x = -k + (m - 2*t + 2 - n);
            y = k;
        } else {
            x = k;
            y = k - (m - 3*t + 3 - n);
        }
        
        const z = Math.sin(n * 0.1) * 10;
        
        points[i * 4 + 0] = x * scale;
        points[i * 4 + 1] = y * scale;
        points[i * 4 + 2] = z * scale;
        points[i * 4 + 3] = 1.0;
    }
    return points;
};



const generateArchimedeanSpiral3D = (numPoints) => {
    const points = new Float32Array(numPoints * 4);
    const scale = 0.15;
    
    for (let i = 0; i < numPoints; i++) {
        const t = (i / numPoints) * 10 * Math.PI;
        const r = t * 0.1;
        const height = Math.sin(t * 0.5) * 2;
        
        const x = r * Math.cos(t);
        const y = r * Math.sin(t);
        const z = height;
        
        points[i * 4 + 0] = x * scale;
        points[i * 4 + 1] = y * scale;
        points[i * 4 + 2] = z * scale;
        points[i * 4 + 3] = 1.0;
    }
    return points;
};

const generateDragonCurve3D = (numPoints) => {
    const points = new Float32Array(numPoints * 4);
    const scale = 0.02;
    
    let sequence = "1";
    for (let i = 0; i < 15; i++) {
        let next = "";
        for (let j = 0; j < sequence.length; j++) {
            if (sequence[j] === "1") next += "1R2";
            else next += "L1R";
        }
        sequence = next;
    }
    
    let x = 0, y = 0, z = 0;
    let direction = 0; // 0=right, 1=up, 2=left, 3=down
    
    for (let i = 0; i < Math.min(numPoints, sequence.length); i++) {
        const cmd = sequence[i];
        if (cmd === "1") {
            const dx = [1, 0, -1, 0][direction];
            const dy = [0, 1, 0, -1][direction];
            x += dx; y += dy; z += Math.sin(i * 0.01) * 5;
        } else if (cmd === "R") {
            direction = (direction + 1) % 4;
        } else if (cmd === "L") {
            direction = (direction + 3) % 4;
        }
        
        points[i * 4 + 0] = x * scale;
        points[i * 4 + 1] = y * scale;
        points[i * 4 + 2] = z * scale;
        points[i * 4 + 3] = 1.0;
    }
    
    return points;
};


const generateJulia3DPoints = (numPoints) => {
    const points = new Float32Array(numPoints * 4);
    const scale = 0.4;
    const c = { x: -0.7, y: 0.27015, z: 0.0 };
    
    for (let i = 0; i < numPoints; i++) {
        let x = (Math.random() - 0.5) * 4;
        let y = (Math.random() - 0.5) * 4;
        let z = (Math.random() - 0.5) * 4;
        
        for (let iter = 0; iter < 10; iter++) {
            const x2 = x*x, y2 = y*y, z2 = z*z;
            if (x2 + y2 + z2 > 4) break;
            
            const newX = x2 - y2 - z2 + c.x;
            const newY = 2*x*y + c.y;
            const newZ = 2*x*z + c.z;
            
            x = newX; y = newY; z = newZ;
        }
        
        points[i * 4 + 0] = x * scale;
        points[i * 4 + 1] = y * scale;
        points[i * 4 + 2] = z * scale;
        points[i * 4 + 3] = 1.0;
    }
    return points;
};

const generateStandingWave3D = (numPoints) => {
    const points = new Float32Array(numPoints * 4);
    const scale = 0.3;
    
    for (let i = 0; i < numPoints; i++) {
        const x = (Math.random() - 0.5) * 6;
        const y = (Math.random() - 0.5) * 6;
        const t = Date.now() * 0.001;
        
        const z1 = Math.sin(x + t) * Math.cos(y + t);
        const z2 = Math.cos(x - t) * Math.sin(y - t);
        const z = (z1 + z2) * 2;
        
        points[i * 4 + 0] = x * scale;
        points[i * 4 + 1] = y * scale;
        points[i * 4 + 2] = z * scale;
        points[i * 4 + 3] = 1.0;
    }
    return points;
};

const generateInterferencePoints = (numPoints) => {
    const points = new Float32Array(numPoints * 4);
    const scale = 0.2;
    
    for (let i = 0; i < numPoints; i++) {
        // ✅ Use x and z for horizontal plane (like your original)
        const x = (Math.random() - 0.5) * 8;
        const z = (Math.random() - 0.5) * 8;  // ✅ Changed from y to z
        
        // ✅ Calculate interference using x and z positions
        const r1 = Math.sqrt((x-1)*(x-1) + z*z);  // ✅ Changed y to z
        const r2 = Math.sqrt((x+1)*(x+1) + z*z);  // ✅ Changed y to z
        
        const wave1 = Math.sin(r1 * 3) / (r1 + 1);
        const wave2 = Math.sin(r2 * 3) / (r2 + 1);
        const y = (wave1 + wave2) * 3;  // ✅ Calculate y (height) from waves
        
        // ✅ Assign to RGBA format with y as the calculated height
        points[i * 4 + 0] = x * scale;  // X position
        points[i * 4 + 1] = y * scale;  // Y height (calculated from waves) ✅
        points[i * 4 + 2] = z * scale;  // Z position ✅
        points[i * 4 + 3] = 1.0;        // Alpha
    }
    return points;
};


const generateTrefoilKnotPoints = (numPoints) => {
    const points = new Float32Array(numPoints * 4);
    const scale = 0.3;
    
    for (let i = 0; i < numPoints; i++) {
        const t = (i / numPoints) * 4 * Math.PI + Math.random() * 0.1;
        
        const x = Math.sin(t) + 2 * Math.sin(2*t);
        const y = Math.cos(t) - 2 * Math.cos(2*t);
        const z = -Math.sin(3*t);
        
        points[i * 4 + 0] = x * scale;
        points[i * 4 + 1] = y * scale;
        points[i * 4 + 2] = z * scale;
        points[i * 4 + 3] = 1.0;
    }
    return points;
};

const generateHopfFibrationPoints = (numPoints) => {
    const points = new Float32Array(numPoints * 4);
    const scale = 0.4;
    
    for (let i = 0; i < numPoints; i++) {
        const theta = Math.random() * 2 * Math.PI;
        const phi = Math.random() * Math.PI;
        const psi = Math.random() * 2 * Math.PI;
        
        const z1 = Math.cos(phi/2) * Math.exp(0.5 * (theta + psi) * Math.sqrt(-1));
        const z2 = Math.sin(phi/2) * Math.exp(0.5 * (theta - psi) * Math.sqrt(-1));
        
        const x = 2 * (z1.real * z2.real + z1.imag * z2.imag);
        const y = 2 * (z2.imag * z1.real - z1.imag * z2.real);
        const z = Math.cos(phi);
        
        // Simplified version for real numbers
        const realX = Math.cos(theta) * Math.sin(phi);
        const realY = Math.sin(theta) * Math.sin(phi);
        const realZ = Math.cos(phi);
        
        points[i * 4 + 0] = realX * scale;
        points[i * 4 + 1] = realY * scale;
        points[i * 4 + 2] = realZ * scale;
        points[i * 4 + 3] = 1.0;
    }
    return points;
};

const generateLissajous3D = (numPoints) => {
    const points = new Float32Array(numPoints * 4);
    const scale = 0.5;
    const A = 1, B = 1, C = 1;
    const a = 3, b = 2, c = 1;
    const δx = 0, δy = Math.PI/2, δz = Math.PI/4;
    
    for (let i = 0; i < numPoints; i++) {
        const t = (i / numPoints) * 4 * Math.PI;
        
        const x = A * Math.sin(a * t + δx);
        const y = B * Math.sin(b * t + δy);
        const z = C * Math.sin(c * t + δz);
        
        points[i * 4 + 0] = x * scale;
        points[i * 4 + 1] = y * scale;
        points[i * 4 + 2] = z * scale;
        points[i * 4 + 3] = 1.0;
    }
    return points;
};

const generateChuaPoints = (numPoints) => {
    const points = new Float32Array(numPoints * 4);
    const scale = 0.2;
    const dt = 0.01;
    let x = 0.1, y = 0, z = 0;
    const alpha = 15.6, beta = 28, gamma = -1.143;
    const m0 = -1.143, m1 = -0.714;
    
    for (let i = 0; i < numPoints; i++) {
        const h = (x >= 1) ? m1 * x + m0 - m1 : 
                 (x <= -1) ? m1 * x + m0 - m1 : m0 * x;
        
        const dx = alpha * (y - x - h) * dt;
        const dy = (x - y + z) * dt;
        const dz = -beta * y * dt;
        
        x += dx; y += dy; z += dz;
        
        points[i * 4 + 0] = x * scale;
        points[i * 4 + 1] = y * scale;
        points[i * 4 + 2] = z * scale;
        points[i * 4 + 3] = 1.0;
    }
    return points;
};


const generateChenPoints = (numPoints) => {
    const points = new Float32Array(numPoints * 4);
    const scale = 0.04;
    const dt = 0.002;
    
    let x = 1, y = 1, z = 1;
    const a = 5, b = -10, c = -0.38;
    
    for (let i = 0; i < numPoints; i++) {
        const dx = (a * x - y * z) * dt;
        const dy = (b * y + x * z) * dt;
        const dz = (c * z + x * y / 3) * dt;
        
        x += dx; y += dy; z += dz;
        
        points[i * 4 + 0] = x * scale;
        points[i * 4 + 1] = y * scale;
        points[i * 4 + 2] = z * scale;
        points[i * 4 + 3] = 1.0; // ✅ RGBA Alpha
    }
    return points;
};

const generateRennard = (numPoints) => {
    const points = new Float32Array(numPoints * 4);
    const scale = 0.4;
    
    for (let i = 0; i < numPoints; i++) {
        const t = Math.random() * 2 * Math.PI;
        const r = Math.sin(4 * t) + Math.cos(7 * t);
        const x = scale * r * Math.cos(t);
        const y = scale * r * Math.sin(t);
        const z = (Math.random() - 0.5) * 0.1;
        
        points[i * 4 + 0] = x;
        points[i * 4 + 1] = y;
        points[i * 4 + 2] = z;
        points[i * 4 + 3] = 1.0; // ✅ RGBA Alpha
    }
    return points;
};

const generateCliffordPoints = (numPoints) => {
    const points = new Float32Array(numPoints * 4);
    const a = -1.4, b = 1.6, c = 1.0, d = 0.7;
    let x = 0.1, y = 0.1;
    const scale = 0.55;
    
    for (let i = 0; i < numPoints; i++) {
        const x1 = Math.sin(a * y) + c * Math.cos(a * x);
        const y1 = Math.sin(b * x) + d * Math.cos(b * y);
        x = x1; y = y1;
        
        points[i * 4 + 0] = x * scale;
        points[i * 4 + 1] = y * scale;
        points[i * 4 + 2] = (Math.random() - 0.5) * 0.05;
        points[i * 4 + 3] = 1.0; // ✅ RGBA Alpha
    }
    return points;
};

const generateSuperformula = (numPoints, m = 7, a = 1, b = 1, n1 = 0.3, n2 = 0.3, n3 = 0.3) => {
    const points = new Float32Array(numPoints * 4);
    const R = 0.5;
    
    for (let i = 0; i < numPoints; i++) {
        const φ = (i / numPoints) * Math.PI * 2;
        const r = Math.pow(
            Math.pow(Math.abs(Math.cos(m * φ / 4) / a), n2) +
            Math.pow(Math.abs(Math.sin(m * φ / 4) / b), n3),
            -1 / n1
        );
        const x = R * r * Math.cos(φ);
        const y = R * r * Math.sin(φ);
        
        points[i * 4 + 0] = x;
        points[i * 4 + 1] = y;
        points[i * 4 + 2] = (Math.random() - 0.5) * 0.1;
        points[i * 4 + 3] = 1.0; // ✅ RGBA Alpha
    }
    return points;
};

const generateSeashellPoints = (numPoints) => {
    const points = new Float32Array(numPoints * 4);
    const scale = 0.1;
    
    for (let i = 0; i < numPoints; i++) {
        const theta = Math.random() * 8 * Math.PI;
        const phi = Math.random() * 2 * Math.PI;
        const radius = 0.2 * Math.exp(0.1 * theta);
        const tubeRadius = 0.05 * Math.exp(0.08 * theta);
        
        const r = radius + tubeRadius * Math.cos(phi);
        const x = scale * r * Math.cos(theta);
        const y = scale * r * Math.sin(theta);
        const z = scale * tubeRadius * Math.sin(phi);
        
        points[i * 4 + 0] = x;
        points[i * 4 + 1] = y;
        points[i * 4 + 2] = z;
        points[i * 4 + 3] = 1.0; // ✅ RGBA Alpha
    }
    return points;
};
const generateThomasPoints = (numPoints) => {
    const points = new Float32Array(numPoints * 4);
    const scale = 0.5;
    const dt = 0.05;
    
    let x = 0.1, y = 0, z = 0;
    const b = 0.208186;
    
    for (let i = 0; i < numPoints; i++) {
        const dx = (Math.sin(y) - b * x) * dt;
        const dy = (Math.sin(z) - b * y) * dt;
        const dz = (Math.sin(x) - b * z) * dt;
        
        x += dx; y += dy; z += dz;
        
        points[i * 4 + 0] = x * scale;
        points[i * 4 + 1] = y * scale;
        points[i * 4 + 2] = z * scale;
        points[i * 4 + 3] = 1.0; // ✅ RGBA Alpha
    }
    return points;
};
const generateMaurerRosePoints = (numPoints) => {
    const points = new Float32Array(numPoints * 4);
    const scale = 0.4;
    const n = 6; // Petals
    const d = 71; // Step angle
    
    for (let i = 0; i < numPoints; i++) {
        // ✅ Use random k values like your original
        const k = Math.floor(Math.random() * 360);
        
        // ✅ Convert to radians like your original
        const theta = k * d * Math.PI / 180;
        
        // ✅ Calculate radius with the original formula
        const r = scale * Math.sin(n * k * Math.PI / 180);
        
        const x = r * Math.cos(theta);
        const y = r * Math.sin(theta);
        
        // ✅ Random z variation like your original
        const z = (Math.random() - 0.5) * 0.3;
        
        points[i * 4 + 0] = x;
        points[i * 4 + 1] = y;
        points[i * 4 + 2] = z;
        points[i * 4 + 3] = 1.0; // RGBA Alpha
    }
    return points;
};

const generateSierpinskiPoints = (numPoints) => {
    const points = new Float32Array(numPoints * 4);
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
        
        points[i * 4 + 0] = x;
        points[i * 4 + 1] = y;
        points[i * 4 + 2] = z;
        points[i * 4 + 3] = 1.0; // ✅ RGBA Alpha
    }
    return points;
};

const generateSprottPoints = (numPoints) => {
    const points = new Float32Array(numPoints * 4);
    const scale = 0.3;
    const dt = 0.01;
    let x = 0.1, y = 0.1, z = 0.1;
    const a = 2.07, b = 1.79;
    
    for (let i = 0; i < numPoints; i++) {
        const dx = y + a * x * y + x * z;
        const dy = 1 - b * x * x + y * z;
        const dz = x - x * x - y * y;
        
        x += dx * dt; y += dy * dt; z += dz * dt;
        
        points[i * 4 + 0] = x * scale;
        points[i * 4 + 1] = y * scale;
        points[i * 4 + 2] = z * scale;
        points[i * 4 + 3] = 1.0;
    }
    return points;
};

const generateArneodoPoints = (numPoints) => {
    const points = new Float32Array(numPoints * 4);
    const scale = 0.15;
    const dt = 0.005;
    let x = 0.1, y = 0.1, z = 0.1;
    const a = -5.5, b = 3.5, c = -1;
    
    for (let i = 0; i < numPoints; i++) {
        const dx = y * dt;
        const dy = z * dt;
        const dz = (a * x + b * y + c * z + x * x * x) * dt;
        
        x += dx; y += dy; z += dz;
        
        points[i * 4 + 0] = x * scale;
        points[i * 4 + 1] = y * scale;
        points[i * 4 + 2] = z * scale;
        points[i * 4 + 3] = 1.0;
    }
    return points;
};
const generateRabinovichPoints = (numPoints) => {
    const points = new Float32Array(numPoints * 4);
    const scale = 0.08;
    const dt = 0.01;
    let x = -1, y = 0, z = 0.5;
    const alpha = 0.14, gamma = 0.10;
    
    for (let i = 0; i < numPoints; i++) {
        const dx = (y * (z - 1 + x * x) + gamma * x) * dt;
        const dy = (x * (3 * z + 1 - x * x) + gamma * y) * dt;
        const dz = (-2 * z * (alpha + x * y)) * dt;
        
        x += dx; y += dy; z += dz;
        
        points[i * 4 + 0] = x * scale;
        points[i * 4 + 1] = y * scale;
        points[i * 4 + 2] = z * scale;
        points[i * 4 + 3] = 1.0;
    }
    return points;
};
const generateHelicoidPoints = (numPoints) => {
    const points = new Float32Array(numPoints * 4);
    const scale = 0.3;
    
    for (let i = 0; i < numPoints; i++) {
        const u = (Math.random() - 0.5) * 4 * Math.PI;
        const v = (Math.random() - 0.5) * 2;
        
        const x = v * Math.cos(u);
        const y = v * Math.sin(u);
        const z = u;
        
        points[i * 4 + 0] = x * scale;
        points[i * 4 + 1] = y * scale;
        points[i * 4 + 2] = z * scale;
        points[i * 4 + 3] = 1.0;
    }
    return points;
};
const generateCatenoidPoints = (numPoints) => {
    const points = new Float32Array(numPoints * 4);
    const scale = 0.4;
    
    for (let i = 0; i < numPoints; i++) {
        const u = Math.random() * 2 * Math.PI;
        const v = (Math.random() - 0.5) * 4;
        const c = 1;
        
        const x = c * Math.cosh(v) * Math.cos(u);
        const y = c * Math.cosh(v) * Math.sin(u);
        const z = v;
        
        points[i * 4 + 0] = x * scale;
        points[i * 4 + 1] = y * scale;
        points[i * 4 + 2] = z * scale;
        points[i * 4 + 3] = 1.0;
    }
    return points;
};
const generateRomanSurfacePoints = (numPoints) => {
    const points = new Float32Array(numPoints * 4);
    const scale = 0.8;
    
    for (let i = 0; i < numPoints; i++) {
        const u = Math.random() * Math.PI;
        const v = Math.random() * Math.PI;
        
        const x = Math.sin(2 * u) * Math.cos(v) * Math.cos(v);
        const y = Math.sin(u) * Math.sin(2 * v);
        const z = Math.cos(u) * Math.sin(2 * v);
        
        points[i * 4 + 0] = x * scale;
        points[i * 4 + 1] = y * scale;
        points[i * 4 + 2] = z * scale;
        points[i * 4 + 3] = 1.0;
    }
    return points;
};

const generateMandelbrot3DPoints = (numPoints) => {
    const points = new Float32Array(numPoints * 4);
    const scale = 0.4;
    
    for (let i = 0; i < numPoints; i++) {
        const x0 = (Math.random() - 0.5) * 4;
        const y0 = (Math.random() - 0.5) * 4;
        const z0 = (Math.random() - 0.5) * 4;
        
        let x = 0, y = 0, z = 0;
        let iteration = 0;
        
        while (x*x + y*y + z*z < 4 && iteration < 10) {
            const xnew = x*x - y*y - z*z + x0;
            const ynew = 2*x*y + y0;
            const znew = 2*x*z + z0;
            x = xnew; y = ynew; z = znew;
            iteration++;
        }
        
        if (iteration < 10) {
            points[i * 4 + 0] = x * scale;
            points[i * 4 + 1] = y * scale;
            points[i * 4 + 2] = z * scale;
            points[i * 4 + 3] = 1.0;
        } else {
            i--; // Skip this point
        }
    }
    return points;
};
const generateMengerSpongePoints = (numPoints) => {
    const points = new Float32Array(numPoints * 4);
    const scale = 0.6;
    
    for (let i = 0; i < numPoints; i++) {
        let x = Math.random();
        let y = Math.random();
        let z = Math.random();
        
        // Check if point is in Menger sponge
        let valid = true;
        for (let level = 0; level < 4; level++) {
            const size = Math.pow(3, -level);
            const ix = Math.floor(x / size) % 3;
            const iy = Math.floor(y / size) % 3;
            const iz = Math.floor(z / size) % 3;
            
            if ((ix === 1 && iy === 1) || (iy === 1 && iz === 1) || (ix === 1 && iz === 1)) {
                valid = false;
                break;
            }
        }
        
        if (valid) {
            points[i * 4 + 0] = (x - 0.5) * scale;
            points[i * 4 + 1] = (y - 0.5) * scale;
            points[i * 4 + 2] = (z - 0.5) * scale;
            points[i * 4 + 3] = 1.0;
        } else {
            i--; // Skip this point
        }
    }
    return points;
};
const generatePolarRose11Points = (numPoints) => {
    const points = new Float32Array(numPoints * 4);
    const scale = 0.4;
    
    for (let i = 0; i < numPoints; i++) {
        const t = (i / numPoints) * 22 * Math.PI;
        const r = Math.cos(11 * t);
        const height = Math.sin(3 * t) * 0.2;
        
        const x = r * Math.cos(t);
        const y = r * Math.sin(t);
        const z = height;
        
        points[i * 4 + 0] = x * scale;
        points[i * 4 + 1] = y * scale;
        points[i * 4 + 2] = z * scale;
        points[i * 4 + 3] = 1.0;
    }
    return points;
};
const generateHypotrochoidPoints = (numPoints) => {
    const points = new Float32Array(numPoints * 4);
    const scale = 0.3;
    const R = 5, r = 3, d = 5;
    
    for (let i = 0; i < numPoints; i++) {
        const t = (i / numPoints) * 20 * Math.PI;
        const x = (R - r) * Math.cos(t) + d * Math.cos(((R - r) / r) * t);
        const y = (R - r) * Math.sin(t) - d * Math.sin(((R - r) / r) * t);
        const z = Math.sin(t * 0.5) * 0.3;
        
        points[i * 4 + 0] = x * scale;
        points[i * 4 + 1] = y * scale;
        points[i * 4 + 2] = z * scale;
        points[i * 4 + 3] = 1.0;
    }
    return points;
};
const generateMagneticFieldPoints = (numPoints) => {
    const points = new Float32Array(numPoints * 4);
    const scale = 0.4;
    
    for (let i = 0; i < numPoints; i++) {
        const t = (Math.random() - 0.5) * 8 * Math.PI;
        const r = Math.abs(Math.sin(t));
        const phi = Math.random() * 2 * Math.PI;
        
        const x = r * Math.cos(phi);
        const y = r * Math.sin(phi);
        const z = t * 0.1;
        
        points[i * 4 + 0] = x * scale;
        points[i * 4 + 1] = y * scale;
        points[i * 4 + 2] = z * scale;
        points[i * 4 + 3] = 1.0;
    }
    return points;
};
const generateQuantumOscillatorPoints = (numPoints) => {
    const points = new Float32Array(numPoints * 4);
    const scale = 0.5;
    
    for (let i = 0; i < numPoints; i++) {
        const x = (Math.random() - 0.5) * 4;
        const y = (Math.random() - 0.5) * 4;
        const psi = Math.exp(-(x*x + y*y) / 2) * Math.cos(3 * Math.sqrt(x*x + y*y));
        const z = psi * 2;
        
        points[i * 4 + 0] = x * scale;
        points[i * 4 + 1] = y * scale;
        points[i * 4 + 2] = z * scale;
        points[i * 4 + 3] = 1.0;
    }
    return points;
};
const generateHopfLinkPoints = (numPoints) => {
    const points = new Float32Array(numPoints * 4);
    const scale = 0.4;
    
    for (let i = 0; i < numPoints; i++) {
        const t = (i / numPoints) * 4 * Math.PI;
        const link = Math.floor(Math.random() * 2); // Two linked circles
        
        if (link === 0) {
            const x = Math.cos(t);
            const y = Math.sin(t);
            const z = 0;
            points[i * 4 + 0] = x * scale;
            points[i * 4 + 1] = y * scale;
            points[i * 4 + 2] = z * scale;
        } else {
            const x = 0;
            const y = Math.cos(t);
            const z = Math.sin(t);
            points[i * 4 + 0] = x * scale;
            points[i * 4 + 1] = y * scale;
            points[i * 4 + 2] = z * scale;
        }
        points[i * 4 + 3] = 1.0;
    }
    return points;
};
const generateFigure8KnotPoints = (numPoints) => {
    const points = new Float32Array(numPoints * 4);
    const scale = 0.3;
    
    for (let i = 0; i < numPoints; i++) {
        const t = (i / numPoints) * 4 * Math.PI;
        
        const x = (2 + Math.cos(2 * t)) * Math.cos(3 * t);
        const y = (2 + Math.cos(2 * t)) * Math.sin(3 * t);
        const z = Math.sin(4 * t);
        
        points[i * 4 + 0] = x * scale;
        points[i * 4 + 1] = y * scale;
        points[i * 4 + 2] = z * scale;
        points[i * 4 + 3] = 1.0;
    }
    return points;
};
const generateDiamondLatticePoints = (numPoints) => {
    const points = new Float32Array(numPoints * 4);
    const scale = 0.1;
    const a = 1; // Lattice parameter
    
    for (let i = 0; i < numPoints; i++) {
        const nx = Math.floor(Math.random() * 8) - 4;
        const ny = Math.floor(Math.random() * 8) - 4;
        const nz = Math.floor(Math.random() * 8) - 4;
        const basis = Math.floor(Math.random() * 8);
        
        let x = nx * a;
        let y = ny * a;
        let z = nz * a;
        
        // Add basis atoms
        if (basis & 1) x += a / 4;
        if (basis & 2) y += a / 4;
        if (basis & 4) z += a / 4;
        
        points[i * 4 + 0] = x * scale;
        points[i * 4 + 1] = y * scale;
        points[i * 4 + 2] = z * scale;
        points[i * 4 + 3] = 1.0;
    }
    return points;
};
const generateHexPackingPoints = (numPoints) => {
    const points = new Float32Array(numPoints * 4);
    const scale = 0.15;
    const a = 1;
    
    for (let i = 0; i < numPoints; i++) {
        const layer = Math.floor(Math.random() * 6) - 3;
        const nx = Math.floor(Math.random() * 10) - 5;
        const ny = Math.floor(Math.random() * 10) - 5;
        
        const x = nx * a + (layer % 2) * a / 2;
        const y = ny * a * Math.sqrt(3) / 2 + (layer % 2) * a * Math.sqrt(3) / 6;
        const z = layer * a * Math.sqrt(2/3);
        
        points[i * 4 + 0] = x * scale;
        points[i * 4 + 1] = y * scale;
        points[i * 4 + 2] = z * scale;
        points[i * 4 + 3] = 1.0;
    }
    return points;
};
const generateCylindricalWavePoints = (numPoints) => {
    const points = new Float32Array(numPoints * 4);
    const scale = 0.3;
    
    for (let i = 0; i < numPoints; i++) {
        const r = Math.random() * 3;
        const theta = Math.random() * 2 * Math.PI;
        const z = (Math.random() - 0.5) * 4;
        
        const amplitude = Math.sin(5 * r) / (r + 0.5);
        const x = (r + amplitude * 0.3) * Math.cos(theta);
        const y = (r + amplitude * 0.3) * Math.sin(theta);
        
        points[i * 4 + 0] = x * scale;
        points[i * 4 + 1] = y * scale;
        points[i * 4 + 2] = z * scale;
        points[i * 4 + 3] = 1.0;
    }
    return points;
};
const generateSphericalHarmonicsPoints = (numPoints) => {
    const points = new Float32Array(numPoints * 4);
    const scale = 0.4;
    const l = 3, m = 2; // Quantum numbers
    
    for (let i = 0; i < numPoints; i++) {
        const theta = Math.random() * Math.PI;
        const phi = Math.random() * 2 * Math.PI;
        
        // Simplified spherical harmonic
        const Y = Math.sin(theta)**l * Math.cos(m * phi);
        const r = 1 + 0.3 * Y;
        
        const x = r * Math.sin(theta) * Math.cos(phi);
        const y = r * Math.sin(theta) * Math.sin(phi);
        const z = r * Math.cos(theta);
        
        points[i * 4 + 0] = x * scale;
        points[i * 4 + 1] = y * scale;
        points[i * 4 + 2] = z * scale;
        points[i * 4 + 3] = 1.0;
    }
    return points;
};
const generateGyroidPoints = (numPoints) => {
    const points = new Float32Array(numPoints * 4);
    const scale = 0.2;
    
    for (let i = 0; i < numPoints; i++) {
        const x = (Math.random() - 0.5) * 8;
        const y = (Math.random() - 0.5) * 8;
        const z = (Math.random() - 0.5) * 8;
        
        const gyroid = Math.sin(x) * Math.cos(y) + Math.sin(y) * Math.cos(z) + Math.sin(z) * Math.cos(x);
        
        if (Math.abs(gyroid) < 0.3) {
            points[i * 4 + 0] = x * scale;
            points[i * 4 + 1] = y * scale;
            points[i * 4 + 2] = z * scale;
            points[i * 4 + 3] = 1.0;
        } else {
            i--; // Skip this point
        }
    }
    return points;
};
const generatePenroseTiling3D = (numPoints) => {
    const points = new Float32Array(numPoints * 4);
    const scale = 0.3;
    const phi = (1 + Math.sqrt(5)) / 2; // Golden ratio
    
    for (let i = 0; i < numPoints; i++) {
        const u = Math.random() * 2 * Math.PI;
        const v = Math.random() * 2 * Math.PI;
        const w = Math.random() * 2 * Math.PI;
        
        const x = Math.cos(u) + phi * Math.cos(v);
        const y = Math.sin(u) + phi * Math.sin(v);
        const z = Math.cos(w) + phi * Math.sin(w);
        
        points[i * 4 + 0] = x * scale;
        points[i * 4 + 1] = y * scale;
        points[i * 4 + 2] = z * scale;
        points[i * 4 + 3] = 1.0;
    }
    return points;
};
const generateAlphaHelixPoints = (numPoints) => {
    const points = new Float32Array(numPoints * 4);
    const scale = 0.3;
    
    for (let i = 0; i < numPoints; i++) {
        const t = (i / numPoints) * 10 * Math.PI;
        const radius = 1 + 0.2 * Math.sin(8 * t);
        
        const x = radius * Math.cos(t);
        const y = radius * Math.sin(t);
        const z = t * 0.3;
        
        // Add side chains
        const sideChain = Math.random() < 0.3;
        if (sideChain) {
            const offset = Math.random() * 0.5;
            const angle = Math.random() * 2 * Math.PI;
            points[i * 4 + 0] = (x + offset * Math.cos(angle)) * scale;
            points[i * 4 + 1] = (y + offset * Math.sin(angle)) * scale;
        } else {
            points[i * 4 + 0] = x * scale;
            points[i * 4 + 1] = y * scale;
        }
        points[i * 4 + 2] = z * scale;
        points[i * 4 + 3] = 1.0;
    }
    return points;
};
const generateCarbonNanotubePoints = (numPoints) => {
    const points = new Float32Array(numPoints * 4);
    const scale = 0.2;
    const radius = 1;
    const n = 6; // Hexagonal structure
    
    for (let i = 0; i < numPoints; i++) {
        const layer = Math.floor(Math.random() * 20);
        const ring = Math.floor(Math.random() * n);
        const jitter = Math.random() * 0.1;
        
        const theta = (ring / n) * 2 * Math.PI + jitter;
        const x = radius * Math.cos(theta);
        const y = radius * Math.sin(theta);
        const z = layer * 0.3 + (layer % 2) * 0.15;
        
        points[i * 4 + 0] = x * scale;
        points[i * 4 + 1] = y * scale;
        points[i * 4 + 2] = z * scale;
        points[i * 4 + 3] = 1.0;
    }
    return points;
};
const generateGalaxySpiralPoints = (numPoints) => {
    const points = new Float32Array(numPoints * 4);
    const scale = 0.3;
    const arms = 2;
    
    for (let i = 0; i < numPoints; i++) {
        const arm = Math.floor(Math.random() * arms);
        const t = Math.random() * 6 * Math.PI;
        const r = 0.2 + t * 0.1;
        const armOffset = (arm / arms) * 2 * Math.PI;
        
        const theta = t * 0.3 + armOffset;
        const x = r * Math.cos(theta);
        const y = r * Math.sin(theta);
        const z = (Math.random() - 0.5) * 0.1 * r;
        
        points[i * 4 + 0] = x * scale;
        points[i * 4 + 1] = y * scale;
        points[i * 4 + 2] = z * scale;
        points[i * 4 + 3] = 1.0;
    }
    return points;
};
const generateSolarCoronaPoints = (numPoints) => {
    const points = new Float32Array(numPoints * 4);
    const scale = 0.4;
    
    for (let i = 0; i < numPoints; i++) {
        const theta = Math.random() * Math.PI;
        const phi = Math.random() * 2 * Math.PI;
        const r = 1 + Math.random() * 2 * Math.sin(theta)**2;
        
        const x = r * Math.sin(theta) * Math.cos(phi);
        const y = r * Math.sin(theta) * Math.sin(phi);
        const z = r * Math.cos(theta);
        
        points[i * 4 + 0] = x * scale;
        points[i * 4 + 1] = y * scale;
        points[i * 4 + 2] = z * scale;
        points[i * 4 + 3] = 1.0;
    }
    return points;
};
const generatePulsarPoints = (numPoints) => {
    const points = new Float32Array(numPoints * 4);
    const scale = 0.3;
    
    for (let i = 0; i < numPoints; i++) {
        const t = Math.random() * 4 * Math.PI;
        const beam = Math.floor(Math.random() * 2); // Two emission beams
        const beamAngle = beam * Math.PI;
        
        const r = 1 + Math.sin(t * 5) * 0.2;
        const theta = t + beamAngle;
        const phi = Math.random() * 0.3 - 0.15; // Narrow cone
        
        const x = r * Math.sin(phi) * Math.cos(theta);
        const y = r * Math.sin(phi) * Math.sin(theta);
        const z = r * Math.cos(phi);
        
        points[i * 4 + 0] = x * scale;
        points[i * 4 + 1] = y * scale;
        points[i * 4 + 2] = z * scale;
        points[i * 4 + 3] = 1.0;
    }
    return points;
};

const simulationVertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position, 1.0);
  }
`;

// const simulationFragmentShader = `
//   varying vec2 vUv;
//   uniform sampler2D uStartPositions;
//   uniform sampler2D uEndPositions;
//   uniform float uProgress;
//   uniform float uStartScale;
//   uniform float uEndScale;
  

//   void main() {
//     vec4 pos1 = texture2D(uStartPositions, vUv);
//     vec4 pos2 = texture2D(uEndPositions, vUv);
    
//     float currentScale = mix(uStartScale, uEndScale, uProgress);
//     vec3 finalPosition = mix(pos1.rgb, pos2.rgb, uProgress) * currentScale;
    
//     gl_FragColor = vec4(finalPosition, 1.0);
//   }
// `;

const simulationFragmentShader = `
  varying vec2 vUv;
  uniform sampler2D uStartPositions;
  uniform sampler2D uEndPositions;
  uniform float uProgress;
  uniform float uStartScale;
  uniform float uEndScale;
  uniform vec2 uMouse;
  uniform float uMouseRadius;
  uniform float uMouseStrength;

  void main() {
    vec4 pos1 = texture2D(uStartPositions, vUv);
    vec4 pos2 = texture2D(uEndPositions, vUv);
    
    float currentScale = mix(uStartScale, uEndScale, uProgress);
    vec3 finalPosition = mix(pos1.rgb, pos2.rgb, uProgress) * currentScale;
    
    // ✅ MAGNETIC MOUSE EFFECT
    vec2 toMouse = uMouse - finalPosition.xy;
    float dist = length(toMouse);
    if (dist < uMouseRadius && dist > 0.01) {
        float force = (uMouseRadius - dist) / uMouseRadius;
        vec2 direction = normalize(toMouse);
        
        // Attract particles towards mouse
        finalPosition.xy += direction * force * uMouseStrength * 0.1;
        finalPosition.z += force * uMouseStrength;
    }
    
    gl_FragColor = vec4(finalPosition, 1.0);
  }
`;

const renderVertexShader = `
  uniform sampler2D uPositions;
  uniform float uSize;
  
  void main() {
    vec3 pos = texture2D(uPositions, uv).rgb;
    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
    gl_PointSize = uSize;
    gl_Position = projectionMatrix * mvPosition;
  }
`;

const renderFragmentShader = `
  uniform vec3 uColor1;
  uniform vec3 uColor2;
  uniform float uProgress;
  
  void main() {
    if (length(gl_PointCoord - vec2(0.5, 0.5)) > 0.475) discard;
    vec3 finalColor = mix(uColor1, uColor2, uProgress);
    gl_FragColor = vec4(finalColor, 1.0);
  }
`;

const ParticleScene = () => {
    // --- Refs for THREE objects ---
    const { scale, uSize, textureSize, mouseStrength } = useResponsivePerformance();
    console.log("ParticleScene scale:", scale, "uSize:", uSize, "textureSize:", textureSize, "mouseStrength:", mouseStrength);
    const pointsRef = useRef();
    const simulationMaterialRef = useRef();
    const renderMaterialRef = useRef();
    const renderTargetRef = useRef();
    
    // --- Refs for managing animation state without re-renders ---
    const currentPhaseRef = useRef(0);
    const loadedShapesRef = useRef([]); 
    // ✅ FINAL FIX: The index for the loading queue is now also a ref.
    const nextShapeToLoadIndexRef = useRef(0);

    const getResponsiveScale = useCallback((mobileScale, desktopScale) => {
        const isMobile = window.innerWidth <= 768;
        return isMobile ? mobileScale : desktopScale;
    }, []);

    console.log("ParticleScene getResponsiveScale:", getResponsiveScale);
    // ✅ NEW: Mouse state management
    const mouseRef = useRef(new THREE.Vector2(0, 0));
    const targetMouseRef = useRef(new THREE.Vector2(0, 0));

    // ✅ State is ONLY used for the initial "is it ready?" check
    const [isReady, setIsReady] = useState(false);
    
    // --- Configuration ---
    const MAX_SHAPES_IN_MEMORY = 10;
    const LOADING_DELAY = 30; 
    // const textureSize = 317;

    const numPoints = textureSize * textureSize;
    
    // ✅ YOUR SHAPE DEFINITIONS (add your 50+ shapes here)
    const shapeDefinitions = useMemo(() => [
        { name: "SineWave", generator: generateSineWavePoints, color: new THREE.Color('#00ff00'), scale: getResponsiveScale(1, 1.5) , positions:[0,2,0]},
        { name: "Lorenz", generator: generateLorenzPoints, color: new THREE.Color('#ff4500'), scale: getResponsiveScale(2.0, 2.0) },
        { name: "Interference", generator: generateInterferencePoints, color: new THREE.Color('#ff69b4'), scale: getResponsiveScale(3.0, 15.0),  positions:[0,2,0] },
        { name: "MaurerRose", generator: generateMaurerRosePoints, color: new THREE.Color('#00bfff'), scale: getResponsiveScale(2.0, 2.5),  positions:[10,12,0] },
        { name: "Chen", generator: generateChenPoints, color: new THREE.Color('#ff7f00'), scale: getResponsiveScale(1.0, 1.5) },
        { name: "Butterfly", generator: generateButterflyPoints, color: new THREE.Color('#ff00ff'), scale: getResponsiveScale(2.0, 2.5) },

        { name: "Torus Knot",             generator: generateTorusKnotPoints,         color: new THREE.Color('#1e90ff'), scale: 0.5 },
        { name: "Thomas' Attractor",      generator: generateThomasAttractorPoints,   color: new THREE.Color('#32cd32'), scale: 0.5 },
        { name: "Halvorsen Attractor",    generator: generateHalvorsenAttractorPoints,  color: new THREE.Color('#ff69b4'), scale: 0.1 },
        { name: "Double Helix",           generator: generateDoubleHelixPoints,       color: new THREE.Color('#fafad2'), scale: 0.5 },
        { name: "Aizawa Attractor",       generator: generateAizawaPoints,            color: new THREE.Color('#ff6347'), scale: 3},
        { name: "Sphere",                 generator: generateSpherePoints,            color: new THREE.Color('#ffffff'), scale: 1.5 },
        { name: "Loxodrome",              generator: generateLoxodromePoints,         color: new THREE.Color('#afeeee'), scale: 5 },
        { name: "Dadras Attractor",       generator: generateDadrasAttractorPoints,   color: new THREE.Color('#dda0dd'), scale: 0.15 },
        { name: "Butterfly 3D",           generator: generateButterfly3DPoints,       color: new THREE.Color('#ba55d3'), scale: 0.3 },
        { name: "Viviani's Curve",        generator: generateVivianiPoints,           color: new THREE.Color('#98fb98'), scale: 0.7 },
        { name: "Rossler", generator: generateRosslerPoints, color: new THREE.Color('#ff1493'), scale: 2.0 },
        { name: "Chua", generator: generateChuaPoints, color: new THREE.Color('#ff4500'), scale: 5 },
        { name: "Julia3D", generator: generateJulia3DPoints, color: new THREE.Color('#9400d3'), scale: 2 },
        
        // 🌸 Parametric Masterpieces  
        { name: "Mobius", generator: generateMobiusPoints, color: new THREE.Color('#9370db'), scale: 1.0 },
        { name: "KleinBottle", generator: generateKleinBottlePoints, color: new THREE.Color('#20b2aa'), scale: 1.2 },
        { name: "BoySurface", generator: generateBoySurfacePoints, color: new THREE.Color('#8a2be2'), scale: 1.5 },
        { name: "DiniSurface", generator: generateDiniSurfacePoints, color: new THREE.Color('#dc143c'), scale: 1.0 },
        { name: "HopfFibration", generator: generateHopfFibrationPoints, color: new THREE.Color('#00ced1'), scale: 1.0 },
        
        // 🌺 Rose & Flower Curves
        { name: "Rose7", generator: generateRose7Points, color: new THREE.Color('#ff69b4'), scale: 1.0 },
        { name: "Rhodonea", generator: generateRhodoneaPoints, color: new THREE.Color('#ff8c00'), scale: 1.0 },
        
        // 🧬 Nature-Inspired Curves
        { name: "DNAHelix", generator: generateDNAHelixPoints, color: new THREE.Color('#00ff7f'), scale: 1.0 },
        { name: "FibonacciSphere", generator: generateFibonacciSpherePoints, color: new THREE.Color('#ffd700'), scale: 1.0 },
        { name: "Nautilus", generator: generateNautilusPoints, color: new THREE.Color('#ff6347'), scale: 2.0 },
        
        // 🌀 Hypnotic Spirals
        { name: "UlamSpiral", generator: generateUlamSpiralPoints, color: new THREE.Color('#00ffff'), scale: 1.0 },
        { name: "ArchimedeanSpiral", generator: generateArchimedeanSpiral3D, color: new THREE.Color('#ff1493'), scale: 1.0 },
        
        // 🎭 Fractal & Exotic Curves
        { name: "DragonCurve", generator: generateDragonCurve3D, color: new THREE.Color('#ff0000'), scale: 1.0 },
        { name: "TrefoilKnot", generator: generateTrefoilKnotPoints, color: new THREE.Color('#32cd32'), scale: 1.0 },
        { name: "Lissajous3D", generator: generateLissajous3D, color: new THREE.Color('#ffff00'), scale: 1.0 },
        
        // 🌊 Wave Functions
        { name: "StandingWave", generator: generateStandingWave3D, color: new THREE.Color('#00ffff'), scale: 1.0 },
        { name: "Rennard", generator: generateRennard, color: new THREE.Color('#00ff7f'), scale: 1.0 },
        { name: "Clifford", generator: generateCliffordPoints, color: new THREE.Color('#7fff00'), scale: 1.0 },
        { name: "Superformula", generator: generateSuperformula, color: new THREE.Color('#8a2be2'), scale: 1.0 },
        { name: "Seashell", generator: generateSeashellPoints, color: new THREE.Color('#ff6347'), scale: 3.0 },
        { name: "ThomasPoint", generator: generateThomasPoints, color: new THREE.Color('#ff0055'), scale: 1.0 },
        { name: "Sierpinski", generator: generateSierpinskiPoints, color: new THREE.Color('#32cd32'), scale: 1.0 },

        // 🌟 ADVANCED STRANGE ATTRACTORS
        { name: "Sprott", generator: generateSprottPoints, color: new THREE.Color('#ff6b6b'), scale: 1.0 },
        { name: "Arneodo", generator: generateArneodoPoints, color: new THREE.Color('#4ecdc4'), scale: 2.0 },
        { name: "Rabinovich", generator: generateRabinovichPoints, color: new THREE.Color('#45b7d1'), scale: 3.0 },
        
        // 🏛️ ADVANCED PARAMETRIC SURFACES
        { name: "Helicoid", generator: generateHelicoidPoints, color: new THREE.Color('#f9ca24'), scale: 1.0 },
        { name: "Catenoid", generator: generateCatenoidPoints, color: new THREE.Color('#6c5ce7'), scale: 1.0 },
        { name: "RomanSurface", generator: generateRomanSurfacePoints, color: new THREE.Color('#a29bfe'), scale: 1.0 },
        
        // 🔥 ADVANCED FRACTALS  
        { name: "Mandelbrot3D", generator: generateMandelbrot3DPoints, color: new THREE.Color('#e17055'), scale: 1.0 },
        { name: "MengerSponge", generator: generateMengerSpongePoints, color: new THREE.Color('#00b894'), scale: 1.0 },
        
        // 🌸 EXOTIC ROSES
        { name: "PolarRose11", generator: generatePolarRose11Points, color: new THREE.Color('#fd79a8'), scale: 1.0 },
        { name: "Hypotrochoid", generator: generateHypotrochoidPoints, color: new THREE.Color('#fdcb6e'), scale: 1.0 },
        
        // 🌊 PHYSICS SHAPES
        { name: "MagneticField", generator: generateMagneticFieldPoints, color: new THREE.Color('#0984e3'), scale: 1.0 },
        { name: "QuantumOscillator", generator: generateQuantumOscillatorPoints, color: new THREE.Color('#00cec9'), scale: 1.0 },
        
        // 🎭 ADVANCED KNOTS
        { name: "HopfLink", generator: generateHopfLinkPoints, color: new THREE.Color('#e84393'), scale: 1.0 },
        { name: "Figure8Knot", generator: generateFigure8KnotPoints, color: new THREE.Color('#2d3436'), scale: 1.0 },
        
        // 🌟 CRYSTAL STRUCTURES
        { name: "DiamondLattice", generator: generateDiamondLatticePoints, color: new THREE.Color('#ffffff'), scale: 5.0 },
        { name: "HexPacking", generator: generateHexPackingPoints, color: new THREE.Color('#fab1a0'), scale: 3.0 },
        
        // 🌈 ADVANCED WAVES
        { name: "CylindricalWave", generator: generateCylindricalWavePoints, color: new THREE.Color('#74b9ff'), scale: 1.0 },
        { name: "SphericalHarmonics", generator: generateSphericalHarmonicsPoints, color: new THREE.Color('#55a3ff'), scale: 1.0 },
        
        // 🎪 EXOTIC SHAPES
        { name: "Gyroid", generator: generateGyroidPoints, color: new THREE.Color('#81ecec'), scale: 1.0 },
        { name: "PenroseTiling3D", generator: generatePenroseTiling3D, color: new THREE.Color('#ffeaa7'), scale: 1.0 },
        
        // 🔬 BIOLOGICAL STRUCTURES
        { name: "AlphaHelix", generator: generateAlphaHelixPoints, color: new THREE.Color('#00b894'), scale: 1.0 },
        { name: "CarbonNanotube", generator: generateCarbonNanotubePoints, color: new THREE.Color('#2d3436'), scale: 2.0 },
        
        // 🌌 COSMIC SHAPES
        { name: "GalaxySpiral", generator: generateGalaxySpiralPoints, color: new THREE.Color('#a29bfe'), scale: 1.0 },
        { name: "SolarCorona", generator: generateSolarCoronaPoints, color: new THREE.Color('#ffeaa7'), scale: 1.0 },
        { name: "Pulsar", generator: generatePulsarPoints, color: new THREE.Color('#fd79a8'), scale: 1.0 },
    ], []);

    // ✅ PHASE 1: INITIAL PROGRESSIVE LOADING (Netflix-style)
    // ✅ Initial load populates the ref, then sets the component to "ready"
    useEffect(() => {
        const loadInitialBuffer = async () => {
            console.log(`🚀 Starting Initial Buffer Load...`);
            const initialShapes = [];
            const numToLoad = Math.min(shapeDefinitions.length, MAX_SHAPES_IN_MEMORY);
            for (let i = 0; i < numToLoad; i++) {
                const shapeDef = shapeDefinitions[i];
                console.log(`📥 Loading initial shape ${i + 1}/${numToLoad}: ${shapeDef.name}`);
                const positions = shapeDef.generator(numPoints);
                const texture = new THREE.DataTexture(positions, textureSize, textureSize, THREE.RGBAFormat, THREE.FloatType);
                texture.needsUpdate = true;
                initialShapes.push({ ...shapeDef, texture, originalIndex: i });
                await new Promise(resolve => setTimeout(resolve, LOADING_DELAY));
            }
            loadedShapesRef.current = initialShapes;
            nextShapeToLoadIndexRef.current = numToLoad; // Initialize the ref
            setIsReady(true);
            console.log(`✅ Initial buffer loaded! Animation is now live.`);
            console.log(`🧠 Memory contains:`, loadedShapesRef.current.map(s => `#${s.originalIndex} (${s.name})`));
        };
        loadInitialBuffer();
    }, [shapeDefinitions, numPoints, textureSize]);


    // ✅ The slideWindow function now mutates the ref directly
    const slideWindow = useCallback(async (completedRelativeIndex) => {
        const numTotalShapes = shapeDefinitions.length;
        const currentLoadedCount = loadedShapesRef.current.length;
        
        // ✅ CHECK: End of shapes reached
        if (nextShapeToLoadIndexRef.current >= numTotalShapes) {
            console.log(`🎯 SLIDING WINDOW: All ${numTotalShapes} shapes have been processed! Cycling complete.`);
            return;
        }

        const nextShapeDef = shapeDefinitions[nextShapeToLoadIndexRef.current];
        const oldShape = loadedShapesRef.current[completedRelativeIndex];
        
        // ✅ MEMORY MANAGEMENT: Log what's being replaced
        console.log(`🔄 SLIDING WINDOW TRIGGERED:`);
        console.log(`   📤 Removing: ${oldShape?.name || 'Unknown'} (original index: ${oldShape?.originalIndex || 'N/A'}) from memory slot ${completedRelativeIndex}`);
        console.log(`   📥 Loading: ${nextShapeDef.name} (original index: ${nextShapeToLoadIndexRef.current}) into memory slot ${completedRelativeIndex}`);
        console.log(`   📊 Progress: ${nextShapeToLoadIndexRef.current + 1}/${numTotalShapes} total shapes processed`);

        // ✅ TEXTURE GENERATION: Log creation
        console.log(`   🎨 Generating texture for ${nextShapeDef.name}...`);
        const startTime = Date.now();
        
        const positions = nextShapeDef.generator(numPoints);
        const texture = new THREE.DataTexture(positions, textureSize, textureSize, THREE.RGBAFormat, THREE.FloatType);
        texture.needsUpdate = true;
        
        const generationTime = Date.now() - startTime;
        console.log(`   ✅ Texture generation complete for ${nextShapeDef.name} (${generationTime}ms)`);
        
        const newShape = { ...nextShapeDef, texture, originalIndex: nextShapeToLoadIndexRef.current };

        // ✅ MEMORY CLEANUP: Log disposal
        if (oldShape?.texture) {
            console.log(`   🗑️ Disposing old texture: ${oldShape.name} (UUID: ${oldShape.texture.uuid.slice(0,8)})`);
            oldShape.texture.dispose();
            console.log(`   ✅ Memory cleanup complete for ${oldShape.name}`);
        } else {
            console.log(`   ⚠️ No texture to dispose for slot ${completedRelativeIndex}`);
        }

        // ✅ MEMORY UPDATE: Log the replacement
        loadedShapesRef.current[completedRelativeIndex] = newShape;
        console.log(`   💾 Memory slot ${completedRelativeIndex} updated: ${oldShape?.name || 'Empty'} → ${newShape.name}`);
        
        // ✅ INDEX MANAGEMENT: Log progression
        const oldNextIndex = nextShapeToLoadIndexRef.current;
        nextShapeToLoadIndexRef.current += 1;
        
        if (nextShapeToLoadIndexRef.current >= shapeDefinitions.length) {
            nextShapeToLoadIndexRef.current = 0;
            console.log(`   🔄 Shape index wrapped around: ${oldNextIndex} → 0 (cycling back to start)`);
        } else {
            console.log(`   ➡️ Next shape to load: ${shapeDefinitions[nextShapeToLoadIndexRef.current].name} (index: ${nextShapeToLoadIndexRef.current})`);
        }

        // ✅ MEMORY STATE: Log current memory contents
        const memorySnapshot = loadedShapesRef.current.map((shape, index) => 
            `${index}:${shape?.name || 'Empty'}(${shape?.originalIndex ?? 'N/A'})`
        ).join(', ');
        console.log(`   📋 Current Memory State: [${memorySnapshot}]`);
        
        // ✅ STATISTICS: Log memory usage stats
        const memoryUsage = {
            slotsUsed: loadedShapesRef.current.filter(shape => shape !== null).length,
            totalSlots: loadedShapesRef.current.length,
            shapesProcessed: nextShapeToLoadIndexRef.current,
            totalShapes: numTotalShapes,
            completionPercentage: ((nextShapeToLoadIndexRef.current / numTotalShapes) * 100).toFixed(1)
        };
        
        console.log(`   📊 Memory Stats: ${memoryUsage.slotsUsed}/${memoryUsage.totalSlots} slots used | ${memoryUsage.shapesProcessed}/${memoryUsage.totalShapes} shapes processed (${memoryUsage.completionPercentage}%)`);
        
        // ✅ SUCCESS: Log completion
        console.log(`🎉 SLIDING WINDOW COMPLETE: ${newShape.name} successfully loaded into memory slot ${completedRelativeIndex}`);
        console.log(`─────────────────────────────────────────────────────────`);

    }, [shapeDefinitions, numPoints]);



    const particleUVs = useMemo(() => {
        const uvs = new Float32Array(numPoints * 2);
        for (let i = 0; i < textureSize; i++) {
            for (let j = 0; j < textureSize; j++) {
                const index = i * textureSize + j;
                uvs[index * 2 + 0] = j / (textureSize - 1);
                uvs[index * 2 + 1] = i / (textureSize - 1);
            }
        }
        return uvs;
    }, [numPoints, textureSize]);

    // ✅ The Final, Uninterrupted Animation Loop
    useFrame(({ clock, mouse }) => {
        if (!isReady) return;

        const currentLoadedShapes = loadedShapesRef.current;
        if (currentLoadedShapes.length < 2) return;

        targetMouseRef.current.set(-mouse.x, mouse.y);
        mouseRef.current.lerp(targetMouseRef.current, 0.08); // Smooth interpolation

        // Derive arrays on the fly from the ref's current value
        const shapeTextures = currentLoadedShapes.map(s => s.texture);
        const colors = currentLoadedShapes.map(s => s.color);
        const scales = currentLoadedShapes.map(s => s.scale || 1.0);

        // Unified Timing Logic
        const elapsedTime = clock.getElapsedTime();






        const transitionDuration = 3, holdDuration = 5;








        const cycleDuration = transitionDuration + holdDuration;
        const numTotalShapes = shapeDefinitions.length;
        const timeInPlaylist = elapsedTime % (cycleDuration * numTotalShapes);
        const absolutePhase = Math.floor(timeInPlaylist / cycleDuration);
        const progress = Math.min((timeInPlaylist % cycleDuration) / transitionDuration, 1.0);

        // Robust Trigger
        if (absolutePhase !== currentPhaseRef.current) {
            let phaseToProcess = (currentPhaseRef.current + 1) % numTotalShapes;
            while (true) {
                const completedOriginalIndex = (phaseToProcess - 1 + numTotalShapes) % numTotalShapes;
                const completedRelativeIndex = currentLoadedShapes.findIndex(s => s.originalIndex === completedOriginalIndex);
                if (completedRelativeIndex !== -1) {
                    slideWindow(completedRelativeIndex);
                }
                if (phaseToProcess === absolutePhase) break;
                phaseToProcess = (phaseToProcess + 1) % numTotalShapes;
            }
            currentPhaseRef.current = absolutePhase;
        }

        // Rendering Logic
        const relIndex1 = currentLoadedShapes.findIndex(s => s.originalIndex === absolutePhase);
        const relIndex2 = currentLoadedShapes.findIndex(s => s.originalIndex === (absolutePhase + 1) % numTotalShapes);
        if (relIndex1 === -1 || relIndex2 === -1) return;

        const simUniforms = simulationMaterialRef.current.uniforms;
        simUniforms.uStartPositions.value = shapeTextures[relIndex1];
        simUniforms.uEndPositions.value = shapeTextures[relIndex2];
        simUniforms.uProgress.value = progress;
        simUniforms.uStartScale.value = scales[relIndex1];
        simUniforms.uEndScale.value = scales[relIndex2];

        // ✅ MOUSE UNIFORMS
        simUniforms.uMouse.value = mouseRef.current;
        simUniforms.uMouseRadius.value = 0.3;
        simUniforms.uMouseStrength.value = mouseStrength;      

        const renderUniforms = renderMaterialRef.current.uniforms;
        if (renderTargetRef.current) renderUniforms.uPositions.value = renderTargetRef.current;
        renderUniforms.uProgress.value = progress;
        renderUniforms.uColor1.value = colors[relIndex1];
        renderUniforms.uColor2.value = colors[relIndex2];
        
        if (pointsRef.current) pointsRef.current.rotation.y += 0.002;
    });

    const particlePositions = useMemo(() => new Float32Array(numPoints * 3), [numPoints]);

    if (!isReady) {
        return null;
    }

    return (
        <>
            <RenderTexture
              ref={renderTargetRef}
              width={textureSize}
              height={textureSize}
              attach="map"
              magFilter={THREE.NearestFilter}
              minFilter={THREE.NearestFilter}
              format={THREE.RGBAFormat}
              type={THREE.FloatType}
            >
                <orthographicCamera attach="camera" args={[-1, 1, 1, -1, 0, 1]} />
                <mesh>
                    <planeGeometry args={[2, 2]} />
                    <shaderMaterial
                        ref={simulationMaterialRef}
                        vertexShader={simulationVertexShader}
                        fragmentShader={simulationFragmentShader}
                        uniforms={{
                            uStartPositions: { value: null },
                            uEndPositions: { value: null },
                            uProgress: { value: 0.0 },
                            uStartScale: { value: 1.0 },
                            uEndScale: { value: 1.0 },
                            uMouse: { value: new THREE.Vector2(0, 0) },          // ✅ NEW
                            uMouseRadius: { value: 0.5 },                       // ✅ NEW
                            uMouseStrength: { value: 0.3 },  
                        }}
                    />
                </mesh>
            </RenderTexture>
            
            <points ref={pointsRef} scale={scale}>
                <bufferGeometry>
                    <bufferAttribute attach="attributes-position" count={numPoints} array={particlePositions} itemSize={3} />
                    <bufferAttribute attach="attributes-uv" count={numPoints} array={particleUVs} itemSize={2} />
                </bufferGeometry>
                <shaderMaterial
                    ref={renderMaterialRef}
                    vertexShader={renderVertexShader}
                    fragmentShader={renderFragmentShader}
                    uniforms={{
                        uPositions: { value: null }, 
                        uSize: { value: uSize }, // ✅ FIXED
                        uColor1: { value: new THREE.Color('white') }, // ✅ FIXED
                        uColor2: { value: new THREE.Color('white') }, // ✅ FIXED
                        uProgress: { value: 0.0 }
                    }}
                    transparent={true}
                    blending={THREE.AdditiveBlending}
                    depthWrite={false}
                />
            </points>
        </>
    );
};

export default ParticleScene;
