import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "@/theme/colors";
import { typography } from "@/theme/typography";
import { BottomSheet } from "@/components/modals/BottomSheet";

interface SocialShareSheetProps {
  visible: boolean;
  onClose: () => void;
}

const shareOptions = [
  { icon: "logo-whatsapp" as const, label: "WhatsApp", color: "#25D366" },
  { icon: "logo-instagram" as const, label: "Instagram", color: "#E4405F" },
  { icon: "logo-facebook" as const, label: "Facebook", color: "#1877F2" },
  { icon: "logo-tiktok" as const, label: "TikTok", color: "#000000" },
  { icon: "chatbubbles-outline" as const, label: "Messenger", color: "#00B4FF" },
  { icon: "logo-twitter" as const, label: "X", color: "#000000" },
  { icon: "link-outline" as const, label: "Copier", color: colors.primary.DEFAULT },
  { icon: "ellipsis-horizontal" as const, label: "Plus", color: colors.text.secondary },
];

export function SocialShareSheet({ visible, onClose }: SocialShareSheetProps) {
  return (
    <BottomSheet visible={visible} onClose={onClose} title="Partager">
      <View style={{ paddingHorizontal: 20 }}>
        <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 16, justifyContent: "center" }}>
          {shareOptions.map((option, index) => (
            <TouchableOpacity
              key={index}
              activeOpacity={0.7}
              style={{ alignItems: "center", width: 64 }}
            >
              <View
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: 28,
                  backgroundColor: option.color + "15",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Ionicons name={option.icon} size={24} color={option.color} />
              </View>
              <Text
                style={{
                  fontFamily: typography.fontFamily.regular,
                  fontSize: typography.fontSize.xs,
                  color: colors.text.secondary,
                  marginTop: 6,
                  textAlign: "center",
                }}
                numberOfLines={1}
              >
                {option.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </BottomSheet>
  );
}
