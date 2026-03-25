import { Colors, Fonts } from "@/constants/theme";
import { moderateSize, Size } from "@/utils/useResponsiveStyle";
import React from "react";
import { View } from "react-native";
import { AppText } from "../AppText";

const InputFieldWrapper = ({
  children,
  label,
  formikProps,
  inputKey,
  labelStyle,
  isRequired,
}: any) => {
  return (
    <View>
      <View>
        {label && (
          <AppText
            type="default"
            style={[
              {
                marginBottom: Size.calcHeight(8),
                color: Colors.white,
                fontFamily: Fonts.Medium,
                fontSize: moderateSize(12),
              },
            ]}
          >
            {label}
          </AppText>
        )}
      </View>
      {children}
      <AppText
        style={{
          fontSize: moderateSize(12),
          color: Colors.red,
          marginTop: moderateSize(2),
          marginBottom: Size.calcHeight(2),
        }}
      >
        {formikProps.touched[inputKey] && formikProps.errors[inputKey]}
      </AppText>
    </View>
  );
};

export default InputFieldWrapper;
