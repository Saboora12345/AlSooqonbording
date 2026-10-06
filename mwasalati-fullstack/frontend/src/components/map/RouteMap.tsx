import { MapContainer, Marker, Polyline, Popup, TileLayer } from "react-leaflet";
import L from "leaflet";
import type { Stop } from "../../types";

// react-leaflet's default marker icon paths break under most bundlers
// (Vite included) because the images referenced in the CSS are resolved
// relative to the leaflet package rather than the served asset path. The
// fix used throughout this project: override with explicit CDN URLs.
const brandIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

interface RouteMapProps {
  stops: Stop[];
  selectedStopId?: string;
  onSelectStop?: (stop: Stop) => void;
}

export function RouteMap({ stops, selectedStopId, onSelectStop }: RouteMapProps) {
  if (stops.length === 0) return null;
  const center: [number, number] = [stops[0].lat, stops[0].lng];
  const path: [number, number][] = stops.map((s) => [s.lat, s.lng]);

  return (
    <div className="h-64 w-full overflow-hidden rounded-ticket ring-1 ring-brand-brown/10">
      <MapContainer center={center} zoom={13} scrollWheelZoom={false} className="h-full w-full">
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Polyline positions={path} pathOptions={{ color: "#6D4C41", weight: 3 }} />
        {stops.map((stop) => (
          <Marker
            key={stop.id}
            position={[stop.lat, stop.lng]}
            icon={brandIcon}
            eventHandlers={{ click: () => onSelectStop?.(stop) }}
          >
            <Popup>{stop.nameAr}</Popup>
          </Marker>
        ))}
      </MapContainer>
      {selectedStopId && (
        <span className="sr-only">Selected stop: {selectedStopId}</span>
      )}
    </div>
  );
}
