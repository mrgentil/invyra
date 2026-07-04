export interface RdcLocation {
  id: string;
  city: string;
  province: string;
  label: string;
}

export const RDC_ALL_ID = "all";

export const RDC_LOCATIONS: RdcLocation[] = [
  { id: RDC_ALL_ID, city: "Toute la RDC", province: "République Démocratique du Congo", label: "Toute la RDC" },
  { id: "kinshasa", city: "Kinshasa", province: "Kinshasa", label: "Kinshasa, Kinshasa" },
  { id: "lubumbashi", city: "Lubumbashi", province: "Haut-Katanga", label: "Lubumbashi, Haut-Katanga" },
  { id: "goma", city: "Goma", province: "Nord-Kivu", label: "Goma, Nord-Kivu" },
  { id: "bukavu", city: "Bukavu", province: "Sud-Kivu", label: "Bukavu, Sud-Kivu" },
  { id: "kisangani", city: "Kisangani", province: "Tshopo", label: "Kisangani, Tshopo" },
  { id: "mbuji-mayi", city: "Mbuji-Mayi", province: "Kasaï-Oriental", label: "Mbuji-Mayi, Kasaï-Oriental" },
  { id: "kananga", city: "Kananga", province: "Kasaï-Central", label: "Kananga, Kasaï-Central" },
  { id: "matadi", city: "Matadi", province: "Kongo-Central", label: "Matadi, Kongo-Central" },
  { id: "kolwezi", city: "Kolwezi", province: "Lualaba", label: "Kolwezi, Lualaba" },
  { id: "bunia", city: "Bunia", province: "Ituri", label: "Bunia, Ituri" },
  { id: "kindu", city: "Kindu", province: "Maniema", label: "Kindu, Maniema" },
  { id: "kalemie", city: "Kalemie", province: "Tanganyika", label: "Kalemie, Tanganyika" },
  { id: "bandundu", city: "Bandundu", province: "Kwilu", label: "Bandundu, Kwilu" },
  { id: "gemena", city: "Gemena", province: "Sud-Ubangi", label: "Gemena, Sud-Ubangi" },
  { id: "gbadolite", city: "Gbadolite", province: "Nord-Ubangi", label: "Gbadolite, Nord-Ubangi" },
  { id: "mbandaka", city: "Mbandaka", province: "Équateur", label: "Mbandaka, Équateur" },
  { id: "isiro", city: "Isiro", province: "Haut-Uele", label: "Isiro, Haut-Uele" },
  { id: "buta", city: "Buta", province: "Bas-Uele", label: "Buta, Bas-Uele" },
  { id: "kamina", city: "Kamina", province: "Haut-Lomami", label: "Kamina, Haut-Lomami" },
  { id: "tshikapa", city: "Tshikapa", province: "Kasaï", label: "Tshikapa, Kasaï" },
  { id: "kenge", city: "Kenge", province: "Kwango", label: "Kenge, Kwango" },
  { id: "kabinda", city: "Kabinda", province: "Lomami", label: "Kabinda, Lomami" },
  { id: "inongo", city: "Inongo", province: "Mai-Ndombe", label: "Inongo, Mai-Ndombe" },
  { id: "lisala", city: "Lisala", province: "Mongala", label: "Lisala, Mongala" },
  { id: "lusambo", city: "Lusambo", province: "Sankuru", label: "Lusambo, Sankuru" },
  { id: "boende", city: "Boende", province: "Tshuapa", label: "Boende, Tshuapa" },
];

export const DEFAULT_RDC_LOCATION_ID = "kinshasa";

export function getRdcLocationById(id: string): RdcLocation | undefined {
  return RDC_LOCATIONS.find((location) => location.id === id);
}

export function getRdcLocationLabel(id: string): string {
  return getRdcLocationById(id)?.label ?? "Kinshasa, Kinshasa";
}
