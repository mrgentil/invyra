import { useState, useMemo, useCallback } from "react";
import { View, Text, TouchableOpacity, FlatList, ScrollView } from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { colors } from "@/theme/colors";
import { typography } from "@/theme/typography";
import { radius } from "@/theme/radius";
import { shadows } from "@/theme/shadows";
import { TicketCard } from "@/components/cards/TicketCard";
import { EmptyState } from "@/components/ui/EmptyState";
import { getUserTickets } from "@/services/mockData";
import { Ticket } from "@/types";

type FilterType = "all" | "active" | "used" | "expired";

const FILTERS: { key: FilterType; label: string; icon: keyof typeof Ionicons.glyphMap }[] = [
  { key: "all", label: "Tous", icon: "layers-outline" },
  { key: "active", label: "Actifs", icon: "checkmark-circle-outline" },
  { key: "used", label: "Utilisés", icon: "time-outline" },
  { key: "expired", label: "Expirés", icon: "close-circle-outline" },
];

export default function TicketsScreen() {
  const [filter, setFilter] = useState<FilterType>("all");
  const allTickets = getUserTickets();

  const filteredTickets = useMemo(() => {
    if (filter === "all") return allTickets;
    return allTickets.filter((ticket) => ticket.status === filter);
  }, [allTickets, filter]);

  const stats = useMemo(
    () => ({
      active: allTickets.filter((ticket) => ticket.status === "active").length,
      used: allTickets.filter((ticket) => ticket.status === "used").length,
      total: allTickets.length,
    }),
    [allTickets]
  );

  const ListHeader = useCallback(
    () => (
      <View>
        <LinearGradient colors={["#EAF2FF", "#F2F4F8"]} style={{ paddingTop: 56, paddingHorizontal: 20, paddingBottom: 18 }}>
          <View style={{ flexDirection: "row", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 18 }}>
            <View style={{ flex: 1 }}>
              <Text style={{ fontFamily: typography.fontFamily.bold, fontSize: typography.fontSize.xxxl, color: colors.text.primary }}>
                Mes billets
              </Text>
              <Text style={{ fontFamily: typography.fontFamily.regular, fontSize: typography.fontSize.sm, color: colors.text.secondary, marginTop: 6 }}>
                Votre wallet digital Invyra
              </Text>
            </View>
            <View
              style={{
                width: 50,
                height: 50,
                borderRadius: 25,
                backgroundColor: colors.primary.DEFAULT,
                alignItems: "center",
                justifyContent: "center",
                ...shadows.md,
                shadowColor: colors.primary.DEFAULT,
                shadowOpacity: 0.3,
              }}
            >
              <Ionicons name="wallet-outline" size={24} color={colors.white} />
            </View>
          </View>

          <View style={{ flexDirection: "row", gap: 10 }}>
            {[
              { label: "Actifs", value: stats.active, icon: "ticket-outline" as const, tint: colors.primary.DEFAULT },
              { label: "Utilisés", value: stats.used, icon: "checkmark-done-outline" as const, tint: colors.text.secondary },
              { label: "Total", value: stats.total, icon: "albums-outline" as const, tint: colors.secondary.DEFAULT },
            ].map((item) => (
              <View
                key={item.label}
                style={{
                  flex: 1,
                  backgroundColor: colors.white,
                  borderRadius: 22,
                  paddingVertical: 14,
                  paddingHorizontal: 12,
                  ...shadows.sm,
                }}
              >
                <View
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: 16,
                    backgroundColor: item.tint + "18",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: 10,
                  }}
                >
                  <Ionicons name={item.icon} size={16} color={item.tint} />
                </View>
                <Text style={{ fontFamily: typography.fontFamily.bold, fontSize: typography.fontSize.xl, color: colors.text.primary }}>
                  {item.value}
                </Text>
                <Text style={{ fontFamily: typography.fontFamily.medium, fontSize: typography.fontSize.xs, color: colors.text.secondary, marginTop: 2 }}>
                  {item.label}
                </Text>
              </View>
            ))}
          </View>
        </LinearGradient>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 20, paddingVertical: 12, gap: 8 }}
        >
          {FILTERS.map((option) => {
            const active = filter === option.key;
            return (
              <TouchableOpacity
                key={option.key}
                activeOpacity={0.82}
                onPress={() => setFilter(option.key)}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 6,
                  paddingHorizontal: 14,
                  paddingVertical: 10,
                  borderRadius: radius.full,
                  backgroundColor: active ? colors.text.primary : colors.white,
                  borderWidth: 1,
                  borderColor: active ? colors.text.primary : colors.border.light,
                  ...shadows.sm,
                }}
              >
                <Ionicons name={option.icon} size={15} color={active ? colors.white : colors.text.secondary} />
                <Text
                  style={{
                    fontFamily: typography.fontFamily.semiBold,
                    fontSize: typography.fontSize.sm,
                    color: active ? colors.white : colors.text.primary,
                  }}
                >
                  {option.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {filteredTickets.length > 0 && (
          <View style={{ paddingHorizontal: 20, paddingTop: 4, paddingBottom: 10 }}>
            <Text style={{ fontFamily: typography.fontFamily.bold, fontSize: typography.fontSize.lg, color: colors.text.primary }}>
              {filter === "all" ? "Tous vos billets" : FILTERS.find((item) => item.key === filter)?.label}
            </Text>
            <Text style={{ fontFamily: typography.fontFamily.regular, fontSize: typography.fontSize.sm, color: colors.text.secondary, marginTop: 3 }}>
              {filteredTickets.length} billet{filteredTickets.length > 1 ? "s" : ""}
            </Text>
          </View>
        )}
      </View>
    ),
    [filter, filteredTickets.length, stats.active, stats.total, stats.used]
  );

  if (filteredTickets.length === 0) {
    return (
      <View style={{ flex: 1, backgroundColor: "#F2F4F8" }}>
        <ListHeader />
        <EmptyState
          variant="tickets"
          title={
            filter === "active"
              ? "Aucun billet actif"
              : filter === "used"
                ? "Aucun billet utilisé"
                : filter === "expired"
                  ? "Aucun billet expiré"
                  : undefined
          }
          message={
            filter === "all"
              ? "Explorez les événements autour de vous et réservez votre prochaine sortie."
              : "Changez de filtre ou explorez de nouveaux événements."
          }
          actionLabel="Explorer les événements"
          onAction={() => router.push("/(tabs)/discover")}
        />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: "#F2F4F8" }}>
      <FlatList
        data={filteredTickets}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={ListHeader}
        renderItem={({ item, index }: { item: Ticket; index: number }) => (
          <View style={{ paddingHorizontal: 20 }}>
            <TicketCard ticket={item} index={index} onPress={() => router.push(`/event/${item.eventId}`)} />
          </View>
        )}
        contentContainerStyle={{ paddingBottom: 120 }}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}
