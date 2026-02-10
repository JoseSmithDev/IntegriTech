/**
 * YachtClean Pro — Constants.
 */

// ── Quoting defaults ─────────────────────────────────────

export const DEFAULT_BASE_RATE = 0.5; // m²/h
export const DEFAULT_HOURLY_COST = 350; // €/h
export const DEFAULT_SETUP_COST = 500; // €
export const DEFAULT_MOBILIZATION_RATE = 2.5; // €/km
export const DEFAULT_DAILY_DOWNTIME = 1500; // €/day

// ── File upload ──────────────────────────────────────────

export const ALLOWED_MODEL_EXTENSIONS = [".obj", ".stl", ".gltf", ".glb"];
export const MAX_FILE_SIZE_MB = 200;
export const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;

// ── 3D Viewer ────────────────────────────────────────────

export const CAMERA_FOV = 50;
export const CAMERA_NEAR = 0.1;
export const CAMERA_FAR = 1000;
export const AUTO_ROTATE_SPEED = 0.5;

// ── Heatmap colors ───────────────────────────────────────

export const HEATMAP_DIRTY = "#CC1A1A"; // Red — heavy fouling
export const HEATMAP_PARTIAL = "#E6B31A"; // Yellow — partial
export const HEATMAP_CLEAN = "#1ACC4D"; // Green — clean

// ── Chart colors ─────────────────────────────────────────

export const CHART_COLORS = {
    laser: "#06B6D4", // Cyan
    sandblasting: "#F97316", // Orange
    chemical: "#EF4444", // Red
    savings: "#10B981", // Emerald
};

// ── API ──────────────────────────────────────────────────

export const POLL_INTERVAL_MS = 2000; // Model processing status poll
