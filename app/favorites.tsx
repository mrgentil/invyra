import { useMemo } from "react";
import { View, FlatList } from "react-native";
import { router, Stack } from "expo-router";
import { EventCardLarge } from "@/components/cards/EventCardLarge";
import { EmptyState } from "@/components/ui/EmptyState";
import { SubScreenHeader } from "@/components/ui/SubScreenHeader";
import { getEventById, getPopularEvents } from "@/services/mockData";
import { useFavoritesStore } from "@/store";
import { Event } from "@/types";

export default function FavoritesScreen() {
  const favorites = useFavoritesStore((state) => state.favorites);
  const suggestions = getPopularEvents().slice(0, 4);

  const favoriteEvents = useMemo(
    () =>
      favorites
        .map((id) => getEventById(id))
        .filter((event): event is Event => Boolean(event)),
    [favorites]
  );

  return (
    <View style={{ flex: 1, backgroundColor: "#F2F4F8" }}>
      <Stack.Screen options={{ headerShown: false }} />
      <SubScreenHeader
        title="Favoris"
        subtitle={`${favoriteEvents.length} événement${favoriteEvents.length > 1 ? "s" : ""} sauvegardé${favoriteEvents.length > 1 ? "s" : ""}`}
      />

      {favoriteEvents.length === 0 ? (
        <FlatList
          data={suggestions}
          keyExtractor={(item) => item.id}
          ListHeaderComponent={
            <EmptyState
              variant="favorites"
              actionLabel="Découvrir des événements"
              onAction={() => router.push("/(tabs)/discover")}
            />
          }
          ListHeaderComponentStyle={{ marginBottom: 8 }}
          renderItem={({ item, index }) => (
            <View style={{ paddingHorizontal: 20 }}>
              <EventCardLarge event={item} index={index} />
            </View>
          )}
          contentContainerStyle={{ paddingBottom: 100 }}
        />
      ) : (
        <FlatList
          data={favoriteEvents}
          keyExtractor={(item) => item.id}
          renderItem={({ item, index }) => (
            <View style={{ paddingHorizontal: 20 }}>
              <EventCardLarge event={item} index={index} />
            </View>
          )}
          contentContainerStyle={{ paddingTop: 8, paddingBottom: 100 }}
        />
      )}
    </View>
  );
}
