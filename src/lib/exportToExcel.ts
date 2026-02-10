import * as XLSX from "xlsx";
import { Place } from "@/types/place";

export function exportPlacesToExcel(places: Place[]): void {
  const rows = places.map((p) => ({
    Nombre: p.title,
    Categoria: p.categoryName ?? "",
    Categorias: p.categories?.join(", ") ?? "",
    Direccion: p.address,
    Barrio: p.neighborhood ?? "",
    Calle: p.street ?? "",
    Ciudad: p.city ?? "",
    "Codigo Postal": p.postalCode ?? "",
    Provincia: p.state ?? "",
    Telefono: p.phone ?? "",
    "Sitio Web": p.website ?? "",
    Instagram: p.instagramUrl ?? "",
    Facebook: p.facebookUrl ?? "",
    "Google Maps": p.url ?? "",
    Puntuacion: p.totalScore,
    Resenas: p.reviewsCount ?? 0,
    Latitud: p.location.lat,
    Longitud: p.location.lng,
    Horarios:
      p.openingHours
        ?.map((h) => `${h.day}: ${h.hours}`)
        .join("\n") ?? "",
  }));

  const ws = XLSX.utils.json_to_sheet(rows);

  ws["!cols"] = [
    { wch: 30 }, // Nombre
    { wch: 20 }, // Categoria
    { wch: 30 }, // Categorias
    { wch: 40 }, // Direccion
    { wch: 18 }, // Barrio
    { wch: 25 }, // Calle
    { wch: 18 }, // Ciudad
    { wch: 12 }, // Codigo Postal
    { wch: 18 }, // Provincia
    { wch: 18 }, // Telefono
    { wch: 30 }, // Sitio Web
    { wch: 30 }, // Instagram
    { wch: 30 }, // Facebook
    { wch: 40 }, // Google Maps
    { wch: 10 }, // Puntuacion
    { wch: 10 }, // Resenas
    { wch: 12 }, // Latitud
    { wch: 12 }, // Longitud
    { wch: 40 }, // Horarios
  ];

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Lugares");
  XLSX.writeFile(wb, "lugares.xlsx");
}
