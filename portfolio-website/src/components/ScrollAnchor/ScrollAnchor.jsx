import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

export const ScrollAnchor = () => {
  const [isUp, setIsUp] = useState(true);
  const topPathRef = useRef(null);
  const bottomPathRef = useRef(null);
  const tlRef = useRef(null);
  
  useEffect(() => {
    // Create timeline once
    tlRef.current = gsap.timeline({
      paused: true,
      defaults: {
        duration: 5,
        ease: "power2.inOut"
      }
    });

    // Up state paths
    const upTopPath = "M216.667,133.333L196.641,133.333L150,63.381L114.469,116.667L145.481,116.667L134.342,133.333L83.333,133.333L150,33.333L216.667,133.333Z";
    const upBottomPath = "M134.342,266.667L134.342,236.659L141.655,225.693L141.654,152.449L165.498,116.688L175.521,131.71L158.321,157.497L158.321,230.741L134.342,266.667Z";
    
    // Down state paths
    const downTopPath = "M165.623,33.334L165.645,63.341L158.333,74.308L158.333,147.552L134.489,183.313L124.467,168.29L141.667,142.504L141.667,69.26L165.623,33.334Z";
    const downBottomPath = "M83.333,166.667L103.358,166.667L150,236.617L185.531,183.333L154.509,183.333L165.623,166.667L216.667,166.667L150,266.667L83.333,166.667Z";

    // Set up the path animations
    tlRef.current
      .to(topPathRef.current, {
        attr: { d: downTopPath }
      })
      .to(bottomPathRef.current, {
        attr: { d: downBottomPath }
      }, "<"); // Start at same time as previous animation

    return () => {
      tlRef.current.kill();
    };
  }, []);

  const handleClick = () => {
    if (isUp) {
      tlRef.current.play();
    } else {
      tlRef.current.reverse();
    }
    setIsUp(!isUp);
  };

  return (
    <button 
      onClick={handleClick} 
      className="w-20 h-20 bg-transparent border-none cursor-pointer"
      aria-label={isUp ? "Scroll down" : "Scroll up"}
    >
      <svg 
        width="100%" 
        height="100%" 
        viewBox="0 0 300 300" 
        version="1.1" 
        xmlns="http://www.w3.org/2000/svg" 
        style={{
          fillRule: "evenodd",
          clipRule: "evenodd",
          strokeLinejoin: "round",
          strokeMiterlimit: 2
        }}
      >
        <path 
          ref={topPathRef}
          id="top" 
          d="M216.667,133.333L196.641,133.333L150,63.381L114.469,116.667L145.481,116.667L134.342,133.333L83.333,133.333L150,33.333L216.667,133.333Z"
          style={{ fill: "#00052d", fillRule: "nonzero" }}
        />
        <path 
          ref={bottomPathRef}
          id="bottom" 
          d="M134.342,266.667L134.342,236.659L141.655,225.693L141.654,152.449L165.498,116.688L175.521,131.71L158.321,157.497L158.321,230.741L134.342,266.667Z"
          style={{ fill: "#00052b", fillRule: "nonzero" }}
        />
      </svg>
    </button>
  );
};