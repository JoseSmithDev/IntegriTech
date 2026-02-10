/**
 * ModelUploader — Drag-and-drop 3D model upload with progress tracking.
 */

"use client";

import React, { useState, useCallback, useRef } from "react";
import { ALLOWED_MODEL_EXTENSIONS, MAX_FILE_SIZE_MB } from "../../lib/constants";

interface ModelUploaderProps {
    yachtId: string;
    onUploadComplete?: (modelId: string) => void;
    onError?: (error: string) => void;
}

type UploadState = "idle" | "dragging" | "uploading" | "processing" | "done" | "error";

export default function ModelUploader({
    yachtId,
    onUploadComplete,
    onError,
}: ModelUploaderProps) {
    const [state, setState] = useState<UploadState>("idle");
    const [progress, setProgress] = useState(0);
    const [fileName, setFileName] = useState("");
    const [error, setError] = useState("");
    const inputRef = useRef<HTMLInputElement>(null);

    const validateFile = (file: File): string | null => {
        const ext = "." + file.name.split(".").pop()?.toLowerCase();
        if (!ALLOWED_MODEL_EXTENSIONS.includes(ext)) {
            return `Formato no soportado. Permitidos: ${ALLOWED_MODEL_EXTENSIONS.join(", ")}`;
        }
        if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
            return `Archivo demasiado grande. Máx: ${MAX_FILE_SIZE_MB} MB`;
        }
        return null;
    };

    const handleFile = useCallback(
        async (file: File) => {
            const validationError = validateFile(file);
            if (validationError) {
                setError(validationError);
                setState("error");
                onError?.(validationError);
                return;
            }

            setFileName(file.name);
            setState("uploading");
            setProgress(0);
            setError("");

            try {
                // Simulate upload progress
                const progressInterval = setInterval(() => {
                    setProgress((p) => Math.min(p + 10, 90));
                }, 200);

                const formData = new FormData();
                formData.append("file", file);

                const res = await fetch(
                    `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api"}/models/yachts/${yachtId}/upload`,
                    { method: "POST", body: formData }
                );

                clearInterval(progressInterval);

                if (!res.ok) {
                    const err = await res.json().catch(() => ({ detail: "Error en la subida" }));
                    throw new Error(err.detail);
                }

                const data = await res.json();
                setProgress(100);
                setState(data.status === "completed" ? "done" : "processing");
                onUploadComplete?.(data.model_id);
            } catch (err) {
                const msg = err instanceof Error ? err.message : "Error en la subida";
                setError(msg);
                setState("error");
                onError?.(msg);
            }
        },
        [yachtId, onUploadComplete, onError]
    );

    const handleDrop = useCallback(
        (e: React.DragEvent) => {
            e.preventDefault();
            setState("idle");
            const file = e.dataTransfer.files[0];
            if (file) handleFile(file);
        },
        [handleFile]
    );

    const handleDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setState("dragging");
    }, []);

    const handleDragLeave = useCallback(() => {
        setState("idle");
    }, []);

    const stateConfig = {
        idle: { icon: "📁", text: "Arrastra tu modelo 3D aquí", sub: `Soporta ${ALLOWED_MODEL_EXTENSIONS.join(", ")} · Máx ${MAX_FILE_SIZE_MB} MB` },
        dragging: { icon: "📥", text: "¡Suéltalo!", sub: "Para comenzar a subir" },
        uploading: { icon: "⬆️", text: `Subiendo ${fileName}...`, sub: `${progress}%` },
        processing: { icon: "⚙️", text: "Analizando malla...", sub: "Calculando área y exclusiones" },
        done: { icon: "✅", text: "¡Análisis completo!", sub: fileName },
        error: { icon: "❌", text: "Error en la subida", sub: error },
    };

    const cfg = stateConfig[state];

    return (
        <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onClick={() => state !== "uploading" && inputRef.current?.click()}
            style={{
                ...styles.dropzone,
                borderColor: state === "dragging" ? "#06b6d4" : state === "error" ? "#ef4444" : "rgba(255,255,255,0.12)",
                background: state === "dragging" ? "rgba(6,182,212,0.05)" : "rgba(15,23,42,0.6)",
                cursor: state === "uploading" ? "default" : "pointer",
            }}
        >
            <input
                ref={inputRef}
                type="file"
                accept={ALLOWED_MODEL_EXTENSIONS.join(",")}
                onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
                style={{ display: "none" }}
            />

            <span style={styles.icon}>{cfg.icon}</span>
            <span style={styles.text}>{cfg.text}</span>
            <span style={styles.sub}>{cfg.sub}</span>

            {(state === "uploading" || state === "processing") && (
                <div style={styles.progressTrack}>
                    <div
                        style={{
                            ...styles.progressFill,
                            width: `${state === "processing" ? 100 : progress}%`,
                            ...(state === "processing" ? { animation: "pulse 1.5s infinite" } : {}),
                        }}
                    />
                </div>
            )}

            <style>{`@keyframes pulse { 0%,100% { opacity: 1 } 50% { opacity: 0.5 } }`}</style>
        </div>
    );
}

const styles: Record<string, React.CSSProperties> = {
    dropzone: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 10,
        padding: 40,
        borderRadius: 16,
        border: "2px dashed",
        transition: "all 0.3s",
        minHeight: 200,
    },
    icon: { fontSize: 40 },
    text: { fontSize: 16, fontWeight: 600, color: "#e2e8f0" },
    sub: { fontSize: 13, color: "#64748b" },
    progressTrack: {
        width: "80%",
        height: 6,
        borderRadius: 3,
        background: "rgba(30,41,59,0.8)",
        marginTop: 12,
        overflow: "hidden",
    },
    progressFill: {
        height: "100%",
        borderRadius: 3,
        background: "linear-gradient(90deg, #06b6d4, #10b981)",
        transition: "width 0.3s",
    },
};
