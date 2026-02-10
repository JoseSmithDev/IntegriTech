/**
 * HeatmapMaterial — Custom shader for cleaning progress visualization.
 *
 * Applies a color gradient (Red → Yellow → Green) based on a progress
 * uniform, giving users a visual "heatmap" of fouling vs. clean areas.
 */

"use client";

import React, { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface HeatmapMaterialProps {
    /** Cleaning progress 0.0 (dirty) → 1.0 (clean) */
    progress: number;
}

// ── GLSL Shaders ────────────────────────────────────────

const vertexShader = /* glsl */ `
  varying vec2 vUv;
  varying vec3 vNormal;
  varying vec3 vPosition;

  void main() {
    vUv = uv;
    vNormal = normalize(normalMatrix * normal);
    vPosition = (modelMatrix * vec4(position, 1.0)).xyz;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fragmentShader = /* glsl */ `
  uniform float uProgress;
  uniform float uTime;
  varying vec2 vUv;
  varying vec3 vNormal;
  varying vec3 vPosition;

  // Heatmap color ramp: Red → Yellow → Green
  vec3 heatColor(float t) {
    vec3 dirty   = vec3(0.80, 0.10, 0.10);  // Red — heavy fouling
    vec3 partial = vec3(0.90, 0.70, 0.10);  // Yellow — in progress
    vec3 clean   = vec3(0.10, 0.80, 0.30);  // Green — fully cleaned

    if (t < 0.5) {
      return mix(dirty, partial, t * 2.0);
    }
    return mix(partial, clean, (t - 0.5) * 2.0);
  }

  void main() {
    // Use a combination of UV and position for spatial variation
    float spatialNoise = fract(sin(dot(vUv, vec2(12.9898, 78.233))) * 43758.5453);

    // Progress with spatial variation (some areas clean before others)
    float localProgress = clamp(uProgress * 1.3 - spatialNoise * 0.3, 0.0, 1.0);

    // Animated sweep line
    float sweepEdge = uProgress;
    float sweep = smoothstep(sweepEdge - 0.05, sweepEdge + 0.05, vUv.y);
    localProgress = mix(localProgress, 1.0, sweep * uProgress);

    vec3 color = heatColor(localProgress);

    // Add subtle fresnel rim for depth
    float fresnel = pow(1.0 - abs(dot(vNormal, vec3(0.0, 0.0, 1.0))), 2.0);
    color += fresnel * 0.15;

    // Pulse effect on the cleaning frontier
    float frontier = smoothstep(0.02, 0.0, abs(localProgress - 0.5));
    color += frontier * vec3(0.2, 0.6, 1.0) * (0.5 + 0.5 * sin(uTime * 4.0));

    gl_FragColor = vec4(color, 0.85);
  }
`;

// ── Component ───────────────────────────────────────────

export function HeatmapMaterial({ progress }: HeatmapMaterialProps) {
    const materialRef = useRef<THREE.ShaderMaterial>(null);

    const uniforms = useMemo(
        () => ({
            uProgress: { value: progress },
            uTime: { value: 0 },
        }),
        []
    );

    // Animate time uniform
    useFrame((_, delta) => {
        if (materialRef.current) {
            materialRef.current.uniforms.uTime.value += delta;
            materialRef.current.uniforms.uProgress.value +=
                (progress - materialRef.current.uniforms.uProgress.value) * 0.05;
        }
    });

    return (
        <shaderMaterial
            ref={materialRef}
            vertexShader={vertexShader}
            fragmentShader={fragmentShader}
            uniforms={uniforms}
            transparent
            side={THREE.DoubleSide}
            depthWrite={false}
        />
    );
}
