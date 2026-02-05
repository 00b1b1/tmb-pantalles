import type { CustomAlert } from '../types/tmb';

export interface PanelConfig {
    lineCode: number;
    lineName: string;
    stationCode: number;
    directionId: number;
    showAlert: boolean;
    showEmergencyAlert: boolean;
    activeAlertIds: number[];
    customAlerts: CustomAlert[];
    hideConfigButton?: boolean;
}

/**
 * Generate a shareable URL for the current panel configuration using simple query parameters
 */
export function generateShareableUrl(config: PanelConfig): string {
    const baseUrl = window.location.origin;
    const params = new URLSearchParams();

    // Basic parameters
    params.set('line', config.lineName);
    params.set('station', config.stationCode.toString());
    params.set('direction', config.directionId.toString());

    // Optional parameters
    if (config.showAlert) {
        params.set('alerts', 'true');
    }

    if (!config.showEmergencyAlert) {
        params.set('emergency', 'false');
    }

    if (config.hideConfigButton) {
        params.set('hideConfig', 'true');
    }

    // Active alert IDs (if any)
    if (config.activeAlertIds.length > 0) {
        params.set('alertIds', config.activeAlertIds.join(','));
    }

    // Custom alerts (encoded as JSON only if present)
    if (config.customAlerts.length > 0) {
        params.set('customAlerts', btoa(JSON.stringify(config.customAlerts)));
    }

    return `${baseUrl}/?${params.toString()}`;
}

/**
 * Parse configuration from URL query parameters
 */
export function parseConfigFromUrl(): PanelConfig | null {
    const params = new URLSearchParams(window.location.search);

    // Check if we have at least the line parameter
    const lineName = params.get('line');
    if (!lineName) {
        return null;
    }

    // Parse basic parameters
    const stationCode = parseInt(params.get('station') || '0');
    const directionId = parseInt(params.get('direction') || '1');

    // Parse optional parameters
    const showAlert = params.get('alerts') === 'true';
    const showEmergencyAlert = params.get('emergency') !== 'false'; // Default true
    const hideConfigButton = params.get('hideConfig') === 'true';

    // Parse alert IDs
    const alertIdsParam = params.get('alertIds');
    const activeAlertIds = alertIdsParam
        ? alertIdsParam.split(',').map(id => parseInt(id)).filter(id => !isNaN(id))
        : [];

    // Parse custom alerts
    let customAlerts: CustomAlert[] = [];
    const customAlertsParam = params.get('customAlerts');
    if (customAlertsParam) {
        try {
            customAlerts = JSON.parse(atob(customAlertsParam));
        } catch (error) {
            console.error('Error parsing custom alerts:', error);
        }
    }

    // Extract line code from line name (e.g., "L4" -> 4)
    const lineCode = parseInt(lineName.replace(/[^0-9]/g, '')) || 0;

    return {
        lineCode,
        lineName,
        stationCode,
        directionId,
        showAlert,
        showEmergencyAlert,
        activeAlertIds,
        customAlerts,
        hideConfigButton
    };
}
