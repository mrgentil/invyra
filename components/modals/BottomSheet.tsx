import { useEffect, useRef } from "react";
import { View, Text, Dimensions, TouchableWithoutFeedback, Animated } from "react-native";
import { colors } from "@/theme/colors";
import { radius } from "@/theme/radius";
import { typography } from "@/theme/typography";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");
const SHEET_HEIGHT = SCREEN_HEIGHT * 0.82;

interface BottomSheetProps {
  visible: boolean;
  onClose: () => void;
  title?: string;
  subtitle?: string;
  badge?: number;
  children: React.ReactNode;
}

export function BottomSheet({ visible, onClose, title, subtitle, badge, children }: BottomSheetProps) {
  const translateY = useRef(new Animated.Value(SHEET_HEIGHT)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.spring(translateY, {
        toValue: 0,
        damping: 20,
        stiffness: 90,
        useNativeDriver: true,
      }).start();
      Animated.timing(opacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(translateY, {
        toValue: SHEET_HEIGHT,
        duration: 300,
        useNativeDriver: true,
      }).start();
      Animated.timing(opacity, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [opacity, translateY, visible]);

  const handleClose = () => {
    Animated.parallel([
      Animated.timing(translateY, {
        toValue: SHEET_HEIGHT,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => onClose());
  };

  if (!visible) return null;

  return (
    <View style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, zIndex: 1000 }}>
      <TouchableWithoutFeedback onPress={handleClose}>
        <Animated.View
          style={[
            {
              flex: 1,
              backgroundColor: "rgba(16,16,18,0.62)",
            },
            { opacity },
          ]}
        />
      </TouchableWithoutFeedback>
      <Animated.View
        style={[
          {
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: SHEET_HEIGHT,
            backgroundColor: colors.background.light,
            borderTopLeftRadius: radius.sheet,
            borderTopRightRadius: radius.sheet,
            paddingTop: 10,
            overflow: "hidden",
          },
          { transform: [{ translateY }] },
        ]}
      >
        <View style={{ alignItems: "center", marginBottom: 14 }}>
          <View
            style={{
              width: 44,
              height: 5,
              borderRadius: 3,
              backgroundColor: colors.border.light,
            }}
          />
        </View>

        {(title || subtitle || badge != null) && (
          <View
            style={{
              paddingHorizontal: 20,
              marginBottom: 14,
              flexDirection: "row",
              alignItems: "flex-start",
              justifyContent: "space-between",
              gap: 12,
            }}
          >
            <View style={{ flex: 1 }}>
              {title && (
                <Text
                  style={{
                    fontFamily: typography.fontFamily.bold,
                    fontSize: typography.fontSize.xxl,
                    color: colors.text.primary,
                  }}
                >
                  {title}
                </Text>
              )}
              {subtitle && (
                <Text
                  style={{
                    fontFamily: typography.fontFamily.regular,
                    fontSize: typography.fontSize.sm,
                    color: colors.text.secondary,
                    marginTop: 4,
                  }}
                >
                  {subtitle}
                </Text>
              )}
            </View>
            {badge != null && badge > 0 && (
              <View
                style={{
                  minWidth: 28,
                  height: 28,
                  borderRadius: 14,
                  paddingHorizontal: 8,
                  backgroundColor: colors.primary.DEFAULT,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Text
                  style={{
                    fontFamily: typography.fontFamily.bold,
                    fontSize: typography.fontSize.xs,
                    color: colors.white,
                  }}
                >
                  {badge}
                </Text>
              </View>
            )}
          </View>
        )}

        <View style={{ flex: 1 }}>{children}</View>
      </Animated.View>
    </View>
  );
}
