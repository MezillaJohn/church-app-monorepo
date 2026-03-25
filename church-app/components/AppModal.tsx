import { Colors } from "@/constants/theme";
import { Size, moderateSize } from "@/utils/useResponsiveStyle";
import React, { useEffect } from "react";
import { Modal, Pressable, StyleSheet, ViewStyle } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";

interface Props {
  isModalVisible: boolean;
  handleClose: () => void;
  children: React.ReactNode;
  width?: number;
  fromUpdate?: boolean;
  height?: number;
  backgroundColor?: string;
  innerStyles?: ViewStyle;
}

const AppModal = ({
  backgroundColor,
  isModalVisible,
  handleClose,
  children,
  fromUpdate,
  height,
  innerStyles,
}: Props) => {
  const scale = useSharedValue(0.9);
  const opacity = useSharedValue(0);
  const backdrop = useSharedValue(0);

  useEffect(() => {
    if (isModalVisible) {
      scale.value = withSpring(1, { damping: 20, stiffness: 120 });
      opacity.value = withTiming(1, { duration: 250 });
      backdrop.value = withTiming(0.8, { duration: 250 });
    } else {
      scale.value = withTiming(0.9, { duration: 150 });
      opacity.value = withTiming(0, { duration: 150 });
      backdrop.value = withTiming(0, { duration: 150 });
    }
  }, [isModalVisible]);

  const modalStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  const backdropStyle = useAnimatedStyle(() => ({
    backgroundColor: `rgba(0, 0, 0, ${backdrop.value})`,
  }));

  return (
    <Modal
      transparent
      visible={isModalVisible}
      animationType="none"
      onRequestClose={handleClose}
    >
      <Animated.View style={[styles.overlay, backdropStyle]}>
        <Pressable style={StyleSheet.absoluteFill} onPress={handleClose} />
        <Animated.View
          style={[
            styles.modal,
            {
              width: Size.getWidth() * 0.9,
              height: fromUpdate
                ? moderateSize(460)
                : height ?? moderateSize(250),
              backgroundColor: backgroundColor ?? Colors.textInputGrey,
            },
            modalStyle,
          ]}
        >
          <Pressable
            style={[styles.inner, innerStyles]}
            onPress={(e) => e.stopPropagation()}
          >
            {children}
          </Pressable>
        </Animated.View>
      </Animated.View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modal: {
    borderRadius: moderateSize(20),
    elevation: 8,
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  inner: {
    flex: 1,
    padding: moderateSize(20),
  },
});

export default AppModal;
