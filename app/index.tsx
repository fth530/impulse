import React, { useEffect, useRef } from "react";
import { View, StyleSheet, Platform } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSequence,
  withDelay,
  Easing,
} from "react-native-reanimated";

import { useMathGame } from "@/hooks/useMathGame";
import { useGameHistory } from "@/hooks/useGameHistory";
import { useGameAudio } from "@/hooks/useGameAudio";
import { useSettings } from "@/hooks/useSettings";
import { COLORS } from "@/constants/colors";

// Screen Components
import { MenuScreen } from "@/components/screens/MenuScreen";
import { PlayingScreen } from "@/components/screens/PlayingScreen";
import { GameOverScreen } from "@/components/screens/GameOverScreen";

export default function GameScreen() {
  const insets = useSafeAreaInsets();
  const game = useMathGame();
  const { addRecord } = useGameHistory();
  const { settings } = useSettings();
  const audio = useGameAudio(settings.soundEnabled);

  const prevGameState = useRef(game.gameState);
  const prevScore = useRef(0);
  const prevStreak = useRef(0);

  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const bottomPad = Platform.OS === "web" ? 34 : insets.bottom;

  // ── Animated transitions ──
  const screenOpacity = useSharedValue(1);
  const screenScale = useSharedValue(1);
  const shakeX = useSharedValue(0);

  // ── Game state transitions (animation + audio) ──
  useEffect(() => {
    const prev = prevGameState.current;
    prevGameState.current = game.gameState;

    if (prev === "menu" && game.gameState === "playing") {
      screenOpacity.value = 0;
      screenScale.value = 0.95;
      screenOpacity.value = withTiming(1, { duration: 300 });
      screenScale.value = withTiming(1, {
        duration: 300,
        easing: Easing.out(Easing.quad),
      });
      audio.startBgm();
    } else if (prev === "playing" && game.gameState === "gameover") {
      shakeX.value = withSequence(
        withTiming(12, { duration: 50 }),
        withTiming(-12, { duration: 50 }),
        withTiming(8, { duration: 50 }),
        withTiming(-8, { duration: 50 }),
        withTiming(0, { duration: 50 }),
      );
      screenOpacity.value = 0.3;
      screenOpacity.value = withDelay(
        250,
        withTiming(1, { duration: 300 }),
      );
      audio.playGameOver();

      if (game.gameEndData) {
        addRecord({
          score: game.gameEndData.score,
          date: new Date().toISOString(),
          durationMs: game.gameEndData.durationMs,
          correctCount: game.gameEndData.correctCount,
          wrongCount: game.gameEndData.wrongCount,
          maxStreak: game.gameEndData.maxStreak,
          maxDifficulty: game.gameEndData.maxDifficulty,
        });
      }
    } else if (game.gameState === "menu") {
      screenOpacity.value = withTiming(1, { duration: 200 });
      screenScale.value = withTiming(1, { duration: 200 });
      audio.stopBgm();
    }
  }, [game.gameState]);

  // ── Score change → correct sound ──
  useEffect(() => {
    if (game.gameState !== "playing") return;
    if (game.score > prevScore.current) {
      audio.playCorrect();
    }
    prevScore.current = game.score;
  }, [game.score]);

  // ── Streak milestone → celebration sound ──
  useEffect(() => {
    if (game.gameState !== "playing") return;
    const s = game.currentStreak;
    if (s >= 5 && s % 5 === 0 && s > prevStreak.current) {
      audio.playStreak();
    }
    prevStreak.current = s;
  }, [game.currentStreak]);

  const animatedScreenStyle = useAnimatedStyle(() => ({
    opacity: screenOpacity.value,
    transform: [
      { scale: screenScale.value },
      { translateX: shakeX.value },
    ],
  }));

  // Render logic based on game state
  return (
    <Animated.View style={[styles.container, animatedScreenStyle]}>
      {game.gameState === "menu" && (
        <MenuScreen
          topPad={topPad}
          bottomPad={bottomPad}
          bestScore={game.bestScore}
          onPlay={game.startGame}
        />
      )}

      {game.gameState === "gameover" && (
        <GameOverScreen
          score={game.score}
          bestScore={game.bestScore}
          isNewRecord={game.isNewRecord}
          gameEndData={game.gameEndData}
          onRestart={game.startGame}
          onMenu={game.goToMenu}
          topPad={topPad}
          bottomPad={bottomPad}
        />
      )}

      {game.gameState === "playing" && (
        <PlayingScreen
          topPad={topPad}
          bottomPad={bottomPad}
          score={game.score}
          bestScore={game.bestScore}
          currentStreak={game.currentStreak}
          ruleLabel={game.ruleLabel}
          ruleFlash={game.ruleFlash}
          equation={game.equation}
          ruleMatches={game.ruleMatches}
          gameState={game.gameState}
          timerDuration={game.timerDuration}
          onTap={game.handleTap}
        />
      )}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
});
