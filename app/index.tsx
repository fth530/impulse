import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Modal,
  ScrollView,
  Platform,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  cancelAnimation,
  Easing,
  interpolateColor,
} from "react-native-reanimated";
import * as Haptics from "expo-haptics";
import { useMathGame } from "@/hooks/useMathGame";
import { COLORS } from "@/constants/colors";
import { Ionicons, Feather } from "@expo/vector-icons";

import { TimerBar } from "@/components/TimerBar";
import { RuleBadge } from "@/components/RuleBadge";
import { HowToPlayModal } from "@/components/HowToPlayModal";
import { ScorePill } from "@/components/ScorePill";

// ─── Main Screen ─────────────────────────────────────────────────────────────

export default function GameScreen() {
  const insets = useSafeAreaInsets();
  const [showHowTo, setShowHowTo] = useState(false);
  const game = useMathGame();

  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const bottomPad = Platform.OS === "web" ? 34 : insets.bottom;

  // ── MENU ────────────────────────────────────────────────────────────────────
  if (game.gameState === "menu") {
    return (
      <View
        style={[
          styles.container,
          { paddingTop: topPad + 20, paddingBottom: bottomPad + 20 },
        ]}
      >
        <View style={styles.menuTop}>
          <View style={styles.menuBadge}>
            <Ionicons name="flash" size={18} color={COLORS.mint} />
            <Text style={styles.menuBadgeText}>REFLEXS GAMİNG</Text>
          </View>
        </View>

        <View style={styles.menuCenter}>
          <Text style={styles.menuTitle}>TEK TUŞ</Text>
          <Text style={styles.menuSubtitle}>MATEMATİK</Text>
          <View style={styles.menuDivider} />
          <Text style={styles.menuTagline}>
            Kural var. Süre var. Hata yok.
          </Text>
        </View>

        <View style={styles.menuActions}>
          {game.bestScore > 0 && (
            <View style={styles.bestScoreRow}>
              <Ionicons name="trophy" size={16} color={COLORS.orange} />
              <Text style={styles.bestScoreText}>
                En İyi: {game.bestScore}
              </Text>
            </View>
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
    return (
      <View
        style={[
          styles.container,
          { paddingTop: topPad + 20, paddingBottom: bottomPad + 20 },
        ]}
      >
        <View style={styles.gameOverContent}>
          <View style={styles.gameOverIconWrap}>
            <Ionicons name="close-circle" size={64} color="#FF3B30" />
          </View>

          <Text style={styles.gameOverLabel}>OYUN BİTTİ</Text>

          {game.isNewRecord && (
            <View style={styles.newRecordBadge}>
              <Ionicons name="trophy" size={16} color={COLORS.orange} />
              <Text style={styles.newRecordText}>YENİ REKOR!</Text>
            </View>
          )}

          <View style={styles.finalScoreWrap}>
            <Text style={styles.finalScoreLabel}>SKOR</Text>
            <Text style={styles.finalScore}>{game.score}</Text>
          </View>

          {game.bestScore > 0 && (
            <View style={styles.bestRow}>
              <Text style={styles.bestRowLabel}>En İyi</Text>
              <Text style={styles.bestRowValue}>{game.bestScore}</Text>
            </View>
          )}

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
        </View>
      </View>
    );
  }

  // ── PLAYING ──────────────────────────────────────────────────────────────────
  return (
    <Pressable
      style={[styles.container, styles.playArea]}
      onPress={game.handleTap}
    >
      {/* Header */}
      <View style={[styles.gameHeader, { marginTop: topPad }]}>
        <ScorePill label="SKOR" value={game.score} accent />
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
  menuTop: {
    alignItems: "center",
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
  bestScoreRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  bestScoreText: {
    fontSize: 14,
    fontFamily: "Inter_500Medium",
    color: COLORS.gray,
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
  gameOverContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 16,
  },
  gameOverIconWrap: {
    marginBottom: 8,
  },
  gameOverLabel: {
    fontSize: 14,
    fontFamily: "Inter_600SemiBold",
    color: COLORS.gray,
    letterSpacing: 3,
  },
  newRecordBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: COLORS.orange + "18",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.orange + "40",
  },
  newRecordText: {
    fontSize: 14,
    fontFamily: "Inter_700Bold",
    color: COLORS.orange,
    letterSpacing: 1.5,
  },
  finalScoreWrap: {
    alignItems: "center",
    marginVertical: 8,
  },
  finalScoreLabel: {
    fontSize: 11,
    fontFamily: "Inter_600SemiBold",
    color: COLORS.gray,
    letterSpacing: 3,
  },
  finalScore: {
    fontSize: 80,
    fontFamily: "Inter_700Bold",
    color: COLORS.dark,
    lineHeight: 90,
    letterSpacing: -3,
  },
  bestRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: "#F5F5F5",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 12,
  },
  bestRowLabel: {
    fontSize: 13,
    fontFamily: "Inter_400Regular",
    color: COLORS.gray,
  },
  bestRowValue: {
    fontSize: 16,
    fontFamily: "Inter_700Bold",
    color: COLORS.navy,
  },
  gameOverButtons: {
    alignItems: "center",
    gap: 12,
    marginTop: 16,
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
