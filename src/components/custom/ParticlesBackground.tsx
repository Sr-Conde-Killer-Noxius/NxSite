"use client";
import { useCallback } from "react";
import { loadSlim } from "tsparticles-slim";
import Particles from "react-tsparticles";
import type { Engine } from "tsparticles-engine";

export const ParticlesBackground = () => (    
  <div className="absolute top-0 left-0 w-full h-full">
    <ParticlesSystem />
  </div>  
)

export const ParticlesSystem = () => {
  const particlesInit = useCallback(async (engine: Engine) => {
    await loadSlim(engine);
  }, []);

  return (
    <Particles
      id="tsparticles"
      init={particlesInit}
      className="absolute top-0 left-0 w-full h-full"
      options={{
        background: {
          color: "transparent",
        },
        particles: {
          number: {
            value: 100, // Quantidade de partículas
            density: {
              enable:       true,
              value_area:   800, // Área onde as partículas se espalham
            },
          },
          color: {
            value: "#00bfff", // Cor das partículas
          },
          shape: {
            type: "circle", // Pode ser "circle", "triangle", "edge", "star" etc.
          },
          opacity: {
            value:  0.7, // Opacidade das partículas
            random: true,
          },
          size: {
            value: { min: 1, max: 5 }, // Tamanho das partículas
          },
          move: {
            enable:     true,
            speed:      1.5, // Velocidade das partículas
            direction: "none",
            random:     true,
            straight:   false,
            outModes: {
              default: "bounce",
            },
          },
          links: {
            enable:     true,
            distance:   150, // Distância para conectar partículas
            color:      "#00bfff",
            opacity:    0.4,
            width:      1,
          },
        },        
        detectRetina: true,
      }}
    />
  );
};

