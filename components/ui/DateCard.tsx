import { View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "@/theme/colors";
import { radius } from "@/theme/radius";
import { typography } from "@/theme/typography";
import { format, parseISO } from "date-fns";
import { fr } from "date-fns/locale";

interface DateCardProps {
  date: string;
  time: string;
  endDate?: string;
  endTime?: string;
}

export function DateCard({ date, time, endDate, endTime }: DateCardProps) {
  const d = parseISO(date);
  const day = format(d, "dd", { locale: fr });
  const month = format(d, "MMM", { locale: fr });
  const weekday = format(d, "EEE", { locale: fr });

  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: colors.primary[50],
        borderRadius: radius.md,
        padding: 12,
        gap: 12,
      }}
    >
      <View style={{ alignItems: "center", minWidth: 48 }}>
        <Text
          style={{
            fontFamily: typography.fontFamily.bold,
            fontSize: typography.fontSize.xxl,
            color: colors.primary.DEFAULT,
          }}
        >
          {day}
        </Text>
        <Text
          style={{
            fontFamily: typography.fontFamily.medium,
            fontSize: typography.fontSize.sm,
            color: colors.primary.DEFAULT,
          }}
        >
          {month}
        </Text>
      </View>
      <View style={{ flex: 1 }}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
          <Ionicons name="calendar-outline" size={14} color={colors.primary.DEFAULT} />
          <Text
            style={{
              fontFamily: typography.fontFamily.medium,
              fontSize: typography.fontSize.sm,
              color: colors.primary.DEFAULT,
            }}
          >
            {weekday}, {month} {day}
          </Text>
        </View>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 4, marginTop: 2 }}>
          <Ionicons name="time-outline" size={14} color={colors.primary.DEFAULT} />
          <Text
            style={{
              fontFamily: typography.fontFamily.regular,
              fontSize: typography.fontSize.sm,
              color: colors.primary.DEFAULT,
            }}
          >
            {time} {endTime ? `- ${endTime}` : ""}
          </Text>
        </View>
      </View>
    </View>
  );
}
