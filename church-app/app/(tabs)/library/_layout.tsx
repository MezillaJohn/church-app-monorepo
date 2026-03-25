import { Stack } from "expo-router";
import React from "react";

export default function LibraryLayout() {
  return (
    <Stack>
      <Stack.Screen options={{ headerShown: false }} name="index" />
      {/* Book list screen */}
      <Stack.Screen options={{ headerShown: false }} name="bookDetails" />
      <Stack.Screen options={{ headerShown: false }} name="readPdf" />
      {/* Details screen */}
    </Stack>
  );
}
