import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
  useFonts,
} from "@expo-google-fonts/inter";
import { QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import React, { useEffect, useState } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { LanguageProvider } from "@/i18n/LanguageContext";
import { LanguageSelector } from "@/components/LanguageSelector";
import { queryClient } from "@/lib/query-client";

const ONBOARDING_KEY = "tek_tus_onboarding_done";

SplashScreen.preventAutoHideAsync();

function RootLayoutNav() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen
        name="stats"
        options={{
          headerShown: false,
          animation: "slide_from_right",
        }}
      />
      <Stack.Screen
        name="settings"
        options={{
          headerShown: false,
          animation: "slide_from_right",
        }}
      />
      <Stack.Screen name="+not-found" />
    </Stack>
  );
}

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
  });

  const [showOnboarding, setShowOnboarding] = useState<boolean | null>(null);

  useEffect(() => {
    AsyncStorage.getItem(ONBOARDING_KEY)
      .then((val) => setShowOnboarding(val !== "true"))
      .catch(() => setShowOnboarding(true));
  }, []);

  useEffect(() => {
    if ((fontsLoaded || fontError) && showOnboarding !== null) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError, showOnboarding]);

  if (!fontsLoaded && !fontError) return null;
  if (showOnboarding === null) return null;

  const handleOnboardingComplete = () => {
    AsyncStorage.setItem(ONBOARDING_KEY, "true").catch(() => {});
    setShowOnboarding(false);
  };

  return (
    <ErrorBoundary>
      <LanguageProvider>
        <QueryClientProvider client={queryClient}>
          <GestureHandlerRootView style={{ flex: 1 }}>
            {showOnboarding ? (
              <LanguageSelector onComplete={handleOnboardingComplete} />
            ) : (
              <RootLayoutNav />
            )}
          </GestureHandlerRootView>
        </QueryClientProvider>
      </LanguageProvider>
    </ErrorBoundary>
  );
}
