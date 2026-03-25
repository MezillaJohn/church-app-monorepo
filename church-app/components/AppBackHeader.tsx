import { AppText } from "@/components/AppText";
import { Colors } from "@/constants/theme";
import { moderateSize } from "@/utils/useResponsiveStyle";
import { router } from "expo-router";
import { ChevronLeft } from "lucide-react-native";
import React from "react";
import { Pressable, View, ViewStyle } from "react-native";

const AppBackHeader = ({
  text,
  style,
}: {
  text: string;
  style?: ViewStyle;
}) => {
  return (
    <View
      style={[{ flexDirection: "row", alignItems: "center", gap: 15 }, style]}
    >
      <Pressable style={{ padding: 5 }} onPress={() => router.canGoBack() ? router.back() : router.replace("/(tabs)")}>
        <ChevronLeft color={Colors.white} size={moderateSize(25)} />
      </Pressable>
      <AppText style={{ fontSize: moderateSize(14), color: Colors.white }}>
        {text}
      </AppText>
    </View>
  );
};

export default AppBackHeader;
