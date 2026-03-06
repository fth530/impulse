import { useState, useEffect, useRef, useCallback } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Haptics from "expo-haptics";

export type GameState = "menu" | "playing" | "gameover";
export type RuleType = "even" | "odd" | "prime" | "gt10";
export type OpType = "+" | "-" | "×";

export interface Equation {
  a: number;
  b: number;
  op: OpType;
  result: number;
  display: string;
  equationKey: number;
}

const RULES: RuleType[] = ["even", "odd", "prime", "gt10"];
export const RULE_LABELS: Record<RuleType, string> = {
  even: "ÇİFT SAYI",
  odd: "TEK SAYI",
  prime: "ASAL SAYI",
  gt10: "10'DAN BÜYÜK",
};

const BASE_TIMER = 2500;
const TIMER_DECREASE = 50;
const MIN_TIMER = 800;
const BEST_SCORE_KEY = "tek_tus_best_score";

function isPrime(n: number): boolean {
  if (n < 2) return false;
  if (n === 2) return true;
  if (n % 2 === 0) return false;
  for (let i = 3; i * i <= n; i += 2) {
    if (n % i === 0) return false;
  }
  return true;
}

function checkRule(result: number, rule: RuleType): boolean {
  switch (rule) {
    case "even":
      return result > 0 && result % 2 === 0;
    case "odd":
      return result > 0 && result % 2 !== 0;
    case "prime":
      return isPrime(result);
    case "gt10":
      return result > 10;
  }
}

let eqCounter = 0;
function generateEquation(): Equation {
  const ops: OpType[] = ["+", "-", "×"];
  const op = ops[Math.floor(Math.random() * ops.length)];
  let a = Math.floor(Math.random() * 12) + 1;
  let b = Math.floor(Math.random() * 12) + 1;
  let result: number;

  if (op === "+") {
    result = a + b;
  } else if (op === "-") {
    if (a <= b) {
      const tmp = a;
      a = b + 1;
      b = tmp;
    }
    result = a - b;
    if (result <= 0) {
      a = b + 2;
      result = a - b;
    }
  } else {
    if (a > 6) a = Math.floor(Math.random() * 6) + 1;
    if (b > 6) b = Math.floor(Math.random() * 6) + 1;
    result = a * b;
  }

  eqCounter += 1;
  return { a, b, op, result, display: `${a} ${op} ${b}`, equationKey: eqCounter };
}

function getTimerDuration(score: number): number {
  return Math.max(MIN_TIMER, BASE_TIMER - score * TIMER_DECREASE);
}

export function useMathGame() {
  const [gameState, setGameState] = useState<GameState>("menu");
  const [displayScore, setDisplayScore] = useState(0);
  const [bestScore, setBestScore] = useState(0);
  const [isNewRecord, setIsNewRecord] = useState(false);
  const [equation, setEquation] = useState<Equation>(generateEquation());
  const [rule, setRule] = useState<RuleType>("even");
  const [ruleMatches, setRuleMatches] = useState(false);
  const [ruleFlash, setRuleFlash] = useState(false);
  const [timerDuration, setTimerDuration] = useState(BASE_TIMER);

  const g = useRef({
    score: 0,
    rule: "even" as RuleType,
    ruleMatches: false,
    turnsSinceRuleChange: 0,
    nextRuleChangeAt: 3,
    isPlaying: false,
    timer: null as ReturnType<typeof setTimeout> | null,
    flashTimer: null as ReturnType<typeof setTimeout> | null,
  });

  const setupNextTurnRef = useRef<(shouldChangeRule: boolean) => void>(() => {});
  const doGameOverRef = useRef<() => void>(() => {});

  useEffect(() => {
    AsyncStorage.getItem(BEST_SCORE_KEY).then((val) => {
      if (val) setBestScore(parseInt(val, 10));
    });
  }, []);

  const doGameOver = useCallback(async () => {
    if (g.current.timer) clearTimeout(g.current.timer);
    g.current.timer = null;
    g.current.isPlaying = false;
    const finalScore = g.current.score;
    const storedBest = await AsyncStorage.getItem(BEST_SCORE_KEY);
    const best = storedBest ? parseInt(storedBest, 10) : 0;
    let newRecord = false;
    if (finalScore > best) {
      await AsyncStorage.setItem(BEST_SCORE_KEY, String(finalScore));
      setBestScore(finalScore);
      newRecord = true;
    }
    setIsNewRecord(newRecord);
    setGameState("gameover");
  }, []);

  doGameOverRef.current = doGameOver;

  const setupNextTurn = useCallback((shouldChangeRule: boolean) => {
    if (!g.current.isPlaying) return;

    if (shouldChangeRule) {
      const available = RULES.filter((r) => r !== g.current.rule);
      g.current.rule = available[Math.floor(Math.random() * available.length)];
      g.current.turnsSinceRuleChange = 0;
      g.current.nextRuleChangeAt = Math.floor(Math.random() * 3) + 3;
      setRule(g.current.rule);
      setRuleFlash(true);
      if (g.current.flashTimer) clearTimeout(g.current.flashTimer);
      g.current.flashTimer = setTimeout(() => setRuleFlash(false), 700);
    }

    const eq = generateEquation();
    g.current.ruleMatches = checkRule(eq.result, g.current.rule);

    setEquation(eq);
    setRuleMatches(g.current.ruleMatches);

    const duration = getTimerDuration(g.current.score);
    setTimerDuration(duration);
    const capturedMatches = g.current.ruleMatches;

    g.current.timer = setTimeout(() => {
      if (!g.current.isPlaying) return;
      if (capturedMatches) {
        doGameOverRef.current();
      } else {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        g.current.score += 1;
        setDisplayScore(g.current.score);
        g.current.turnsSinceRuleChange += 1;
        const shouldChange =
          g.current.turnsSinceRuleChange >= g.current.nextRuleChangeAt;
        setupNextTurnRef.current(shouldChange);
      }
    }, duration);
  }, []);

  setupNextTurnRef.current = setupNextTurn;

  const startGame = useCallback(() => {
    if (g.current.timer) clearTimeout(g.current.timer);
    if (g.current.flashTimer) clearTimeout(g.current.flashTimer);

    g.current.score = 0;
    g.current.turnsSinceRuleChange = 0;
    g.current.nextRuleChangeAt = Math.floor(Math.random() * 3) + 3;
    g.current.rule = RULES[Math.floor(Math.random() * RULES.length)];
    g.current.isPlaying = true;

    setDisplayScore(0);
    setIsNewRecord(false);
    setRuleFlash(false);
    setRule(g.current.rule);
    setGameState("playing");

    setupNextTurnRef.current(false);
  }, []);

  const handleTap = useCallback(() => {
    if (!g.current.isPlaying) return;

    if (g.current.ruleMatches) {
      if (g.current.timer) clearTimeout(g.current.timer);
      g.current.timer = null;
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      g.current.score += 1;
      setDisplayScore(g.current.score);
      g.current.turnsSinceRuleChange += 1;
      const shouldChange =
        g.current.turnsSinceRuleChange >= g.current.nextRuleChangeAt;
      setupNextTurnRef.current(shouldChange);
    } else {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      doGameOverRef.current();
    }
  }, []);

  const goToMenu = useCallback(() => {
    if (g.current.timer) clearTimeout(g.current.timer);
    if (g.current.flashTimer) clearTimeout(g.current.flashTimer);
    g.current.timer = null;
    g.current.isPlaying = false;
    setGameState("menu");
  }, []);

  return {
    gameState,
    score: displayScore,
    bestScore,
    isNewRecord,
    equation,
    rule,
    ruleLabel: RULE_LABELS[rule],
    ruleMatches,
    ruleFlash,
    timerDuration,
    startGame,
    handleTap,
    goToMenu,
  };
}
