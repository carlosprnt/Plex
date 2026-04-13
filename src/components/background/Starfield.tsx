import { useState, useEffect } from 'react';
import Particles, { initParticlesEngine } from '@tsparticles/react';
import { loadFull } from 'tsparticles';
import styles from './Starfield.module.css';

export default function Starfield() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadFull(engine);
    }).then(() => setReady(true));
  }, []);

  if (!ready) return <div className={styles.container} />;

  return (
    <div className={styles.container}>
      <Particles
        id="starfield"
        options={{
          fullScreen: false,
          background: { color: { value: 'transparent' } },
          fpsLimit: 60,
          particles: {
            number: {
              value: 160,
              density: { enable: true, width: 1200, height: 800 },
            },
            color: { value: ['#ffffff', '#a0c4ff', '#c4b5fd'] },
            shape: { type: 'circle' },
            opacity: {
              value: { min: 0.1, max: 0.8 },
              animation: {
                enable: true,
                speed: 0.5,
                sync: false,
              },
            },
            size: {
              value: { min: 0.5, max: 2.5 },
            },
            move: {
              enable: true,
              speed: 0.15,
              direction: 'none',
              random: true,
              straight: false,
              outModes: { default: 'out' },
            },
          },
          detectRetina: true,
        }}
      />
    </div>
  );
}
