import { View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "@/theme/colors";
import { typography } from "@/theme/typography";
import { AppButton } from "@/components/ui/AppButton";

interface ErrorStateProps {
  message?: string;
  onRetry?: () => void;
}

export function ErrorState({
  message = "Erreur inattendue",
  onRetry,
}: ErrorStateProps) {
  return (
    <View
      style={{
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: 40,
        paddingVertical: 60,
      }}
    >
      <View
        style={{
          width: 80,
          height: 80,
          borderRadius: 40,
          backgroundColor: colors.danger[50],
          alignItems: "center",
          justifyContent: "center",
          marginBottom: 20,
        }}
      >
        <Ionicons name="alert-circle-outline" size={36} color={colors.danger.DEFAULT} />
      </View>
      <Text
        style={{
          fontFamily: typography.fontFamily.semiBold,
          fontSize: typography.fontSize.xl,
          color: colors.text.primary,
          textAlign: "center",
        }}
      >
        Oups !
      </Text>
      <Text
        style={{
          fontFamily: typography.fontFamily.regular,
          fontSize: typography.fontSize.md,
          color: colors.text.secondary,
          textAlign: "center",
          marginTop: 8,
        }}
      >
        {message}
      </Text>
      {onRetry && (
        <View style={{ marginTop: 24 }}>
          <AppButton title="Réessayer" onPress={onRetry} variant="outline" />
        </View>
      )}
    </View>
  );
}
