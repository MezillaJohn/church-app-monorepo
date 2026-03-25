import { Colors, Fonts } from "@/constants/theme";
import { moderateSize } from "@/utils/useResponsiveStyle";
import { LinearGradient } from "expo-linear-gradient";
import React, { useRef } from "react";
import {
  ActivityIndicator,
  Animated,
  Pressable,
  View,
  ViewStyle,
} from "react-native";
import { AppText } from "../AppText";

interface CustomButtonProps {
  title: string;
  onPress?: () => void;
  disabled?: boolean;
  processing?: boolean;
  outlined?: boolean;
  icon?: React.ReactNode;
  style?: ViewStyle;
  gradientColors?: string[];
}

const CustomButton: React.FC<CustomButtonProps> = ({
  title,
  onPress,
  disabled,
  processing,
  outlined,
  icon,
  style,
  gradientColors = ["#00D9A6", "#00C49A", "#00B894"],
}) => {
  const isDisabled = disabled || processing;
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.96,
      useNativeDriver: true,
      speed: 30,
      bounciness: 8,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      speed: 20,
      bounciness: 6,
    }).start();
  };

  return (
    <Animated.View
      style={[
        {
          transform: [{ scale: scaleAnim }],
          shadowColor: Colors.primary,
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.25,
          shadowRadius: 6,
          elevation: 4,
          borderRadius: moderateSize(14),
          borderCurve: "continuous",
          overflow: "hidden",
          opacity: isDisabled ? 0.5 : 1,
        },
        style,
      ]}
    >
      <Pressable
        onPress={onPress}
        disabled={isDisabled}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={{
          alignSelf: "stretch",
          height: moderateSize(48),
          borderRadius: moderateSize(14),
          borderCurve: "continuous",
          overflow: "hidden",
        }}
      >
        {outlined ? (
          <View
            style={{
              borderWidth: 2,
              borderColor: Colors.primary,
              height: "100%",
              borderRadius: moderateSize(14),
              borderCurve: "continuous",
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "row",
              columnGap: moderateSize(8),
              backgroundColor: "transparent",
            }}
          >
            {icon}
            {processing ? (
              <ActivityIndicator color={Colors.white} />
            ) : (
              <AppText
                style={{
                  color: Colors.white,
                  fontFamily: Fonts.SemiBold,
                  fontSize: moderateSize(14),
                  lineHeight: 35,
                }}
              >
                {title}
              </AppText>
            )}
          </View>
        ) : (
          <LinearGradient
            colors={gradientColors}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{
              flex: 1,
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "row",
              columnGap: moderateSize(8),
              borderRadius: moderateSize(14),
              borderCurve: "continuous",
            }}
          >
            {icon}
            {processing ? (
              <ActivityIndicator color={Colors.black} />
            ) : (
              <AppText
                style={{
                  color: Colors.black,
                  fontFamily: Fonts.SemiBold,
                  fontSize: moderateSize(14),
                  letterSpacing: 0.3,
                  lineHeight: 35,
                }}
              >
                {title}
              </AppText>
            )}
          </LinearGradient>
        )}
      </Pressable>
    </Animated.View>
  );
};

export default CustomButton;
