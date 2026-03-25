import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  StyleProp,
  StyleSheet,
  TextInput,
  TextInputProps,
  View,
  ViewStyle,
} from "react-native";
import { Colors, Fonts, whiteOpacity } from "@/constants/theme";
import { moderateSize } from "@/utils/useResponsiveStyle";

interface FloatingInputProps extends TextInputProps {
  label: string;
  error?: string;
  containerStyle?: StyleProp<ViewStyle>;
}

export const FloatingInput: React.FC<FloatingInputProps> = ({
  label,
  error,
  value,
  containerStyle,
  onFocus,
  onBlur,
  ...rest
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const labelAnim = useRef(new Animated.Value(value ? 1 : 0)).current;

  const hasValue = !!value && value.length > 0;

  useEffect(() => {
    Animated.timing(labelAnim, {
      toValue: isFocused || hasValue ? 1 : 0,
      duration: 150,
      useNativeDriver: false,
    }).start();
  }, [isFocused, hasValue]);

  const labelTop = labelAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [moderateSize(14), moderateSize(6)],
  });

  const labelSize = labelAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [moderateSize(14), moderateSize(10)],
  });

  const borderColor = error
    ? Colors.error
    : isFocused
    ? Colors.borderFocused
    : whiteOpacity("0.08");

  return (
    <View style={containerStyle}>
      <View style={[styles.container, { borderColor }]}>
        <Animated.Text
          style={[
            styles.label,
            {
              top: labelTop,
              fontSize: labelSize,
              color: error
                ? Colors.error
                : isFocused
                ? Colors.primary
                : Colors.textMuted,
            },
          ]}
        >
          {label}
        </Animated.Text>
        <TextInput
          value={value}
          style={styles.input}
          placeholderTextColor={Colors.textDisabled}
          onFocus={(e) => {
            setIsFocused(true);
            onFocus?.(e);
          }}
          onBlur={(e) => {
            setIsFocused(false);
            onBlur?.(e);
          }}
          {...rest}
        />
      </View>
      {error && (
        <Animated.Text style={styles.errorText}>{error}</Animated.Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: whiteOpacity("0.04"),
    borderWidth: 1,
    borderRadius: 14,
    borderCurve: "continuous",
    paddingHorizontal: moderateSize(14),
    height: moderateSize(56),
    justifyContent: "center",
  },
  label: {
    position: "absolute",
    left: moderateSize(14),
    fontFamily: Fonts.Medium,
  },
  input: {
    color: Colors.text,
    fontFamily: Fonts.Regular,
    fontSize: moderateSize(14),
    paddingTop: moderateSize(12),
    height: "100%",
  },
  errorText: {
    color: Colors.error,
    fontFamily: Fonts.Medium,
    fontSize: moderateSize(11),
    marginTop: 4,
    marginLeft: 4,
  },
});
