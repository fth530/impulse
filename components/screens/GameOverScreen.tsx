import React from "react";
import { View, Text, StyleSheet, Pressable, ScrollView } from "react-native";
import { Ionicons, Feather } from "@expo/vector-icons";
import { COLORS } from "@/constants/colors";
import { GameEndData } from "@/hooks/useMathGame";
import { useT } from "@/i18n/LanguageContext";
import { getDifficultyLabelTranslated } from "@/i18n/ruleLabels";

interface GameOverScreenProps {
    score: number;
    bestScore: number;
    isNewRecord: boolean;
    gameEndData: GameEndData | null;
    onRestart: () => void;
    onMenu: () => void;
    topPad: number;
    bottomPad: number;
}

export function GameOverScreen({
    score,
    bestScore,
    isNewRecord,
    gameEndData,
    onRestart,
    onMenu,
    topPad,
    bottomPad,
}: GameOverScreenProps) {
    const t = useT();
    const durationSecs = gameEndData ? Math.floor(gameEndData.durationMs / 1000) : 0;
    const durationStr =
        durationSecs >= 60
            ? `${Math.floor(durationSecs / 60)}m ${durationSecs % 60}s`
            : `${durationSecs}s`;
    const diffLabel = gameEndData ? getDifficultyLabelTranslated(gameEndData.maxDifficulty, t) : "";

    return (
        <ScrollView
            contentContainerStyle={[styles.gameOverScroll, { paddingTop: topPad + 8, paddingBottom: bottomPad + 20 }]}
            showsVerticalScrollIndicator={false}
        >
            <View style={styles.scoreHero}>
                <View style={styles.scoreHeroTop}>
                    <Ionicons name="close-circle" size={36} color="#FF3B30" />
                    <Text style={styles.gameOverLabel}>{t.gameOver}</Text>
                </View>

                <Text style={styles.finalScore}>{score}</Text>

                {isNewRecord ? (
                    <View style={styles.newRecordBadge}>
                        <Ionicons name="trophy" size={14} color={COLORS.orange} />
                        <Text style={styles.newRecordText}>{t.newRecord}</Text>
                    </View>
                ) : bestScore > 0 ? (
                    <View style={styles.bestRowInline}>
                        <Ionicons name="trophy-outline" size={14} color={COLORS.orange} />
                        <Text style={styles.bestRowInlineText}>{t.bestInline(bestScore)}</Text>
                    </View>
                ) : null}
            </View>

            {gameEndData && (
                <View style={styles.statsGrid2x2}>
                    <View style={styles.stat2x2Card}>
                        <View style={[styles.stat2x2Icon, { backgroundColor: COLORS.mint + "15" }]}>
                            <Ionicons name="checkmark-circle" size={18} color={COLORS.mint} />
                        </View>
                        <Text style={styles.stat2x2Value}>{gameEndData.correctCount}</Text>
                        <Text style={styles.stat2x2Label}>{t.correct}</Text>
                    </View>

                    <View style={styles.stat2x2Card}>
                        <View style={[styles.stat2x2Icon, { backgroundColor: COLORS.navy + "12" }]}>
                            <Ionicons name="time" size={18} color={COLORS.navy} />
                        </View>
                        <Text style={styles.stat2x2Value}>{durationStr}</Text>
                        <Text style={styles.stat2x2Label}>{t.duration}</Text>
                    </View>

                    <View style={styles.stat2x2Card}>
                        <View style={[styles.stat2x2Icon, { backgroundColor: COLORS.orange + "15" }]}>
                            <Ionicons name="flame" size={18} color={COLORS.orange} />
                        </View>
                        <Text style={styles.stat2x2Value}>{gameEndData.maxStreak}x</Text>
                        <Text style={styles.stat2x2Label}>{t.bestStreak}</Text>
                    </View>

                    <View style={styles.stat2x2Card}>
                        <View style={[styles.stat2x2Icon, { backgroundColor: "#FF3B30" + "12" }]}>
                            <Ionicons name="speedometer" size={18} color="#FF3B30" />
                        </View>
                        <Text style={styles.stat2x2Value}>{diffLabel}</Text>
                        <Text style={styles.stat2x2Label}>{t.level}</Text>
                    </View>
                </View>
            )}

            <View style={styles.gameOverButtons}>
                <Pressable
                    style={({ pressed }) => [styles.restartButton, pressed && styles.restartButtonPressed]}
                    onPress={onRestart}
                    accessibilityRole="button"
                    accessibilityLabel={t.playAgainAccessibility}
                >
                    <Ionicons name="refresh" size={20} color="#FFFFFF" />
                    <Text style={styles.restartButtonText}>{t.playAgain}</Text>
                </Pressable>

                <Pressable
                    style={({ pressed }) => [styles.menuButtonSmall, pressed && { opacity: 0.6 }]}
                    onPress={onMenu}
                    accessibilityRole="button"
                    accessibilityLabel={t.menuAccessibility}
                >
                    <Feather name="home" size={16} color={COLORS.gray} />
                    <Text style={styles.menuButtonSmallText}>{t.menu}</Text>
                </Pressable>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    gameOverScroll: { flexGrow: 1, alignItems: "center", gap: 16, paddingBottom: 20, paddingTop: 8, paddingHorizontal: 24 },
    scoreHero: { alignItems: "center", gap: 6, width: "100%", backgroundColor: "#F8F8F8", borderRadius: 24, paddingVertical: 28, paddingHorizontal: 20 },
    scoreHeroTop: { flexDirection: "row", alignItems: "center", gap: 8 },
    gameOverLabel: { fontSize: 13, fontFamily: "Inter_700Bold", color: COLORS.gray, letterSpacing: 3 },
    finalScore: { fontSize: 80, fontFamily: "Inter_700Bold", color: COLORS.dark, lineHeight: 92, letterSpacing: -3 },
    newRecordBadge: { flexDirection: "row", alignItems: "center", gap: 6, backgroundColor: COLORS.orange + "18", paddingHorizontal: 14, paddingVertical: 6, borderRadius: 20, borderWidth: 1, borderColor: COLORS.orange + "40" },
    newRecordText: { fontSize: 12, fontFamily: "Inter_700Bold", color: COLORS.orange, letterSpacing: 1.5 },
    bestRowInline: { flexDirection: "row", alignItems: "center", gap: 5 },
    bestRowInlineText: { fontSize: 13, fontFamily: "Inter_500Medium", color: COLORS.gray },
    statsGrid2x2: { flexDirection: "row", flexWrap: "wrap", gap: 10, width: "100%" },
    stat2x2Card: { width: "48%", flexGrow: 1, backgroundColor: "#F8F8F8", borderRadius: 16, paddingVertical: 14, paddingHorizontal: 14, alignItems: "center", gap: 6 },
    stat2x2Icon: { width: 34, height: 34, borderRadius: 10, alignItems: "center", justifyContent: "center" },
    stat2x2Value: { fontSize: 18, fontFamily: "Inter_700Bold", color: COLORS.dark },
    stat2x2Label: { fontSize: 11, fontFamily: "Inter_500Medium", color: COLORS.gray, letterSpacing: 0.3 },
    gameOverButtons: { alignItems: "center", gap: 12, marginTop: 8, width: "100%" },
    restartButton: { flexDirection: "row", alignItems: "center", gap: 10, backgroundColor: COLORS.mint, paddingHorizontal: 40, paddingVertical: 18, borderRadius: 50, shadowColor: COLORS.mint, shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.3, shadowRadius: 16, elevation: 8, width: "100%", justifyContent: "center" },
    restartButtonPressed: { transform: [{ scale: 0.96 }], shadowOpacity: 0.1 },
    restartButtonText: { fontSize: 17, fontFamily: "Inter_700Bold", color: "#FFFFFF", letterSpacing: 1.5 },
    menuButtonSmall: { flexDirection: "row", alignItems: "center", gap: 8, paddingVertical: 12 },
    menuButtonSmallText: { fontSize: 14, fontFamily: "Inter_500Medium", color: COLORS.gray, letterSpacing: 1 },
});
