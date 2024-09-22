import { useEffect, useRef } from "react";
import * as THREE from "three";

export function NetworkAnimation() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mountRef.current) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(300, 300);
    mountRef.current.appendChild(renderer.domElement);

    // Create nodes
    const nodes: THREE.Mesh[] = [];
    const nodeGeometry = new THREE.SphereGeometry(0.1, 32, 32);
    const nodeMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00 });

    for (let i = 0; i < 10; i++) {
      const node = new THREE.Mesh(nodeGeometry, nodeMaterial);
      node.position.set(
        Math.random() * 4 - 2,
        Math.random() * 4 - 2,
        Math.random() * 4 - 2,
      );
      scene.add(node);
      nodes.push(node);
    }

    // Create edges
    const edges: THREE.Line[] = [];
    const edgeMaterial = new THREE.LineBasicMaterial({
      color: 0x00ff00,
      opacity: 0.5,
      transparent: true,
    });

    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        if (Math.random() > 0.7) continue; // Only create some connections
        const geometry = new THREE.BufferGeometry().setFromPoints([
          nodes[i]?.position ?? new THREE.Vector3(),
          nodes[j]?.position ?? new THREE.Vector3(),
        ]);
        const edge = new THREE.Line(geometry, edgeMaterial);
        scene.add(edge);
        edges.push(edge);
      }
    }

    // Create data packets
    const packetGeometry = new THREE.SphereGeometry(0.03, 16, 16);
    const packetMaterial = new THREE.MeshBasicMaterial({ color: 0xffff00 });
    const packets: { mesh: THREE.Mesh; edge: THREE.Line; progress: number }[] =
      [];

    for (let i = 0; i < 20; i++) {
      const packet = new THREE.Mesh(packetGeometry, packetMaterial);
      const edge = edges[Math.floor(Math.random() * edges.length)];
      if (edge) {
        scene.add(packet);
        packets.push({ mesh: packet, edge, progress: 0 });
      }
    }

    camera.position.z = 5;

    const animate = () => {
      requestAnimationFrame(animate);

      // Animate packets
      packets.forEach((packet) => {
        packet.progress += 0.01;
        if (packet.progress > 1) {
          packet.progress = 0;
          const newEdge = edges[Math.floor(Math.random() * edges.length)];
          if (newEdge) {
            packet.edge = newEdge;
          }
        }
        const start = packet.edge?.geometry.attributes.position
          ?.array as THREE.TypedArray;
        if (start && start.length > 0) {
          packet.mesh.position.set(
            (start[0] as number) +
              ((start[3] as number) - (start[0] as number)) * packet.progress,
            (start[1] as number) +
              ((start[4] as number) - (start[1] as number)) * packet.progress,
            (start[2] as number) +
              ((start[5] as number) - (start[2] as number)) * packet.progress,
          );
        }
      });

      // Rotate the entire scene
      scene.rotation.x += 0.001;
      scene.rotation.y += 0.002;

      renderer.render(scene, camera);
    };

    animate();

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
