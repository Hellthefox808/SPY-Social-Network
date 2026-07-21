"use client";

import { useEffect, useRef, useState } from "react";
import { MapPin, ZoomIn, ZoomOut, Compass } from "lucide-react";
import "maplibre-gl/dist/maplibre-gl.css";

import type { Map as MapLibreMap, Marker } from "maplibre-gl";
import { JobProfile, JobLocation, JobEdge } from "@/types/osint";

export interface MapTabProps {
  profile: JobProfile;
  locations: JobLocation[];
  edges: JobEdge[];
  onMarkerClick: (loc: JobLocation) => void;
}

export default function MapTab({ profile, locations, edges, onMarkerClick }: MapTabProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<MapLibreMap | null>(null);
  const markersRef = useRef<Marker[]>([]);
  const [mapLoaded, setMapLoaded] = useState(false);

  // Filter locations that have valid coordinates
  const validLocations = locations.filter(
    (loc) => typeof loc.lat === "number" && typeof loc.lng === "number" && (loc.lat !== 0 || loc.lng !== 0)
  );

  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Dynamically import maplibre-gl to avoid SSR issues
    import("maplibre-gl").then((maplibregl) => {
      // Find starting center coordinates (default to first location, or 0,0)
      const center =
        validLocations.length > 0
          ? [validLocations[0].lng, validLocations[0].lat]
          : [-0.1278, 51.5074]; // Default to London

      // Initialize map with a beautiful CartoDB Dark Matter tile layer
      const map = new maplibregl.Map({
        container: mapContainerRef.current!,
        style: "https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json",
        center: center as [number, number],
        zoom: validLocations.length > 0 ? 3.5 : 1.5,
        attributionControl: false,
      });

      mapRef.current = map;

      map.on("load", () => {
        setMapLoaded(true);
        drawConnectionLines(map);
      });

      // Render locations as HTML markers
      renderMarkers(map, maplibregl);
    });

    return () => {
      // Cleanup markers
      markersRef.current.forEach((m) => m.remove());
      markersRef.current = [];
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [locations]);

  // Redraw lines when map or coordinates change
  const drawConnectionLines = (map: MapLibreMap) => {
    if (validLocations.length < 2) return;

    const sourceLocation = validLocations.find(l => l.locationType === "declared") || validLocations[0];
    const routes: Array<{
      type: "Feature";
      geometry: { type: "LineString"; coordinates: number[][] };
    }> = [];

    for (let i = 0; i < validLocations.length; i++) {
      const target = validLocations[i];
      if (target === sourceLocation) continue;

      routes.push({
        type: "Feature",
        geometry: {
          type: "LineString",
          coordinates: [
            [sourceLocation.lng, sourceLocation.lat],
            [target.lng, target.lat],
          ],
        },
      });
    }

    const geojson: GeoJSON.FeatureCollection = {
      type: "FeatureCollection",
      features: routes as GeoJSON.Feature[],
    };

    const routeSource = map.getSource("route");
    if (routeSource && "setData" in routeSource) {
      (routeSource as unknown as { setData: (data: GeoJSON.FeatureCollection) => void }).setData(geojson);
    } else {
      map.addSource("route", {
        type: "geojson",
        data: geojson,
      });

      map.addLayer({
        id: "route-layer",
        type: "line",
        source: "route",
        layout: {
          "line-join": "round",
          "line-cap": "round",
        },
        paint: {
          "line-color": "#3b82f6",
          "line-width": 2,
          "line-opacity": 0.45,
          "line-dasharray": [3, 2],
        },
      });
    }
  };

  const renderMarkers = (map: MapLibreMap, maplibreglInstance: typeof import("maplibre-gl")) => {
    // Clear old markers first
    markersRef.current.forEach((m) => m.remove());
    markersRef.current = [];

    validLocations.forEach((loc, index) => {
      const el = document.createElement("div");
      el.className = "custom-map-marker";

      // Color coding markers by locationType
      let markerColor = "bg-blue-500 shadow-blue-500/50"; // declared
      if (loc.locationType === "geotag") markerColor = "bg-rose-500 shadow-rose-500/50";
      if (loc.locationType === "organization") markerColor = "bg-amber-500 shadow-amber-500/50";
      if (loc.locationType === "inferred") markerColor = "bg-teal-500 shadow-teal-500/50";

      // HTML structure for visual pulses
      el.innerHTML = `
        <div class="relative flex items-center justify-center h-5 w-5 cursor-pointer">
          <div class="animate-ping absolute inline-flex h-full w-full rounded-full ${markerColor} opacity-40"></div>
          <div class="relative inline-flex rounded-full h-3.5 w-3.5 ${markerColor} border-2 border-white"></div>
        </div>
      `;

      el.addEventListener("click", () => {
        onMarkerClick(loc);
      });

      const marker = new maplibreglInstance.Marker({ element: el })
        .setLngLat([loc.lng, loc.lat])
        .addTo(map);

      markersRef.current.push(marker);
    });
  };

  const handleZoom = (type: "in" | "out") => {
    if (!mapRef.current) return;
    const currentZoom = mapRef.current.getZoom();
    mapRef.current.setZoom(type === "in" ? currentZoom + 1 : currentZoom - 1);
  };

  return (
    <div className="relative h-[550px] w-full rounded-xl border border-slate-900 bg-slate-950 overflow-hidden shadow-inner flex flex-col">
      {/* Map Element */}
      <div ref={mapContainerRef} className="flex-1 w-full h-full" />

      {validLocations.length === 0 && (
        <div className="absolute inset-0 z-20 flex items-center justify-center bg-slate-950/70 backdrop-blur-sm p-4 text-center">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 max-w-sm space-y-2 shadow-2xl">
            <Compass className="h-8 w-8 text-slate-500 mx-auto" />
            <h4 className="font-bold text-slate-200 text-sm">No Location Signals Found</h4>
            <p className="text-xs text-slate-400">
              No geographical coordinate markers match the active filter criteria or confidence threshold.
            </p>
          </div>
        </div>
      )}

      {/* Floating Controls */}
      <div className="absolute bottom-5 left-5 z-10 flex flex-col gap-2 bg-slate-900/90 border border-slate-800 rounded-lg p-1.5 backdrop-blur shadow-xl">
        <button
          onClick={() => handleZoom("in")}
          className="p-2 text-slate-400 hover:text-slate-100 hover:bg-slate-800 rounded transition"
          title="Zoom In"
        >
          <ZoomIn className="h-4.5 w-4.5" />
        </button>
        <button
          onClick={() => handleZoom("out")}
          className="p-2 text-slate-400 hover:text-slate-100 hover:bg-slate-800 rounded transition"
          title="Zoom Out"
        >
          <ZoomOut className="h-4.5 w-4.5" />
        </button>
      </div>

      {/* Map Legend */}
      <div className="absolute top-5 right-5 z-10 bg-slate-900/95 border border-slate-800 rounded-xl p-3.5 backdrop-blur shadow-xl space-y-2.5 max-w-[200px] text-[10px]">
        <span className="font-semibold text-slate-300 uppercase tracking-wider block border-b border-slate-850 pb-1">
          Geographic Legend
        </span>
        <div className="space-y-1.5 text-slate-400">
          <div className="flex items-center gap-2">
            <div className="h-2.5 w-2.5 rounded-full bg-blue-500" />
            <span>Declared Location</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-2.5 w-2.5 rounded-full bg-rose-500" />
            <span>Geotagged Posts</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-2.5 w-2.5 rounded-full bg-amber-500" />
            <span>Company Headquarters</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-2.5 w-2.5 rounded-full bg-teal-500" />
            <span>Inferred Location</span>
          </div>
        </div>
      </div>
    </div>
  );
}
