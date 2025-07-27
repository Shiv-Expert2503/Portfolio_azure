// src/hooks/useResponsivePerformance.js
import { useState, useEffect } from 'react';

const useResponsivePerformance = () => {
  const [deviceSpecs, setDeviceSpecs] = useState({
    scale: 1.75,
    uSize: 1.5,
    textureSize: 388
  });
  
  useEffect(() => {
    const width = window.innerWidth;
    const isMobile = width <= 768;
    const isSlowDevice = navigator.hardwareConcurrency <= 4;
    
    if (isMobile) {
      setDeviceSpecs({
        scale: 1.5,
        uSize: 3.5,
        textureSize: isSlowDevice ? 64 : 256,
        mouseStrength: 0.8
      });
    } else {
      setDeviceSpecs({
        scale: 1.75,
        uSize: 1.5,
        textureSize: 388,
        mouseStrength: 0.5
      });
    }
  }, []);
  
  return deviceSpecs;
};

export default useResponsivePerformance;
