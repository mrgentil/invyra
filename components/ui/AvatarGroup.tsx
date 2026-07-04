import { View, Text } from "react-native";
import { Image } from "expo-image";
import { colors } from "@/theme/colors";
import { typography } from "@/theme/typography";

interface AvatarGroupProps {
  avatars: { source?: string; name?: string }[];
  max?: number;
  size?: number;
}

export function AvatarGroup({ avatars, max = 4, size = 28 }: AvatarGroupProps) {
  const visible = avatars.slice(0, max);
  const remaining = avatars.length - max;

  return (
    <View style={{ flexDirection: "row", alignItems: "center" }}>
      {visible.map((avatar, index) => (
        <View
          key={index}
          style={{
            marginLeft: index > 0 ? -8 : 0,
            zIndex: visible.length - index,
          }}
        >
          {avatar.source ? (
            <Image
              source={{ uri: avatar.source }}
              style={{
                width: size,
                height: size,
                borderRadius: size / 2,
                borderWidth: 2,
                borderColor: colors.white,
              }}
            />
          ) : (
            <View
              style={{
                width: size,
                height: size,
                borderRadius: size / 2,
                backgroundColor: colors.primary[200],
                borderWidth: 2,
                borderColor: colors.white,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Text
                style={{
                  color: colors.white,
                  fontSize: size * 0.35,
                  fontFamily: typography.fontFamily.medium,
                }}
              >
                {avatar.name?.charAt(0) || "?"}
              </Text>
            </View>
          )}
        </View>
      ))}
      {remaining > 0 && (
        <View
          style={{
            marginLeft: -8,
            width: size,
            height: size,
            borderRadius: size / 2,
            backgroundColor: colors.primary[50],
            borderWidth: 2,
            borderColor: colors.white,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Text
            style={{
              color: colors.primary.DEFAULT,
              fontSize: size * 0.35,
              fontFamily: typography.fontFamily.semiBold,
            }}
          >
            +{remaining}
          </Text>
        </View>
      )}
    </View>
  );
}
