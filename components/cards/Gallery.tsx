import { View, TouchableOpacity, Text, Dimensions } from "react-native";
import { Image } from "expo-image";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "@/theme/colors";
import { radius } from "@/theme/radius";
import { typography } from "@/theme/typography";

const { width } = Dimensions.get("window");
const GALLERY_SIZE = (width - 48) / 3;

interface GalleryProps {
  images: string[];
  onImagePress?: (index: number) => void;
}

export function Gallery({ images, onImagePress }: GalleryProps) {
  const displayed = images.slice(0, 6);

  return (
    <View
      style={{
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 8,
      }}
    >
      {displayed.map((image, index) => (
        <View key={index}>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => onImagePress?.(index)}
          >
            <Image
              source={{ uri: image }}
              style={{
                width: GALLERY_SIZE,
                height: GALLERY_SIZE,
                borderRadius: radius.md,
              }}
              contentFit="cover"
            />
            {index === 5 && images.length > 6 && (
              <View
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  borderRadius: radius.md,
                  backgroundColor: "rgba(0,0,0,0.5)",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Ionicons name="images-outline" size={24} color={colors.white} />
                <Text
                  style={{
                    color: colors.white,
                    fontSize: typography.fontSize.sm,
                    fontFamily: typography.fontFamily.bold,
                    marginTop: 4,
                  }}
                >
                  +{images.length - 6}
                </Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
      ))}
    </View>
  );
}
