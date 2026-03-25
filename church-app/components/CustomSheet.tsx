import React, { ReactNode } from "react";
import { Pressable, StyleSheet, View } from "react-native";

import Entypo from "@expo/vector-icons/Entypo";
import { BottomSheet } from "react-native-btr";

import { AppText } from "@/components/AppText";
import { Colors, Fonts, whiteOpacity } from "@/constants/theme";
import { moderateSize, Size } from "@/utils/useResponsiveStyle";

type CustomSheetProps = {
  visible: boolean;
  onClose: () => void;
  children: ReactNode;
  title?: string;
  height?: number;
  backgroundColor?: string;
  iconColor?: string;
  titleColor?: string;
  iconWrapperBackground?: string;
};

const CustomSheet: React.FC<CustomSheetProps> = ({
  visible,
  onClose,
  children,
  title,
  height,
  backgroundColor,
  titleColor,
  iconWrapperBackground,
  iconColor,
}) => {
  return (
    <BottomSheet
      visible={visible}
      onBackButtonPress={onClose}
      onBackdropPress={onClose}
    >
      <View
        style={[
          styles.container,
          {
            backgroundColor: backgroundColor ?? Colors.textInputGrey,
            height: height ?? Size.getHeight() * moderateSize(0.4),
          },
        ]}
      >
        <View style={styles.header}>
          <AppText style={[styles.title, { color: titleColor ?? undefined }]}>
            {title ?? "Options"}
          </AppText>

          <Pressable
            onPress={onClose}
            style={[
              styles.closeButton,
              { backgroundColor: iconWrapperBackground ?? whiteOpacity("0.2") },
            ]}
          >
            <Entypo
              name="chevron-down"
              size={moderateSize(18)}
              color={iconColor ?? Colors.white}
            />
          </Pressable>
        </View>
        {children}
      </View>
    </BottomSheet>
  );
};

export default CustomSheet;

const styles = StyleSheet.create({
  container: {
    width: Size.getWidth(),
    borderTopRightRadius: moderateSize(16),
    borderTopLeftRadius: moderateSize(16),
    borderWidth: moderateSize(0.5),
    borderColor: Colors.disabled,
  },
  header: {
    padding: moderateSize(15),
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomColor: Colors.disabled,
    borderBottomWidth: 0.2,
  },
  title: {
    fontFamily: Fonts.Bold,
    fontSize: moderateSize(14),
  },
  closeButton: {
    width: moderateSize(25),
    height: moderateSize(25),

    borderRadius: 100,
    justifyContent: "center",
    alignItems: "center",
  },
});
