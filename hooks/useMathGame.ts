import { useState, useEffect, useRef, useCallback } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Haptics from "expo-haptics";

export type GameState = "menu" | "playing" | "gameover";
export type OpType = "+" | "-" | "×" | "÷";

export interface Equation {
  a: number;
  b: number;
  op: OpType;
  result: number;
  display: string;
  equationKey: number;
}

export interface Rule {
  id: string;
  label: string;
}

const BASE_TIMER = 2500; // ms
const TIMER_DECREASE = 40; // a bit gentler to survive higher bounds
const MIN_TIMER = 700; // ms floor
const BEST_SCORE_KEY = "tek_tus_best_score";

// ─── Rule Evaluators ─────────────────────────────────────────────────────────

export function isEven(n: number): boolean {
  return Number.isInteger(n) && n >= 2 && n % 2 === 0;
}

export function isOdd(n: number): boolean {
  return Number.isInteger(n) && n >= 1 && n % 2 !== 0;
}

export function isPrime(n: number): boolean {
  if (!Number.isInteger(n) || n < 2) return false;
  if (n === 2) return true;
  if (n % 2 === 0) return false;
  for (let i = 3; i * i <= n; i += 2) {
    if (n % i === 0) return false;
  }
  return true;
}

export function isGreaterThan(n: number, limit: number): boolean {
  return Number.isInteger(n) && n > limit;
}

export function isLessThan(n: number, limit: number): boolean {
  return Number.isInteger(n) && n < limit;
}

export function checkRule(result: number, rule: Rule): boolean {
  if (rule.id === "even") return isEven(result);
  if (rule.id === "odd") return isOdd(result);
  if (rule.id === "prime") return isPrime(result);
  if (rule.id.startsWith("gt_")) return isGreaterThan(result, parseInt(rule.id.split("_")[1], 10));
  if (rule.id.startsWith("lt_")) return isLessThan(result, parseInt(rule.id.split("_")[1], 10));
  if (rule.id === "ends_5") return result % 10 === 5;
  if (rule.id === "ends_0") return result % 10 === 0 && result !== 0;
  if (rule.id === "mod_3") return result > 0 && result % 3 === 0;
  return false;
}

export function generateDynamicRule(score: number, currentRuleId?: string): Rule {
  const possibleRules: (() => Rule)[] = [
    () => ({ id: "even", label: "ÇİFT SAYI" }),
    () => ({ id: "odd", label: "TEK SAYI" }),
  ];

  if (score > 10) {
    possibleRules.push(
      () => ({ id: "prime", label: "ASAL SAYI" }),
      () => {
        const limits = [10, 20, 25];
        const l = limits[Math.floor(Math.random() * limits.length)];
        return { id: `gt_${l}`, label: `${l}'DAN BÜYÜK` };
      },
      () => {
        const limits = [15, 20, 30];
        const l = limits[Math.floor(Math.random() * limits.length)];
        return { id: `lt_${l}`, label: `${l}'DEN KÜÇÜK` };
      }
    );
  }

  if (score > 30) {
    possibleRules.push(
      () => ({ id: "ends_5", label: "SONU 5 İLE BİTEN" }),
      () => ({ id: "ends_0", label: "SONU 0 İLE BİTEN" }),
      () => ({ id: "mod_3", label: "3'ÜN KATI" })
    );
  }

  // Prevent selecting the exact same rule id consecutively
  let maxRetries = 5;
  while (maxRetries > 0) {
    const fn = possibleRules[Math.floor(Math.random() * possibleRules.length)];
    const newRule = fn();
    if (newRule.id !== currentRuleId) return newRule;
    maxRetries--;
  }

  return possibleRules[0]();
}

// ─── Equation Generator ───────────────────────────────────────────────────────

let eqCounter = 0;

function rand(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function generateEquation(score: number): Equation {
  eqCounter += 1;

  if (score > 60) {
    // Level 4: Includes division and parentheses
    const types = ["basic", "div", "parens"];
    const type = types[rand(0, types.length - 1)];

    if (type === "div") {
      const result = rand(2, 9);
      const b = rand(2, 9);
      const a = result * b;
      return {
        a, b, op: "÷", result, display: `${a} ÷ ${b}`, equationKey: eqCounter
      };
    } else if (type === "parens") {
      const a = rand(1, 5);
      const b = rand(1, 5);
      const c = rand(2, 4);
      return {
        a: a + b, b: c, op: "×", result: (a + b) * c, display: `(${a} + ${b}) × ${c}`, equationKey: eqCounter
      };
    }
    // "basic" falls through to Level 3 math
  }

  // Flow down to lower levels based on score
  const ops: OpType[] = ["+", "-"];
  if (score >= 15) ops.push("×");

  const op = ops[rand(0, ops.length - 1)];

  if (op === "+") {
    let a, b;
    if (score <= 15) { a = rand(1, 9); b = rand(1, 9); }
    else if (score <= 35) { a = rand(5, 15); b = rand(5, 15); }
    else { a = rand(10, 25); b = rand(10, 25); }
    return { a, b, op, result: a + b, display: `${a} + ${b}`, equationKey: eqCounter };
  } else if (op === "-") {
    let diff, b;
    if (score <= 15) { diff = rand(1, 9); b = rand(1, 9); }
    else if (score <= 35) { diff = rand(1, 15); b = rand(5, 15); }
    else { diff = rand(5, 20); b = rand(10, 25); }
    const a = b + diff;
    return { a, b, op, result: diff, display: `${a} - ${b}`, equationKey: eqCounter };
  } else { // "×"
    let a, b;
    if (score <= 35) { a = rand(2, 9); b = rand(2, 9); }
    else { a = rand(5, 12); b = rand(3, 9); }
    return { a, b, op, result: a * b, display: `${a} × ${b}`, equationKey: eqCounter };
  }
}

function getTimerDuration(score: number): number {
  return Math.max(MIN_TIMER, BASE_TIMER - score * TIMER_DECREASE);
}

// ─── Internal Ref Shape ───────────────────────────────────────────────────────

interface GameRef {
  score: number;
  rule: Rule;
  ruleMatches: boolean;
  turnsSinceRuleChange: number;
  nextRuleChangeAt: number;
  isPlaying: boolean;
  tapLocked: boolean;
  turnId: number;
  timer: ReturnType<typeof setTimeout> | null;
  flashTimer: ReturnType<typeof setTimeout> | null;
  // New tracking fields
  correctCount: number;
  wrongCount: number;
  currentStreak: number;
  maxStreak: number;
  startTime: number;
}

// ─── Hook ────────────────────────────────────────────────────────────────────

export function getDifficultyLevel(score: number): number {
  if (score > 60) return 4;
  if (score >= 15) return 3;
  if (score > 10) return 2;
  return 1;
}

export function getDifficultyLabel(level: number): string {
  switch (level) {
    case 1: return "BAŞLANGIÇ";
    case 2: return "ORTA";
    case 3: return "ZOR";
    case 4: return "UZMAN";
    default: return "BAŞLANGIÇ";
  }
}

export interface GameEndData {
  score: number;
  correctCount: number;
  wrongCount: number;
  maxStreak: number;
  durationMs: number;
  maxDifficulty: number;
}

export function useMathGame() {
  const [gameState, setGameState] = useState<GameState>("menu");
  const [displayScore, setDisplayScore] = useState(0);
  const [bestScore, setBestScore] = useState(0);
  const [isNewRecord, setIsNewRecord] = useState(false);
  const [equation, setEquation] = useState<Equation>(generateEquation(0));
  const [currentStreak, setCurrentStreak] = useState(0);
  const [gameEndData, setGameEndData] = useState<GameEndData | null>(null);

  const initialRule = { id: "even", label: "ÇİFT SAYI" };
  const [rule, setRule] = useState<Rule>(initialRule);
  const [ruleMatches, setRuleMatches] = useState(false);
  const [ruleFlash, setRuleFlash] = useState(false);
  const [timerDuration, setTimerDuration] = useState(BASE_TIMER);

  const g = useRef<GameRef>({
    score: 0,
    rule: initialRule,
    ruleMatches: false,
    turnsSinceRuleChange: 0,
    nextRuleChangeAt: 3,
    isPlaying: false,
    tapLocked: false,
    turnId: 0,
    timer: null,
    flashTimer: null,
    correctCount: 0,
    wrongCount: 0,
    currentStreak: 0,
    maxStreak: 0,
    startTime: 0,
  });

  const doGameOverRef = useRef<() => void>(() => { });
  const setupNextTurnRef = useRef<(shouldChangeRule: boolean) => void>(() => { });

  function cancelAllTimers(): void {
    if (g.current.timer !== null) {
      clearTimeout(g.current.timer);
      g.current.timer = null;
    }
    if (g.current.flashTimer !== null) {
      clearTimeout(g.current.flashTimer);
      g.current.flashTimer = null;
    }
  }

  useEffect(() => {
    AsyncStorage.getItem(BEST_SCORE_KEY).then((val) => {
      if (val !== null) setBestScore(parseInt(val, 10));
    });

    return () => {
      g.current.isPlaying = false;
      g.current.turnId += 1;
      cancelAllTimers();
    };
  }, []);

  const doGameOver = useCallback(async () => {
    g.current.isPlaying = false;
    g.current.tapLocked = true;
    g.current.turnId += 1;
    g.current.wrongCount += 1;
    cancelAllTimers();

    const finalScore = g.current.score;
    const endData: GameEndData = {
      score: finalScore,
      correctCount: g.current.correctCount,
      wrongCount: g.current.wrongCount,
      maxStreak: g.current.maxStreak,
      durationMs: Date.now() - g.current.startTime,
      maxDifficulty: getDifficultyLevel(finalScore),
    };
    setGameEndData(endData);

    let newRecord = false;
    try {
      const storedBest = await AsyncStorage.getItem(BEST_SCORE_KEY);
      const best = storedBest !== null ? parseInt(storedBest, 10) : 0;
      if (finalScore > best) {
        await AsyncStorage.setItem(BEST_SCORE_KEY, String(finalScore));
        setBestScore(finalScore);
        newRecord = true;
      }
    } catch { }

    setIsNewRecord(newRecord);
    setGameState("gameover");
  }, []);

  doGameOverRef.current = doGameOver;

  const setupNextTurn = useCallback((shouldChangeRule: boolean) => {
    if (!g.current.isPlaying) return;

    g.current.tapLocked = false;

    if (shouldChangeRule) {
      const nextRule = generateDynamicRule(g.current.score, g.current.rule.id);
      g.current.rule = nextRule;
      g.current.turnsSinceRuleChange = 0;
      g.current.nextRuleChangeAt = Math.floor(Math.random() * 3) + 3; // 3–5
      setRule(nextRule);

      setRuleFlash(true);
      if (g.current.flashTimer !== null) clearTimeout(g.current.flashTimer);
      g.current.flashTimer = setTimeout(() => setRuleFlash(false), 700);
    }

    const eq = generateEquation(g.current.score);
    const matches = checkRule(eq.result, g.current.rule);
    g.current.ruleMatches = matches;

    setEquation(eq);
    setRuleMatches(matches);

    const duration = getTimerDuration(g.current.score);
    setTimerDuration(duration);

    g.current.turnId += 1;
    const myTurnId = g.current.turnId;
    const myMatches = matches;

    if (g.current.timer !== null) {
      clearTimeout(g.current.timer);
      g.current.timer = null;
    }

    g.current.timer = setTimeout(() => {
      if (g.current.turnId !== myTurnId || !g.current.isPlaying) return;

      if (myMatches) {
        doGameOverRef.current();
      } else {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        g.current.score += 1;
        g.current.correctCount += 1;
        g.current.currentStreak += 1;
        if (g.current.currentStreak > g.current.maxStreak) {
          g.current.maxStreak = g.current.currentStreak;
        }
        setCurrentStreak(g.current.currentStreak);
        setDisplayScore(g.current.score);
        g.current.turnsSinceRuleChange += 1;
        const shouldChange = g.current.turnsSinceRuleChange >= g.current.nextRuleChangeAt;
        setupNextTurnRef.current(shouldChange);
      }
    }, duration);
  }, []);

  setupNextTurnRef.current = setupNextTurn;

  const startGame = useCallback(() => {
    cancelAllTimers();

    g.current.score = 0;
    g.current.turnsSinceRuleChange = 0;
    g.current.nextRuleChangeAt = Math.floor(Math.random() * 3) + 3;
    g.current.rule = { id: "even", label: "ÇİFT SAYI" };
    g.current.isPlaying = true;
    g.current.tapLocked = false;
    g.current.turnId += 1;
    g.current.correctCount = 0;
    g.current.wrongCount = 0;
    g.current.currentStreak = 0;
    g.current.maxStreak = 0;
    g.current.startTime = Date.now();

    setDisplayScore(0);
    setCurrentStreak(0);
    setIsNewRecord(false);
    setRuleFlash(false);
    setGameEndData(null);
    setRule(g.current.rule);
    setGameState("playing");

    setupNextTurnRef.current(false);
  }, []);

  const handleTap = useCallback(() => {
    if (!g.current.isPlaying) return;

    if (g.current.tapLocked) return;
    g.current.tapLocked = true;

    if (g.current.ruleMatches) {
      if (g.current.timer !== null) {
        clearTimeout(g.current.timer);
        g.current.timer = null;
      }

      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      g.current.score += 1;
      g.current.correctCount += 1;
      g.current.currentStreak += 1;
      if (g.current.currentStreak > g.current.maxStreak) {
        g.current.maxStreak = g.current.currentStreak;
      }
      setCurrentStreak(g.current.currentStreak);
      setDisplayScore(g.current.score);
      g.current.turnsSinceRuleChange += 1;
      const shouldChange = g.current.turnsSinceRuleChange >= g.current.nextRuleChangeAt;
      setupNextTurnRef.current(shouldChange);
    } else {
      g.current.currentStreak = 0;
      setCurrentStreak(0);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      doGameOverRef.current();
    }
  }, []);

  const goToMenu = useCallback(() => {
    g.current.isPlaying = false;
    g.current.tapLocked = true;
    g.current.turnId += 1;
    cancelAllTimers();
    setGameState("menu");
  }, []);

  return {
    gameState,
    score: displayScore,
    bestScore,
    isNewRecord,
    equation,
    rule,
    ruleLabel: rule.label,
    ruleMatches,
    ruleFlash,
    timerDuration,
    currentStreak,
    gameEndData,
    startGame,
    handleTap,
    goToMenu,
  };
}
