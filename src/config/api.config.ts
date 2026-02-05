export const TMB_API_CONFIG = {
    BASE_URL: 'https://api.tmb.cat/v1',
    APP_ID: import.meta.env.VITE_TMB_APP_ID || '',
    APP_KEY: import.meta.env.VITE_TMB_APP_KEY || ''
};

export const DEFAULT_PANEL_CONFIG = {
    lineCode: 4,
    lineName: 'L4',
    lineColor: 'F7A30E',
    lineTextColor: '000000',
    stationCode: 428,
    stationName: 'Joanic',
    directionId: 1,
    destinationName: 'Trinitat Nova',
    showAlert: false,
    showEmergencyAlert: true,
    activeAlertIds: [],
    customAlerts: [],
    hideConfigButton: false
};
