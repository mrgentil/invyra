import * as Location from "expo-location";
import { DEFAULT_RDC_LOCATION_ID, RDC_ALL_ID, RDC_LOCATIONS } from "@/constants/rdcLocations";

export type DetectedCity = {
  cityId: string;
  cityLabel: string;
  source: "reverseGeocode" | "fallback";
};

function normalize(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function matchRdcCityId(cityName: string | null | undefined): string | null {
  if (!cityName) return null;
  const n = normalize(cityName);
  if (!n) return null;

  const match = RDC_LOCATIONS.find((loc) => loc.id !== RDC_ALL_ID && normalize(loc.city) === n);
  return match?.id ?? null;
}

export async function detectRdcCityId(): Promise<DetectedCity> {
  const perm = await Location.requestForegroundPermissionsAsync();
  if (perm.status !== "granted") {
    return {
      cityId: DEFAULT_RDC_LOCATION_ID,
      cityLabel: RDC_LOCATIONS.find((l) => l.id === DEFAULT_RDC_LOCATION_ID)?.label ?? "Kinshasa, Kinshasa",
      source: "fallback",
    };
  }

  const position = await Location.getCurrentPositionAsync({
    accuracy: Location.Accuracy.Balanced,
  });

  const results = await Location.reverseGeocodeAsync({
    latitude: position.coords.latitude,
    longitude: position.coords.longitude,
  });

  const first = results[0];
  const cityName = first?.city ?? first?.subregion ?? first?.region ?? null;
  const matched = matchRdcCityId(cityName);

  const cityId = matched ?? DEFAULT_RDC_LOCATION_ID;
  const cityLabel = RDC_LOCATIONS.find((l) => l.id === cityId)?.label ?? "Kinshasa, Kinshasa";

  return { cityId, cityLabel, source: matched ? "reverseGeocode" : "fallback" };
}

