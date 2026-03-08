import { useState, useEffect, useCallback } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const SETTINGS_KEY = "tek_tus_settings";

export interface AppSettings {
  hapticEnabled: boolean;
  soundEnabled: boolean;
}

const DEFAULT_SETTINGS: AppSettings = {
  hapticEnabled: true,
  soundEnabled: true,
};

export function useSettings() {
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS);

  useEffect(() => {
    AsyncStorage.getItem(SETTINGS_KEY).then((val) => {
      if (val) setSettings({ ...DEFAULT_SETTINGS, ...JSON.parse(val) });
    });
  }, []);

  const updateSetting = useCallback(
    async <K extends keyof AppSettings>(key: K, value: AppSettings[K]) => {
      const next = { ...settings, [key]: value };
      setSettings(next);
      await AsyncStorage.setItem(SETTINGS_KEY, JSON.stringify(next));
    },
    [settings],
  );

  return { settings, updateSetting };
}
