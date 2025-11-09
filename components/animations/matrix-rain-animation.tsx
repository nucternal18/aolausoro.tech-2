import { useEffect, useRef } from "react";
import * as THREE from "three";
import { FontLoader } from "three/addons/loaders/FontLoader.js";
import { TextGeometry } from "three/addons/geometries/TextGeometry.js";

export function MatrixRainAnimation() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mountRef.current) return;

    const scene = new THREE.Scene();
    const width = window.innerWidth;
    const height = window.innerHeight;
    const aspect = width / height;

    const camera = new THREE.PerspectiveCamera(75, aspect, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });

    // Set renderer to full screen size
    renderer.setSize(width, height);
    renderer.domElement.style.position = "fixed";
    renderer.domElement.style.top = "0";
    renderer.domElement.style.left = "0";
    renderer.domElement.style.width = "100%";
    renderer.domElement.style.height = "100%";
    renderer.domElement.style.zIndex = "0";
    mountRef.current.appendChild(renderer.domElement);

    const createTextGeometry = (text: string, font: any) => {
      return new TextGeometry(text, {
        font: font,
        size: 0.2,
        depth: 0.01,
      });
    };

    let animationId: number | undefined;
    let handleResize: (() => void) | null = null;

    const loader = new FontLoader();
    loader.load("/fonts/helvetiker_regular.typeface.json", (font) => {
      const particles: THREE.Mesh[] = [];
      const textMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
      // Increase particle count for better coverage
      const particleCount = Math.floor((width * height) / 5000);

      for (let i = 0; i < particleCount; i++) {
        const textGeometry = createTextGeometry(
          Math.random() > 0.5 ? "1" : "0",
          font
        );
        const particle = new THREE.Mesh(textGeometry, textMaterial);
        particle.position.set(
          (Math.random() - 0.5) * 10,
          (Math.random() - 0.5) * 20,
          Math.random() * 6 - 3
        );
        scene.add(particle);
        particles.push(particle);
      }

      camera.position.z = 5;

      handleResize = () => {
        const newWidth = window.innerWidth;
        const newHeight = window.innerHeight;
        const newAspect = newWidth / newHeight;

        camera.aspect = newAspect;
        camera.updateProjectionMatrix();
        renderer.setSize(newWidth, newHeight);
      };

      window.addEventListener("resize", handleResize);

      const animate = () => {
        animationId = requestAnimationFrame(animate);

        particles.forEach((particle) => {
          particle.position.y -= 0.05;
          if (particle.position.y < -10) {
            particle.position.y = 10;
          }
          particle.rotation.y += 0.01;
        });

        renderer.render(scene, camera);
      };

      animate();

      return () => {
        if (animationId) {
          cancelAnimationFrame(animationId);
        }
        if (handleResize) {
          window.removeEventListener("resize", handleResize);
        };
        if (mountRef.current && renderer.domElement.parentNode) {
          mountRef.current.removeChild(renderer.domElement);
        }
      }
    });
  }, []);

  return (
    <div
      ref={mountRef}
      className="fixed inset-0 w-full h-full pointer-events-none matrix-bg"
    />
  );
}
