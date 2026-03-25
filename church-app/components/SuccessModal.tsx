// src/components/SuccessModal.tsx
import React, { useEffect } from "react";
import { StyleSheet, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { Path, Svg } from "react-native-svg";

import AppModal from "@/components/AppModal";
import { AppText } from "@/components/AppText";
import { Colors, Fonts } from "@/constants/theme";
import { moderateSize } from "@/utils/useResponsiveStyle";

interface SuccessModalProps {
  visible: boolean;
  onClose: () => void;
  title?: string;
  message?: string;
  height?: number;
}

export const SuccessModal: React.FC<SuccessModalProps> = ({
  visible,
  onClose,
  title = "Verification Successful",
  message = "You’ve successfully verified your email.",
  height = moderateSize(300),
}) => {
  const scale = useSharedValue(0);

  useEffect(() => {
    if (visible) {
      scale.value = withSpring(1, { damping: 10, stiffness: 100 });
    } else {
      scale.value = 0;
    }
  }, [visible]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <AppModal isModalVisible={visible} handleClose={onClose} height={height}>
      <Animated.View style={[styles.successCard, animatedStyle]}>
        <View style={styles.checkmarkOuter}>
          <View style={styles.checkmarkInner}>
            <Svg
              width={moderateSize(50)}
              height={moderateSize(50)}
              viewBox="0 0 60 60"
            >
              <Path
                d="M15 30 L25 40 L45 20"
                stroke="white"
                strokeWidth="3"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </Svg>
          </View>
        </View>

        <AppText style={styles.successTitle}>{title}</AppText>
        <AppText style={styles.successSubtitle}>{message}</AppText>
      </Animated.View>
    </AppModal>
  );
};

const styles = StyleSheet.create({
  successCard: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: moderateSize(40),
  },
  checkmarkOuter: {
    width: moderateSize(120),
    height: moderateSize(120),
    borderRadius: moderateSize(60),
    backgroundColor: Colors.white,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: moderateSize(25),
  },
  checkmarkInner: {
    width: moderateSize(80),
    height: moderateSize(80),
    borderRadius: moderateSize(45),
    backgroundColor: Colors.success,
    justifyContent: "center",
    alignItems: "center",
  },
  successTitle: {
    fontFamily: Fonts.Bold,
    color: Colors.white,
    fontSize: moderateSize(18),
    marginBottom: moderateSize(12),
    textAlign: "center",
  },
  successSubtitle: {
    color: Colors.white,
    fontSize: moderateSize(12),
    fontFamily: Fonts.Medium,
    textAlign: "center",
  },
});
