import { View, TextInput, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "@/theme/colors";
import { radius } from "@/theme/radius";

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  onClear?: () => void;
  onFilter?: () => void;
  onFocus?: () => void;
  autoFocus?: boolean;
}

export function SearchBar({
  value,
  onChangeText,
  placeholder = "Rechercher...",
  onClear,
  onFilter,
  onFocus,
  autoFocus = false,
}: SearchBarProps) {
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: colors.card.light,
        borderRadius: radius.input,
        paddingHorizontal: 16,
        height: 48,
        borderWidth: 1,
        borderColor: colors.border.light,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
      }}
    >
      <Ionicons name="search-outline" size={20} color={colors.text.secondary} />
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.text.secondary}
        autoFocus={autoFocus}
        onFocus={onFocus}
        style={{
          flex: 1,
          marginLeft: 10,
          fontSize: 14,
          fontFamily: "Poppins",
          color: colors.text.primary,
          height: "100%",
        }}
      />
      {value.length > 0 && (
        <View style={{ marginRight: onFilter ? 4 : 0 }}>
          <TouchableOpacity onPress={onClear} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
            <Ionicons name="close-circle" size={18} color={colors.text.secondary} />
          </TouchableOpacity>
        </View>
      )}
      {onFilter && (
        <TouchableOpacity
          onPress={onFilter}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          style={{
            marginLeft: 8,
            width: 32,
            height: 32,
            borderRadius: 16,
            backgroundColor: colors.primary[50],
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Ionicons name="funnel-outline" size={18} color={colors.primary.DEFAULT} />
        </TouchableOpacity>
      )}
    </View>
  );
}
