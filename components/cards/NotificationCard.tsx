import { TouchableOpacity, View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "@/theme/colors";
import { radius } from "@/theme/radius";
import { typography } from "@/theme/typography";
import { Notification } from "@/types";
import { formatRelativeTime } from "@/utils";

interface NotificationCardProps {
  notification: Notification;
  onPress?: () => void;
}

const typeConfig = {
  booking: { icon: "ticket-outline" as const, color: colors.primary.DEFAULT },
  reminder: { icon: "alarm-outline" as const, color: "#FF9800" },
  promo: { icon: "pricetag-outline" as const, color: colors.success.DEFAULT },
  system: { icon: "settings-outline" as const, color: colors.text.secondary },
};

export function NotificationCard({ notification, onPress }: NotificationCardProps) {
  const config = typeConfig[notification.type];

  return (
    <View>
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={onPress}
        style={{
          flexDirection: "row",
          alignItems: "flex-start",
          padding: 16,
          backgroundColor: notification.read ? colors.card.light : colors.primary[50],
          borderRadius: radius.md,
          marginBottom: 8,
          gap: 12,
        }}
      >
        <View
          style={{
            width: 40,
            height: 40,
            borderRadius: 20,
            backgroundColor: config.color + "20",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Ionicons name={config.icon} size={20} color={config.color} />
        </View>
        <View style={{ flex: 1 }}>
          <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
            <Text
              style={{
                fontFamily: typography.fontFamily.semiBold,
                fontSize: typography.fontSize.md,
                color: colors.text.primary,
                flex: 1,
              }}
              numberOfLines={1}
            >
              {notification.title}
            </Text>
            {!notification.read && (
              <View
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: 4,
                  backgroundColor: colors.primary.DEFAULT,
                }}
              />
            )}
          </View>
          <Text
            style={{
              fontFamily: typography.fontFamily.regular,
              fontSize: typography.fontSize.sm,
              color: colors.text.secondary,
              marginTop: 4,
            }}
            numberOfLines={2}
          >
            {notification.message}
          </Text>
          <Text
            style={{
              fontFamily: typography.fontFamily.regular,
              fontSize: typography.fontSize.xs,
              color: colors.text.secondary,
              marginTop: 4,
            }}
          >
            {formatRelativeTime(notification.createdAt)}
          </Text>
        </View>
      </TouchableOpacity>
    </View>
  );
}
