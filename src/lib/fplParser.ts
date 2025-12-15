import type { FlightPlan, Waypoint, WaypointType, RoutePoint } from './types';

function parseWaypointType(typeStr: string): WaypointType {
    const normalized = typeStr.toUpperCase().trim();
    if (normalized === 'AIRPORT') return 'airport';
    if (normalized === 'VOR' || normalized === 'NDB' || normalized === 'NAVAID') return 'navaid';
    if (normalized === 'INT' || normalized === 'FIX' || normalized === 'INTERSECTION') return 'fix';
    if (normalized.includes('USER') || normalized.includes('WAYPOINT')) return 'user';
    return 'unknown';
}

function getTextContent(element: Element, tagName: string): string {
    const child = element.getElementsByTagName(tagName)[0];
    return child?.textContent?.trim() ?? '';
}

function haversineDistanceNm(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 3440.065; // Earth radius in nautical miles
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}

function calculateTotalDistance(routePoints: RoutePoint[]): number {
    let total = 0;
    for (let i = 1; i < routePoints.length; i++) {
        const prev = routePoints[i - 1].waypoint;
        const curr = routePoints[i].waypoint;
        total += haversineDistanceNm(prev.lat, prev.lon, curr.lat, curr.lon);
    }
    return Math.round(total);
}

export function parseFplFile(content: string): FlightPlan {
    // Handle UTF-16 encoding (ForeFlight exports as UTF-16)
    // Remove BOM and null characters that appear between each character in UTF-16
    let cleanedContent = content;
    if (content.charCodeAt(0) === 0xFFFE || content.charCodeAt(0) === 0xFEFF) {
        cleanedContent = content.substring(1);
    }
    // Remove null bytes (appears in UTF-16 when read as UTF-8)
    cleanedContent = cleanedContent.replace(/\x00/g, '');

    const parser = new DOMParser();
    const doc = parser.parseFromString(cleanedContent, 'application/xml');

    const parseError = doc.querySelector('parsererror');
    if (parseError) {
        throw new Error('Invalid FPL file: ' + parseError.textContent);
    }

    // Build waypoint lookup table
    const waypointTable = new Map<string, Waypoint>();
    const waypointElements = doc.getElementsByTagName('waypoint');

    for (const wpEl of waypointElements) {
        const identifier = getTextContent(wpEl, 'identifier');
        if (!identifier) continue;

        const waypoint: Waypoint = {
            identifier,
            type: parseWaypointType(getTextContent(wpEl, 'type')),
            lat: parseFloat(getTextContent(wpEl, 'lat')) || 0,
            lon: parseFloat(getTextContent(wpEl, 'lon')) || 0,
        };
        waypointTable.set(identifier, waypoint);
    }

    // Get cruise altitude from flight-data
    let cruiseAltitudeFeet: number | null = null;
    const flightDataEl = doc.getElementsByTagName('flight-data')[0];
    if (flightDataEl) {
        const altStr = getTextContent(flightDataEl, 'altitude-ft');
        if (altStr) {
            cruiseAltitudeFeet = parseInt(altStr, 10) || null;
        }
    }

    // Parse route points
    const routePoints: RoutePoint[] = [];
    const routePointElements = doc.getElementsByTagName('route-point');

    for (const rpEl of routePointElements) {
        const identifier = getTextContent(rpEl, 'waypoint-identifier');
        const waypoint = waypointTable.get(identifier);

        if (!waypoint) {
            console.warn(`Waypoint not found in table: ${identifier}`);
            continue;
        }

        routePoints.push({
            waypoint,
            altitudeFeet: cruiseAltitudeFeet,
        });
    }

    if (routePoints.length === 0) {
        throw new Error('No route points found in FPL file');
    }

    // Get route name or generate from departure/destination
    const routeNameEl = doc.getElementsByTagName('route-name')[0];
    let name = routeNameEl?.textContent?.trim() ?? '';

    const departure = routePoints[0].waypoint.identifier;
    const destination = routePoints[routePoints.length - 1].waypoint.identifier;

    if (!name) {
        name = `${departure} → ${destination}`;
    }

    return {
        name,
        departure,
        destination,
        routePoints,
        totalDistanceNm: calculateTotalDistance(routePoints),
        cruiseAltitudeFeet,
    };
}
