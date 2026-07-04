import { View, Text, Dimensions } from "react-native";
import { colors } from "@/theme/colors";
import { radius } from "@/theme/radius";
import { typography } from "@/theme/typography";
import { shadows } from "@/theme/shadows";

const { width } = Dimensions.get("window");
const MAP_HEIGHT = 200;

interface MapCardProps {
  latitude: number;
  longitude: number;
  locationName: string;
  address: string;
}

export function MapCard({ latitude, longitude, locationName, address }: MapCardProps) {
  const mapUrl = `https://maps.googleapis.com/maps/api/staticmap?center=${latitude},${longitude}&zoom=15&size=${Math.floor(width - 32)}x${MAP_HEIGHT}&markers=color:red|${latitude},${longitude}&key=YOUR_API_KEY`;

  return (
    <View
      style={[
        {
          backgroundColor: colors.card.light,
          borderRadius: radius.card,
          overflow: "hidden",
        },
        shadows.md,
      ]}
    >
      <View
        style={{
          width: "100%",
          height: MAP_HEIGHT,
          backgroundColor: colors.primary[50],
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Text style={{ color: colors.text.secondary, fontFamily: typography.fontFamily.regular }}>
          Carte : {locationName}
        </Text>
      </View>
      <View style={{ padding: 12 }}>
        <Text
          style={{
            fontFamily: typography.fontFamily.semiBold,
            fontSize: typography.fontSize.md,
            color: colors.text.primary,
          }}
        >
          {locationName}
        </Text>
        <Text
          style={{
            fontFamily: typography.fontFamily.regular,
            fontSize: typography.fontSize.sm,
            color: colors.text.secondary,
            marginTop: 2,
          }}
        >
          {address}
        </Text>
      </View>
    </View>
  );
}
