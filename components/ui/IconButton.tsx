import { TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";


interface IconButtonProps {
  icon: keyof typeof Ionicons.glyphMap;
  onPress: () => void;
  size?: number;
  color?: string;
  backgroundColor?: string;
  disabled?: boolean;
  style?: object;
}

export function IconButton({
  icon,
  onPress,
  size = 24,
  color = "#1E1E1E",
  backgroundColor = "transparent",
  disabled = false,
  style,
}: IconButtonProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.7}
      style={[
        {
          width: size + 16,
          height: size + 16,
          borderRadius: (size + 16) / 2,
          backgroundColor,
          alignItems: "center",
          justifyContent: "center",
        },
        style,
      ]}
    >
      <Ionicons name={icon} size={size} color={color} />
    </TouchableOpacity>
  );
}
