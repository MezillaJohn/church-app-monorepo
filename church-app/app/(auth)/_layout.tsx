import { Stack } from "expo-router";
import React from "react";
import { StatusBar } from "react-native";
import "react-native-reanimated";

export default function AuthLayout() {
  return (
    <>
      <StatusBar barStyle="light-content" />
      <Stack screenOptions={{ headerShown: false }} />
    </>
  );
}
