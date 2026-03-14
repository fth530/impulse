import React from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "@/constants/colors";
import { TimerBar } from "@/components/TimerBar";
import { RuleBadge } from "@/components/RuleBadge";
import { ScorePill } from "@/components/ScorePill";
import { StreakBadge } from "@/components/StreakBadge";
import { Equation } from "@/hooks/useMathGame";
import { useT } from "@/i18n/LanguageContext";
import { getRuleLabel } from "@/i18n/ruleLabels";

interface PlayingScreenProps {
    topPad: number;
    bottomPad: number;
    score: number;
    bestScore: number;
    currentStreak: number;
    ruleId: string;
    ruleFlash: boolean;
    equation: Equation;
    ruleMatches: boolean;
    gameState: string;
    timerDuration: number;
    onTap: () => void;
}

export function PlayingScreen({
    topPad,
    bottomPad,
    score,
    bestScore,
    currentStreak,
    ruleId,
    ruleFlash,
    equation,
    ruleMatches,
    gameState,
    timerDuration,
    onTap,
}: PlayingScreenProps) {
    const t = useT();
    const ruleLabel = getRuleLabel(ruleId, t);

    return (
        <Pressable style={[styles.container, styles.playArea]} onPress={onTap}>
            <View style={[styles.gameHeader, { marginTop: topPad }]}>
                <ScorePill label={t.score} value={score} accent />
                {currentStreak > 1 && <StreakBadge streak={currentStreak} />}
                <ScorePill label={t.best} value={bestScore} />
            </View>

            <View style={styles.gameCenter}>
                <RuleBadge label={ruleLabel} flash={ruleFlash} />

                <View style={styles.equationWrap}>
                    <Text style={styles.equationText}>{equation.display}</Text>
                </View>

                <View style={styles.hintRow}>
                    {ruleMatches ? (
                        <View style={styles.goHint}>
                            <Ionicons name="hand-left-outline" size={14} color={COLORS.mint} />
                            <Text style={styles.goHintText}>{t.tap}</Text>
                        </View>
                    ) : (
                        <View style={styles.noGoHint}>
                            <Ionicons name="time-outline" size={14} color={COLORS.gray} />
                            <Text style={styles.noGoHintText}>{t.wait}</Text>
                        </View>
                    )}
                </View>
            </View>

            <View style={[styles.timerContainer, { paddingBottom: bottomPad + 16 }]}>
                <TimerBar
                    equationKey={equation.equationKey}
                    duration={timerDuration}
                    active={gameState === "playing"}
                />
                <Text style={styles.timerLabel}>
                    {(timerDuration / 1000).toFixed(1)}s
                </Text>
            </View>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: COLORS.background, paddingHorizontal: 24 },
    playArea: { justifyContent: "space-between" },
    gameHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 0 },
    gameCenter: { flex: 1, justifyContent: "center", alignItems: "center", gap: 20 },
    equationWrap: { alignItems: "center", marginVertical: 12 },
    equationText: { fontSize: 72, fontFamily: "Inter_700Bold", color: COLORS.dark, letterSpacing: -2, textAlign: "center" },
    hintRow: { height: 32, justifyContent: "center" },
    goHint: { flexDirection: "row", alignItems: "center", gap: 6, backgroundColor: COLORS.mint + "15", paddingHorizontal: 14, paddingVertical: 7, borderRadius: 20 },
    goHintText: { fontSize: 12, fontFamily: "Inter_700Bold", color: COLORS.mint, letterSpacing: 2 },
    noGoHint: { flexDirection: "row", alignItems: "center", gap: 6, backgroundColor: "#F0F0F0", paddingHorizontal: 14, paddingVertical: 7, borderRadius: 20 },
    noGoHintText: { fontSize: 12, fontFamily: "Inter_600SemiBold", color: COLORS.gray, letterSpacing: 2 },
    timerContainer: { gap: 8, paddingTop: 8 },
    timerLabel: { fontSize: 11, fontFamily: "Inter_400Regular", color: "#BDBDBD", textAlign: "right", letterSpacing: 0.5 },
});
