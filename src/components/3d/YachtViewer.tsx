/**
 * YachtViewer — Main 3D scene component.
 *
 * Uses React Three Fiber to render the yacht hull with:
 *   - HDR environment lighting
 *   - Orbit controls
 *   - Heatmap shader overlay
 *   - Before/After toggle
 */

"use client";

import React, { Suspense, useRef, useState, useCallback } from "react";
import { Canvas } from "@react-three/fiber";
import {
    OrbitControls,
    Environment,
    Center,
    useGLTF,
    Html,
    ContactShadows,
} from "@react-three/drei";
import * as THREE from "three";
import { HeatmapMaterial } from "./HeatmapMaterial";
import type { ViewerMode } from "../../lib/types";

// ── Props ────────────────────────────────────────────────

interface YachtViewerProps {
    /** URL or path to the .glb/.gltf model */
    modelUrl: string;
    /** Overall cleaning progress 0..1 */
    cleanProgress?: number;
    /** Active viewer mode */
    mode?: ViewerMode;
    /** Called when a mesh part is clicked */
    onPartClick?: (name: string) => void;
    /** Optional CSS class for the container */
    className?: string;
}

// ── Hull Mesh sub-component ──────────────────────────────

function HullMesh({
    url,
    progress,
    mode,
    onPartClick,
}: {
    url: string;
    progress: number;
    mode: ViewerMode;
    onPartClick?: (name: string) => void;
}) {
    const { scene } = useGLTF(url);
    const groupRef = useRef<THREE.Group>(null);

    // Clone scene to avoid shared-state issues
    const clonedScene = React.useMemo(() => scene.clone(true), [scene]);

    // Apply heatmap material if in heatmap mode
    React.useEffect(() => {
        if (!clonedScene) return;

        clonedScene.traverse((child) => {
            if (child instanceof THREE.Mesh) {
                if (mode === "heatmap" || mode === "before_after") {
                    // Store original material for restoration
                    if (!(child.userData as any).__originalMaterial) {
                        (child.userData as any).__originalMaterial = child.material;
                    }
                    // We'll apply the heatmap shader via the HeatmapMaterial wrapper
                } else {
                    // Restore original material
                    const orig = (child.userData as any).__originalMaterial;
                    if (orig) {
                        child.material = orig;
                    }
                }
            }
        });
    }, [clonedScene, mode]);

    const handleClick = useCallback(
        (e: any) => {
            e.stopPropagation();
            if (onPartClick && e.object.name) {
                onPartClick(e.object.name);
            }
        },
        [onPartClick]
    );

    return (
        <Center>
            <group ref={groupRef} onClick={handleClick}>
                <primitive object={clonedScene} />
                {(mode === "heatmap" || mode === "before_after") && (
                    <HeatmapMaterial progress={progress} />
                )}
            </group>
        </Center>
    );
}

// ── Loading fallback ─────────────────────────────────────

function Loader() {
    return (
        <Html center>
            <div
                style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 12,
                    color: "#94a3b8",
                    fontFamily: "Inter, system-ui, sans-serif",
                }}
            >
                <div
                    style={{
                        width: 40,
                        height: 40,
                        border: "3px solid #1e293b",
                        borderTopColor: "#06b6d4",
                        borderRadius: "50%",
                        animation: "spin 1s linear infinite",
                    }}
                />
                <span>Loading 3D Model...</span>
                <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
            </div>
        </Html>
    );
}

// ── Main Component ───────────────────────────────────────

export default function YachtViewer({
    modelUrl,
    cleanProgress = 0,
    mode = "normal",
    onPartClick,
    className,
}: YachtViewerProps) {
    const [autoRotate, setAutoRotate] = useState(true);

    return (
        <div
            className={className}
            style={{
                width: "100%",
                height: "100%",
                minHeight: 500,
                background: "linear-gradient(180deg, #0f172a 0%, #1e293b 100%)",
                borderRadius: 16,
                overflow: "hidden",
                position: "relative",
            }}
        >
            <Canvas
                camera={{ position: [5, 3, 5], fov: 50, near: 0.1, far: 1000 }}
                gl={{ antialias: true, alpha: false }}
                dpr={[1, 2]}
            >
                {/* Lighting */}
                <ambientLight intensity={0.4} />
                <directionalLight position={[10, 10, 5]} intensity={1} castShadow />
                <directionalLight position={[-5, 5, -5]} intensity={0.3} />

                {/* Environment HDR */}
                <Environment preset="sunset" background={false} />

                {/* Contact shadow for grounding */}
                <ContactShadows
                    position={[0, -1.5, 0]}
                    opacity={0.4}
                    scale={20}
                    blur={2}
                />

                {/* Model */}
                <Suspense fallback={<Loader />}>
                    <HullMesh
                        url={modelUrl}
                        progress={cleanProgress}
                        mode={mode}
                        onPartClick={onPartClick}
                    />
                </Suspense>

                {/* Camera controls */}
                <OrbitControls
                    autoRotate={autoRotate}
                    autoRotateSpeed={0.5}
                    enablePan
                    enableZoom
                    enableRotate
                    maxPolarAngle={Math.PI / 1.5}
                    minDistance={2}
                    maxDistance={50}
                />
            </Canvas>

            {/* Viewer controls overlay */}
            <div
                style={{
                    position: "absolute",
                    bottom: 16,
                    right: 16,
                    display: "flex",
                    gap: 8,
                }}
            >
                <button
                    onClick={() => setAutoRotate(!autoRotate)}
                    style={{
                        padding: "8px 16px",
                        borderRadius: 8,
                        border: "1px solid rgba(255,255,255,0.15)",
                        background: autoRotate
                            ? "rgba(6,182,212,0.2)"
                            : "rgba(15,23,42,0.7)",
                        color: "#e2e8f0",
                        cursor: "pointer",
                        fontSize: 13,
                        backdropFilter: "blur(8px)",
                    }}
                >
                    {autoRotate ? "⏸ Pause" : "▶ Rotate"}
                </button>
            </div>
        </div>
    );
}
