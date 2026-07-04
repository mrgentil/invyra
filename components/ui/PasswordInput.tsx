import { useState } from "react";
import { View, TextInput, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "@/theme/colors";
import { radius } from "@/theme/radius";
import { typography } from "@/theme/typography";

interface PasswordInputProps {
  label?: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  error?: string;
}

export function PasswordInput({
  label,
  value,
  onChangeText,
  placeholder = "Mot de passe",
  error,
}: PasswordInputProps) {
  const [visible, setVisible] = useState(false);

  return (
    <View style={{ marginBottom: 16 }}>
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
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          backgroundColor: colors.card.light,
          borderRadius: radius.input,
          borderWidth: 1,
          borderColor: error ? colors.danger.DEFAULT : colors.border.light,
          paddingHorizontal: 16,
          height: 48,
        }}
      >
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={colors.text.secondary}
          secureTextEntry={!visible}
          style={{
            flex: 1,
            fontSize: typography.fontSize.md,
            fontFamily: typography.fontFamily.regular,
            color: colors.text.primary,
            height: "100%",
          }}
        />
        <TouchableOpacity onPress={() => setVisible(!visible)} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
          <Ionicons
            name={visible ? "eye-off-outline" : "eye-outline"}
            size={20}
            color={colors.text.secondary}
          />
        </TouchableOpacity>
      </View>
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
