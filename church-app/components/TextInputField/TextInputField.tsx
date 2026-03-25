import React, { useState } from "react";
import {
  KeyboardTypeOptions,
  Pressable,
  StyleSheet,
  TextInput,
  TextStyle,
  View,
} from "react-native";
import InputFieldWrapper from "./InputFieldWrapper";

import { Colors, Fonts, whiteOpacity } from "@/constants/theme";
import { moderateSize, Size } from "@/utils/useResponsiveStyle";
import { FormikProps } from "formik";
import { AppText } from "../AppText";

interface Props {
  label?: string;
  inputKey: string;
  formikProps: FormikProps<any>;
  icon?: JSX.Element;
  text?: string;
  handleRightIconPress?: () => void;
  handleRightIconText?: () => void;
  textStyle?: TextStyle;
  secureTextEntry?: boolean;
  leftIcon?: JSX.Element;
  auth?: boolean;
  placeholder?: string;
  autoFocus?: boolean;
  keyboardType?: KeyboardTypeOptions;
  labelStyle?: TextStyle;
  inputStyle?: any;
  isRequired?: boolean;
  editable?: boolean;
  onPress?: () => void;
}

const TextInputField = ({
  label,
  inputKey,
  formikProps,
  icon,
  text,
  handleRightIconPress,
  handleRightIconText,
  textStyle,
  secureTextEntry,
  leftIcon,
  labelStyle,
  auth,
  inputStyle,
  isRequired,
  editable,
  onPress,
  ...others
}: Props) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <InputFieldWrapper
      isRequired={isRequired}
      labelStyle
      label={label}
      inputKey={inputKey}
      formikProps={formikProps}
    >
      <Pressable
        onPress={onPress}
        style={[
          styles.inputWrapper,
          styles.flexWrapper,
          {
            borderColor:
              formikProps.touched[inputKey] && formikProps.errors[inputKey]
                ? Colors.red
                : isFocused
                ? Colors.primary
                : Colors.disabled,
            borderWidth: moderateSize(0.5),
            backgroundColor: Colors.textInputGrey,
          },
        ]}
      >
        <Pressable>{leftIcon && leftIcon}</Pressable>
        <TextInput
          onPress={onPress}
          editable={editable}
          style={[styles.input, inputStyle, { color: Colors.white }]}
          onChangeText={formikProps.handleChange(inputKey)}
          onBlur={formikProps.handleBlur(inputKey)}
          secureTextEntry={secureTextEntry}
          placeholderTextColor={whiteOpacity("0.3")}
          onFocus={() => {
            setIsFocused(true);
          }}
          value={formikProps.values[inputKey]}
          {...others}
        />
        <View
          style={
            (styles.flexWrapper,
            { justifyContent: "flex-start", columnGap: moderateSize(8) })
          }
        >
          {text && (
            <Pressable onPress={handleRightIconText}>
              <AppText style={textStyle}>{text}</AppText>
            </Pressable>
          )}

          {icon && (
            <Pressable onPress={handleRightIconPress}>{icon && icon}</Pressable>
          )}
        </View>
      </Pressable>
    </InputFieldWrapper>
  );
};

export default TextInputField;

const styles = StyleSheet.create({
  inputWrapper: {
    borderWidth: moderateSize(0.3),
    height: moderateSize(48),
    paddingHorizontal: Size.calcWidth(10),
    borderRadius: moderateSize(7),
    columnGap: Size.calcWidth(10),
  },
  input: {
    height: "100%",
    fontFamily: Fonts.SemiBold,
    flex: 1,
    fontSize: moderateSize(13),
  },

  flexWrapper: {
    justifyContent: "space-between",
    alignItems: "center",
    columnGap: 4,
    flexDirection: "row",
  },
});
