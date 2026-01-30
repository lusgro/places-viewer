"use client";

import { Place } from "@/types/place";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Star,
  MapPin,
  Phone,
  Globe,
  Clock,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Instagram,
  Facebook,
} from "lucide-react";
import { useState, useEffect } from "react";

interface PlaceCardProps {
  place: Place;
}

function StarRating({ score }: { score: number | null | undefined }) {
  if (score === null || score === undefined) return <span className="text-muted-foreground text-sm">Sin calificación</span>;
  
  const fullStars = Math.floor(score);
  const hasHalfStar = score % 1 >= 0.5;
  
  return (
    <div className="flex items-center gap-1">
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          className={`h-4 w-4 ${
            i < fullStars
              ? "fill-yellow-400 text-yellow-400"
              : i === fullStars && hasHalfStar
              ? "fill-yellow-400/50 text-yellow-400"
              : "text-gray-300"
          }`}
        />
      ))}
      <span className="ml-1 text-sm font-medium">{score.toFixed(1)}</span>
    </div>
  );
}

function OpeningHoursDisplay({ hours }: { hours: Place["openingHours"] }) {
  const [expanded, setExpanded] = useState(false);
  const [todayInfo, setTodayInfo] = useState<{ day: string; isOpen: boolean; hours: string | null } | null>(null);
  
  useEffect(() => {
    if (!hours || hours.length === 0) return;
    const today = new Date().toLocaleDateString("es-ES", { weekday: "long" }).toLowerCase();
    const todayHours = hours.find(h => h.day.toLowerCase() === today);
    const isOpen = todayHours ? !todayHours.hours.toLowerCase().includes("cerrado") : false;
    setTodayInfo({ day: today, isOpen, hours: todayHours?.hours || null });
  }, [hours]);
  
  if (!hours || hours.length === 0) return null;
  
  return (
    <div className="space-y-1">
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex items-center gap-1 text-sm hover:text-primary transition-colors"
      >
        <Clock className="h-4 w-4" />
        {todayInfo && (
          <>
            <span className={todayInfo.isOpen ? "text-green-600 font-medium" : "text-red-600 font-medium"}>
              {todayInfo.isOpen ? "Abierto" : "Cerrado"}
            </span>
            {todayInfo.hours && (
              <span className="text-muted-foreground ml-1">· {todayInfo.hours}</span>
            )}
          </>
        )}
        {expanded ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
      </button>
      
      {expanded && (
        <div className="pl-5 space-y-0.5 text-xs text-muted-foreground">
          {hours.map((h, i) => (
            <div key={i} className="flex justify-between max-w-[200px]">
              <span className="capitalize">{h.day}</span>
              <span>{h.hours}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export function PlaceCard({ place }: PlaceCardProps) {
  return (
    <Card className="h-full flex flex-col hover:shadow-lg transition-shadow">
      {place.imageUrl && (
        <div className="relative h-40 overflow-hidden rounded-t-lg">
          <img
            src={place.imageUrl}
            alt={place.title}
            className="w-full h-full object-cover"
            loading="lazy"
          />
          {place.permanentlyClosed && (
            <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
              <Badge variant="destructive" className="text-sm">Cerrado Permanentemente</Badge>
            </div>
          )}
        </div>
      )}
      
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-lg leading-tight">{place.title}</CardTitle>
          {place.rank && (
            <Badge variant="secondary" className="shrink-0">#{place.rank}</Badge>
          )}
        </div>
        
        <div className="flex items-center gap-2 flex-wrap">
          <StarRating score={place.totalScore} />
          {place.reviewsCount !== undefined && place.reviewsCount > 0 && (
            <span className="text-sm text-muted-foreground">
              ({place.reviewsCount.toLocaleString()} reseñas)
            </span>
          )}
        </div>
        
        {place.description && (
          <CardDescription className="line-clamp-2">{place.description}</CardDescription>
        )}
      </CardHeader>
      
      <CardContent className="flex-1 space-y-3">
        {place.categories && place.categories.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {place.categories.slice(0, 3).map((cat, i) => (
              <Badge key={i} variant="outline" className="text-xs">
                {cat}
              </Badge>
            ))}
            {place.categories.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{place.categories.length - 3}
              </Badge>
            )}
          </div>
        )}
        
        <div className="flex items-start gap-2 text-sm">
          <MapPin className="h-4 w-4 mt-0.5 shrink-0 text-muted-foreground" />
          <span className="text-muted-foreground">{place.address}</span>
        </div>
        
        <OpeningHoursDisplay hours={place.openingHours} />
        
        <div className="flex flex-wrap gap-2 pt-2">
          {place.phone && (
            <Button variant="outline" size="sm" asChild>
              <a href={`tel:${place.phoneUnformatted || place.phone}`}>
                <Phone className="h-3 w-3 mr-1" />
                Llamar
              </a>
            </Button>
          )}
          {place.website && (
            <Button variant="outline" size="sm" asChild>
              <a href={place.website} target="_blank" rel="noopener noreferrer">
                <Globe className="h-3 w-3 mr-1" />
                Web
              </a>
            </Button>
          )}
          {place.url && (
            <Button variant="outline" size="sm" asChild>
              <a href={place.url} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-3 w-3 mr-1" />
                Maps
              </a>
            </Button>
          )}
          {place.instagramUrl && (
            <Button variant="outline" size="sm" asChild>
              <a href={place.instagramUrl} target="_blank" rel="noopener noreferrer">
                <Instagram className="h-3 w-3 mr-1" />
                Instagram
              </a>
            </Button>
          )}
          {place.facebookUrl && (
            <Button variant="outline" size="sm" asChild>
              <a href={place.facebookUrl} target="_blank" rel="noopener noreferrer">
                <Facebook className="h-3 w-3 mr-1" />
                Facebook
              </a>
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
