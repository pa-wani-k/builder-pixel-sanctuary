import { useEffect, useMemo, useRef, useState } from "react";
import { Loader2, MapPin, Search, Crosshair } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { Centre } from "@shared/api";

const GOOGLE_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY as
  | string
  | undefined;

function loadGoogleMaps(apiKey: string): Promise<void> {
  if (typeof window === "undefined") return Promise.resolve();
  if ((window as any).google?.maps) return Promise.resolve();
  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = (e) => reject(e);
    document.head.appendChild(script);
  });
}

export default function GooglePlacesMap({
  onSelectCentre,
}: {
  onSelectCentre: (c: Centre) => void;
}) {
  const mapRef = useRef<HTMLDivElement | null>(null);
  const map = useRef<any | null>(null);
  const [centres, setCentres] = useState<Centre[]>([]);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState("");
  const [error, setError] = useState<string | null>(null);

  const canUseGoogle = Boolean(GOOGLE_KEY);

  useEffect(() => {
    if (!canUseGoogle) return;
    let canceled = false;
    setError(null);
    loadGoogleMaps(GOOGLE_KEY!)
      .then(() => {
        if (canceled) return;
        const center = new google.maps.LatLng(19.076, 72.8777); // Mumbai default
        map.current = new google.maps.Map(mapRef.current as HTMLDivElement, {
          center,
          zoom: 12,
          mapId: "AYURSUTRA_MAP",
        });
      })
      .catch(() => setError("Failed loading Google Maps"));
    return () => {
      canceled = true;
    };
  }, [canUseGoogle]);

  function geolocate() {
    if (!navigator.geolocation || !map.current) return;
    navigator.geolocation.getCurrentPosition((pos) => {
      const loc = new google.maps.LatLng(
        pos.coords.latitude,
        pos.coords.longitude,
      );
      map.current!.setCenter(loc);
      map.current!.setZoom(14);
      searchNearby("panchakarma centre");
    });
  }

  function searchNearby(keyword: string) {
    if (!map.current) return;
    setLoading(true);
    const service = new google.maps.places.PlacesService(map.current);
    const bounds = map.current.getBounds();
    const request: any = {
      keyword,
      bounds: bounds ?? undefined,
      type: ["spa"],
    } as any;

    service.nearbySearch(request, (results, status) => {
      setLoading(false);
      if (status !== google.maps.places.PlacesServiceStatus.OK || !results) {
        setCentres([]);
        return;
      }
      const mapped: Centre[] = results.map((r) => ({
        id: r.place_id || String(r.geometry?.location?.toUrlValue()),
        name: r.name || "Centre",
        address: r.vicinity || r.formatted_address || "",
        location: {
          lat: r.geometry?.location?.lat() || 0,
          lng: r.geometry?.location?.lng() || 0,
        },
        rating: r.rating ?? undefined,
        user_ratings_total: r.user_ratings_total ?? undefined,
        phone: undefined,
        website: r.website ?? undefined,
      }));
      setCentres(mapped);

      // Clear previous markers by re-creating map
      const center = map.current.getCenter();
      map.current = new google.maps.Map(mapRef.current as HTMLDivElement, {
        center: center || new google.maps.LatLng(19.076, 72.8777),
        zoom: 12,
        mapId: "AYURSUTRA_MAP",
      });

      mapped.forEach((c) => {
        const marker = new google.maps.Marker({
          position: c.location,
          map: map.current!,
          title: c.name,
        });
        marker.addListener("click", () => onSelectCentre(c));
      });
    });
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-3">
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search e.g. 'Panchakarma centre' or location"
              className="pl-9"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-foreground/50" />
          </div>
          <Button onClick={() => searchNearby(query || "panchakarma centre")}>
            Search
          </Button>
          <Button variant="secondary" onClick={geolocate} className="gap-2">
            <Crosshair className="h-4 w-4" />
            Near me
          </Button>
        </div>
        {error && (
          <div className="rounded-md border p-4 text-sm bg-amber-50 text-amber-900">
            Google Maps failed to load. Please enable billing and activate “Maps
            JavaScript API” and “Places API” for your key.
          </div>
        )}
        {!canUseGoogle && (
          <div className="rounded-md border p-4 text-sm text-foreground/80">
            Set VITE_GOOGLE_MAPS_API_KEY and enable billing to use Google Maps.
            The dashboard still works without the map.
          </div>
        )}
        <div
          ref={mapRef}
          className="h-[380px] w-full rounded-lg border bg-muted/40"
        />
        {loading && (
          <div className="flex items-center gap-2 text-sm text-foreground/70">
            <Loader2 className="h-4 w-4 animate-spin" /> Searching nearby
            centres...
          </div>
        )}
      </div>
      <div className="lg:col-span-1">
        <div className="rounded-xl border p-4">
          <div className="mb-3 text-sm font-semibold">Nearby Centres</div>
          <div className="space-y-3 max-h-[400px] overflow-auto pr-2">
            {centres.map((c) => (
              <button
                key={c.id}
                onClick={() => onSelectCentre(c)}
                className="w-full rounded-lg border p-3 text-left hover:bg-accent/50"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="font-medium">{c.name}</div>
                    <div className="mt-1 flex items-center gap-1 text-xs text-foreground/70">
                      <MapPin className="h-3 w-3" /> {c.address}
                    </div>
                  </div>
                  {typeof c.rating === "number" && (
                    <span className="rounded bg-amber-100 px-1.5 py-0.5 text-xs font-semibold text-amber-900">
                      {c.rating.toFixed(1)} ★
                    </span>
                  )}
                </div>
              </button>
            ))}
            {centres.length === 0 && (
              <div className="text-sm text-foreground/60">
                No results yet. Try search or Near me.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
