import React, { useEffect } from "react";
import { StyleSheet } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";

import AppModal from "@/components/AppModal";
import { AppText } from "@/components/AppText";
import CustomButton from "@/components/Buttons/CustomButton";
import { Colors, Fonts } from "@/constants/theme";
import { moderateSize } from "@/utils/useResponsiveStyle";

interface SuccessModalProps {
  visible: boolean;
  onClose: () => void;
}

const SuccessModal = ({ visible, onClose }: SuccessModalProps) => {
  const scale = useSharedValue(0.9);
  const opacity = useSharedValue(0);

  useEffect(() => {
    if (visible) {
      scale.value = withSpring(1, { damping: 20, stiffness: 120 });
      opacity.value = withTiming(1, { duration: 250 });
    } else {
      scale.value = withTiming(0.9, { duration: 150 });
      opacity.value = withTiming(0, { duration: 150 });
    }
  }, [visible]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  return (
    <AppModal
      isModalVisible={visible}
      handleClose={onClose}
      height={moderateSize(350)}
    >
      <Animated.View style={[styles.container, animatedStyle]}>
        <AppText style={styles.title}>🎉 Congratulations!</AppText>

        <AppText style={styles.message}>
          You’ve started a rewarding journey of partnership and impact.
        </AppText>

        <AppText style={styles.subMessage}>
          Thank you for your commitment. We appreciate your generosity and look
          forward to walking this journey with you.
        </AppText>

        <CustomButton onPress={onClose} title="Done" />
      </Animated.View>
    </AppModal>
  );
};

export default SuccessModal;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderRadius: moderateSize(20),
    overflow: "hidden",
    justifyContent: "center",
    rowGap: 15,
  },
  gradient: {
    flex: 1,
    padding: moderateSize(25),
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    color: Colors.white,
    fontSize: moderateSize(18),
    fontFamily: Fonts.Bold,
    marginBottom: moderateSize(10),
    textAlign: "center",
  },
  message: {
    color: Colors.white,
    fontSize: moderateSize(14),
    fontFamily: Fonts.SemiBold,
    textAlign: "center",
    marginBottom: moderateSize(15),
  },
  subMessage: {
    color: "rgba(255,255,255,0.9)",
    fontSize: moderateSize(12),
    fontFamily: Fonts.Regular,
    textAlign: "center",
    marginBottom: moderateSize(30),
  },
  button: {
    backgroundColor: Colors.white,
    paddingVertical: moderateSize(12),
    paddingHorizontal: moderateSize(40),
    borderRadius: moderateSize(25),
  },
  buttonText: {
    color: Colors.primary,
    fontFamily: Fonts.Bold,
    fontSize: moderateSize(16),
  },
});
