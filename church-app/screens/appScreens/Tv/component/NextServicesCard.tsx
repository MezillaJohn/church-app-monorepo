import ClockIcon from "@/assets/svg/ClockIcon";
import { AppText } from "@/components/AppText";
import Card from "@/components/Card";
import { Colors, Fonts } from "@/constants/theme";
import CountDowntimer from "@/screens/appScreens/Tv/component/CountDowntimer";
import { NestedEvent } from "@/services/api/public/types";
import { moderateSize } from "@/utils/useResponsiveStyle";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { View } from "react-native";

const NextServicesCard = ({
  nextLiveEvent,
}: {
  nextLiveEvent: NestedEvent | null;
}) => {
  if (!nextLiveEvent) return null;

  const attr = nextLiveEvent.attributes;

  return (
    <Card
      style={{
        backgroundColor: Colors.surface,
        borderWidth: 1,
        borderColor: Colors.border,
        borderRadius: moderateSize(16),
        padding: moderateSize(16),
        marginBottom: moderateSize(28),
      }}
    >
      {/* Gradient Header */}
      <View style={{ marginBottom: moderateSize(14) }}>
        <AppText
          style={{
            color: Colors.white,
            fontFamily: Fonts.Regular,
            fontSize: moderateSize(12),
            marginBottom: 4,
          }}
        >
          Next Live Broadcast
        </AppText>
        <LinearGradient
          colors={[Colors.primary, "#FFD76A"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={{
            height: 3,
            width: moderateSize(100),
            borderRadius: 3,
          }}
        />
      </View>

      {/* Service Info */}
      <View
        style={{
          marginBottom: moderateSize(12),
        }}
      >
        <AppText
          style={{
            fontFamily: Fonts.Bold,
            color: Colors.white,
            fontSize: moderateSize(14),
          }}
        >
          {attr.title}
        </AppText>

        <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
          <ClockIcon />
          <AppText
            style={{
              color: Colors.deemedWhite,
              fontFamily: Fonts.Medium,
              fontSize: moderateSize(12),
            }}
          >
            {attr.event_time} WAT
          </AppText>
        </View>
      </View>

      <CountDowntimer eventDate={attr.event_date} eventTime={attr.event_time} />
    </Card>
  );
};

export default NextServicesCard;
