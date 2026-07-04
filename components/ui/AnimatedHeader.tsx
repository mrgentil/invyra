import { View, Text, Dimensions, Animated } from "react-native";
import { colors } from "@/theme/colors";
import { typography } from "@/theme/typography";

const { width } = Dimensions.get("window");

interface AnimatedHeaderProps {
  scrollOffset: Animated.Value;
  title: string;
  height?: number;
  children?: React.ReactNode;
}

export function AnimatedHeader({
  scrollOffset,
  title,
  height = 120,
  children,
}: AnimatedHeaderProps) {
  const headerOpacity = scrollOffset.interpolate({
    inputRange: [0, height - 60],
    outputRange: [0, 1],
    extrapolate: "clamp",
  });

  const titleScale = scrollOffset.interpolate({
    inputRange: [0, height - 60],
    outputRange: [1, 0.8],
    extrapolate: "clamp",
  });
  const titleTranslateY = scrollOffset.interpolate({
    inputRange: [0, height - 60],
    outputRange: [0, -10],
    extrapolate: "clamp",
  });

  return (
    <View>
      <View style={{ height }} />
      <Animated.View
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height,
          overflow: "hidden",
        }}
      >
        <View style={{ paddingTop: 50, paddingHorizontal: 20, flex: 1 }}>
          <Animated.View style={{ transform: [{ scale: titleScale }, { translateY: titleTranslateY }] }}>
            <Text
              style={{
                fontFamily: typography.fontFamily.bold,
                fontSize: typography.fontSize.huge,
                color: colors.text.primary,
              }}
            >
              {title}
            </Text>
            {children}
          </Animated.View>
        </View>
      </Animated.View>
      <Animated.View
        style={[
          {
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: 100,
            overflow: "hidden",
          },
          { opacity: headerOpacity },
        ]}
      >
        <View
          style={{
            flex: 1,
            justifyContent: "flex-end",
            paddingBottom: 10,
            paddingHorizontal: 20,
          }}
        >
          <Text
            style={{
              fontFamily: typography.fontFamily.semiBold,
              fontSize: typography.fontSize.xl,
              color: colors.text.primary,
            }}
            numberOfLines={1}
          >
            {title}
          </Text>
        </View>
      </Animated.View>
    </View>
  );
}
