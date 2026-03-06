import React, { useState } from "react";
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
  withSequence,
  withRepeat,
  cancelAnimation,
  Easing,
  interpolateColor,
} from "react-native-reanimated";
import * as Haptics from "expo-haptics";
import { useMathGame } from "@/hooks/useMathGame";
import { COLORS } from "@/constants/colors";
import { Ionicons, Feather } from "@expo/vector-icons";

// ─── Timer Bar ──────────────────────────────────────────────────────────────

interface TimerBarProps {
  equationKey: number;
  duration: number;
  active: boolean;
}

function TimerBar({ equationKey, duration, active }: TimerBarProps) {
  const progress = useSharedValue(1);

  useEffect(() => {
    if (active) {
      progress.value = 1;
      progress.value = withTiming(0, {
        duration,
        easing: Easing.linear,
      });
    } else {
      cancelAnimation(progress);
      progress.value = 1;
    }
  }, [equationKey, active]);

  const barStyle = useAnimatedStyle(() => ({
    width: `${progress.value * 100}%` as any,
    backgroundColor: interpolateColor(
      progress.value,
      [0, 0.3, 0.6, 1],
      ["#FF3B30", "#FF9500", "#FFD60A", COLORS.mint]
    ),
  }));

  return (
    <View style={timerStyles.track}>
      <Animated.View style={[timerStyles.bar, barStyle]} />
    </View>
  );
}

const timerStyles = StyleSheet.create({
  track: {
    width: "100%",
    height: 6,
    backgroundColor: "#F0F0F0",
    borderRadius: 3,
    overflow: "hidden",
  },
  bar: {
    height: "100%",
    borderRadius: 3,
  },
});

// ─── Rule Flash Animation ────────────────────────────────────────────────────

interface RuleBadgeProps {
  label: string;
  flash: boolean;
}

function RuleBadge({ label, flash }: RuleBadgeProps) {
  const flashAnim = useSharedValue(0);

  useEffect(() => {
    if (flash) {
      flashAnim.value = 0;
      flashAnim.value = withRepeat(
        withSequence(
          withTiming(1, { duration: 120 }),
          withTiming(0, { duration: 120 })
        ),
        3,
        false
      );
    } else {
      cancelAnimation(flashAnim);
      flashAnim.value = 0;
    }
  }, [flash, label]);

  const badgeStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(
      flashAnim.value,
      [0, 1],
      [COLORS.mint + "18", "#FFD60A40"]
    ),
    borderColor: interpolateColor(
      flashAnim.value,
      [0, 1],
      [COLORS.mint, "#FFD60A"]
    ),
  }));

  const textStyle = useAnimatedStyle(() => ({
    color: interpolateColor(
      flashAnim.value,
      [0, 1],
      [COLORS.mint, "#B8860B"]
    ),
  }));

  return (
    <Animated.View style={[ruleStyles.badge, badgeStyle]}>
      <Animated.Text style={[ruleStyles.kural, textStyle]}>KURAL</Animated.Text>
      <Animated.Text style={[ruleStyles.label, textStyle]}>{label}</Animated.Text>
    </Animated.View>
  );
}

const ruleStyles = StyleSheet.create({
  badge: {
    alignItems: "center",
    paddingHorizontal: 28,
    paddingVertical: 14,
    borderRadius: 20,
    borderWidth: 2,
    gap: 2,
  },
  kural: {
    fontSize: 11,
    fontFamily: "Inter_600SemiBold",
    letterSpacing: 3,
  },
  label: {
    fontSize: 22,
    fontFamily: "Inter_700Bold",
    letterSpacing: 1,
  },
});

// ─── How To Play Modal ───────────────────────────────────────────────────────

interface HowToPlayModalProps {
  visible: boolean;
  onClose: () => void;
}

function HowToPlayModal({ visible, onClose }: HowToPlayModalProps) {
  const insets = useSafeAreaInsets();

  const rules = [
    {
      icon: "checkmark-circle" as const,
      color: COLORS.mint,
      title: "Kurala uyuyorsa DOKUN",
      desc: "Süre bitmeden önce ekrana dokun. Geç kalırsan yanarsın!",
    },
    {
      icon: "hand-left" as const,
      color: COLORS.navy,
      title: "Kurala uymuyorsa DOKUNMA",
      desc: "Bekle ve sürenin bitmesini izle. Dokunursan yanarsın!",
    },
    {
      icon: "flash" as const,
      color: COLORS.orange,
      title: "Kural değişiyor",
      desc: "Her 3-5 turda bir kural değişir. Sarı yanıp söndüğünde dikkat et!",
    },
    {
      icon: "trending-up" as const,
      color: "#FF3B30",
      title: "Zorluk artıyor",
      desc: "Her doğru hamlede süre kısalır. Ne kadar dayanabilirsin?",
    },
  ];

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <Pressable style={modalStyles.backdrop} onPress={onClose} />
      <View
        style={[
          modalStyles.sheet,
          { paddingBottom: Math.max(insets.bottom, 20) },
        ]}
      >
        <View style={modalStyles.handle} />
        <View style={modalStyles.header}>
          <Text style={modalStyles.title}>NASIL OYNANIR?</Text>
          <Pressable onPress={onClose} style={modalStyles.closeBtn}>
            <Feather name="x" size={22} color={COLORS.gray} />
          </Pressable>
        </View>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={modalStyles.content}
        >
          {rules.map((rule, i) => (
            <View key={i} style={modalStyles.ruleRow}>
              <View
                style={[modalStyles.iconWrap, { backgroundColor: rule.color + "18" }]}
              >
                <Ionicons name={rule.icon} size={24} color={rule.color} />
              </View>
              <View style={modalStyles.ruleText}>
                <Text style={modalStyles.ruleTitle}>{rule.title}</Text>
                <Text style={modalStyles.ruleDesc}>{rule.desc}</Text>
              </View>
            </View>
          ))}

          <View style={modalStyles.exampleBox}>
            <Text style={modalStyles.exampleTitle}>Örnek</Text>
            <Text style={modalStyles.exampleText}>
              Kural{" "}
              <Text style={{ color: COLORS.mint, fontFamily: "Inter_700Bold" }}>
                ÇİFT SAYI
              </Text>{" "}
              ise ve denklem{" "}
              <Text style={{ fontFamily: "Inter_700Bold", color: COLORS.dark }}>
                3 + 5
              </Text>{" "}
              ise (sonuç = 8, çift) → <Text style={{ color: COLORS.mint, fontFamily: "Inter_600SemiBold" }}>DOKUN!</Text>
            </Text>
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
}

const modalStyles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  sheet: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingTop: 12,
    maxHeight: "78%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.08,
    shadowRadius: 20,
    elevation: 20,
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: "#E0E0E0",
    borderRadius: 2,
    alignSelf: "center",
    marginBottom: 20,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 24,
    marginBottom: 8,
  },
  title: {
    fontSize: 17,
    fontFamily: "Inter_700Bold",
    color: COLORS.dark,
    letterSpacing: 1.5,
  },
  closeBtn: {
    width: 36,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
  },
  content: {
    padding: 24,
    gap: 20,
  },
  ruleRow: {
    flexDirection: "row",
    gap: 16,
    alignItems: "flex-start",
  },
  iconWrap: {
    width: 48,
    height: 48,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  ruleText: {
    flex: 1,
    gap: 3,
  },
  ruleTitle: {
    fontSize: 15,
    fontFamily: "Inter_600SemiBold",
    color: COLORS.dark,
  },
  ruleDesc: {
    fontSize: 13,
    fontFamily: "Inter_400Regular",
    color: COLORS.gray,
    lineHeight: 19,
  },
  exampleBox: {
    backgroundColor: COLORS.mint + "10",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.mint + "30",
    gap: 6,
    marginTop: 4,
  },
  exampleTitle: {
    fontSize: 12,
    fontFamily: "Inter_600SemiBold",
    color: COLORS.mint,
    letterSpacing: 1.5,
    textTransform: "uppercase",
  },
  exampleText: {
    fontSize: 14,
    fontFamily: "Inter_400Regular",
    color: COLORS.dark,
    lineHeight: 21,
  },
});

// ─── Score Pill ──────────────────────────────────────────────────────────────

function ScorePill({
  label,
  value,
  accent,
}: {
  label: string;
  value: number;
  accent?: boolean;
}) {
  return (
    <View style={[scorePillStyles.pill, accent && scorePillStyles.accentPill]}>
      <Text style={[scorePillStyles.label, accent && scorePillStyles.accentLabel]}>
        {label}
      </Text>
      <Text style={[scorePillStyles.value, accent && scorePillStyles.accentValue]}>
        {value}
      </Text>
    </View>
  );
}

const scorePillStyles = StyleSheet.create({
  pill: {
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: "#F5F5F5",
    borderRadius: 14,
    minWidth: 80,
  },
  accentPill: {
    backgroundColor: COLORS.navy,
  },
  label: {
    fontSize: 10,
    fontFamily: "Inter_600SemiBold",
    color: COLORS.gray,
    letterSpacing: 1.5,
    textTransform: "uppercase",
  },
  accentLabel: {
    color: "rgba(255,255,255,0.6)",
  },
  value: {
    fontSize: 26,
    fontFamily: "Inter_700Bold",
    color: COLORS.dark,
    lineHeight: 32,
  },
  accentValue: {
    color: "#FFFFFF",
  },
});

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
