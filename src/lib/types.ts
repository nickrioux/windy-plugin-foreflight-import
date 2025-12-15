export type WaypointType = 'airport' | 'navaid' | 'fix' | 'user' | 'unknown';

export interface Waypoint {
    identifier: string;
    type: WaypointType;
    lat: number;
    lon: number;
}

export interface RoutePoint {
    waypoint: Waypoint;
    altitudeFeet: number | null;
}

export interface FlightPlan {
    name: string;
    departure: string;
    destination: string;
    routePoints: RoutePoint[];
    totalDistanceNm: number;
    cruiseAltitudeFeet: number | null;
}
