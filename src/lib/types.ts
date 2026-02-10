/**
 * YachtClean Pro — Shared TypeScript types.
 *
 * These mirror the backend Pydantic models and database enums.
 */

// ── Enums (match PostgreSQL enum types) ──────────────────

export type FoulingType = "bio_fouling" | "heavy_oxidation" | "old_antifouling";
export type SubstrateType = "carbon_fiber" | "aluminum" | "steel";
export type FinishType = "bare_clean" | "pre_paint_ready" | "mirror_polish";
export type QuoteStatus = "draft" | "sent" | "accepted" | "expired" | "declined";
export type JobStatus = "pending" | "processing" | "completed" | "failed";

// ── Human-readable labels ────────────────────────────────

export const FOULING_LABELS: Record<FoulingType, string> = {
    bio_fouling: "Bio-fouling (barnacles, algae)",
    heavy_oxidation: "Heavy Oxidation",
    old_antifouling: "Old Anti-fouling Paint",
};

export const SUBSTRATE_LABELS: Record<SubstrateType, string> = {
    carbon_fiber: "Carbon Fiber",
    aluminum: "Aluminum",
    steel: "Steel",
};

export const FINISH_LABELS: Record<FinishType, string> = {
    bare_clean: "Bare Clean",
    pre_paint_ready: "Pre-paint Ready",
    mirror_polish: "Mirror Polish",
};

// ── Data models ──────────────────────────────────────────

export interface Client {
    id: string;
    email: string;
    full_name: string;
    company?: string;
    phone?: string;
    avatar_url?: string;
}

export interface Yacht {
    id: string;
    client_id: string;
    name: string;
    imo_number?: string;
    loa_m?: number;
    beam_m?: number;
    draft_m?: number;
    hull_material: SubstrateType;
    year_built?: number;
    flag_state?: string;
    home_port?: string;
}

export interface Model3D {
    id: string;
    yacht_id: string;
    filename: string;
    file_format: string;
    file_size_bytes?: number;
    vertex_count?: number;
    face_count?: number;
    total_area_m2?: number;
    hull_area_m2?: number;
    excluded_parts?: ExcludedPart[];
    mesh_metadata?: MeshMetadata;
    processing_job: JobStatus;
}

export interface ExcludedPart {
    name: string;
    area_m2: number;
    reason: "keyword" | "small_component" | "normal_cluster";
}

export interface MeshMetadata {
    bounding_box: [number, number, number];
    center: [number, number, number];
}

// ── Quote ────────────────────────────────────────────────

export interface QuoteInputs {
    hull_area_m2: number;
    fouling: FoulingType;
    substrate: SubstrateType;
    desired_finish: FinishType;
    distance_km: number;
}

export interface CostBreakdown {
    hull_area_m2: number;
    effective_rate_m2h: number;
    cleaning_time_h: number;
    cost_cleaning: number;
    cost_setup: number;
    cost_mobilization: number;
    cost_total: number;
}

export interface Quote {
    quote_id: string;
    cost_breakdown: CostBreakdown;
    valid_until: string;
    status: QuoteStatus;
}

// ── ROI / TCO ────────────────────────────────────────────

export interface TCODetail {
    direct: number;
    waste: number;
    downtime: number;
    fines: number;
    damage: number;
    total: number;
}

export interface ROIResult {
    laser: TCODetail;
    sandblasting: TCODetail;
    chemical: TCODetail;
    roi_pct: number;
    annual_savings: number;
    best_traditional: string;
}

// ── 3D Viewer state ──────────────────────────────────────

export type ViewerMode = "normal" | "heatmap" | "before_after";

export interface ViewerState {
    mode: ViewerMode;
    cleanProgress: number; // 0.0 → 1.0
    showWireframe: boolean;
    autoRotate: boolean;
    selectedPart: string | null;
}
