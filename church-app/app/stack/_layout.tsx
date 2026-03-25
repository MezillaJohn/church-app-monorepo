import { useAuth } from "@/context/AuthContext";
import { Redirect, Stack, usePathname } from "expo-router";
import React from "react";
import { useMMKVString } from "react-native-mmkv";

export default function StackLayout() {
  const { authToken } = useAuth();
  const pathname = usePathname();
  const [, setRedirectAfterLogin] = useMMKVString("redirectAfterLogin");

  if (!authToken) {
    // Store the intended destination for after login
    setRedirectAfterLogin(pathname);
    return <Redirect href="/(auth)" />;
  }


  return (
    <Stack>
      <Stack.Screen options={{ headerShown: false }} name="allVideoSermon" />
      <Stack.Screen options={{ headerShown: false }} name="allAudioSermons" />
      <Stack.Screen options={{ headerShown: false }} name="audioPlay" />
      <Stack.Screen options={{ headerShown: false }} name="event" />
      <Stack.Screen
        options={{ headerShown: false }}
        name="videoDetailsScreen"
      />
      <Stack.Screen options={{ headerShown: false }} name="partnership" />
      <Stack.Screen options={{ headerShown: false }} name="events" />
      <Stack.Screen options={{ headerShown: false }} name="eventDetails" />
      <Stack.Screen options={{ headerShown: false }} name="updateProfile" />
      <Stack.Screen options={{ headerShown: false }} name="changePassword" />
      <Stack.Screen options={{ headerShown: false }} name="paymentPage" />
      <Stack.Screen options={{ headerShown: false }} name="readPdf" />
      <Stack.Screen options={{ headerShown: false }} name="favourite" />
      <Stack.Screen options={{ headerShown: false }} name="download" />
      <Stack.Screen options={{ headerShown: false }} name="notification" />
      <Stack.Screen options={{ headerShown: false }} name="notificationDetails" />
      <Stack.Screen options={{ headerShown: false }} name="bookDetails" />
      <Stack.Screen options={{ headerShown: false }} name="giving" />
      <Stack.Screen options={{ headerShown: false }} name="givingHistory" />
      <Stack.Screen options={{ headerShown: false }} name="books" />
    </Stack>
  );
}
