import React from "react";
import { Pressable, StyleProp, StyleSheet, View, ViewStyle } from "react-native";
import { useRouter } from "expo-router";
import { ChevronLeft } from "lucide-react-native";
import { Text } from "@/components/global/typography/Text";
import { Colors, whiteOpacity } from "@/constants/theme";
import { moderateSize } from "@/utils/useResponsiveStyle";

interface ScreenHeaderProps {
  title: string;
  showBack?: boolean;
  rightAction?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}

export const ScreenHeader: React.FC<ScreenHeaderProps> = ({
  title,
  showBack = false,
  rightAction,
  style,
}) => {
  const router = useRouter();

  return (
    <View style={[styles.container, style]}>
      {showBack ? (
        <Pressable
          onPress={() => router.back()}
          style={styles.backButton}
          hitSlop={8}
        >
          <ChevronLeft size={moderateSize(24)} color={Colors.text} strokeWidth={1.8} />
        </Pressable>
      ) : (
        <View style={styles.placeholder} />
      )}
      <Text variant="heading3">{title}</Text>
      {rightAction ? (
        <View style={styles.rightAction}>{rightAction}</View>
      ) : (
        <View style={styles.placeholder} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: moderateSize(20),
    paddingVertical: moderateSize(12),
  },
  backButton: {
    width: moderateSize(36),
    height: moderateSize(36),
    borderRadius: moderateSize(18),
    backgroundColor: whiteOpacity("0.06"),
    borderWidth: 1,
    borderColor: whiteOpacity("0.08"),
    alignItems: "center",
    justifyContent: "center",
  },
  placeholder: {
    width: moderateSize(36),
  },
  rightAction: {
    minWidth: moderateSize(36),
    alignItems: "flex-end",
  },
});
