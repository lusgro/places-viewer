"use client";

import { useState, useMemo } from "react";
import dynamic from "next/dynamic";
import { Place } from "@/types/place";
import placesData from "@/data/places.json";
import { PlaceCard } from "@/components/PlaceCard";
import { PlacesTable } from "@/components/PlacesTable";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import {
  LayoutGrid,
  List,
  Map,
  Search,
  X,
  MapPin,
  Store,
} from "lucide-react";

const PlacesMap = dynamic(
  () => import("@/components/PlacesMap").then((mod) => mod.PlacesMap),
  {
    ssr: false,
    loading: () => (
      <div className="h-full flex items-center justify-center bg-muted rounded-lg">
        <p className="text-muted-foreground">Cargando mapa...</p>
      </div>
    ),
  }
);

const places: Place[] = placesData as Place[];

function getAllCategories(places: Place[]): string[] {
  const categoriesSet = new Set<string>();
  places.forEach((p) => {
    if (p.categoryName) categoriesSet.add(p.categoryName);
    p.categories?.forEach((c) => categoriesSet.add(c));
  });
  return Array.from(categoriesSet).sort();
}

function getAllNeighborhoods(places: Place[]): string[] {
  const neighborhoodsSet = new Set<string>();
  places.forEach((p) => {
    if (p.neighborhood) neighborhoodsSet.add(p.neighborhood);
  });
  return Array.from(neighborhoodsSet).sort();
}

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedNeighborhoods, setSelectedNeighborhoods] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState("cards");

  const allCategories = useMemo(() => getAllCategories(places), []);
  const allNeighborhoods = useMemo(() => getAllNeighborhoods(places), []);

  const filteredPlaces = useMemo(() => {
    return places.filter((place) => {
      const matchesSearch =
        searchQuery === "" ||
        place.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        place.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
        place.description?.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory =
        selectedCategories.length === 0 ||
        selectedCategories.some(
          (cat) =>
            place.categoryName === cat || place.categories?.includes(cat)
        );

      const matchesNeighborhood =
        selectedNeighborhoods.length === 0 ||
        selectedNeighborhoods.includes(place.neighborhood || "");

      return matchesSearch && matchesCategory && matchesNeighborhood;
    });
  }, [searchQuery, selectedCategories, selectedNeighborhoods]);

  const toggleCategory = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  const toggleNeighborhood = (neighborhood: string) => {
    setSelectedNeighborhoods((prev) =>
      prev.includes(neighborhood)
        ? prev.filter((n) => n !== neighborhood)
        : [...prev, neighborhood]
    );
  };

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedCategories([]);
    setSelectedNeighborhoods([]);
  };

  const hasActiveFilters =
    searchQuery !== "" ||
    selectedCategories.length > 0 ||
    selectedNeighborhoods.length > 0;

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-2">
              <Store className="h-6 w-6 text-primary" />
              <h1 className="text-xl font-bold">Places Viewer</h1>
              <Badge variant="secondary" className="ml-2">
                {filteredPlaces.length} lugares
              </Badge>
            </div>

            <div className="flex items-center gap-2 flex-1 max-w-md">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por nombre, dirección..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              {hasActiveFilters && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearFilters}
                  className="shrink-0"
                >
                  <X className="h-4 w-4 mr-1" />
                  Limpiar
                </Button>
              )}
            </div>
          </div>

          <div className="mt-4 space-y-2">
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-muted-foreground shrink-0" />
              <ScrollArea className="w-full whitespace-nowrap">
                <div className="flex gap-1 pb-2">
                  {allNeighborhoods.map((neighborhood) => (
                    <Badge
                      key={neighborhood}
                      variant={
                        selectedNeighborhoods.includes(neighborhood)
                          ? "default"
                          : "outline"
                      }
                      className="cursor-pointer shrink-0"
                      onClick={() => toggleNeighborhood(neighborhood)}
                    >
                      {neighborhood}
                    </Badge>
                  ))}
                </div>
                <ScrollBar orientation="horizontal" />
              </ScrollArea>
            </div>

            <ScrollArea className="w-full whitespace-nowrap">
              <div className="flex gap-1 pb-2">
                {allCategories.slice(0, 15).map((category) => (
                  <Badge
                    key={category}
                    variant={
                      selectedCategories.includes(category)
                        ? "default"
                        : "outline"
                    }
                    className="cursor-pointer shrink-0"
                    onClick={() => toggleCategory(category)}
                  >
                    {category}
                  </Badge>
                ))}
                {allCategories.length > 15 && (
                  <Badge variant="secondary" className="shrink-0">
                    +{allCategories.length - 15} más
                  </Badge>
                )}
              </div>
              <ScrollBar orientation="horizontal" />
            </ScrollArea>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="cards" className="gap-2">
              <LayoutGrid className="h-4 w-4" />
              Tarjetas
            </TabsTrigger>
            <TabsTrigger value="table" className="gap-2">
              <List className="h-4 w-4" />
              Tabla
            </TabsTrigger>
            <TabsTrigger value="map" className="gap-2">
              <Map className="h-4 w-4" />
              Mapa
            </TabsTrigger>
          </TabsList>

          <TabsContent value="cards">
            {filteredPlaces.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">
                  No se encontraron lugares con los filtros aplicados
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {filteredPlaces.map((place) => (
                  <PlaceCard key={place.placeId} place={place} />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="table">
            <PlacesTable data={filteredPlaces} />
          </TabsContent>

          <TabsContent value="map" className="h-[calc(100vh-300px)] min-h-[400px]">
            <PlacesMap places={filteredPlaces} />
          </TabsContent>
        </Tabs>
      </main>

      <footer className="border-t bg-card py-4">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          Datos de Google Places · {places.length} lugares ·{" "}
          {new Date(places[0]?.scrapedAt || "").toLocaleDateString("es-AR")}
        </div>
      </footer>
    </div>
  );
}
