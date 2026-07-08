import { View, TextInput, Text } from "react-native";
import { colors } from "@/theme/colors";
import { radius } from "@/theme/radius";
import { typography } from "@/theme/typography";

interface InputProps {
  label?: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  error?: string;
  multiline?: boolean;
  numberOfLines?: number;
  secureTextEntry?: boolean;
  keyboardType?: "default" | "email-address" | "numeric" | "phone-pad";
  autoCapitalize?: "none" | "sentences" | "words" | "characters";
  editable?: boolean;
  style?: object;
}

export function Input({
  label,
  value,
  onChangeText,
  placeholder,
  error,
  multiline = false,
  numberOfLines = 1,
  secureTextEntry = false,
  keyboardType = "default",
  autoCapitalize = "none",
  editable = true,
  style,
}: InputProps) {
  return (
    <View style={[{ marginBottom: 16 }, style]}>
      {label && (
        <Text
          style={{
            fontFamily: typography.fontFamily.medium,
            fontSize: typography.fontSize.md,
            color: colors.text.primary,
            marginBottom: 8,
          }}
        >
          {label}
        </Text>
      )}
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.text.secondary}
        multiline={multiline}
        numberOfLines={numberOfLines}
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
        autoCapitalize={autoCapitalize}
        editable={editable}
        style={{
          backgroundColor: colors.card.light,
          borderRadius: radius.input,
          paddingHorizontal: 16,
          paddingVertical: multiline ? 12 : 14,
          fontSize: typography.fontSize.md,
          fontFamily: typography.fontFamily.regular,
          color: colors.text.primary,
          borderWidth: 1,
          borderColor: error ? colors.danger.DEFAULT : colors.border.light,
          minHeight: multiline ? 100 : 48,
          textAlignVertical: multiline ? "top" : "center",
        }}
      />
      {error && (
        <Text
          style={{
            fontFamily: typography.fontFamily.regular,
            fontSize: typography.fontSize.xs,
            color: colors.danger.DEFAULT,
            marginTop: 4,
          }}
        >
          {error}
        </Text>
      )}
    </View>
  );
}
