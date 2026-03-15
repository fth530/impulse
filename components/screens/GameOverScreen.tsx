import React from "react";
import { View, Text, StyleSheet, Pressable, ScrollView } from "react-native";
import { Ionicons, Feather } from "@expo/vector-icons";
import { COLORS } from "@/constants/colors";
import { GameEndData } from "@/hooks/useMathGame";
import { useT } from "@/i18n/LanguageContext";
import { getDifficultyLabelTranslated } from "@/i18n/ruleLabels";
import { useShareScore } from "@/hooks/useShareScore";

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
    const { shareScore } = useShareScore();
    const durationSecs = gameEndData ? Math.floor(gameEndData.durationMs / 1000) : 0;
    const durationStr =
        durationSecs >= 60
            ? `${Math.floor(durationSecs / 60)}m ${durationSecs % 60}s`
            : `${durationSecs}s`;
    const diffLabel = gameEndData ? getDifficultyLabelTranslated(gameEndData.maxDifficulty, t) : "";

    return (
        <ScrollView
            contentContainerStyle={[
                styles.container,
                { paddingTop: topPad + 16, paddingBottom: bottomPad + 24 },
            ]}
            showsVerticalScrollIndicator={false}
        >
            {/* Header Label */}
            <View style={styles.headerRow}>
                <View style={styles.gameOverPill}>
                    <View style={styles.redDot} />
                    <Text style={styles.gameOverText}>{t.gameOver}</Text>
                </View>
            </View>

            {/* Score Section */}
            <View style={styles.scoreSection}>
                <Text style={styles.scoreNumber}>{score}</Text>
                {isNewRecord ? (
                    <View style={styles.recordBadge}>
                        <Ionicons name="star" size={12} color="#FFFFFF" />
                        <Text style={styles.recordText}>{t.newRecord}</Text>
                    </View>
                ) : bestScore > 0 ? (
                    <Text style={styles.bestText}>
                        {t.bestInline(bestScore)}
                    </Text>
                ) : null}
            </View>

            {/* Stats Row */}
            {gameEndData && (
                <View style={styles.statsContainer}>
                    <View style={styles.statsRow}>
                        <StatItem
                            icon="checkmark-circle"
                            iconColor={COLORS.mint}
                            value={String(gameEndData.correctCount)}
                            label={t.correct}
                        />
                        <View style={styles.statSep} />
                        <StatItem
                            icon="time"
                            iconColor={COLORS.navy}
                            value={durationStr}
                            label={t.duration}
                        />
                    </View>
                    <View style={styles.statsRowDivider} />
                    <View style={styles.statsRow}>
                        <StatItem
                            icon="flame"
                            iconColor={COLORS.orange}
                            value={`${gameEndData.maxStreak}x`}
                            label={t.bestStreak}
                        />
                        <View style={styles.statSep} />
                        <StatItem
                            icon="speedometer"
                            iconColor="#FF3B30"
                            value={diffLabel}
                            label={t.level}
                        />
                    </View>
                </View>
            )}

            {/* Action Buttons */}
            <View style={styles.actions}>
                <Pressable
                    style={({ pressed }) => [
                        styles.primaryBtn,
                        pressed && styles.primaryBtnPressed,
                    ]}
                    onPress={onRestart}
                    accessibilityRole="button"
                    accessibilityLabel={t.playAgainAccessibility}
                >
                    <Ionicons name="refresh" size={20} color="#FFFFFF" />
                    <Text style={styles.primaryBtnText}>{t.playAgain}</Text>
                </Pressable>

                <View style={styles.secondaryRow}>
                    <Pressable
                        style={({ pressed }) => [
                            styles.secondaryBtn,
                            pressed && { opacity: 0.7 },
                        ]}
                        onPress={() => shareScore(score)}
                    >
                        <Feather name="share-2" size={15} color={COLORS.mint} />
                        <Text style={styles.secondaryBtnText}>{t.shareScore}</Text>
                    </Pressable>

                    <View style={styles.btnDivider} />

                    <Pressable
                        style={({ pressed }) => [
                            styles.secondaryBtn,
                            pressed && { opacity: 0.7 },
                        ]}
                        onPress={onMenu}
                        accessibilityRole="button"
                        accessibilityLabel={t.menuAccessibility}
                    >
                        <Feather name="home" size={15} color={COLORS.gray} />
                        <Text style={[styles.secondaryBtnText, { color: COLORS.gray }]}>
                            {t.menu}
                        </Text>
                    </Pressable>
                </View>
            </View>
        </ScrollView>
    );
}

// ── Stat Item Component ──
function StatItem({
    icon,
    iconColor,
    value,
    label,
}: {
    icon: keyof typeof Ionicons.glyphMap;
    iconColor: string;
    value: string;
    label: string;
}) {
    return (
        <View style={styles.statItem}>
            <Ionicons name={icon} size={16} color={iconColor} />
            <Text style={styles.statValue}>{value}</Text>
            <Text style={styles.statLabel}>{label}</Text>
        </View>
    );
}

// ── Styles ──
const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        alignItems: "center",
        paddingHorizontal: 24,
        justifyContent: "center",
        gap: 24,
    },

    // Header
    headerRow: {
        alignItems: "center",
    },
    gameOverPill: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
        backgroundColor: "#FFF0F0",
        paddingHorizontal: 18,
        paddingVertical: 10,
        borderRadius: 24,
    },
    redDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: "#FF3B30",
    },
    gameOverText: {
        fontSize: 13,
        fontFamily: "Inter_700Bold",
        color: "#FF3B30",
        letterSpacing: 3,
    },

    // Score
    scoreSection: {
        alignItems: "center",
        gap: 10,
    },
    scoreNumber: {
        fontSize: 96,
        fontFamily: "Inter_700Bold",
        color: COLORS.dark,
        lineHeight: 100,
        letterSpacing: -4,
    },
    recordBadge: {
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
        backgroundColor: COLORS.orange,
        paddingHorizontal: 16,
        paddingVertical: 7,
        borderRadius: 20,
    },
    recordText: {
        fontSize: 12,
        fontFamily: "Inter_700Bold",
        color: "#FFFFFF",
        letterSpacing: 1.5,
    },
    bestText: {
        fontSize: 14,
        fontFamily: "Inter_500Medium",
        color: COLORS.gray,
    },

    // Stats
    statsContainer: {
        width: "100%",
        backgroundColor: "#F8F9FA",
        borderRadius: 20,
        paddingVertical: 4,
        paddingHorizontal: 4,
    },
    statsRow: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 14,
    },
    statsRowDivider: {
        height: 1,
        backgroundColor: "#EEEFF1",
        marginHorizontal: 16,
    },
    statItem: {
        flex: 1,
        alignItems: "center",
        gap: 4,
    },
    statSep: {
        width: 1,
        height: 28,
        backgroundColor: "#E4E5E7",
    },
    statValue: {
        fontSize: 17,
        fontFamily: "Inter_700Bold",
        color: COLORS.dark,
    },
    statLabel: {
        fontSize: 10,
        fontFamily: "Inter_500Medium",
        color: COLORS.gray,
        letterSpacing: 0.3,
    },

    // Buttons
    actions: {
        width: "100%",
        gap: 12,
    },
    primaryBtn: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 10,
        backgroundColor: COLORS.mint,
        paddingVertical: 18,
        borderRadius: 50,
        shadowColor: COLORS.mint,
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.3,
        shadowRadius: 16,
        elevation: 8,
    },
    primaryBtnPressed: {
        transform: [{ scale: 0.97 }],
        shadowOpacity: 0.1,
    },
    primaryBtnText: {
        fontSize: 17,
        fontFamily: "Inter_700Bold",
        color: "#FFFFFF",
        letterSpacing: 1.5,
    },
    secondaryRow: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#F5F5F5",
        borderRadius: 16,
        paddingVertical: 4,
    },
    secondaryBtn: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 6,
        paddingVertical: 12,
    },
    secondaryBtnText: {
        fontSize: 13,
        fontFamily: "Inter_600SemiBold",
        color: COLORS.mint,
        letterSpacing: 0.5,
    },
    btnDivider: {
        width: 1,
        height: 20,
        backgroundColor: "#E0E0E0",
    },
});
