import { TextInput, KeyboardTypeOptions } from "react-native";
import React from "react";

import styles from "./text-input-style";

interface Input {
  value?: string;
  onChangeText: (value: string) => void;
  placeholder: string;
  keyboardType?: KeyboardTypeOptions;
  secureTextEntry?: boolean;
  defaultValue?: string;
  onFocus?: () => void;
  autoFocus?: boolean;
  onBlur?: () => void;
  style?: any;
}

const InputField = ({
  value,
  onChangeText,
  placeholder,
  keyboardType,
  defaultValue,
  onFocus,
  autoFocus,
  onBlur,
  style,
}: Input) => {
  return (
    <TextInput
      onBlur={onBlur}
      autoFocus={autoFocus}
      onFocus={onFocus}
      style={{ ...styles.input, height: "100%" }}
      value={value}
      onChangeText={onChangeText}
      placeholderTextColor="#bbb"
      placeholder={placeholder}
      keyboardType={keyboardType}
      defaultValue={defaultValue}
    />
  );
};

export default InputField;
