import React, { useState } from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { Ionicons, Feather } from "@expo/vector-icons";
import { COLORS } from "@/constants/colors";
import { HowToPlayModal } from "@/components/HowToPlayModal";
import { useRouter } from "expo-router";
import { useT } from "@/i18n/LanguageContext";

interface MenuScreenProps {
    topPad: number;
    bottomPad: number;
    bestScore: number;
    onPlay: () => void;
}

export function MenuScreen({ topPad, bottomPad, bestScore, onPlay }: MenuScreenProps) {
    const router = useRouter();
    const [showHowTo, setShowHowTo] = useState(false);
    const t = useT();

    return (
        <View style={[styles.container, { paddingTop: topPad + 20, paddingBottom: bottomPad + 20 }]}>
            <View style={styles.menuTopBar}>
                <View style={styles.menuBadge}>
                    <Ionicons name="flash" size={18} color={COLORS.mint} />
                    <Text style={styles.menuBadgeText}>{t.menuBadge}</Text>
                </View>
                <View style={styles.menuTopActions}>
                    <Pressable
                        style={({ pressed }) => [styles.menuIconButton, pressed && { opacity: 0.6 }]}
                        onPress={() => router.push("/stats" as any)}
                        hitSlop={8}
                    >
                        <Ionicons name="stats-chart" size={18} color={COLORS.gray} />
                    </Pressable>
                    <Pressable
                        style={({ pressed }) => [styles.menuIconButton, pressed && { opacity: 0.6 }]}
                        onPress={() => router.push("/settings" as any)}
                        hitSlop={8}
                    >
                        <Feather name="settings" size={18} color={COLORS.gray} />
                    </Pressable>
                </View>
            </View>

            <View style={styles.menuCenter}>
                <Text style={styles.menuTitle}>{t.menuTitle}</Text>
                <Text style={styles.menuSubtitle}>{t.menuSubtitle}</Text>
                <View style={styles.menuDivider} />
                <Text style={styles.menuTagline}>{t.menuTagline}</Text>
            </View>

            <View style={styles.menuActions}>
                {bestScore > 0 && (
                    <Pressable style={styles.bestScoreCard} onPress={() => router.push("/stats" as any)}>
                        <View style={styles.bestScoreIconWrap}>
                            <Ionicons name="trophy" size={24} color={COLORS.orange} />
                        </View>
                        <View style={styles.bestScoreInfo}>
                            <Text style={styles.bestScoreLabel}>{t.bestScoreLabel}</Text>
                            <Text style={styles.bestScoreValue}>{bestScore}</Text>
                        </View>
                        <Feather name="chevron-right" size={18} color={COLORS.gray + "60"} />
                    </Pressable>
                )}

                <Pressable
                    style={({ pressed }) => [styles.playButton, pressed && styles.playButtonPressed]}
                    onPress={onPlay}
                    accessibilityRole="button"
                    accessibilityLabel={t.playAccessibility}
                >
                    <Text style={styles.playButtonText}>{t.play}</Text>
                    <Ionicons name="arrow-forward" size={20} color="#FFFFFF" />
                </Pressable>

                <Pressable
                    style={({ pressed }) => [styles.howToButton, pressed && { opacity: 0.6 }]}
                    onPress={() => setShowHowTo(true)}
                    accessibilityRole="button"
                    accessibilityLabel={t.howToPlayAccessibility}
                >
                    <Feather name="help-circle" size={16} color={COLORS.gray} />
                    <Text style={styles.howToButtonText}>{t.howToPlay}</Text>
                </Pressable>
            </View>

            <HowToPlayModal visible={showHowTo} onClose={() => setShowHowTo(false)} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: COLORS.background, paddingHorizontal: 24 },
    menuTopBar: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
    menuBadge: { flexDirection: "row", alignItems: "center", gap: 6, backgroundColor: COLORS.mint + "15", paddingHorizontal: 14, paddingVertical: 7, borderRadius: 20, borderWidth: 1, borderColor: COLORS.mint + "30" },
    menuBadgeText: { fontSize: 11, fontFamily: "Inter_600SemiBold", color: COLORS.mint, letterSpacing: 2 },
    menuTopActions: { flexDirection: "row", gap: 8 },
    menuIconButton: { width: 36, height: 36, borderRadius: 12, backgroundColor: "#F5F5F5", alignItems: "center", justifyContent: "center" },
    menuCenter: { flex: 1, justifyContent: "center", alignItems: "center", gap: 4 },
    menuTitle: { fontSize: 52, fontFamily: "Inter_700Bold", color: COLORS.dark, letterSpacing: -2, lineHeight: 58 },
    menuSubtitle: { fontSize: 28, fontFamily: "Inter_400Regular", color: COLORS.gray, letterSpacing: 6, textTransform: "uppercase" },
    menuDivider: { width: 40, height: 3, backgroundColor: COLORS.mint, borderRadius: 2, marginTop: 20, marginBottom: 16 },
    menuTagline: { fontSize: 15, fontFamily: "Inter_400Regular", color: COLORS.gray, letterSpacing: 0.3 },
    menuActions: { alignItems: "center", gap: 16, paddingBottom: 8 },
    bestScoreCard: { flexDirection: "row", alignItems: "center", backgroundColor: "#F8F8F8", borderRadius: 16, paddingHorizontal: 20, paddingVertical: 14, width: "100%", gap: 14, borderWidth: 1, borderColor: COLORS.orange + "20" },
    bestScoreIconWrap: { width: 44, height: 44, borderRadius: 14, backgroundColor: COLORS.orange + "15", alignItems: "center", justifyContent: "center" },
    bestScoreInfo: { flex: 1, gap: 2 },
    bestScoreLabel: { fontSize: 10, fontFamily: "Inter_600SemiBold", color: COLORS.gray, letterSpacing: 2 },
    bestScoreValue: { fontSize: 28, fontFamily: "Inter_700Bold", color: COLORS.dark, letterSpacing: -1 },
    playButton: { flexDirection: "row", alignItems: "center", gap: 10, backgroundColor: COLORS.mint, paddingHorizontal: 48, paddingVertical: 18, borderRadius: 50, shadowColor: COLORS.mint, shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.35, shadowRadius: 16, elevation: 8, width: "100%", justifyContent: "center" },
    playButtonPressed: { transform: [{ scale: 0.96 }], shadowOpacity: 0.15 },
    playButtonText: { fontSize: 18, fontFamily: "Inter_700Bold", color: "#FFFFFF", letterSpacing: 2 },
    howToButton: { flexDirection: "row", alignItems: "center", gap: 8, paddingVertical: 10, paddingHorizontal: 16 },
    howToButtonText: { fontSize: 13, fontFamily: "Inter_500Medium", color: COLORS.gray, letterSpacing: 1 },
});
