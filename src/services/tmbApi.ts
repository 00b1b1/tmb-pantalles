import { TMB_API_CONFIG } from '../config/api.config';
import type { TMBResponse, LinesResponse, StationsResponse, TMBAlertResponse } from '../types/tmb';

const { BASE_URL: TMB_API_BASE, APP_ID, APP_KEY } = TMB_API_CONFIG;

/**
 * Fetch all metro lines
 * @returns List of all TMB metro lines
 */
export async function fetchAllLines(): Promise<LinesResponse> {
    const url = `${TMB_API_BASE}/transit/linies/metro/?app_key=${APP_KEY}&app_id=${APP_ID}&propertyName=ID_LINIA,CODI_LINIA,NOM_LINIA,DESC_LINIA,ORIGEN_LINIA,DESTI_LINIA,COLOR_LINIA,COLOR_TEXT_LINIA,ID_OPERADOR,ORDRE_FAMILIA,NOM_TIPUS_TRANSPORT,ORDRE_LINIA&sortBy=ORDRE_LINIA&srsName=EPSG:3857`;

    const response = await fetch(url);

    if (!response.ok) {
        throw new Error(`TMB API error: ${response.status} ${response.statusText}`);
    }

    return response.json();
}

/**
 * Fetch all stations for a specific line
 * @param lineCode - Line code (e.g., 1 for L1, 4 for L4)
 * @returns List of stations for the line
 */
export async function fetchLineStations(lineCode: number): Promise<StationsResponse> {
    const url = `${TMB_API_BASE}/transit/linies/metro/${lineCode}/estacions?app_key=${APP_KEY}&app_id=${APP_ID}&cql_filter=&sortBy=ORDRE_ESTACIO&srsName=EPSG:3857`;

    const response = await fetch(url);

    if (!response.ok) {
        throw new Error(`TMB API error: ${response.status} ${response.statusText}`);
    }

    return response.json();
}

/**
 * Fetch real-time metro information for a specific station
 * @param stationId - Station code (e.g., 428)
 * @param lineId - Line code (e.g., 4)
 * @returns TMB API response with arrival times
 */
export async function fetchStationInfo(
    stationId: number,
    lineId: number
): Promise<TMBResponse> {
    const url = `${TMB_API_BASE}/itransit/metro/estacions/${stationId}?app_key=${APP_KEY}&app_id=${APP_ID}&temps_teoric=true&codi_linia=${lineId}`;

    const response = await fetch(url);

    if (!response.ok) {
        throw new Error(`TMB API error: ${response.status} ${response.statusText}`);
    }

    return response.json();
}

/**
 * Calculate time remaining until arrival
 * @param arrivalTimestamp - Unix timestamp of arrival
 * @param currentTimestamp - Current unix timestamp
 * @param simplify - If true, show only minutes (e.g., "2 min") when duration is >= 2 minutes
 * @returns Formatted time string
 */
export function calculateTimeRemaining(
    arrivalTimestamp: number,
    currentTimestamp: number,
    simplify: boolean = false
): string {
    const diffMs = arrivalTimestamp - currentTimestamp;

    if (diffMs <= 0) {
        return 'Entra';
    }

    const totalSeconds = Math.floor(diffMs / 1000);

    // Show "Entra" when 15 seconds or less remain
    if (totalSeconds <= 15) {
        return 'Entra';
    }

    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;

    // For the second train (or when simplify is true) and more than 2 minutes,
    // show only minutes
    if (simplify && minutes >= 2) {
        return `${minutes} min`;
    }

    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}
/**
 * Fetch alerts/disruptions for a specific line
 * @param lineName - Line name (e.g., "L4")
 * @returns TMB API response with alerts
 */
export async function fetchLineAlerts(lineName: string): Promise<TMBAlertResponse> {
    const url = `${TMB_API_BASE}/alerts/metro/channels/WEB/routes/${lineName}?app_key=${APP_KEY}&app_id=${APP_ID}`;

    const response = await fetch(url);

    if (!response.ok) {
        throw new Error(`TMB API error: ${response.status} ${response.statusText}`);
    }

    return response.json();
}
