import LogoSvg from "@/assets/svg/LogoSvg";
import { moderateSize } from "@/utils/useResponsiveStyle";
import React from "react";
import { View } from "react-native";
import { AppText } from "../AppText";

const Logo = () => {
  return (
    <View style={{ flexDirection: "row", alignItems: "center", gap: 5 }}>
      <LogoSvg />
      <View>
        <AppText
          type="default"
          style={{
            lineHeight: moderateSize(10) * 1.25,
            fontSize: moderateSize(10),
          }}
        >
          The
        </AppText>

        <AppText
          type="default"
          style={{
            lineHeight: moderateSize(10) * 1.25,
            fontSize: moderateSize(10),
          }}
        >
          GodHouse
        </AppText>

        <AppText
          type="default"
          style={{
            lineHeight: moderateSize(10) * 1.25,
            fontSize: moderateSize(10),
          }}
        >
          Center
        </AppText>
      </View>
    </View>
  );
};

export default Logo;
