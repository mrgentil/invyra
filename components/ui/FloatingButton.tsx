import { TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { colors } from "@/theme/colors";
import { shadows } from "@/theme/shadows";

interface FloatingButtonProps {
  icon?: keyof typeof Ionicons.glyphMap;
  onPress: () => void;
  visible?: boolean;
}

export function FloatingButton({
  icon = "add-outline",
  onPress,
  visible = true,
}: FloatingButtonProps) {
  return (
    <View
      style={[
        {
          position: "absolute",
          bottom: 24,
          right: 24,
          zIndex: 100,
          opacity: visible ? 1 : 0,
        },
      ]}
    >
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={onPress}
        style={[shadows.lg]}
      >
        <LinearGradient
          colors={[colors.primary.DEFAULT, colors.secondary.DEFAULT]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{
            width: 56,
            height: 56,
            borderRadius: 28,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Ionicons name={icon} size={24} color={colors.white} />
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );
}
