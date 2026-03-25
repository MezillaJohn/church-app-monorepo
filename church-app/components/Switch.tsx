import { Colors } from "@/constants/theme";
import React, { memo } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { moderateSize } from "../utils/useResponsiveStyle";

interface Props {
  handleToogleMode?: () => void;
  isOn: boolean | undefined;
  disabled?: boolean;
}

const Switch = ({ handleToogleMode, isOn, disabled }: Props) => {
  return (
    <TouchableOpacity
      disabled={disabled}
      style={[
        styles.outer,
        isOn
          ? { justifyContent: "flex-end", backgroundColor: Colors.primary }
          : {
              justifyContent: "flex-start",
              backgroundColor: Colors.black,
            },
      ]}
      activeOpacity={1}
      onPress={handleToogleMode}
    >
      <View style={[styles.inner]} />
    </TouchableOpacity>
  );
};

export default memo(Switch, (prevProps, nextProps) => {
  return prevProps.isOn === nextProps.isOn;
});

const styles = StyleSheet.create({
  inner: {
    width: moderateSize(17),
    height: moderateSize(17),
    backgroundColor: Colors.white,
    borderRadius: 15,
    // ...SHADOWS.medium,
  },

  outer: {
    width: moderateSize(40),
    height: moderateSize(23),
    borderRadius: 15,
    alignItems: "center",
    flexDirection: "row",
    paddingHorizontal: 2,
  },
});
