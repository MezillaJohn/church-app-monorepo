import { Stack } from "expo-router";
import React from "react";

export default function LibraryLayout() {
  return (
    <Stack>
      <Stack.Screen options={{ headerShown: false }} name="index" />
      <Stack.Screen options={{ headerShown: false }} name="favourite" />
      <Stack.Screen options={{ headerShown: false }} name="downloads" />
      <Stack.Screen options={{ headerShown: false }} name="updateProfile" />
      <Stack.Screen options={{ headerShown: false }} name="changePassword" />
      <Stack.Screen options={{ headerShown: false }} name="deleteAccont" />
    </Stack>
  );
}
