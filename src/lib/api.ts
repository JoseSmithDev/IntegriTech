/**
 * YachtClean Pro — API client.
 *
 * Typed wrapper around fetch for communicating with the FastAPI backend.
 */

import type {
    Model3D,
    Quote,
    QuoteInputs,
    ROIResult,
    CostBreakdown,
} from "./types";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

// ── Generic fetch helper ─────────────────────────────────

async function apiFetch<T>(
    path: string,
    options: RequestInit = {}
): Promise<T> {
    const url = `${API_BASE}${path}`;
    const res = await fetch(url, {
        headers: {
            "Content-Type": "application/json",
            ...options.headers,
        },
        ...options,
    });

    if (!res.ok) {
        const error = await res.json().catch(() => ({ detail: res.statusText }));
        throw new Error(error.detail || `API error: ${res.status}`);
    }

    return res.json();
}

// ── Model endpoints ──────────────────────────────────────

export async function uploadModel(
    yachtId: string,
    file: File
): Promise<{ model_id: string; status: string; message: string }> {
    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch(`${API_BASE}/models/yachts/${yachtId}/upload`, {
        method: "POST",
        body: formData,
    });

    if (!res.ok) {
        const error = await res.json().catch(() => ({ detail: res.statusText }));
        throw new Error(error.detail || `Upload failed: ${res.status}`);
    }

    return res.json();
}

export async function getModelStatus(modelId: string): Promise<Model3D> {
    return apiFetch(`/models/${modelId}/status`);
}

export async function getModelDetails(modelId: string): Promise<Model3D> {
    return apiFetch(`/models/${modelId}`);
}

// ── Quote endpoints ──────────────────────────────────────

export async function getQuoteFactors(): Promise<{
    fouling: Record<string, number>;
    substrate: Record<string, number>;
    finish: Record<string, number>;
}> {
    return apiFetch("/quotes/factors");
}

export async function createQuote(params: {
    model_id: string;
    client_id: string;
    yacht_id: string;
    hull_area_m2: number;
    fouling: string;
    substrate: string;
    desired_finish: string;
    distance_km?: number;
}): Promise<Quote> {
    return apiFetch("/quotes/", {
        method: "POST",
        body: JSON.stringify(params),
    });
}

export async function getQuote(quoteId: string): Promise<Quote> {
    return apiFetch(`/quotes/${quoteId}`);
}

// ── ROI endpoint ─────────────────────────────────────────

export async function calculateROI(params: {
    hull_area_m2: number;
    laser_quote_total: number;
    laser_time_h: number;
    years?: number;
    cleanings_per_year?: number;
}): Promise<ROIResult> {
    return apiFetch("/quotes/roi", {
        method: "POST",
        body: JSON.stringify(params),
    });
}

// ── Health check ─────────────────────────────────────────

export async function healthCheck(): Promise<{
    status: string;
    service: string;
    version: string;
}> {
    return apiFetch("/health");
}
