import { Stack } from "expo-router";
import React from "react";
import "react-native-reanimated";

export default function AuthLayout() {
  return <Stack screenOptions={{ headerShown: false }} />;
}
