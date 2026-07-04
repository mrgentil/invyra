import { useState } from "react";
import { View, Dimensions, ScrollView, NativeScrollEvent, NativeSyntheticEvent } from "react-native";
import { Image } from "expo-image";
import { colors } from "@/theme/colors";
import { radius } from "@/theme/radius";

const { width } = Dimensions.get("window");
const CAROUSEL_WIDTH = width;
const CAROUSEL_HEIGHT = 300;

interface ImageCarouselProps {
  images: string[];
  height?: number;
}

export function ImageCarousel({ images, height = CAROUSEL_HEIGHT }: ImageCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  const onScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const offsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(offsetX / CAROUSEL_WIDTH);
    setActiveIndex(index);
  };

  return (
    <View style={{ height }}>
      <ScrollView
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={onScroll}
        scrollEventThrottle={16}
        bounces={false}
      >
        {images.map((image, index) => (
          <Image
            key={index}
            source={{ uri: image }}
            style={{ width: CAROUSEL_WIDTH, height }}
            contentFit="cover"
          />
        ))}
      </ScrollView>
      {images.length > 1 && (
        <View
          style={{
            position: "absolute",
            bottom: 16,
            left: 0,
            right: 0,
            flexDirection: "row",
            justifyContent: "center",
            gap: 6,
          }}
        >
          {images.map((_, index) => (
            <View
              key={index}
              style={{
                width: activeIndex === index ? 24 : 8,
                height: 8,
                borderRadius: 4,
                backgroundColor:
                  activeIndex === index ? colors.white : "rgba(255,255,255,0.5)",
              }}
            />
          ))}
        </View>
      )}
    </View>
  );
}
