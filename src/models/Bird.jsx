// import { useRef, useEffect}from 'react'
// import birdScene from '../assets/3d/bird.glb';
// import { useGLTF, useAnimations } from '@react-three/drei'
// import { useFrame } from '@react-three/fiber';


// const Bird = () => {

//     const birdRef = useRef();
//     const {scene, animations} = useGLTF(birdScene)
//     const { actions } = useAnimations(animations, birdRef)

//     console.log("Available animations:", animations);
//     console.log("Available actions:", actions);

//     useEffect(() => {
//         actions['Take 001'].play();
//     },[]);

//     useFrame(({clock, camera}) => {
//         birdRef.current.position.y = Math.sin(clock.elapsedTime) * 0.2 + 2;

//         if(birdRef.current.position.x > camera.position.x + 10){
//             birdRef.current.rotation.y += Math.PI;
//         }else if(birdRef.current.position.x < camera.position.x - 10){
//             birdRef.current.rotation.y -= Math.PI;
//         }

//         if(birdRef.current.rotation.y === 0)
//         {
//             birdRef.current.position.x += 0.01;
//             birdRef.current.position.z -= 0.01;
//         }
//         else{
//             birdRef.current.position.x -= 0.01;
//             birdRef.current.position.z += 0.01;
//         }
//     })

//   return (
//     <mesh 
//         position={[-5, 2, 1]} 
//         scale={[0.003, 0.003, 0.003]} 
//         ref={birdRef}
//     > 
//         <primitive object={scene} />

//     </mesh>
//   )
// }

// export default Bird




// ---------------------------------------------------->used gltf compressed model from Blender 
import { useRef, useEffect } from 'react';
// import birdScene from '../assets/3d/bird.glb'; // <-- 1. DELETE THIS LINE
import { useGLTF, useAnimations } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';

const Bird = () => {
    const birdRef = useRef();
    // 2. USE THE PUBLIC URL PATH TO YOUR NEW .gltf FILE
    const { scene, animations } = useGLTF('/models/bird_blender/bird_ani_blender.gltf'); // <-- CHANGED HERE
    const { actions } = useAnimations(animations, birdRef);

    useEffect(() => {
        // Make sure the animation name 'Take 001' still exists. 
        // If it changed, you can find the new name by logging 'animations'.
        if (actions['Take 001']) {
            actions['Take 001'].play();
        }
    }, []);
    // useEffect(() => {
    //     actions['Take 001'].play();
    // },[]);

    useFrame(({ clock, camera }) => {
        birdRef.current.position.y = Math.sin(clock.elapsedTime) * 0.2 + 2;

        if (birdRef.current.position.x > camera.position.x + 10) {
            birdRef.current.rotation.y = Math.PI;
        } else if (birdRef.current.position.x < camera.position.x - 10) {
            birdRef.current.rotation.y = 0; // It's better to set it directly
        }

        if (birdRef.current.rotation.y === 0) {
            birdRef.current.position.x += 0.01;
            birdRef.current.position.z -= 0.01;
        } else {
            birdRef.current.position.x -= 0.01;
            birdRef.current.position.z += 0.01;
        }
    });

    
    return (
        <mesh 
            position={[-5, 2, 1]} 
            scale={[0.003, 0.003, 0.003]} 
            ref={birdRef}
        >
            <primitive object={scene} />
        </mesh>
    );
};


export default Bird;

