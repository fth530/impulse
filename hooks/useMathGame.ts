/**
 * useMathGame — Bulletproof core game logic
 *
 * Safeguards:
 *  - Double-tap lock: `tapLocked` flag set synchronously on first tap
 *  - Stale-timer guard: `turnId` incremented each turn; callbacks abort if ID changed
 *  - Full timer cleanup on unmount, game-over, menu exit, and equation change
 *  - Subtraction always produces a positive result (a > b enforced)
 *  - Result capped at 50 for quick mental arithmetic
 *  - Strict, well-tested rule evaluators (0 and 1 are not prime; 2 is)
 */

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

const BASE_TIMER = 2500; // ms
const TIMER_DECREASE = 50; // ms per point
const MIN_TIMER = 800; // ms floor
const BEST_SCORE_KEY = "tek_tus_best_score";

// ─── Rule Evaluators ─────────────────────────────────────────────────────────
// Each accepts only positive integers; edge cases are explicitly handled.

/** Returns true for positive even integers (2, 4, 6 …). */
function isEven(n: number): boolean {
  return Number.isInteger(n) && n >= 2 && n % 2 === 0;
}

/** Returns true for positive odd integers (1, 3, 5 …). */
function isOdd(n: number): boolean {
  return Number.isInteger(n) && n >= 1 && n % 2 !== 0;
}

/**
 * Returns true for prime numbers.
 * – 0 and 1 are NOT prime.
 * – 2 IS prime (the only even prime).
 * – All other even numbers are NOT prime.
 */
function isPrime(n: number): boolean {
  if (!Number.isInteger(n) || n < 2) return false;
  if (n === 2) return true;
  if (n % 2 === 0) return false;
  for (let i = 3; i * i <= n; i += 2) {
    if (n % i === 0) return false;
  }
  return true;
}

/** Returns true when n is strictly greater than 10. */
function isGreaterThan10(n: number): boolean {
  return Number.isInteger(n) && n > 10;
}

function checkRule(result: number, rule: RuleType): boolean {
  switch (rule) {
    case "even":
      return isEven(result);
    case "odd":
      return isOdd(result);
    case "prime":
      return isPrime(result);
    case "gt10":
      return isGreaterThan10(result);
  }
}

// ─── Equation Generator ───────────────────────────────────────────────────────
// Guarantees: result ∈ [1, 50], no negative results, a > b for subtraction.

let eqCounter = 0;

function generateEquation(): Equation {
  const ops: OpType[] = ["+", "-", "×"];
  const op = ops[Math.floor(Math.random() * ops.length)];
  let a: number;
  let b: number;
  let result: number;

  if (op === "+") {
    // a, b ∈ [1, 12] → result ∈ [2, 24] ✓ (always ≤ 50)
    a = Math.floor(Math.random() * 12) + 1;
    b = Math.floor(Math.random() * 12) + 1;
    result = a + b;
  } else if (op === "-") {
    // diff ∈ [1, 10], b ∈ [1, 10] → a = b + diff, result = diff ∈ [1, 10]
    // Enforces a > b so result is ALWAYS positive and non-zero.
    const diff = Math.floor(Math.random() * 10) + 1; // 1–10
    b = Math.floor(Math.random() * 10) + 1; // 1–10
    a = b + diff; // b+1 – b+10 (max 20)
    result = diff; // a - b = diff ∈ [1, 10]
  } else {
    // a, b ∈ [1, 7] → result ∈ [1, 49] ✓ (always ≤ 50)
    a = Math.floor(Math.random() * 7) + 1;
    b = Math.floor(Math.random() * 7) + 1;
    result = a * b;
  }

  eqCounter += 1;
  return {
    a,
    b,
    op,
    result,
    display: `${a} ${op} ${b}`,
    equationKey: eqCounter,
  };
}

function getTimerDuration(score: number): number {
  return Math.max(MIN_TIMER, BASE_TIMER - score * TIMER_DECREASE);
}

// ─── Internal Ref Shape ───────────────────────────────────────────────────────

interface GameRef {
  /** Current running score. */
  score: number;
  /** Active rule. */
  rule: RuleType;
  /** Does the current equation satisfy the current rule? */
  ruleMatches: boolean;
  /** How many turns have passed since the last rule change. */
  turnsSinceRuleChange: number;
  /** Rule changes when turnsSinceRuleChange reaches this value. */
  nextRuleChangeAt: number;
  /** True while a game session is active (playing state). */
  isPlaying: boolean;
  /**
   * Tap lock — set to true the instant a tap is registered.
   * Prevents double-taps from executing game logic twice.
   * Reset to false at the start of each new turn.
   */
  tapLocked: boolean;
  /**
   * Turn identifier — incremented every time a new turn begins or the
   * game session ends. Timer callbacks compare their captured ID against
   * this value to detect whether they are stale.
   */
  turnId: number;
  /** Handle for the active turn timer. */
  timer: ReturnType<typeof setTimeout> | null;
  /** Handle for the rule-flash reset timer. */
  flashTimer: ReturnType<typeof setTimeout> | null;
}

// ─── Hook ────────────────────────────────────────────────────────────────────

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

  const g = useRef<GameRef>({
    score: 0,
    rule: "even",
    ruleMatches: false,
    turnsSinceRuleChange: 0,
    nextRuleChangeAt: 3,
    isPlaying: false,
    tapLocked: false,
    turnId: 0,
    timer: null,
    flashTimer: null,
  });

  // Stable refs for cross-closure calls (avoids stale-closure issues in
  // timer callbacks while keeping useCallback deps empty).
  const doGameOverRef = useRef<() => void>(() => {});
  const setupNextTurnRef = useRef<(shouldChangeRule: boolean) => void>(
    () => {}
  );

  // ── Utility: cancel all pending timers ────────────────────────────────────
  // Defined as a plain function (not hook) so it can be called anywhere,
  // including inside the useEffect cleanup without stale-closure risk.
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

  // ── Load best score; clean up timers on unmount ───────────────────────────
  useEffect(() => {
    AsyncStorage.getItem(BEST_SCORE_KEY).then((val) => {
      if (val !== null) setBestScore(parseInt(val, 10));
    });

    return () => {
      // Prevent any rogue timers from firing after the component is gone
      g.current.isPlaying = false;
      g.current.turnId += 1;
      cancelAllTimers();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Game Over ────────────────────────────────────────────────────────────
  const doGameOver = useCallback(async () => {
    // ① Atomically stop the game and invalidate all pending timers
    g.current.isPlaying = false;
    g.current.tapLocked = true;
    g.current.turnId += 1;
    cancelAllTimers();

    // ② Persist best score
    const finalScore = g.current.score;
    let newRecord = false;
    try {
      const storedBest = await AsyncStorage.getItem(BEST_SCORE_KEY);
      const best = storedBest !== null ? parseInt(storedBest, 10) : 0;
      if (finalScore > best) {
        await AsyncStorage.setItem(BEST_SCORE_KEY, String(finalScore));
        setBestScore(finalScore);
        newRecord = true;
      }
    } catch {
      // AsyncStorage errors must never crash the game
    }

    setIsNewRecord(newRecord);
    setGameState("gameover");
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  doGameOverRef.current = doGameOver;

  // ── Setup Next Turn ──────────────────────────────────────────────────────
  const setupNextTurn = useCallback((shouldChangeRule: boolean) => {
    // Guard: abort if the game is no longer running
    if (!g.current.isPlaying) return;

    // Unlock tap for the new equation
    g.current.tapLocked = false;

    // ── Rule rotation ──
    if (shouldChangeRule) {
      const available = RULES.filter((r) => r !== g.current.rule);
      g.current.rule = available[Math.floor(Math.random() * available.length)];
      g.current.turnsSinceRuleChange = 0;
      g.current.nextRuleChangeAt = Math.floor(Math.random() * 3) + 3; // 3–5
      setRule(g.current.rule);
      // Flash the rule badge
      setRuleFlash(true);
      if (g.current.flashTimer !== null) clearTimeout(g.current.flashTimer);
      g.current.flashTimer = setTimeout(() => setRuleFlash(false), 700);
    }

    // ── New equation ──
    const eq = generateEquation();
    const matches = checkRule(eq.result, g.current.rule);
    g.current.ruleMatches = matches;

    setEquation(eq);
    setRuleMatches(matches);

    const duration = getTimerDuration(g.current.score);
    setTimerDuration(duration);

    // Snapshot immutable values for this turn's timer closure
    g.current.turnId += 1;
    const myTurnId = g.current.turnId;
    const myMatches = matches;

    // Cancel any previous timer before arming a new one
    if (g.current.timer !== null) {
      clearTimeout(g.current.timer);
      g.current.timer = null;
    }

    g.current.timer = setTimeout(() => {
      // ── Stale-timer guard ──────────────────────────────────────────────
      // If the turn ID has changed or the game has ended, this callback
      // belongs to a superseded turn — discard it entirely.
      if (g.current.turnId !== myTurnId || !g.current.isPlaying) return;

      if (myMatches) {
        // Go scenario: timer expired before the player tapped → GAME OVER
        doGameOverRef.current();
      } else {
        // No-Go scenario: timer expired without a tap → SUCCESS
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        g.current.score += 1;
        setDisplayScore(g.current.score);
        g.current.turnsSinceRuleChange += 1;
        const shouldChange =
          g.current.turnsSinceRuleChange >= g.current.nextRuleChangeAt;
        setupNextTurnRef.current(shouldChange);
      }
    }, duration);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  setupNextTurnRef.current = setupNextTurn;

  // ── Start Game ───────────────────────────────────────────────────────────
  const startGame = useCallback(() => {
    // Clear any timers from a previous session
    cancelAllTimers();

    // Reset all game-ref fields atomically
    g.current.score = 0;
    g.current.turnsSinceRuleChange = 0;
    g.current.nextRuleChangeAt = Math.floor(Math.random() * 3) + 3;
    g.current.rule = RULES[Math.floor(Math.random() * RULES.length)];
    g.current.isPlaying = true;
    g.current.tapLocked = false;
    g.current.turnId += 1; // new session — invalidates any ghost timers

    setDisplayScore(0);
    setIsNewRecord(false);
    setRuleFlash(false);
    setRule(g.current.rule);
    setGameState("playing");

    setupNextTurnRef.current(false);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Handle Tap ───────────────────────────────────────────────────────────
  const handleTap = useCallback(() => {
    // ① Out-of-game guard
    if (!g.current.isPlaying) return;

    // ② Double-tap guard — set lock SYNCHRONOUSLY before any async work
    if (g.current.tapLocked) return;
    g.current.tapLocked = true;

    if (g.current.ruleMatches) {
      // Go scenario — correct tap
      // Cancel the timer and invalidate it before doing anything else
      if (g.current.timer !== null) {
        clearTimeout(g.current.timer);
        g.current.timer = null;
      }

      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      g.current.score += 1;
      setDisplayScore(g.current.score);
      g.current.turnsSinceRuleChange += 1;
      const shouldChange =
        g.current.turnsSinceRuleChange >= g.current.nextRuleChangeAt;
      setupNextTurnRef.current(shouldChange);
    } else {
      // No-Go scenario — wrong tap → immediate GAME OVER
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      doGameOverRef.current();
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Go to Menu ───────────────────────────────────────────────────────────
  const goToMenu = useCallback(() => {
    g.current.isPlaying = false;
    g.current.tapLocked = true;
    g.current.turnId += 1; // invalidate any in-flight timers
    cancelAllTimers();
    setGameState("menu");
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

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
