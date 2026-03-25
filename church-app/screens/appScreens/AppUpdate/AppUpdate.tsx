import AppModal from "@/components/AppModal"; // ← Your provided modal
import { AppText } from "@/components/AppText"; // change if your text component differs
import { Colors, Fonts } from "@/constants/theme";
import { moderateSize } from "@/utils/useResponsiveStyle";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { Linking, Pressable, View } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";

interface Props {
  visible: boolean;
  onClose: () => void;
  version?: string | null;
  downloadUrl: string | null;
}

export default function AppUpdate({
  visible,
  onClose,
  version,
  downloadUrl,
}: Props) {
  const handleUpdate = () => Linking.openURL(downloadUrl ?? "");

  return (
    <AppModal
      innerStyles={{ padding: 2 }}
      fromUpdate
      isModalVisible={visible}
      handleClose={onClose}
    >
      {/* 🎨 Gradient Background */}
      <LinearGradient
        colors={Colors.gradientDeep}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{
          flex: 1,
          borderRadius: moderateSize(20),
          overflow: "hidden",
          paddingVertical: moderateSize(35),
          paddingHorizontal: moderateSize(20),
          justifyContent: "space-between",
        }}
      >
        {/* Glow Circle Accent */}
        <View
          style={{
            position: "absolute",
            top: -50,
            right: -30,
            height: 160,
            width: 160,
            borderRadius: 100,
            backgroundColor: Colors.primary + "25",
            // blurRadius: 30,
          }}
        />
        <View
          style={{
            position: "absolute",
            bottom: -40,
            left: -25,
            height: 180,
            width: 180,
            borderRadius: 100,
            backgroundColor: Colors.purple + "18",
            // blurRadius: 40,
          }}
        />

        {/* Header Animation */}
        <Animated.View entering={FadeInDown.springify().damping(12)}>
          <AppText
            style={{
              fontSize: moderateSize(26),
              color: Colors.white,
              fontFamily: Fonts.Bold,
              textAlign: "center",
              lineHeight: 32,
            }}
          >
            New Update Available 🔥
          </AppText>

          <AppText
            style={{
              color: Colors.deemedWhite,
              textAlign: "center",
              marginTop: moderateSize(10),
              fontFamily: Fonts.Medium,
              fontSize: moderateSize(14),
              lineHeight: moderateSize(20),
            }}
          >
            A better version of your app is ready. Update now for the best
            experience.
          </AppText>

          {version && (
            <AppText
              style={{
                color: Colors.primary,
                textAlign: "center",
                marginTop: moderateSize(6),
                fontSize: moderateSize(13),
                fontFamily: Fonts.SemiBold,
              }}
            >
              Version {version}
            </AppText>
          )}
        </Animated.View>

        {/* Action Buttons */}
        <Animated.View entering={FadeInDown.delay(200).springify()}>
          <View
            style={{
              marginTop: moderateSize(25),
              backgroundColor: Colors.surface,
              borderRadius: moderateSize(14),
              paddingVertical: moderateSize(14),
              alignItems: "center",
            }}
          >
            <AppText
              style={{ color: Colors.white, fontSize: moderateSize(14) }}
            >
              Level up your experience
            </AppText>
          </View>

          <View style={{ marginTop: moderateSize(20), gap: moderateSize(12) }}>
            {/* Update Now Button */}
            <Pressable
              onPress={handleUpdate}
              style={{
                backgroundColor: Colors.primary,
                paddingVertical: moderateSize(14),
                borderRadius: moderateSize(14),
                alignItems: "center",
              }}
            >
              <AppText
                style={{
                  color: Colors.black,
                  fontFamily: Fonts.Bold,
                  fontSize: moderateSize(16),
                }}
              >
                Update Now 🚀
              </AppText>
            </Pressable>

            {/* Optional Skip Button */}
            <Pressable
              onPress={onClose}
              style={{
                alignItems: "center",
                paddingVertical: moderateSize(10),
              }}
            >
              <AppText
                style={{
                  color: Colors.muted,
                  fontFamily: Fonts.Medium,
                }}
              >
                Maybe Later
              </AppText>
            </Pressable>
          </View>
        </Animated.View>
      </LinearGradient>
    </AppModal>
  );
}
