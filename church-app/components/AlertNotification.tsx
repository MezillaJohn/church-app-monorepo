import React, { useEffect } from "react";
import {
  Animated,
  Dimensions,
  StyleSheet,
  TouchableOpacity,
} from "react-native";

import { AppText } from "@/components/AppText";
import { Colors, Fonts } from "@/constants/theme";
import { moderateSize } from "@/utils/useResponsiveStyle";

type Props = {
  text: string;
  direction?: "top" | "bottom" | "left" | "right";
  onClose: () => void;
  duration?: number; // how long it stays visible
};

const AlertNotification = ({
  text,
  direction = "top",
  onClose,
  duration = 3000,
}: Props) => {
  const slideAnim = React.useRef(new Animated.Value(-100)).current;

  const { width, height } = Dimensions.get("window");

  useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();

    // Auto slide out after duration
    const timer = setTimeout(() => {
      Animated.timing(slideAnim, {
        toValue: -100,
        duration: 300,
        useNativeDriver: true,
      }).start(() => onClose());
    }, duration);

    return () => clearTimeout(timer);
  }, []);

  const getTransformStyle = () => {
    switch (direction) {
      case "top":
        return { transform: [{ translateY: slideAnim }] };
      case "bottom":
        return {
          transform: [
            {
              translateY: slideAnim.interpolate({
                inputRange: [-100, 0],
                outputRange: [100, 0],
              }),
            },
          ],
        };
      case "left":
        return { transform: [{ translateX: slideAnim }] };
      case "right":
        return {
          transform: [
            {
              translateX: slideAnim.interpolate({
                inputRange: [-100, 0],
                outputRange: [100, 0],
              }),
            },
          ],
        };
      default:
        return { transform: [{ translateY: slideAnim }] };
    }
  };

  return (
    <Animated.View
      style={[
        styles.container,
        getTransformStyle(),
        directionStyles(direction, width, height),
      ]}
    >
      <TouchableOpacity
        style={{
          flexDirection: "row",
          alignItems: "flex-start",
          columnGap: 10,
        }}
        onPress={onClose}
      >
        <AppText style={styles.text}>{text}</AppText>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    paddingVertical: 8,
    paddingHorizontal: 20,
    paddingLeft: 30,
    backgroundColor: Colors.white,
    borderRadius: 8,
    zIndex: 9333999,
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    fontSize: moderateSize(12),
    color: Colors.dark,
    fontFamily: Fonts.SemiBold,
  },
});

const directionStyles = (direction: string, width: number, height: number) => {
  switch (direction) {
    case "top":
      return { top: 80, left: width * 0.1, right: width * 0.1 };
    case "bottom":
      return { bottom: 80, left: width * 0.1, right: width * 0.1 };
    case "left":
      return { top: height * 0.4, left: 20, width: width * 0.6 };
    case "right":
      return { top: height * 0.4, right: 20, width: width * 0.6 };
    default:
      return { top: 20, left: width * 0.1, right: width * 0.1 };
  }
};

export default AlertNotification;
