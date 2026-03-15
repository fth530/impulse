import { useState, useEffect, useCallback } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const DAILY_KEY = "mathpulse_daily_challenge";

interface DailyData {
  lastPlayedDate: string; // YYYY-MM-DD
  dailyBestScore: number;
  currentDayStreak: number; // consecutive days played
  longestDayStreak: number;
  totalDaysPlayed: number;
}

const DEFAULT: DailyData = {
  lastPlayedDate: "",
  dailyBestScore: 0,
  currentDayStreak: 0,
  longestDayStreak: 0,
  totalDaysPlayed: 0,
};

function getTodayStr(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function getYesterdayStr(): string {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

export function useDailyChallenge() {
  const [data, setData] = useState<DailyData>(DEFAULT);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(DAILY_KEY)
      .then((val) => {
        if (val) setData({ ...DEFAULT, ...JSON.parse(val) });
      })
      .catch(() => {})
      .finally(() => setIsReady(true));
  }, []);

  const save = useCallback((d: DailyData) => {
    setData(d);
    AsyncStorage.setItem(DAILY_KEY, JSON.stringify(d)).catch(() => {});
  }, []);

  const today = getTodayStr();
  const hasPlayedToday = data.lastPlayedDate === today;

  const recordDailyScore = useCallback(
    (score: number) => {
      const todayStr = getTodayStr();
      const yesterdayStr = getYesterdayStr();

      let nextStreak = data.currentDayStreak;
      let nextTotal = data.totalDaysPlayed;

      // If first play today
      if (data.lastPlayedDate !== todayStr) {
        // Check if played yesterday (consecutive)
        if (data.lastPlayedDate === yesterdayStr) {
          nextStreak = data.currentDayStreak + 1;
        } else {
          nextStreak = 1; // streak broken
        }
        nextTotal = data.totalDaysPlayed + 1;
      }

      const nextBest =
        data.lastPlayedDate === todayStr
          ? Math.max(data.dailyBestScore, score)
          : score; // reset daily best if new day

      const next: DailyData = {
        lastPlayedDate: todayStr,
        dailyBestScore: nextBest,
        currentDayStreak: nextStreak,
        longestDayStreak: Math.max(data.longestDayStreak, nextStreak),
        totalDaysPlayed: nextTotal,
      };

      save(next);
      return next;
    },
    [data, save],
  );

  return {
    isReady,
    hasPlayedToday,
    dailyBestScore: data.dailyBestScore,
    currentDayStreak: data.currentDayStreak,
    longestDayStreak: data.longestDayStreak,
    totalDaysPlayed: data.totalDaysPlayed,
    recordDailyScore,
  };
}
