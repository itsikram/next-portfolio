'use client';

import React, { useCallback } from 'react';
import Particles from 'react-tsparticles';
import type { Engine } from 'tsparticles-engine';
import { loadFull } from 'tsparticles';

const ParticlesBackground: React.FC = () => {
  const particlesInit = useCallback(async (engine: Engine) => {
    await loadFull(engine);
  }, []);

  return (
    <Particles
      id="tsparticles"
      init={particlesInit}
      options={{
        fullScreen: { enable: true, zIndex: -1 },
        background: {
          color: '#10121B', // dark background for contrast
        },
        particles: {
          number: {
            value: 200,
            density: {
              enable: true,
              area: 800,
            },
          },
          color: {
            value: '#ffffff',
          },
          shape: {
            type: 'circle',
          },
          opacity: {
            value: 0.7,
            random: true,
          },
          size: {
            value: { min: 1, max: 4 },
          },
          move: {
            enable: true,
            speed: { min: 0.3, max: 1 },
            direction: 'bottom',
            straight: false,
            outModes: {
              default: 'out',
            },
            random: true,
          },
          wobble: {
            enable: true,
            distance: 5,
            speed: 0.5,
          },
        },
        interactivity: {
          events: {
            onHover: {
              enable: false,
            },
            onClick: {
              enable: false,
            },
            resize: true,
          },
        },
        detectRetina: true,
      }}
    />
  );
};

export default ParticlesBackground;
