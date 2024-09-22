import { useEffect, useRef } from "react";
import * as THREE from "three";

export function CodeCubeAnimation() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mountRef.current) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(300, 300);
    mountRef.current.appendChild(renderer.domElement);

    const createCodeTexture = (code: string, language: string) => {
      const canvas = document.createElement("canvas");
      canvas.width = 512;
      canvas.height = 512;
      const ctx = canvas.getContext("2d");
      if (!ctx) return new THREE.Texture();

      ctx.fillStyle = "#282c34";
      ctx.fillRect(0, 0, 512, 512);

      ctx.font = "20px monospace";
      ctx.fillStyle = "#abb2bf";
      ctx.textAlign = "left";
      ctx.textBaseline = "top";

      const lines = code.split("\n");
      lines.forEach((line, index) => {
        ctx.fillText(line, 10, 10 + index * 24);
      });

      ctx.font = "bold 24px sans-serif";
      ctx.fillStyle = "#61afef";
      ctx.textAlign = "right";
      ctx.textBaseline = "bottom";
      ctx.fillText(language, 502, 502);

      const texture = new THREE.Texture(canvas);
      texture.needsUpdate = true;
      return texture;
    };

    const geometry = new THREE.BoxGeometry(2, 2, 2);
    const materials = [
      new THREE.MeshBasicMaterial({
        map: createCodeTexture(
          'function hello() {\n  console.log("Hello!");\n}',
          "JavaScript",
        ),
      }),
      new THREE.MeshBasicMaterial({
        map: createCodeTexture('def hello():\n    print("Hello!")', "Python"),
      }),
      new THREE.MeshBasicMaterial({
        map: createCodeTexture(
          '<div class="hello">\n  Hello, World!\n</div>',
          "HTML",
        ),
      }),
      new THREE.MeshBasicMaterial({
        map: createCodeTexture(".hello {\n  color: blue;\n}", "CSS"),
      }),
      new THREE.MeshBasicMaterial({
        map: createCodeTexture(
          "SELECT *\nFROM users\nWHERE active = true;",
          "SQL",
        ),
      }),
      new THREE.MeshBasicMaterial({
        map: createCodeTexture(
          "struct Hello {\n    message: String\n}",
          "Rust",
        ),
      }),
    ];
    const cube = new THREE.Mesh(geometry, materials);
    scene.add(cube);

    camera.position.z = 5;

    const rotationSpeed = 0.01;
    let lastMousePosition = { x: 0, y: 0 };

    const animate = () => {
      requestAnimationFrame(animate);
      cube.rotation.x += rotationSpeed;
      cube.rotation.y += rotationSpeed;
      renderer.render(scene, camera);
    };

    animate();

    const handleMouseMove = (event: MouseEvent) => {
      const deltaMove = {
        x: event.clientX - lastMousePosition.x,
        y: event.clientY - lastMousePosition.y,
      };

      if (event.buttons === 1) {
        cube.rotation.y += deltaMove.x * 0.005;
        cube.rotation.x += deltaMove.y * 0.005;
      }

      lastMousePosition = {
        x: event.clientX,
        y: event.clientY,
      };
    };

    const handleWheel = (event: WheelEvent) => {
      event.preventDefault();
      camera.position.z += event.deltaY * 0.005;
      camera.position.z = Math.max(3, Math.min(camera.position.z, 10));
    };

    renderer.domElement.addEventListener("mousemove", handleMouseMove);
    renderer.domElement.addEventListener("wheel", handleWheel);

    return () => {
      renderer.domElement.removeEventListener("mousemove", handleMouseMove);
      renderer.domElement.removeEventListener("wheel", handleWheel);
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
