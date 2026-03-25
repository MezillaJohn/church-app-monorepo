import { Stack } from "expo-router";
import React from "react";

export default function CommunityLayout() {
  return (
    <Stack>
      <Stack.Screen options={{ headerShown: false }} name="index" />
    </Stack>
  );
}
