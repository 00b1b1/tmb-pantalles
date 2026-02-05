// Types for TMB API response
export interface TMBResponse {
    timestamp: number; // Real timestamp
    linies: Line[];
}

export interface Line {
    codi_linia: number; // Line ID
    nom_linia: string; // Line name (e.g., "L4")
    nom_familia: string; // "Metro"
    codi_familia: number;
    color_linia: string; // Hex color without #
    estacions: Station[];
}

export interface Station {
    codi_via: number; // Track number
    id_sentit: number; // Direction ID
    codi_estacio: number; // Station ID
    linies_trajectes: LineRoute[];
}

export interface LineRoute {
    codi_linia: number; // Line ID
    nom_linia: string; // Line name
    color_linia: string; // Hex color
    codi_trajecte: string; // Route ID
    desti_trajecte: string; // Destination name
    propers_trens: UpcomingTrain[]; // Upcoming arrivals
}

export interface UpcomingTrain {
    codi_servei?: string; // Service ID (optional)
    temps_arribada: number; // Arrival timestamp
    temps_teoric?: boolean; // Theoretical time flag
}

// Lines API Types
export interface LinesResponse {
    type: string;
    features: LineFeature[];
    totalFeatures: number;
}

export interface LineFeature {
    type: string;
    id: string;
    geometry: null;
    properties: LineProperties;
}

export interface LineProperties {
    ID_LINIA: number;
    CODI_LINIA: number; // Line code (1, 2, 3, 4, etc.)
    NOM_LINIA: string; // Line name (L1, L2, L3, L4, etc.)
    DESC_LINIA: string; // Description
    ORIGEN_LINIA: string; // Origin
    DESTI_LINIA: string; // Destination
    COLOR_LINIA: string; // Hex color without #
    COLOR_TEXT_LINIA: string; // Text color hex without #
    ID_OPERADOR: number;
    NOM_TIPUS_TRANSPORT: string;
    ORDRE_FAMILIA: number;
    ORDRE_LINIA: number;
}

// Stations API Types
export interface StationsResponse {
    type: string;
    features: StationFeature[];
    totalFeatures: number;
}

export interface StationFeature {
    type: string;
    id: string;
    geometry: {
        type: string;
        coordinates: number[];
    };
    geometry_name: string;
    properties: StationProperties;
}

export interface StationProperties {
    ID_ESTACIO_LINIA: number;
    CODI_ESTACIO_LINIA: number; // Station code for timing endpoint
    ID_GRUP_ESTACIO: number;
    CODI_GRUP_ESTACIO: number;
    ID_ESTACIO: number;
    CODI_ESTACIO: number;
    NOM_ESTACIO: string; // Station name
    ORDRE_ESTACIO: number;
    ID_LINIA: number;
    CODI_LINIA: number; // Line code
    NOM_LINIA: string; // Line name
    ORDRE_LINIA: number;
    ID_TIPUS_SERVEI: number;
    DESC_SERVEI: string; // Service description
    ORIGEN_SERVEI: string; // Service origin
    DESTI_SERVEI: string; // Service destination
    ID_TIPUS_ACCESSIBILITAT: number;
    NOM_TIPUS_ACCESSIBILITAT: string; // Accessibility
    ID_TIPUS_ESTAT: number;
    NOM_TIPUS_ESTAT: string; // Operational status
    DATA_INAUGURACIO: string;
    DATA: string;
    COLOR_LINIA: string; // Line color hex
    PICTO: string;
    PICTO_GRUP: string;
}
// Alerts API Types
export interface TMBAlertResponse {
    status: string;
    data: {
        alerts: TMBAlert[];
    };
}

export interface TMBAlert {
    id: number;
    disruption_dates: {
        begin_date: number;
        end_date: number;
    }[];
    entities: AlertEntity[];
    publications: AlertPublication[];
    categories?: {
        effect_code: string;
        effect_type: string;
        cause_code: string;
        effect_status: string;
    };
}

export interface AlertEntity {
    line_code: string;
    line_name: string;
    station_code: string;
    station_name: string;
    direction_code?: string;
    direction_name?: string;
}

export interface AlertPublication {
    headerCa: string;
    headerEs: string;
    headerEn: string;
    textCa: string;
    textEs: string;
    textEn: string;
    begin_date: number;
    end_date: number;
}

export interface CustomAlert {
    id: string;
    title: string;
    content: string;
    bgColor: string;
    textColor: string;
    headerColor: string;
    iconName: string; // Filename of the icon in /transport-icons/
    isActive: boolean;
}
