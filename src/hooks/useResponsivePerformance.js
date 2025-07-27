// src/hooks/useResponsivePerformance.js
import { useState, useEffect } from 'react';

const useResponsivePerformance = () => {
  const [deviceSpecs, setDeviceSpecs] = useState({
    scale: 1.75,
    uSize: 1.5,
    textureSize: 317
  });
  
  useEffect(() => {
    const width = window.innerWidth;
    const isMobile = width <= 768;
    const isSlowDevice = navigator.hardwareConcurrency <= 4;
    
    if (isMobile) {
      setDeviceSpecs({
        scale: 1.5,
        uSize: 2.5,
        textureSize: isSlowDevice ? 64 : 128,
        mouseStrength: 0.25
      });
    } else {
      setDeviceSpecs({
        scale: 1.75,
        uSize: 1.5,
        textureSize: 317,
        mouseStrength: 0.15
      });
    }
  }, []);
  
  return deviceSpecs;
};

export default useResponsivePerformance;
