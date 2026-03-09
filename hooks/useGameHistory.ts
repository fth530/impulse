import { useState, useEffect, useCallback } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const HISTORY_KEY = "tek_tus_game_history";
const MAX_HISTORY = 20;

export interface GameRecord {
  score: number;
  date: string; // ISO string
  durationMs: number;
  correctCount: number;
  wrongCount: number;
  maxStreak: number;
  maxDifficulty: number; // 1-4
}

export interface GameStats {
  totalGames: number;
  averageScore: number;
  bestScore: number;
  longestStreak: number;
  totalCorrect: number;
  totalWrong: number;
}

export function useGameHistory() {
  const [history, setHistory] = useState<GameRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    AsyncStorage.getItem(HISTORY_KEY)
      .then((val) => {
        if (val) setHistory(JSON.parse(val));
      })
      .catch(() => { })
      .finally(() => setLoading(false));
  }, []);

  const addRecord = useCallback((record: GameRecord) => {
    setHistory((currentHistory) => {
      const newList = [record, ...currentHistory].slice(0, MAX_HISTORY);
      // Fire and forget to storage
      AsyncStorage.setItem(HISTORY_KEY, JSON.stringify(newList)).catch(() => { });
      return newList;
    });
  }, []);

  const clearHistory = useCallback(async () => {
    await AsyncStorage.removeItem(HISTORY_KEY);
    setHistory([]);
  }, []);

  const stats: GameStats = {
    totalGames: history.length,
    averageScore:
      history.length > 0
        ? Math.round(history.reduce((s, r) => s + r.score, 0) / history.length)
        : 0,
    bestScore:
      history.length > 0 ? Math.max(...history.map((r) => r.score)) : 0,
    longestStreak:
      history.length > 0 ? Math.max(...history.map((r) => r.maxStreak)) : 0,
    totalCorrect: history.reduce((s, r) => s + r.correctCount, 0),
    totalWrong: history.reduce((s, r) => s + r.wrongCount, 0),
  };

  const last5 = history.slice(0, 5).reverse();

  return { history, stats, last5, loading, addRecord, clearHistory };
}
