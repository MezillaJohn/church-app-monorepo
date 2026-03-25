import AppNav from "@/appNav/AppNav";
import { AudioProvider } from "@/context/AudioContext";
import { AppAlertProvider } from "@/context/AlertContext";
import { AuthProvider } from "@/context/AuthContext";
import { NetworkProvider } from "@/context/NetworkContext";
import { NotificationProvider } from "@/context/Notification";
import { persistor, store } from "@/redux/store/store";
import {
  useFonts,
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
  Inter_800ExtraBold,
  Inter_900Black,
} from "@expo-google-fonts/inter";
import { Slot } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import React from "react";
import { useEffect } from "react";
import { StatusBar } from "react-native";
import { KeyboardProvider } from "react-native-keyboard-controller";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
    Inter_800ExtraBold,
    Inter_900Black,
  });

  // fake auth state (replace with secure storage or api check)

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) return null;


  return (
    <KeyboardProvider>
      <StatusBar barStyle="light-content" />
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <NetworkProvider>
            <AuthProvider>
              <AudioProvider>
                <AppAlertProvider>
                  <AppNav />
                  <Slot />
                </AppAlertProvider>
              </AudioProvider>
            </AuthProvider>
          </NetworkProvider>
        </PersistGate>
      </Provider>
    </KeyboardProvider>
  );
}
