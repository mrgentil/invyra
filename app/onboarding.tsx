import { useRef, useState, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  Dimensions,
  TouchableOpacity,
  ViewToken,
} from "react-native";
import { router } from "expo-router";
import { Image } from "expo-image";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { colors } from "@/theme/colors";
import { typography } from "@/theme/typography";
import { radius } from "@/theme/radius";
import { useOnboardingStore } from "@/store/useOnboardingStore";

const { width } = Dimensions.get("window");
const ACCENT = "#3B82F6";
const DARK = "#101012";
const MUTED = "rgba(255,255,255,0.64)";

type Slide = {
  id: string;
  image: string;
  title: string;
  description: string;
  visual: "stack" | "live" | "orbit";
};

const SLIDES: Slide[] = [
  {
    id: "discover",
    image: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=1200",
    title: "Découvrez les événements faits pour vous",
    description: "Explorez concerts, soirées et expériences locales selon vos envies.",
    visual: "stack",
  },
  {
    id: "book",
    image: "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=1200",
    title: "Réservez votre place sans friction",
    description: "Choisissez vos billets, confirmez le total et payez en quelques secondes.",
    visual: "live",
  },
  {
    id: "tickets",
    image: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=1200",
    title: "Entrez avec votre billet digital",
    description: "Vos QR codes et réservations restent accessibles au même endroit.",
    visual: "orbit",
  },
];

function Header({
  top,
  canGoBack,
  onBack,
  onSkip,
  showSkip,
}: {
  top: number;
  canGoBack: boolean;
  onBack: () => void;
  onSkip: () => void;
  showSkip: boolean;
}) {
  return (
    <View
      style={{
        position: "absolute",
        top,
        left: 0,
        right: 0,
        paddingHorizontal: 22,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        zIndex: 3,
      }}
    >
      <TouchableOpacity
        onPress={canGoBack ? onBack : undefined}
        activeOpacity={canGoBack ? 0.75 : 1}
        style={{
          width: 34,
          height: 34,
          borderRadius: 10,
          alignItems: "center",
          justifyContent: "center",
          borderWidth: canGoBack ? 1 : 0,
          borderColor: "rgba(255,255,255,0.13)",
        }}
      >
        {canGoBack ? (
          <Ionicons name="arrow-back" size={18} color={colors.white} />
        ) : (
          <Image
            source={require("../assets/icon.png")}
            style={{ width: 30, height: 30, borderRadius: 9 }}
            contentFit="cover"
          />
        )}
      </TouchableOpacity>

      {showSkip && (
        <TouchableOpacity
          onPress={onSkip}
          activeOpacity={0.82}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
        >
          <Text
            style={{
              fontFamily: typography.fontFamily.medium,
              fontSize: typography.fontSize.sm,
              color: "rgba(255,255,255,0.78)",
            }}
          >
            Passer
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

function FloatingBadge({
  icon,
  top,
  left,
  right,
  color = ACCENT,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  top: number;
  left?: number;
  right?: number;
  color?: string;
}) {
  return (
    <View
      style={{
        position: "absolute",
        top,
        left,
        right,
        width: 28,
        height: 28,
        borderRadius: 14,
        backgroundColor: color,
        alignItems: "center",
        justifyContent: "center",
        shadowColor: color,
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.4,
        shadowRadius: 16,
        elevation: 8,
      }}
    >
      <Ionicons name={icon} size={15} color={colors.white} />
    </View>
  );
}

function MiniAvatar({
  image,
  size,
  top,
  left,
  right,
}: {
  image: string;
  size: number;
  top: number;
  left?: number;
  right?: number;
}) {
  return (
    <Image
      source={{ uri: image }}
      style={{
        position: "absolute",
        top,
        left,
        right,
        width: size,
        height: size,
        borderRadius: size / 2,
        borderWidth: 3,
        borderColor: "rgba(255,255,255,0.9)",
      }}
      contentFit="cover"
    />
  );
}

function StackedCards({ image }: { image: string }) {
  return (
    <View style={{ width: 270, height: 270, alignItems: "center", justifyContent: "center" }}>
      <View
        style={{
          position: "absolute",
          width: 220,
          height: 220,
          borderRadius: 110,
          backgroundColor: "rgba(59,130,246,0.1)",
        }}
      />
      <LinearGradient
        colors={["#EAF3FF", "#DCEBFF", "#E0F2FE"]}
        style={{
          position: "absolute",
          width: 154,
          height: 184,
          borderRadius: 24,
          transform: [{ rotate: "-14deg" }],
          left: 36,
          top: 54,
        }}
      />
      <LinearGradient
        colors={["#F4F8FF", "#E7F0FF", "#FFFFFF"]}
        style={{
          position: "absolute",
          width: 154,
          height: 184,
          borderRadius: 24,
          transform: [{ rotate: "13deg" }],
          right: 36,
          top: 54,
        }}
      />
      <LinearGradient
        colors={["#EAF3FF", "#DCEBFF", "#3B82F6"]}
        style={{
          width: 162,
          height: 194,
          borderRadius: 26,
          padding: 14,
          justifyContent: "space-between",
        }}
      >
        <View style={{ alignItems: "center", paddingTop: 18 }}>
          <Image
            source={{ uri: image }}
            style={{
              width: 94,
              height: 94,
              borderRadius: 47,
              borderWidth: 4,
              borderColor: "rgba(255,255,255,0.85)",
            }}
            contentFit="cover"
          />
        </View>
        <View>
          <Text
            style={{
              fontFamily: typography.fontFamily.semiBold,
              fontSize: typography.fontSize.sm,
              color: colors.white,
            }}
          >
            Invyra
          </Text>
          <Text
            style={{
              fontFamily: typography.fontFamily.regular,
              fontSize: typography.fontSize.xs,
              color: "rgba(255,255,255,0.75)",
            }}
          >
            Événements
          </Text>
        </View>
      </LinearGradient>
      <FloatingBadge icon="navigate" top={222} />
      <FloatingBadge icon="checkmark" top={72} right={24} />
    </View>
  );
}

function LiveCard({ image }: { image: string }) {
  return (
    <View style={{ width: 290, height: 284, alignItems: "center", justifyContent: "center" }}>
      <View
        style={{
          position: "absolute",
          width: 224,
          height: 224,
          borderRadius: 112,
          backgroundColor: "rgba(59,130,246,0.1)",
        }}
      />
      <LinearGradient
        colors={["#EAF3FF", "#DCEBFF", "#E0F2FE"]}
        style={{
          position: "absolute",
          width: 148,
          height: 176,
          borderRadius: 24,
          left: 36,
          top: 58,
          transform: [{ rotate: "-17deg" }],
        }}
      />
      <LinearGradient
        colors={["#EFF6FF", "#E0F2FE", "#E7F0FF"]}
        style={{
          position: "absolute",
          width: 148,
          height: 176,
          borderRadius: 24,
          right: 36,
          top: 58,
          transform: [{ rotate: "17deg" }],
        }}
      />
      <View
        style={{
          width: 170,
          height: 204,
          borderRadius: 26,
          overflow: "hidden",
          backgroundColor: "#17171A",
        }}
      >
        <Image source={{ uri: image }} style={{ flex: 1 }} contentFit="cover" />
        <LinearGradient
          colors={["transparent", "rgba(93,67,255,0.92)"]}
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            bottom: 0,
            padding: 14,
            paddingTop: 42,
          }}
        >
          <Text
            style={{
              fontFamily: typography.fontFamily.semiBold,
              fontSize: typography.fontSize.sm,
              color: colors.white,
            }}
          >
            Live Session
          </Text>
          <Text
            style={{
              fontFamily: typography.fontFamily.regular,
              fontSize: typography.fontSize.xs,
              color: "rgba(255,255,255,0.8)",
            }}
          >
            Kinshasa, 20h00
          </Text>
        </LinearGradient>
      </View>
      <FloatingBadge icon="flash" top={228} color="#4A6CFF" />
      <FloatingBadge icon="paper-plane" top={72} right={28} />
    </View>
  );
}

function OrbitVisual({ image }: { image: string }) {
  const orbitColor = "rgba(59,130,246,0.18)";

  return (
    <View style={{ width: 310, height: 290, alignItems: "center", justifyContent: "center" }}>
      {[116, 178, 238].map((size) => (
        <View
          key={size}
          style={{
            position: "absolute",
            width: size,
            height: size,
            borderRadius: size / 2,
            borderWidth: 1,
            borderColor: orbitColor,
          }}
        />
      ))}

      <Image
        source={{ uri: image }}
        style={{
          width: 122,
          height: 122,
          borderRadius: 61,
          borderWidth: 4,
          borderColor: "rgba(255,255,255,0.95)",
        }}
        contentFit="cover"
      />

      <MiniAvatar
        image="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300"
        size={60}
        top={36}
        left={36}
      />
      <MiniAvatar
        image="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=300"
        size={48}
        top={70}
        right={34}
      />
      <MiniAvatar
        image="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300"
        size={46}
        top={190}
        left={55}
      />
      <MiniAvatar
        image="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300"
        size={52}
        top={198}
        right={50}
      />
      <FloatingBadge icon="ticket" top={54} left={152} />
      <FloatingBadge icon="musical-notes" top={190} left={150} color="#0EA5E9" />
      <FloatingBadge icon="star" top={122} left={28} color="#00A6FF" />
      <FloatingBadge icon="location" top={124} right={24} color="#FFB020" />
    </View>
  );
}

function SlideVisual({ slide }: { slide: Slide }) {
  if (slide.visual === "live") {
    return <LiveCard image={slide.image} />;
  }

  if (slide.visual === "orbit") {
    return <OrbitVisual image={slide.image} />;
  }

  return <StackedCards image={slide.image} />;
}

function SlideScene({ slide }: { slide: Slide }) {
  return (
    <View
      style={{
        width,
        flex: 1,
        alignItems: "center",
        paddingHorizontal: 34,
        paddingTop: 112,
      }}
    >
      <SlideVisual slide={slide} />

      <Text
        style={{
          fontFamily: typography.fontFamily.bold,
          fontSize: typography.fontSize.huge,
          lineHeight: typography.lineHeight.huge,
          color: colors.white,
          textAlign: "center",
          marginTop: 16,
        }}
      >
        {slide.title}
      </Text>
      <Text
        style={{
          fontFamily: typography.fontFamily.regular,
          fontSize: typography.fontSize.sm,
          lineHeight: typography.lineHeight.sm + 6,
          color: MUTED,
          textAlign: "center",
          marginTop: 14,
          maxWidth: 290,
        }}
      >
        {slide.description}
      </Text>
    </View>
  );
}

function OnboardingButton({
  title,
  onPress,
}: {
  title: string;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.86}
      style={{
        height: 58,
        borderRadius: 29,
        backgroundColor: ACCENT,
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "row",
        gap: 10,
        shadowColor: ACCENT,
        shadowOffset: { width: 0, height: 12 },
        shadowOpacity: 0.26,
        shadowRadius: 22,
        elevation: 10,
      }}
    >
      <Text
        style={{
          fontFamily: typography.fontFamily.semiBold,
          fontSize: typography.fontSize.md,
          color: colors.white,
        }}
      >
        {title}
      </Text>
      <Ionicons name="arrow-forward" size={18} color={colors.white} />
    </TouchableOpacity>
  );
}

function Footer({
  index,
  bottom,
  isLast,
  onNext,
}: {
  index: number;
  bottom: number;
  isLast: boolean;
  onNext: () => void;
}) {
  return (
    <View
      style={{
        position: "absolute",
        left: 26,
        right: 26,
        bottom: bottom + 18,
      }}
    >
      <View style={{ flexDirection: "row", justifyContent: "center", gap: 5, marginBottom: 34 }}>
        {SLIDES.map((item, itemIndex) => (
          <View
            key={item.id}
            style={{
              width: itemIndex === index ? 30 : 6,
              height: 6,
              borderRadius: 3,
              backgroundColor: itemIndex === index ? ACCENT : "rgba(255,255,255,0.22)",
            }}
          />
        ))}
      </View>

      <OnboardingButton title={isLast ? "Commencer" : "Continuer"} onPress={onNext} />
    </View>
  );
}

export default function OnboardingScreen() {
  const insets = useSafeAreaInsets();
  const listRef = useRef<FlatList<Slide>>(null);
  const [index, setIndex] = useState(0);
  const complete = useOnboardingStore((state) => state.complete);

  const finish = useCallback(async () => {
    await complete();
    router.replace("/(tabs)/home");
  }, [complete]);

  const goNext = useCallback(() => {
    if (index < SLIDES.length - 1) {
      listRef.current?.scrollToIndex({ index: index + 1, animated: true });
      return;
    }

    finish();
  }, [finish, index]);

  const goBack = useCallback(() => {
    if (index > 0) {
      listRef.current?.scrollToIndex({ index: index - 1, animated: true });
    }
  }, [index]);

  const onViewableItemsChanged = useRef(({ viewableItems }: { viewableItems: ViewToken[] }) => {
    if (viewableItems[0]?.index != null) {
      setIndex(viewableItems[0].index);
    }
  }).current;

  const viewabilityConfig = useRef({ viewAreaCoveragePercentThreshold: 60 }).current;
  const isLast = index === SLIDES.length - 1;

  return (
    <View style={{ flex: 1, backgroundColor: DARK }}>
      <View
        style={{
          position: "absolute",
          top: 88,
          alignSelf: "center",
          width: 230,
          height: 230,
          borderRadius: 115,
          backgroundColor: "rgba(59,130,246,0.1)",
        }}
      />
      <FlatList
        ref={listRef}
        data={SLIDES}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled
        bounces={false}
        showsHorizontalScrollIndicator={false}
        style={{ flex: 1 }}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
        onScrollToIndexFailed={() => {}}
        renderItem={({ item }) => <SlideScene slide={item} />}
      />

      <Header
        top={insets.top + 12}
        canGoBack={index > 0}
        onBack={goBack}
        onSkip={finish}
        showSkip={!isLast}
      />
      <Footer index={index} bottom={insets.bottom} isLast={isLast} onNext={goNext} />
    </View>
  );
}
