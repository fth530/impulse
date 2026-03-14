import { useCallback, useRef, useEffect } from "react";
import { Platform } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as StoreReview from "expo-store-review";

const RATING_KEY = "mathpulse_rating_data";

interface RatingData {
  sessionCount: number;
  hasHitPersonalBest: boolean;
  promptCount: number;
  firstInstallDate: string;
  lastPromptDate: string | null;
}

const DEFAULT_DATA: RatingData = {
  sessionCount: 0,
  hasHitPersonalBest: false,
  promptCount: 0,
  firstInstallDate: new Date().toISOString(),
  lastPromptDate: null,
};

/**
 * Rating prompt system based on ASO Playbook:
 * - Prompt 1: session >= 5 AND personal best hit AND app >= 7 days old
 * - Prompt 2: session >= 20 AND new rule mode completed
 * - Prompt 3: 30+ days user AND after update
 * - Max 3 prompts per year (Apple limit)
 * - NEVER on first 3 games or after a loss
 */
export function useRatingPrompt() {
  const data = useRef<RatingData>(DEFAULT_DATA);

  useEffect(() => {
    AsyncStorage.getItem(RATING_KEY)
      .then((val) => {
        if (val) {
          data.current = { ...DEFAULT_DATA, ...JSON.parse(val) };
        } else {
          save(DEFAULT_DATA);
        }
      })
      .catch(() => {});
  }, []);

  const save = (d: RatingData) => {
    data.current = d;
    AsyncStorage.setItem(RATING_KEY, JSON.stringify(d)).catch(() => {});
  };

  const trackSession = useCallback(() => {
    const next = { ...data.current, sessionCount: data.current.sessionCount + 1 };
    save(next);
  }, []);

  const trackPersonalBest = useCallback(() => {
    const next = { ...data.current, hasHitPersonalBest: true };
    save(next);
  }, []);

  const shouldPrompt = useCallback((): boolean => {
    if (Platform.OS === "web") return false;

    const d = data.current;

    // Max 3 prompts ever
    if (d.promptCount >= 3) return false;

    // Don't prompt more than once per 60 days
    if (d.lastPromptDate) {
      const daysSince = (Date.now() - new Date(d.lastPromptDate).getTime()) / (1000 * 60 * 60 * 24);
      if (daysSince < 60) return false;
    }

    // Prompt 1: session >= 5 AND personal best AND app >= 7 days old
    if (d.promptCount === 0) {
      const daysOld = (Date.now() - new Date(d.firstInstallDate).getTime()) / (1000 * 60 * 60 * 24);
      return d.sessionCount >= 5 && d.hasHitPersonalBest && daysOld >= 7;
    }

    // Prompt 2: session >= 20
    if (d.promptCount === 1) {
      return d.sessionCount >= 20;
    }

    // Prompt 3: session >= 50 (long-term user)
    if (d.promptCount === 2) {
      const daysOld = (Date.now() - new Date(d.firstInstallDate).getTime()) / (1000 * 60 * 60 * 24);
      return d.sessionCount >= 50 && daysOld >= 30;
    }

    return false;
  }, []);

  const requestReview = useCallback(async () => {
    try {
      const available = await StoreReview.isAvailableAsync();
      if (!available) return;

      await StoreReview.requestReview();

      const next = {
        ...data.current,
        promptCount: data.current.promptCount + 1,
        lastPromptDate: new Date().toISOString(),
      };
      save(next);
    } catch {}
  }, []);

  const checkAndPrompt = useCallback(async () => {
    if (shouldPrompt()) {
      // Small delay so it doesn't feel jarring
      setTimeout(() => requestReview(), 1500);
    }
  }, [shouldPrompt, requestReview]);

  return {
    trackSession,
    trackPersonalBest,
    checkAndPrompt,
  };
}
