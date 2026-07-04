import { useEffect, useRef } from "react";
import { Animated, View, Text } from "react-native";
import { colors } from "@/theme/colors";
import { typography } from "@/theme/typography";
import { radius } from "@/theme/radius";

interface LoadingStateProps {
  message?: string;
  fullScreen?: boolean;
}

export function LoadingState({ message = "Chargement...", fullScreen = false }: LoadingStateProps) {
  const pulse = useRef(new Animated.Value(0)).current;
  const dotOne = useRef(new Animated.Value(0.35)).current;
  const dotTwo = useRef(new Animated.Value(0.35)).current;
  const dotThree = useRef(new Animated.Value(0.35)).current;

  useEffect(() => {
    const pulseAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, {
          toValue: 1,
          duration: 950,
          useNativeDriver: true,
        }),
        Animated.timing(pulse, {
          toValue: 0,
          duration: 950,
          useNativeDriver: true,
        }),
      ])
    );

    const dotAnimation = Animated.loop(
      Animated.stagger(
        160,
        [dotOne, dotTwo, dotThree].map((dot) =>
          Animated.sequence([
            Animated.timing(dot, {
              toValue: 1,
              duration: 420,
              useNativeDriver: true,
            }),
            Animated.timing(dot, {
              toValue: 0.35,
              duration: 420,
              useNativeDriver: true,
            }),
          ])
        )
      )
    );

    pulseAnimation.start();
    dotAnimation.start();

    return () => {
      pulseAnimation.stop();
      dotAnimation.stop();
    };
  }, [dotOne, dotThree, dotTwo, pulse]);

  const haloScale = pulse.interpolate({
    inputRange: [0, 1],
    outputRange: [0.88, 1.18],
  });

  const haloOpacity = pulse.interpolate({
    inputRange: [0, 1],
    outputRange: [0.5, 0.08],
  });

  return (
    <View
      style={[
        {
          alignItems: "center",
          justifyContent: "center",
          paddingVertical: 40,
        },
        fullScreen && {
          flex: 1,
          backgroundColor: colors.background.light,
        },
      ]}
    >
      <View style={{ width: 86, height: 86, alignItems: "center", justifyContent: "center" }}>
        <Animated.View
          style={{
            position: "absolute",
            width: 78,
            height: 78,
            borderRadius: 39,
            backgroundColor: colors.primary.DEFAULT,
            opacity: haloOpacity,
            transform: [{ scale: haloScale }],
          }}
        />
        <View
          style={{
            width: 58,
            height: 58,
            borderRadius: radius.full,
            backgroundColor: colors.primary.DEFAULT,
            alignItems: "center",
            justifyContent: "center",
            shadowColor: colors.primary.DEFAULT,
            shadowOffset: { width: 0, height: 10 },
            shadowOpacity: 0.24,
            shadowRadius: 22,
            elevation: 10,
          }}
        >
          <View style={{ flexDirection: "row", gap: 5 }}>
            {[dotOne, dotTwo, dotThree].map((dot, index) => (
              <Animated.View
                key={index}
                style={{
                  width: 7,
                  height: 7,
                  borderRadius: 4,
                  backgroundColor: colors.white,
                  opacity: dot,
                  transform: [
                    {
                      translateY: dot.interpolate({
                        inputRange: [0.35, 1],
                        outputRange: [3, -3],
                      }),
                    },
                  ],
                }}
              />
            ))}
          </View>
        </View>
      </View>
      <Text
        style={{
          fontFamily: typography.fontFamily.medium,
          fontSize: typography.fontSize.md,
          color: colors.text.secondary,
          marginTop: 12,
        }}
      >
        {message}
      </Text>
    </View>
  );
}
