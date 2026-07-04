import { useEffect, useRef, useState } from "react";
import { View, TouchableOpacity, Text, Animated, Platform } from "react-native";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { colors } from "@/theme/colors";
import { typography } from "@/theme/typography";
import { shadows } from "@/theme/shadows";

const TAB_CONFIG: Record<
  string,
  { label: string; active: keyof typeof Ionicons.glyphMap; inactive: keyof typeof Ionicons.glyphMap }
> = {
  home: { label: "Accueil", active: "home", inactive: "home-outline" },
  discover: { label: "Explorer", active: "compass", inactive: "compass-outline" },
  tickets: { label: "Billets", active: "ticket", inactive: "ticket-outline" },
  profile: { label: "Profil", active: "person", inactive: "person-outline" },
};

function TabItem({
  focused,
  label,
  iconActive,
  iconInactive,
  onPress,
  onLongPress,
}: {
  focused: boolean;
  label: string;
  iconActive: keyof typeof Ionicons.glyphMap;
  iconInactive: keyof typeof Ionicons.glyphMap;
  onPress: () => void;
  onLongPress?: () => void;
}) {
  const iconScale = useRef(new Animated.Value(focused ? 1 : 0.92)).current;
  const labelOpacity = useRef(new Animated.Value(focused ? 1 : 0.72)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(iconScale, {
        toValue: focused ? 1.1 : 0.94,
        damping: 14,
        stiffness: 260,
        mass: 0.7,
        useNativeDriver: true,
      }),
      Animated.timing(labelOpacity, {
        toValue: focused ? 1 : 0.65,
        duration: 180,
        useNativeDriver: true,
      }),
    ]).start();
  }, [focused, iconScale, labelOpacity]);

  return (
    <TouchableOpacity
      onPress={onPress}
      onLongPress={onLongPress}
      activeOpacity={0.9}
      style={{
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: 8,
        zIndex: 2,
      }}
    >
      <Animated.View style={{ transform: [{ scale: iconScale }] }}>
        <Ionicons
          name={focused ? iconActive : iconInactive}
          size={22}
          color={focused ? colors.white : colors.text.secondary}
        />
      </Animated.View>
      <Animated.Text
        style={{
          fontSize: 10,
          fontFamily: focused ? typography.fontFamily.semiBold : typography.fontFamily.medium,
          color: focused ? colors.white : colors.text.secondary,
          marginTop: 4,
          opacity: labelOpacity,
        }}
      >
        {label}
      </Animated.Text>
    </TouchableOpacity>
  );
}

export function CustomTabBar({ state, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();
  const slideX = useRef(new Animated.Value(0)).current;
  const pillScale = useRef(new Animated.Value(1)).current;
  const [barWidth, setBarWidth] = useState(0);

  const tabCount = state.routes.length;
  const tabWidth = barWidth > 0 ? barWidth / tabCount : 0;
  const innerPadding = 6;

  useEffect(() => {
    if (tabWidth <= 0) return;

    Animated.sequence([
      Animated.spring(pillScale, {
        toValue: 0.92,
        damping: 20,
        stiffness: 400,
        useNativeDriver: true,
      }),
      Animated.spring(pillScale, {
        toValue: 1,
        damping: 12,
        stiffness: 220,
        useNativeDriver: true,
      }),
    ]).start();

    Animated.spring(slideX, {
      toValue: state.index * tabWidth,
      damping: 22,
      stiffness: 280,
      mass: 0.85,
      useNativeDriver: true,
    }).start();
  }, [pillScale, slideX, state.index, tabWidth]);

  return (
    <View
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        bottom: 0,
        paddingHorizontal: 16,
        paddingBottom: Math.max(insets.bottom, Platform.OS === "ios" ? 20 : 12),
        paddingTop: 8,
      }}
    >
      <View
        onLayout={(event) => setBarWidth(event.nativeEvent.layout.width)}
        style={[
          {
            flexDirection: "row",
            backgroundColor: colors.white,
            borderRadius: 32,
            padding: innerPadding,
            borderWidth: 1,
            borderColor: "rgba(0,0,0,0.04)",
          },
          shadows.lg,
        ]}
      >
        {tabWidth > 0 && (
          <Animated.View
            pointerEvents="none"
            style={{
              position: "absolute",
              top: innerPadding,
              left: innerPadding,
              width: tabWidth,
              height: 58,
              borderRadius: 26,
              backgroundColor: colors.primary.DEFAULT,
              transform: [{ translateX: slideX }, { scale: pillScale }],
              ...shadows.md,
              shadowColor: colors.primary.DEFAULT,
              shadowOpacity: 0.35,
            }}
          />
        )}

        {state.routes.map((route, index) => {
          const config = TAB_CONFIG[route.name] ?? {
            label: route.name,
            active: "ellipse" as const,
            inactive: "ellipse-outline" as const,
          };
          const focused = state.index === index;

          return (
            <TabItem
              key={route.key}
              focused={focused}
              label={config.label}
              iconActive={config.active}
              iconInactive={config.inactive}
              onPress={() => {
                const event = navigation.emit({
                  type: "tabPress",
                  target: route.key,
                  canPreventDefault: true,
                });

                if (!focused && !event.defaultPrevented) {
                  navigation.navigate(route.name);
                }
              }}
              onLongPress={() => {
                navigation.emit({
                  type: "tabLongPress",
                  target: route.key,
                });
              }}
            />
          );
        })}
      </View>
    </View>
  );
}
