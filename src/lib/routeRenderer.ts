import type { FlightPlan, RoutePoint } from './types';

declare const L: typeof import('leaflet');

export interface RouteRendererOptions {
    map: L.Map;
    routeColor?: string;
    routeWeight?: number;
}

export class RouteRenderer {
    private map: L.Map;
    private polyline: L.Polyline | null = null;
    private markers: L.CircleMarker[] = [];
    private routeColor: string;
    private routeWeight: number;

    constructor(options: RouteRendererOptions) {
        this.map = options.map;
        this.routeColor = options.routeColor ?? '#0066ff';
        this.routeWeight = options.routeWeight ?? 3;
    }

    render(flightPlan: FlightPlan): void {
        this.clear();

        const latLngs = flightPlan.routePoints.map(rp =>
            L.latLng(rp.waypoint.lat, rp.waypoint.lon)
        );

        // Draw route polyline
        this.polyline = L.polyline(latLngs, {
            color: this.routeColor,
            weight: this.routeWeight,
            opacity: 0.8,
        }).addTo(this.map);

        // Draw waypoint markers
        flightPlan.routePoints.forEach((rp, index) => {
            const marker = this.createMarker(rp, index, flightPlan.routePoints.length);
            this.markers.push(marker);
            marker.addTo(this.map);
        });

        // Fit map bounds to show entire route
        if (this.polyline) {
            this.map.fitBounds(this.polyline.getBounds(), { padding: [50, 50] });
        }
    }

    private createMarker(routePoint: RoutePoint, index: number, total: number): L.CircleMarker {
        const { waypoint } = routePoint;
        const isAirport = waypoint.type === 'airport';
        const isEndpoint = index === 0 || index === total - 1;

        // Style based on waypoint type
        const markerOptions: L.CircleMarkerOptions = {
            radius: isAirport ? 7 : 5,
            fillColor: isAirport ? '#00cc00' : '#ffaa00',
            color: isEndpoint ? '#ff0000' : '#ffffff',
            weight: isEndpoint ? 3 : 2,
            fillOpacity: 1,
        };

        const marker = L.circleMarker(
            [waypoint.lat, waypoint.lon],
            markerOptions
        );

        // Add tooltip with identifier
        marker.bindTooltip(waypoint.identifier, {
            permanent: true,
            direction: 'top',
            offset: [0, -8],
            className: 'waypoint-label',
        });

        return marker;
    }

    clear(): void {
        if (this.polyline) {
            this.polyline.remove();
            this.polyline = null;
        }
        this.markers.forEach(marker => marker.remove());
        this.markers = [];
    }
}
