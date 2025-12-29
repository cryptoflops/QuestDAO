'use client';

import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function WebGLBackground() {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!containerRef.current) return;

        const container = containerRef.current;
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });

        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        container.appendChild(renderer.domElement);

        camera.position.z = 5;

        // Multi-Blob Fluid Geometry
        const geometry = new THREE.IcosahedronGeometry(5, 128);

        // Custom Material with iridescent/glassy feel
        const material = new THREE.MeshPhongMaterial({
            color: 0xFF4B12, // Vibrant Stacks Orange
            emissive: 0x110000,
            shininess: 150,
            transparent: true,
            opacity: 0.9,
            specular: 0xffffff,
            flatShading: false,
        });

        const sphere = new THREE.Mesh(geometry, material);
        scene.add(sphere);

        // Advanced Lighting Suite (Tamed)
        const mainLight = new THREE.DirectionalLight(0xffffff, 1.2);
        mainLight.position.set(10, 10, 10);
        scene.add(mainLight);

        const pointLight1 = new THREE.PointLight(0xFF4B12, 10, 30);
        pointLight1.position.set(-5, 5, 5);
        scene.add(pointLight1);

        const pointLight2 = new THREE.PointLight(0xFFFFFF, 2, 25);
        pointLight2.position.set(5, -5, 5);
        scene.add(pointLight2);

        const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
        scene.add(ambientLight);

        // Animation Variables
        let time = 0;
        const initialPositions = (geometry.attributes.position as THREE.BufferAttribute).array.slice();

        const animate = () => {
            time += 0.006;

            // Liquid Morphing logic
            const positions = geometry.attributes.position as THREE.BufferAttribute;
            for (let i = 0; i < positions.count; i++) {
                const x = initialPositions[i * 3];
                const y = initialPositions[i * 3 + 1];
                const z = initialPositions[i * 3 + 2];

                // Complex organic displacement
                const noise =
                    Math.sin(x * 0.3 + time) * 0.4 +
                    Math.cos(y * 0.4 + time * 0.8) * 0.4 +
                    Math.sin(z * 0.5 + time * 1.5) * 0.3 +
                    Math.sin((x + y + z) * 0.1 + time) * 0.5;

                positions.setXYZ(i, x + noise, y + noise, z + noise);
            }
            positions.needsUpdate = true;

            sphere.rotation.y += 0.0008;
            sphere.rotation.x += 0.0004;

            renderer.render(scene, camera);
            requestAnimationFrame(animate);
        };

        animate();

        // Responsive handling
        const handleResize = () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        };

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
            if (container.contains(renderer.domElement)) {
                container.removeChild(renderer.domElement);
            }
            renderer.dispose();
            geometry.dispose();
            material.dispose();
        };
    }, []);

    return (
        <div
            ref={containerRef}
            className="fixed inset-0 -z-50 pointer-events-none transition-opacity duration-1000 bg-[#FFFFFF]"
            aria-hidden="true"
        />
    );
}
