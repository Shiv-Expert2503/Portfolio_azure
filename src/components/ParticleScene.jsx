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
//     //     { name: "Interference", type: "procedural", generator: generateInterferencePoints, color: new THREE.Color('#00ffff'), scale: 1.5 },#ff69b4
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
//         }).catch(error => //console.error("Failed to load particle data:", error));
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
        const z = radius * Math.sin(theta);  // ✅ Swapped: was y
        const y = layer * 0.3 + (layer % 2) * 0.15;  // ✅ Swapped: was z
        
        points[i * 4 + 0] = x * scale;
        points[i * 4 + 1] = y * scale;  // ✅ Now Y is the tube length (vertical)
        points[i * 4 + 2] = z * scale;  // ✅ Now Z is the circular component
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


const simulationVertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position, 1.0);
  }
`;


const simulationFragmentShader = `
  varying vec2 vUv;
  uniform sampler2D uStartPositions;
  uniform sampler2D uEndPositions;
  uniform float uProgress;
  uniform float uStartScale;
  uniform float uEndScale;
  void main() {
    vec4 pos1 = texture2D(uStartPositions, vUv);
    vec4 pos2 = texture2D(uEndPositions, vUv);
    
    float currentScale = mix(uStartScale, uEndScale, uProgress);
    vec3 finalPosition = mix(pos1.rgb, pos2.rgb, uProgress) * currentScale;
    gl_FragColor = vec4(finalPosition, 1.0);
  }
`;

const renderVertexShader = `
uniform sampler2D uPositions;
uniform float uSize;
uniform vec2 uMouse;
uniform float uMouseStrength; 

void main() {
vec3 pos = texture2D(uPositions, uv).rgb;

// Calculate the morphed position
vec3 finalPosition = pos;

// THE EXACT SAME MOUSE EFFECT FROM YOUR ORIGINAL CODE
float dist = distance(finalPosition.xy, uMouse);
float radius = 0.3;
if (dist < radius) {
float force = (radius - dist) / radius;
finalPosition.z += force * uMouseStrength; // Apply mouse effect to Z position
}

vec4 mvPosition = modelViewMatrix * vec4(finalPosition, 1.0);
gl_PointSize = uSize;
gl_Position = projectionMatrix * mvPosition;
}
`;


const renderFragmentShader = `
  uniform vec3 uColor1;
  uniform vec3 uColor2;
  uniform float uProgress;
  uniform vec2 uMouse;
  uniform float uMouseStrength;
  uniform float uTime;
  
  void main() {
    if (length(gl_PointCoord - vec2(0.5, 0.5)) > 0.475) discard;
    
    vec3 finalColor = mix(uColor1, uColor2, uProgress);
    
    
    gl_FragColor = vec4(finalColor, 1.0);
  }
`;

const ParticleScene = () => {
    // --- Refs for THREE objects ---
    const { scale, uSize, textureSize, mouseStrength } = useResponsivePerformance();
    //console.log("ParticleScene scale:", scale, "uSize:", uSize, "textureSize:", textureSize, "mouseStrength:", mouseStrength);
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

    // //console.log("ParticleScene getResponsiveScale:", getResponsiveScale);


    // ✅ State is ONLY used for the initial "is it ready?" check
    const [isReady, setIsReady] = useState(false);
    
    // --- Configuration ---
    const MAX_SHAPES_IN_MEMORY = 10;
    const LOADING_DELAY = 30; 
    // const textureSize = 317;

    const numPoints = textureSize * textureSize;
    
    // ✅ YOUR SHAPE DEFINITIONS (add your 50+ shapes here)
    // 🎨 THEME: Neon Noir
    // 🎨 THEME: Cosmic Nebula
    // 🎨 THEME: Organic & Bioluminescent
    const shapeDefinitions = useMemo(() => [
        { name: "SineWave",               generator: generateSineWavePoints, color: new THREE.Color('#55a630'), scale: getResponsiveScale(2, 2.5) , positions:[0,2,0]},
        { name: "Interference",           generator: generateInterferencePoints, color: new THREE.Color('#00a896'), scale: getResponsiveScale(3.0, 5.0),  positions:[0,2,0] },
        { name: "MaurerRose",             generator: generateMaurerRosePoints, color: new THREE.Color('#f4a261'), scale: getResponsiveScale(4.0, 4),  positions:[10,12,0] },
        { name: "DiamondLattice", generator: generateDiamondLatticePoints, color: new THREE.Color('#f0ead2'), scale: getResponsiveScale(5.0, 5.0) },
        { name: "HexPacking", generator: generateHexPackingPoints, color: new THREE.Color('#adc178'), scale: getResponsiveScale(3.0, 3.0) },
        { name: "Double Helix",           generator: generateDoubleHelixPoints,       color: new THREE.Color('#eeef20'), scale: getResponsiveScale(0.5, 0.5) },
        { name: "Aizawa Attractor",       generator: generateAizawaPoints,            color: new THREE.Color('#9370db'), scale: getResponsiveScale(5, 7) },
        { name: "Chen",                   generator: generateChenPoints, color: new THREE.Color('#e76f51'), scale: getResponsiveScale(1.5, 1.75) },
        { name: "Lorenz",                 generator: generateLorenzPoints, color: new THREE.Color('#ff7b9c'), scale: getResponsiveScale(1.5, 1.5) },
        { name: "Butterfly",              generator: generateButterflyPoints, color: new THREE.Color('#8cb369'), scale: getResponsiveScale(3, 3) },
        { name: "Torus Knot",             generator: generateTorusKnotPoints,         color: new THREE.Color('#0077b6'), scale: getResponsiveScale(0.5, 1) },
        { name: "Thomas' Attractor",      generator: generateThomasAttractorPoints,   color: new THREE.Color('#9ef01a'), scale: getResponsiveScale(0.5, 0.5) },
        { name: "Halvorsen Attractor",    generator: generateHalvorsenAttractorPoints,  color: new THREE.Color('#f72585'), scale: getResponsiveScale(0.1, 0.36) },
        { name: "Sphere",                 generator: generateSpherePoints,            color: new THREE.Color('#fdfcdc'), scale: getResponsiveScale(1.5, 2.1) },
        { name: "Loxodrome",              generator: generateLoxodromePoints,         color: new THREE.Color('#48cae4'), scale: getResponsiveScale(5, 5) },
        { name: "Dadras Attractor",       generator: generateDadrasAttractorPoints,   color: new THREE.Color('#b5179e'), scale: getResponsiveScale(0.15, 0.15) },
        { name: "Butterfly 3D",           generator: generateButterfly3DPoints,       color: new THREE.Color('#7209b7'), scale: getResponsiveScale(0.3, 0.6) },
        { name: "Viviani's Curve",        generator: generateVivianiPoints,           color: new THREE.Color('#52b788'), scale: getResponsiveScale(0.7, 0.7) },
        { name: "Rossler",                 generator: generateRosslerPoints, color: new THREE.Color('#ff9e00'), scale: getResponsiveScale(2.0, 2.0) },
        { name: "Chua",                    generator: generateChuaPoints, color: new THREE.Color('#fb5607'), scale: getResponsiveScale(5, 7) },
        { name: "Julia3D",                 generator: generateJulia3DPoints, color: new THREE.Color('#4361ee'), scale: getResponsiveScale(2, 5) },
        { name: "Mobius",                   generator: generateMobiusPoints, color: new THREE.Color('#bc6c25'), scale: getResponsiveScale(3.0, 3) },
        { name: "KleinBottle",              generator: generateKleinBottlePoints, color: new THREE.Color('#005f73'), scale: getResponsiveScale(1.2, 1.2) },
        { name: "BoySurface",               generator: generateBoySurfacePoints, color: new THREE.Color('#2a9d8f'), scale: getResponsiveScale(4.0, 4.5) },
        { name: "DiniSurface",              generator: generateDiniSurfacePoints, color: new THREE.Color('#f07167'), scale: getResponsiveScale(1.75, 3.0) },
        { name: "HopfFibration",           generator: generateHopfFibrationPoints, color: new THREE.Color('#00afb9'), scale: getResponsiveScale(4.0, 4.0) },
        { name: "Rose7",                     generator: generateRose7Points, color: new THREE.Color('#ffbf69'), scale: getResponsiveScale(3.0, 4.0) },
        { name: "Rhodonea",                  generator: generateRhodoneaPoints, color: new THREE.Color('#ff9f1c'), scale: getResponsiveScale(2.0, 4.0) },
        { name: "DNAHelix",                   generator: generateDNAHelixPoints, color: new THREE.Color('#40916c'), scale: getResponsiveScale(1.5, 2.5) },
        { name: "FibonacciSphere",            generator: generateFibonacciSpherePoints, color: new THREE.Color('#ffd60a'), scale: getResponsiveScale(3.0, 3.5) },
        { name: "Nautilus",                   generator: generateNautilusPoints, color: new THREE.Color('#cb997e'), scale: getResponsiveScale(2.0, 2.0) },
        { name: "UlamSpiral",                   generator: generateUlamSpiralPoints, color: new THREE.Color('#00ffff'), scale: getResponsiveScale(1.0, 3.0) },
        { name: "ArchimedeanSpiral",           generator: generateArchimedeanSpiral3D, color: new THREE.Color('#ef476f'), scale: getResponsiveScale(2.0, 2.0) },
        { name: "DragonCurve", generator: generateDragonCurve3D, color: new THREE.Color('#d00000'), scale: getResponsiveScale(2.0, 3.0) },
        { name: "TrefoilKnot", generator: generateTrefoilKnotPoints, color: new THREE.Color('#70e000'), scale: getResponsiveScale(2.0, 3.0) },
        { name: "Lissajous3D", generator: generateLissajous3D, color: new THREE.Color('#ffc300'), scale: getResponsiveScale(2.0, 3.0) },
        { name: "StandingWave", generator: generateStandingWave3D, color: new THREE.Color('#00b4d8'), scale: getResponsiveScale(2.0, 2) },
        { name: "Rennard", generator: generateRennard, color: new THREE.Color('#80b918'), scale: getResponsiveScale(2.0, 2.5) },
        { name: "Clifford", generator: generateCliffordPoints, color: new THREE.Color('#aacc00'), scale: getResponsiveScale(2.0, 2) },
        { name: "Superformula", generator: generateSuperformula, color: new THREE.Color('#8a2be2'), scale: getResponsiveScale(5.0, 4.5) },
        { name: "Seashell", generator: generateSeashellPoints, color: new THREE.Color('#ff6347'), scale: getResponsiveScale(7.0, 17.0) },
        { name: "ThomasPoint", generator: generateThomasPoints, color: new THREE.Color('#ff0a54'), scale: getResponsiveScale(2.0, 1.0) },
        { name: "Sierpinski", generator: generateSierpinskiPoints, color: new THREE.Color('#4f772d'), scale: getResponsiveScale(2.0, 2.5) },
        { name: "Sprott", generator: generateSprottPoints, color: new THREE.Color('#f25c54'), scale: getResponsiveScale(4.0, 5.0) },
        { name: "Arneodo", generator: generateArneodoPoints, color: new THREE.Color('#588157'), scale: getResponsiveScale(2.0, 3.0) },
        { name: "Rabinovich", generator: generateRabinovichPoints, color: new THREE.Color('#00ff2f'), scale: getResponsiveScale(5.0, 7.0),intensity: 2.0 },
        { name: "Helicoid", generator: generateHelicoidPoints, color: new THREE.Color('#dda15e'), scale: getResponsiveScale(1.5, 2.0) },
        { name: "Catenoid", generator: generateCatenoidPoints, color: new THREE.Color('#6c5ce7'), scale: getResponsiveScale(1.5, 1.5), intensity: 2.0 },
        { name: "RomanSurface", generator: generateRomanSurfacePoints, color: new THREE.Color('#94d2bd'), scale: getResponsiveScale(1.4, 2) },
        { name: "Mandelbrot3D", generator: generateMandelbrot3DPoints, color: new THREE.Color('#ffbe0b'), scale: getResponsiveScale(1.0, 1.0) },
        { name: "MengerSponge", generator: generateMengerSpongePoints, color: new THREE.Color('#00b894'), scale: getResponsiveScale(2.5, 4.0) },
        { name: "PolarRose11", generator: generatePolarRose11Points, color: new THREE.Color('#faa307'), scale: getResponsiveScale(2.0, 3.0) },
        { name: "Hypotrochoid", generator: generateHypotrochoidPoints, color: new THREE.Color('#ffca3a'), scale: getResponsiveScale(1.0, 1.0) },
        { name: "MagneticField", generator: generateMagneticFieldPoints, color: new THREE.Color('#4895ef'), scale: getResponsiveScale(1.9, 3.0) },
        { name: "QuantumOscillator", generator: generateQuantumOscillatorPoints, color: new THREE.Color('#06d6a0'), scale: getResponsiveScale(1.5, 2.0) },
        { name: "HopfLink", generator: generateHopfLinkPoints, color: new THREE.Color('#f77f00'), scale: getResponsiveScale(2.0, 2.0) },
        { name: "Figure8Knot", generator: generateFigure8KnotPoints, color: new THREE.Color('#6c757d'), scale: getResponsiveScale(2.0, 2.0) },
        { name: "CylindricalWave", generator: generateCylindricalWavePoints, color: new THREE.Color('#4cc9f0'), scale: getResponsiveScale(1.5, 2.0) },
        { name: "SphericalHarmonics", generator: generateSphericalHarmonicsPoints, color: new THREE.Color('#118ab2'), scale: getResponsiveScale(2.0, 4.0) },
        { name: "Gyroid", generator: generateGyroidPoints, color: new THREE.Color('#04e762'), scale: getResponsiveScale(1.5, 3.0) },
        { name: "PenroseTiling3D", generator: generatePenroseTiling3D, color: new THREE.Color('#f0e68c'), scale: getResponsiveScale(1.5, 2.5) },
        { name: "AlphaHelix", generator: generateAlphaHelixPoints, color: new THREE.Color('#008000'), scale: getResponsiveScale(2.0, 3.0) },
        { name: "GalaxySpiral", generator: generateGalaxySpiralPoints, color: new THREE.Color('#a29bfe'), scale: getResponsiveScale(3.25, 3.0) , intnsity: 15 },
        { name: "SolarCorona", generator: generateSolarCoronaPoints, color: new THREE.Color('#fcbf49'), scale: getResponsiveScale(1.5, 3.0) },
    ], []);
    // ✅ PHASE 1: INITIAL PROGRESSIVE LOADING (Netflix-style)
    // ✅ Initial load populates the ref, then sets the component to "ready"
    useEffect(() => {
        const loadInitialBuffer = async () => {
            ////console.log(`🚀 Starting Initial Buffer Load...`);
            const initialShapes = [];
            const numToLoad = Math.min(shapeDefinitions.length, MAX_SHAPES_IN_MEMORY);
            for (let i = 0; i < numToLoad; i++) {
                const shapeDef = shapeDefinitions[i];
                ////console.log(`📥 Loading initial shape ${i + 1}/${numToLoad}: ${shapeDef.name}`);
                const positions = shapeDef.generator(numPoints);
                const texture = new THREE.DataTexture(positions, textureSize, textureSize, THREE.RGBAFormat, THREE.FloatType);
                texture.needsUpdate = true;
                initialShapes.push({ ...shapeDef, texture, originalIndex: i });
                await new Promise(resolve => setTimeout(resolve, LOADING_DELAY));
            }
            loadedShapesRef.current = initialShapes;
            nextShapeToLoadIndexRef.current = numToLoad; // Initialize the ref
            setIsReady(true);
            //console.log(`✅ Initial buffer loaded! Animation is now live.`);
            //console.log(`🧠 Memory contains:`, loadedShapesRef.current.map(s => `#${s.originalIndex} (${s.name})`));
        };
        loadInitialBuffer();
    }, [shapeDefinitions, numPoints, textureSize]);


    // ✅ The slideWindow function now mutates the ref directly
    const slideWindow = useCallback(async (completedRelativeIndex) => {
        const numTotalShapes = shapeDefinitions.length;
        const currentLoadedCount = loadedShapesRef.current.length;
        
        // ✅ CHECK: End of shapes reached
        if (nextShapeToLoadIndexRef.current >= numTotalShapes) {
            //console.log(`🎯 SLIDING WINDOW: All ${numTotalShapes} shapes have been processed! Cycling complete.`);
            return;
        }

        const nextShapeDef = shapeDefinitions[nextShapeToLoadIndexRef.current];
        const oldShape = loadedShapesRef.current[completedRelativeIndex];
        
        // ✅ MEMORY MANAGEMENT: Log what's being replaced
        //console.log(`🔄 SLIDING WINDOW TRIGGERED:`);
        //console.log(`   📤 Removing: ${oldShape?.name || 'Unknown'} (original index: ${oldShape?.originalIndex || 'N/A'}) from memory slot ${completedRelativeIndex}`);
        //console.log(`   📥 Loading: ${nextShapeDef.name} (original index: ${nextShapeToLoadIndexRef.current}) into memory slot ${completedRelativeIndex}`);
        //console.log(`   📊 Progress: ${nextShapeToLoadIndexRef.current + 1}/${numTotalShapes} total shapes processed`);

        // ✅ TEXTURE GENERATION: Log creation
        //console.log(`   🎨 Generating texture for ${nextShapeDef.name}...`);
        const startTime = Date.now();
        
        const positions = nextShapeDef.generator(numPoints);
        const texture = new THREE.DataTexture(positions, textureSize, textureSize, THREE.RGBAFormat, THREE.FloatType);
        texture.needsUpdate = true;
        
        const generationTime = Date.now() - startTime;
        //console.log(`   ✅ Texture generation complete for ${nextShapeDef.name} (${generationTime}ms)`);
        
        const newShape = { ...nextShapeDef, texture, originalIndex: nextShapeToLoadIndexRef.current };

        // ✅ MEMORY CLEANUP: Log disposal
        if (oldShape?.texture) {
            //console.log(`   🗑️ Disposing old texture: ${oldShape.name} (UUID: ${oldShape.texture.uuid.slice(0,8)})`);
            oldShape.texture.dispose();
            //console.log(`   ✅ Memory cleanup complete for ${oldShape.name}`);
        } else {
            //console.log(`   ⚠️ No texture to dispose for slot ${completedRelativeIndex}`);
        }

        // ✅ MEMORY UPDATE: Log the replacement
        loadedShapesRef.current[completedRelativeIndex] = newShape;
        //console.log(`   💾 Memory slot ${completedRelativeIndex} updated: ${oldShape?.name || 'Empty'} → ${newShape.name}`);
        
        // ✅ INDEX MANAGEMENT: Log progression
        const oldNextIndex = nextShapeToLoadIndexRef.current;
        nextShapeToLoadIndexRef.current += 1;
        
        if (nextShapeToLoadIndexRef.current >= shapeDefinitions.length) {
            nextShapeToLoadIndexRef.current = 0;
            //console.log(`   🔄 Shape index wrapped around: ${oldNextIndex} → 0 (cycling back to start)`);
        } else {
            //console.log(`   ➡️ Next shape to load: ${shapeDefinitions[nextShapeToLoadIndexRef.current].name} (index: ${nextShapeToLoadIndexRef.current})`);
        }

        // ✅ MEMORY STATE: Log current memory contents
        const memorySnapshot = loadedShapesRef.current.map((shape, index) => 
            `${index}:${shape?.name || 'Empty'}(${shape?.originalIndex ?? 'N/A'})`
        ).join(', ');
        //console.log(`   📋 Current Memory State: [${memorySnapshot}]`);
        
        // ✅ STATISTICS: Log memory usage stats
        const memoryUsage = {
            slotsUsed: loadedShapesRef.current.filter(shape => shape !== null).length,
            totalSlots: loadedShapesRef.current.length,
            shapesProcessed: nextShapeToLoadIndexRef.current,
            totalShapes: numTotalShapes,
            completionPercentage: ((nextShapeToLoadIndexRef.current / numTotalShapes) * 100).toFixed(1)
        };
        
        //console.log(`   📊 Memory Stats: ${memoryUsage.slotsUsed}/${memoryUsage.totalSlots} slots used | ${memoryUsage.shapesProcessed}/${memoryUsage.totalShapes} shapes processed (${memoryUsage.completionPercentage}%)`);
        
        // ✅ SUCCESS: Log completion
        //console.log(`🎉 SLIDING WINDOW COMPLETE: ${newShape.name} successfully loaded into memory slot ${completedRelativeIndex}`);
        //console.log(`─────────────────────────────────────────────────────────`);

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
    // const pausableElapsedTimeRef = useRef(0);
    useFrame(({ clock , mouse}) => {
        if (!isReady) return;

        if (renderMaterialRef.current) {
            const correctedMouse = new THREE.Vector2(-mouse.x, mouse.y);
            renderMaterialRef.current.uniforms.uMouse.value.lerp(mouse, 0.1);
            renderMaterialRef.current.uniforms.uMouseStrength.value = mouseStrength; 
        }

        const currentLoadedShapes = loadedShapesRef.current;
        if (currentLoadedShapes.length < 2) return;


        // Derive arrays on the fly from the ref's current value
        const shapeTextures = currentLoadedShapes.map(s => s.texture);
        const colors = currentLoadedShapes.map(s => s.color);
        const scales = currentLoadedShapes.map(s => s.scale || 1.0);

        // Unified Timing Logic
        const elapsedTime = clock.getElapsedTime();






        const transitionDuration = 3.0, holdDuration = 4.0;








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
                        uMouse: { value: new THREE.Vector2(0, 0) }, // Add this line
                        uMouseStrength: { value: mouseStrength },
                        uColor1: { value: new THREE.Color('white') }, // ✅ FIXED
                        uColor2: { value: new THREE.Color('white') }, // ✅ FIXED
                        uProgress: { value: 0.0 },
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