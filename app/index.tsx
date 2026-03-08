import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Platform,
  ScrollView,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSequence,
  withDelay,
  withSpring,
  Easing,
  FadeIn,
  FadeOut,
  SlideInDown,
  SlideOutDown,
} from "react-native-reanimated";
import { useMathGame, getDifficultyLabel } from "@/hooks/useMathGame";
import { useGameHistory } from "@/hooks/useGameHistory";
import { useGameAudio } from "@/hooks/useGameAudio";
import { useSettings } from "@/hooks/useSettings";
import { COLORS } from "@/constants/colors";
import { Ionicons, Feather } from "@expo/vector-icons";

import { TimerBar } from "@/components/TimerBar";
import { RuleBadge } from "@/components/RuleBadge";
import { HowToPlayModal } from "@/components/HowToPlayModal";
import { ScorePill } from "@/components/ScorePill";
import { StreakBadge } from "@/components/StreakBadge";

// ─── Main Screen ─────────────────────────────────────────────────────────────

export default function GameScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [showHowTo, setShowHowTo] = useState(false);
  const game = useMathGame();
  const { last5, addRecord } = useGameHistory();
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
      // Menu → Playing: fade + scale in + start BGM
      screenOpacity.value = 0;
      screenScale.value = 0.95;
      screenOpacity.value = withTiming(1, { duration: 300 });
      screenScale.value = withTiming(1, {
        duration: 300,
        easing: Easing.out(Easing.quad),
      });
      audio.startBgm();
    } else if (prev === "playing" && game.gameState === "gameover") {
      // Playing → Game Over: shake + fade + game over sound
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

      // Save game record
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
    // Play streak sound at 5, 10, 15, 20...
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

  // ── MENU ────────────────────────────────────────────────────────────────────
  if (game.gameState === "menu") {
    return (
      <View
        style={[
          styles.container,
          { paddingTop: topPad + 20, paddingBottom: bottomPad + 20 },
        ]}
      >
        {/* Top Bar */}
        <View style={styles.menuTopBar}>
          <View style={styles.menuBadge}>
            <Ionicons name="flash" size={18} color={COLORS.mint} />
            <Text style={styles.menuBadgeText}>REFLEXS GAMİNG</Text>
          </View>
          <View style={styles.menuTopActions}>
            <Pressable
              style={({ pressed }) => [
                styles.menuIconButton,
                pressed && { opacity: 0.6 },
              ]}
              onPress={() => router.push("/stats")}
              hitSlop={8}
            >
              <Ionicons name="stats-chart" size={18} color={COLORS.gray} />
            </Pressable>
            <Pressable
              style={({ pressed }) => [
                styles.menuIconButton,
                pressed && { opacity: 0.6 },
              ]}
              onPress={() => router.push("/settings")}
              hitSlop={8}
            >
              <Feather name="settings" size={18} color={COLORS.gray} />
            </Pressable>
          </View>
        </View>

        {/* Center Title */}
        <View style={styles.menuCenter}>
          <Text style={styles.menuTitle}>TEK TUŞ</Text>
          <Text style={styles.menuSubtitle}>MATEMATİK</Text>
          <View style={styles.menuDivider} />
          <Text style={styles.menuTagline}>
            Kural var. Süre var. Hata yok.
          </Text>
        </View>

        {/* Best Score Card */}
        <View style={styles.menuActions}>
          {game.bestScore > 0 && (
            <Pressable
              style={styles.bestScoreCard}
              onPress={() => router.push("/stats")}
            >
              <View style={styles.bestScoreIconWrap}>
                <Ionicons name="trophy" size={24} color={COLORS.orange} />
              </View>
              <View style={styles.bestScoreInfo}>
                <Text style={styles.bestScoreLabel}>EN İYİ SKOR</Text>
                <Text style={styles.bestScoreValue}>{game.bestScore}</Text>
              </View>
              <Feather name="chevron-right" size={18} color={COLORS.gray + "60"} />
            </Pressable>
          )}

          <Pressable
            style={({ pressed }) => [
              styles.playButton,
              pressed && styles.playButtonPressed,
            ]}
            onPress={game.startGame}
            accessibilityRole="button"
            accessibilityLabel="Oyunu Başlat"
          >
            <Text style={styles.playButtonText}>OYNA</Text>
            <Ionicons name="arrow-forward" size={20} color="#FFFFFF" />
          </Pressable>

          <Pressable
            style={({ pressed }) => [
              styles.howToButton,
              pressed && { opacity: 0.6 },
            ]}
            onPress={() => setShowHowTo(true)}
            accessibilityRole="button"
            accessibilityLabel="Nasıl Oynanır"
          >
            <Feather name="help-circle" size={16} color={COLORS.gray} />
            <Text style={styles.howToButtonText}>NASIL OYNANIR?</Text>
          </Pressable>
        </View>

        <HowToPlayModal
          visible={showHowTo}
          onClose={() => setShowHowTo(false)}
        />
      </View>
    );
  }

  // ── GAME OVER ────────────────────────────────────────────────────────────────
  if (game.gameState === "gameover") {
    const endData = game.gameEndData;
    const durationSecs = endData ? Math.floor(endData.durationMs / 1000) : 0;
    const durationStr =
      durationSecs >= 60
        ? `${Math.floor(durationSecs / 60)}dk ${durationSecs % 60}s`
        : `${durationSecs}s`;
    const diffLabel = endData ? getDifficultyLabel(endData.maxDifficulty) : "";

    return (
      <Animated.View
        style={[
          styles.container,
          { paddingTop: topPad + 16, paddingBottom: bottomPad + 16 },
          animatedScreenStyle,
        ]}
      >
        <ScrollView
          contentContainerStyle={styles.gameOverScroll}
          showsVerticalScrollIndicator={false}
        >
          {/* Score Hero Section */}
          <View style={styles.scoreHero}>
            <View style={styles.scoreHeroTop}>
              <Ionicons name="close-circle" size={36} color="#FF3B30" />
              <Text style={styles.gameOverLabel}>OYUN BİTTİ</Text>
            </View>

            <Text style={styles.finalScore}>{game.score}</Text>

            {game.isNewRecord ? (
              <View style={styles.newRecordBadge}>
                <Ionicons name="trophy" size={14} color={COLORS.orange} />
                <Text style={styles.newRecordText}>YENİ REKOR!</Text>
              </View>
            ) : game.bestScore > 0 ? (
              <View style={styles.bestRowInline}>
                <Ionicons name="trophy-outline" size={14} color={COLORS.orange} />
                <Text style={styles.bestRowInlineText}>
                  En İyi: {game.bestScore}
                </Text>
              </View>
            ) : null}
          </View>

          {/* Stats 2x2 Grid */}
          {endData && (
            <View style={styles.statsGrid2x2}>
              <View style={styles.stat2x2Card}>
                <View style={[styles.stat2x2Icon, { backgroundColor: COLORS.mint + "15" }]}>
                  <Ionicons name="checkmark-circle" size={18} color={COLORS.mint} />
                </View>
                <Text style={styles.stat2x2Value}>{endData.correctCount}</Text>
                <Text style={styles.stat2x2Label}>Doğru</Text>
              </View>

              <View style={styles.stat2x2Card}>
                <View style={[styles.stat2x2Icon, { backgroundColor: COLORS.navy + "12" }]}>
                  <Ionicons name="time" size={18} color={COLORS.navy} />
                </View>
                <Text style={styles.stat2x2Value}>{durationStr}</Text>
                <Text style={styles.stat2x2Label}>Süre</Text>
              </View>

              <View style={styles.stat2x2Card}>
                <View style={[styles.stat2x2Icon, { backgroundColor: COLORS.orange + "15" }]}>
                  <Ionicons name="flame" size={18} color={COLORS.orange} />
                </View>
                <Text style={styles.stat2x2Value}>{endData.maxStreak}x</Text>
                <Text style={styles.stat2x2Label}>En İyi Seri</Text>
              </View>

              <View style={styles.stat2x2Card}>
                <View style={[styles.stat2x2Icon, { backgroundColor: "#FF3B30" + "12" }]}>
                  <Ionicons name="speedometer" size={18} color="#FF3B30" />
                </View>
                <Text style={styles.stat2x2Value}>{diffLabel}</Text>
                <Text style={styles.stat2x2Label}>Seviye</Text>
              </View>
            </View>
          )}

          {/* Buttons */}
          <View style={styles.gameOverButtons}>
            <Pressable
              style={({ pressed }) => [
                styles.restartButton,
                pressed && styles.restartButtonPressed,
              ]}
              onPress={game.startGame}
              accessibilityRole="button"
              accessibilityLabel="Tekrar Oyna"
            >
              <Ionicons name="refresh" size={20} color="#FFFFFF" />
              <Text style={styles.restartButtonText}>TEKRAR OYNA</Text>
            </Pressable>

            <Pressable
              style={({ pressed }) => [
                styles.menuButtonSmall,
                pressed && { opacity: 0.6 },
              ]}
              onPress={game.goToMenu}
              accessibilityRole="button"
              accessibilityLabel="Menüye Dön"
            >
              <Feather name="home" size={16} color={COLORS.gray} />
              <Text style={styles.menuButtonSmallText}>MENÜ</Text>
            </Pressable>
          </View>
        </ScrollView>
      </Animated.View>
    );
  }

  // ── PLAYING ──────────────────────────────────────────────────────────────────
  return (
    <Animated.View style={[{ flex: 1 }, animatedScreenStyle]}>
      <Pressable
        style={[styles.container, styles.playArea]}
        onPress={game.handleTap}
      >
        {/* Header */}
        <View style={[styles.gameHeader, { marginTop: topPad }]}>
          <ScorePill label="SKOR" value={game.score} accent />
          {game.currentStreak > 1 && (
            <StreakBadge streak={game.currentStreak} />
          )}
          <ScorePill label="EN İYİ" value={game.bestScore} />
        </View>

        {/* Main Content */}
        <View style={styles.gameCenter}>
          <RuleBadge label={game.ruleLabel} flash={game.ruleFlash} />

          <View style={styles.equationWrap}>
            <Text style={styles.equationText}>{game.equation.display}</Text>
          </View>

          <View style={styles.hintRow}>
            {game.ruleMatches ? (
              <View style={styles.goHint}>
                <Ionicons name="hand-left-outline" size={14} color={COLORS.mint} />
                <Text style={styles.goHintText}>DOKUN!</Text>
              </View>
            ) : (
              <View style={styles.noGoHint}>
                <Ionicons name="time-outline" size={14} color={COLORS.gray} />
                <Text style={styles.noGoHintText}>BEKLEME ZAMANI</Text>
              </View>
            )}
          </View>
        </View>

        {/* Timer Bar */}
        <View style={[styles.timerContainer, { paddingBottom: bottomPad + 16 }]}>
          <TimerBar
            equationKey={game.equation.equationKey}
            duration={game.timerDuration}
            active={game.gameState === "playing"}
          />
          <Text style={styles.timerLabel}>
            {(game.timerDuration / 1000).toFixed(1)}s
          </Text>
        </View>
      </Pressable>
    </Animated.View>
  );
}

// ─── Styles ──────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    paddingHorizontal: 24,
  },

  // ── Menu ──
  menuTopBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  menuBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: COLORS.mint + "15",
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.mint + "30",
  },
  menuBadgeText: {
    fontSize: 11,
    fontFamily: "Inter_600SemiBold",
    color: COLORS.mint,
    letterSpacing: 2,
  },
  menuTopActions: {
    flexDirection: "row",
    gap: 8,
  },
  menuIconButton: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: "#F5F5F5",
    alignItems: "center",
    justifyContent: "center",
  },
  menuCenter: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 4,
  },
  menuTitle: {
    fontSize: 52,
    fontFamily: "Inter_700Bold",
    color: COLORS.dark,
    letterSpacing: -2,
    lineHeight: 58,
  },
  menuSubtitle: {
    fontSize: 28,
    fontFamily: "Inter_400Regular",
    color: COLORS.gray,
    letterSpacing: 6,
    textTransform: "uppercase",
  },
  menuDivider: {
    width: 40,
    height: 3,
    backgroundColor: COLORS.mint,
    borderRadius: 2,
    marginTop: 20,
    marginBottom: 16,
  },
  menuTagline: {
    fontSize: 15,
    fontFamily: "Inter_400Regular",
    color: COLORS.gray,
    letterSpacing: 0.3,
  },
  menuActions: {
    alignItems: "center",
    gap: 16,
    paddingBottom: 8,
  },

  // ── Best Score Card (Menu) ──
  bestScoreCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8F8F8",
    borderRadius: 16,
    paddingHorizontal: 20,
    paddingVertical: 14,
    width: "100%",
    gap: 14,
    borderWidth: 1,
    borderColor: COLORS.orange + "20",
  },
  bestScoreIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: COLORS.orange + "15",
    alignItems: "center",
    justifyContent: "center",
  },
  bestScoreInfo: {
    flex: 1,
    gap: 2,
  },
  bestScoreLabel: {
    fontSize: 10,
    fontFamily: "Inter_600SemiBold",
    color: COLORS.gray,
    letterSpacing: 2,
  },
  bestScoreValue: {
    fontSize: 28,
    fontFamily: "Inter_700Bold",
    color: COLORS.dark,
    letterSpacing: -1,
  },

  playButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: COLORS.mint,
    paddingHorizontal: 48,
    paddingVertical: 18,
    borderRadius: 50,
    shadowColor: COLORS.mint,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 16,
    elevation: 8,
    width: "100%",
    justifyContent: "center",
  },
  playButtonPressed: {
    transform: [{ scale: 0.96 }],
    shadowOpacity: 0.15,
  },
  playButtonText: {
    fontSize: 18,
    fontFamily: "Inter_700Bold",
    color: "#FFFFFF",
    letterSpacing: 2,
  },
  howToButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  howToButtonText: {
    fontSize: 13,
    fontFamily: "Inter_500Medium",
    color: COLORS.gray,
    letterSpacing: 1,
  },

  // ── Game Over ──
  gameOverScroll: {
    flexGrow: 1,
    alignItems: "center",
    gap: 16,
    paddingBottom: 20,
    paddingTop: 8,
  },

  // Score hero section
  scoreHero: {
    alignItems: "center",
    gap: 6,
    width: "100%",
    backgroundColor: "#F8F8F8",
    borderRadius: 24,
    paddingVertical: 28,
    paddingHorizontal: 20,
  },
  scoreHeroTop: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  gameOverLabel: {
    fontSize: 13,
    fontFamily: "Inter_700Bold",
    color: COLORS.gray,
    letterSpacing: 3,
  },
  finalScore: {
    fontSize: 80,
    fontFamily: "Inter_700Bold",
    color: COLORS.dark,
    lineHeight: 92,
    letterSpacing: -3,
  },
  newRecordBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: COLORS.orange + "18",
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.orange + "40",
  },
  newRecordText: {
    fontSize: 12,
    fontFamily: "Inter_700Bold",
    color: COLORS.orange,
    letterSpacing: 1.5,
  },
  bestRowInline: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  bestRowInlineText: {
    fontSize: 13,
    fontFamily: "Inter_500Medium",
    color: COLORS.gray,
  },

  // 2x2 Stats Grid
  statsGrid2x2: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    width: "100%",
  },
  stat2x2Card: {
    width: "48%",
    flexGrow: 1,
    backgroundColor: "#F8F8F8",
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 14,
    alignItems: "center",
    gap: 6,
  },
  stat2x2Icon: {
    width: 34,
    height: 34,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  stat2x2Value: {
    fontSize: 18,
    fontFamily: "Inter_700Bold",
    color: COLORS.dark,
  },
  stat2x2Label: {
    fontSize: 11,
    fontFamily: "Inter_500Medium",
    color: COLORS.gray,
    letterSpacing: 0.3,
  },
  gameOverButtons: {
    alignItems: "center",
    gap: 12,
    marginTop: 8,
    width: "100%",
  },
  restartButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: COLORS.mint,
    paddingHorizontal: 40,
    paddingVertical: 18,
    borderRadius: 50,
    shadowColor: COLORS.mint,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
    width: "100%",
    justifyContent: "center",
  },
  restartButtonPressed: {
    transform: [{ scale: 0.96 }],
    shadowOpacity: 0.1,
  },
  restartButtonText: {
    fontSize: 17,
    fontFamily: "Inter_700Bold",
    color: "#FFFFFF",
    letterSpacing: 1.5,
  },
  menuButtonSmall: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingVertical: 12,
  },
  menuButtonSmallText: {
    fontSize: 14,
    fontFamily: "Inter_500Medium",
    color: COLORS.gray,
    letterSpacing: 1,
  },

  // ── Playing ──
  playArea: {
    justifyContent: "space-between",
  },
  gameHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 0,
  },
  gameCenter: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 20,
  },
  equationWrap: {
    alignItems: "center",
    marginVertical: 12,
  },
  equationText: {
    fontSize: 72,
    fontFamily: "Inter_700Bold",
    color: COLORS.dark,
    letterSpacing: -2,
    textAlign: "center",
  },
  hintRow: {
    height: 32,
    justifyContent: "center",
  },
  goHint: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: COLORS.mint + "15",
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
  },
  goHintText: {
    fontSize: 12,
    fontFamily: "Inter_700Bold",
    color: COLORS.mint,
    letterSpacing: 2,
  },
  noGoHint: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#F0F0F0",
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
  },
  noGoHintText: {
    fontSize: 12,
    fontFamily: "Inter_600SemiBold",
    color: COLORS.gray,
    letterSpacing: 2,
  },
  timerContainer: {
    gap: 8,
    paddingTop: 8,
  },
  timerLabel: {
    fontSize: 11,
    fontFamily: "Inter_400Regular",
    color: "#BDBDBD",
    textAlign: "right",
    letterSpacing: 0.5,
  },
});
