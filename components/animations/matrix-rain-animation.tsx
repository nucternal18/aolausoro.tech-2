import { useEffect, useRef } from "react";
import * as THREE from "three";
import { FontLoader } from "three/addons/loaders/FontLoader.js";
import { TextGeometry } from "three/addons/geometries/TextGeometry.js";

export function MatrixRainAnimation() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mountRef.current) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(400, 400);
    mountRef.current.appendChild(renderer.domElement);

    const createTextGeometry = (text: string, font: any) => {
      return new TextGeometry(text, {
        font: font,
        size: 0.2,
        depth: 0.01,
      });
    };

    const loader = new FontLoader();
    loader.load("/fonts/helvetiker_regular.typeface.json", (font) => {
      const particles: THREE.Mesh[] = [];
      const textMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00 });

      for (let i = 0; i < 100; i++) {
        const textGeometry = createTextGeometry(
          Math.random() > 0.5 ? "1" : "0",
          font,
        );
        const particle = new THREE.Mesh(textGeometry, textMaterial);
        particle.position.set(
          Math.random() * 6 - 3,
          Math.random() * 10 - 5,
          Math.random() * 6 - 3,
        );
        scene.add(particle);
        particles.push(particle);
      }

      camera.position.z = 5;

      const animate = () => {
        requestAnimationFrame(animate);

        particles.forEach((particle) => {
          particle.position.y -= 0.05;
          if (particle.position.y < -5) {
            particle.position.y = 5;
          }
          particle.rotation.y += 0.01;
        });

        renderer.render(scene, camera);
      };

      animate();
    });

    return () => {
      mountRef.current?.removeChild(renderer.domElement);
    };
  }, []);

  return (
    <div
      ref={mountRef}
      className="w-full h-full flex items-center justify-center"
    />
  );
}
