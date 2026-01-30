"use client";

import { Place } from "@/types/place";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { Icon } from "leaflet";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, Phone, Globe, ExternalLink } from "lucide-react";
import "leaflet/dist/leaflet.css";

interface PlacesMapProps {
  places: Place[];
  selectedPlaceId?: string;
  onSelectPlace?: (placeId: string) => void;
}

const defaultIcon = new Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

export function PlacesMap({ places, selectedPlaceId, onSelectPlace }: PlacesMapProps) {
  const validPlaces = places.filter(
    (p) => p.location && p.location.lat && p.location.lng
  );

  if (validPlaces.length === 0) {
    return (
      <div className="h-full flex items-center justify-center bg-muted rounded-lg">
        <p className="text-muted-foreground">No hay ubicaciones disponibles</p>
      </div>
    );
  }

  const centerLat =
    validPlaces.reduce((sum, p) => sum + p.location.lat, 0) / validPlaces.length;
  const centerLng =
    validPlaces.reduce((sum, p) => sum + p.location.lng, 0) / validPlaces.length;

  return (
    <MapContainer
      center={[centerLat, centerLng]}
      zoom={15}
      className="h-full w-full rounded-lg"
      scrollWheelZoom={true}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {validPlaces.map((place) => (
        <Marker
          key={place.placeId}
          position={[place.location.lat, place.location.lng]}
          icon={defaultIcon}
          eventHandlers={{
            click: () => onSelectPlace?.(place.placeId),
          }}
        >
          <Popup minWidth={280} maxWidth={350}>
            <div className="space-y-2">
              <div className="flex items-start gap-2">
                {place.imageUrl && (
                  <img
                    src={place.imageUrl}
                    alt={place.title}
                    className="h-16 w-16 rounded object-cover"
                  />
                )}
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-sm leading-tight">
                    {place.title}
                  </h3>
                  {place.categoryName && (
                    <Badge variant="outline" className="text-xs mt-1">
                      {place.categoryName}
                    </Badge>
                  )}
                </div>
              </div>

              {place.totalScore !== null && place.totalScore !== undefined && (
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span className="text-sm font-medium">
                    {place.totalScore.toFixed(1)}
                  </span>
                  {place.reviewsCount && (
                    <span className="text-xs text-muted-foreground">
                      ({place.reviewsCount} reseñas)
                    </span>
                  )}
                </div>
              )}

              <p className="text-xs text-muted-foreground">{place.address}</p>

              <div className="flex gap-1 pt-1">
                {place.phone && (
                  <Button variant="outline" size="sm" className="h-7 text-xs" asChild>
                    <a href={`tel:${place.phoneUnformatted || place.phone}`}>
                      <Phone className="h-3 w-3 mr-1" />
                      Llamar
                    </a>
                  </Button>
                )}
                {place.website && (
                  <Button variant="outline" size="sm" className="h-7 text-xs" asChild>
                    <a href={place.website} target="_blank" rel="noopener noreferrer">
                      <Globe className="h-3 w-3 mr-1" />
                      Web
                    </a>
                  </Button>
                )}
                {place.url && (
                  <Button variant="outline" size="sm" className="h-7 text-xs" asChild>
                    <a href={place.url} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="h-3 w-3 mr-1" />
                      Maps
                    </a>
                  </Button>
                )}
              </div>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
