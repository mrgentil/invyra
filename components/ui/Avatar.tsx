import { View, Text } from "react-native";
import { Image } from "expo-image";
import { colors } from "@/theme/colors";
import { getInitials, getRandomColor } from "@/utils";

interface AvatarProps {
  source?: string;
  name?: string;
  size?: number;
  status?: "online" | "offline" | "away";
}

export function Avatar({
  source,
  name,
  size = 40,
  status,
}: AvatarProps) {
  const initials = name ? getInitials(name) : "?";
  const bgColor = getRandomColor();

  return (
    <View style={{ width: size, height: size }}>
      {source ? (
        <Image
          source={{ uri: source }}
          style={{
            width: size,
            height: size,
            borderRadius: size / 2,
          }}
        />
      ) : (
        <View
          style={{
            width: size,
            height: size,
            borderRadius: size / 2,
            backgroundColor: bgColor,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Text
            style={{
              color: colors.white,
              fontSize: size * 0.4,
              fontFamily: "Poppins-SemiBold",
            }}
          >
            {initials}
          </Text>
        </View>
      )}
      {status && (
        <View
          style={{
            position: "absolute",
            bottom: 0,
            right: 0,
            width: size * 0.3,
            height: size * 0.3,
            borderRadius: size * 0.15,
            backgroundColor:
              status === "online"
                ? colors.success.DEFAULT
                : status === "away"
                ? "#FF9800"
                : colors.border.light,
            borderWidth: 2,
            borderColor: colors.white,
          }}
        />
      )}
    </View>
  );
}
