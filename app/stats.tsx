import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  Platform,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Ionicons, Feather } from "@expo/vector-icons";
import { COLORS } from "@/constants/colors";
import { useGameHistory } from "@/hooks/useGameHistory";
import { useT } from "@/i18n/LanguageContext";
import { getDifficultyLabelTranslated } from "@/i18n/ruleLabels";

function formatDate(iso: string): string {
  const d = new Date(iso);
  const day = d.getDate().toString().padStart(2, "0");
  const month = (d.getMonth() + 1).toString().padStart(2, "0");
  const hour = d.getHours().toString().padStart(2, "0");
  const min = d.getMinutes().toString().padStart(2, "0");
  return `${day}.${month} ${hour}:${min}`;
}

function formatDuration(ms: number): string {
  const secs = Math.floor(ms / 1000);
  const m = Math.floor(secs / 60);
  const s = secs % 60;
  return m > 0 ? `${m}m ${s}s` : `${s}s`;
}

export default function StatsScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { history, stats } = useGameHistory();
  const t = useT();

  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const bottomPad = Platform.OS === "web" ? 34 : insets.bottom;

  return (
    <View
      style={[
        styles.container,
        { paddingTop: topPad + 16, paddingBottom: bottomPad },
      ]}
    >
      {/* Header */}
      <View style={styles.header}>
        <Pressable
          style={styles.backButton}
          onPress={() => router.back()}
          hitSlop={12}
        >
          <Feather name="arrow-left" size={22} color={COLORS.dark} />
        </Pressable>
        <Text style={styles.headerTitle}>{t.statsTitle}</Text>
        <View style={{ width: 36 }} />
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Stats Cards */}
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <Ionicons name="game-controller-outline" size={20} color={COLORS.mint} />
            <Text style={styles.statValue}>{stats.totalGames}</Text>
            <Text style={styles.statLabel}>{t.totalGames}</Text>
          </View>
          <View style={styles.statCard}>
            <Ionicons name="analytics-outline" size={20} color={COLORS.mint} />
            <Text style={styles.statValue}>{stats.averageScore}</Text>
            <Text style={styles.statLabel}>{t.averageScore}</Text>
          </View>
          <View style={styles.statCard}>
            <Ionicons name="trophy-outline" size={20} color={COLORS.orange} />
            <Text style={styles.statValue}>{stats.bestScore}</Text>
            <Text style={styles.statLabel}>{t.bestScore}</Text>
          </View>
          <View style={styles.statCard}>
            <Ionicons name="flame-outline" size={20} color="#FF3B30" />
            <Text style={styles.statValue}>{stats.longestStreak}</Text>
            <Text style={styles.statLabel}>{t.longestStreak}</Text>
          </View>
        </View>

        {/* Accuracy */}
        {stats.totalGames > 0 && (
          <View style={styles.accuracyCard}>
            <Text style={styles.accuracyTitle}>{t.accuracyTitle}</Text>
            <View style={styles.accuracyRow}>
              <View style={styles.accuracyBarBg}>
                <View
                  style={[
                    styles.accuracyBarFill,
                    {
                      width: `${
                        stats.totalCorrect + stats.totalWrong > 0
                          ? Math.round(
                              (stats.totalCorrect /
                                (stats.totalCorrect + stats.totalWrong)) *
                                100,
                            )
                          : 0
                      }%`,
                    },
                  ]}
                />
              </View>
              <Text style={styles.accuracyPercent}>
                {stats.totalCorrect + stats.totalWrong > 0
                  ? Math.round(
                      (stats.totalCorrect /
                        (stats.totalCorrect + stats.totalWrong)) *
                        100,
                    )
                  : 0}
                %
              </Text>
            </View>
            <View style={styles.accuracyDetails}>
              <Text style={styles.accuracyDetailText}>
                {t.correctWrong(stats.totalCorrect, stats.totalWrong)}
              </Text>
            </View>
          </View>
        )}

        {/* History List */}
        <Text style={styles.sectionTitle}>{t.scoreHistory}</Text>

        {history.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="hourglass-outline" size={32} color={COLORS.gray + "60"} />
            <Text style={styles.emptyText}>{t.noGamesYet}</Text>
          </View>
        ) : (
          history.map((record, i) => (
            <View key={i} style={styles.historyRow}>
              <View style={styles.historyRank}>
                <Text style={styles.historyRankText}>#{i + 1}</Text>
              </View>
              <View style={styles.historyInfo}>
                <Text style={styles.historyScore}>{record.score} {t.points}</Text>
                <Text style={styles.historyMeta}>
                  {formatDate(record.date)} · {formatDuration(record.durationMs)} ·{" "}
                  {getDifficultyLabelTranslated(record.maxDifficulty, t)}
                </Text>
              </View>
              <View style={styles.historyStreak}>
                <Ionicons name="flame-outline" size={12} color={COLORS.orange} />
                <Text style={styles.historyStreakText}>{record.maxStreak}</Text>
              </View>
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: "#F5F5F5",
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    fontSize: 14,
    fontFamily: "Inter_700Bold",
    color: COLORS.dark,
    letterSpacing: 3,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginBottom: 20,
  },
  statCard: {
    flex: 1,
    minWidth: "45%",
    backgroundColor: "#F8F8F8",
    borderRadius: 16,
    padding: 16,
    alignItems: "center",
    gap: 6,
  },
  statValue: {
    fontSize: 28,
    fontFamily: "Inter_700Bold",
    color: COLORS.dark,
  },
  statLabel: {
    fontSize: 11,
    fontFamily: "Inter_500Medium",
    color: COLORS.gray,
    letterSpacing: 0.5,
  },
  accuracyCard: {
    backgroundColor: "#F8F8F8",
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
    gap: 10,
  },
  accuracyTitle: {
    fontSize: 10,
    fontFamily: "Inter_600SemiBold",
    color: COLORS.gray,
    letterSpacing: 2,
  },
  accuracyRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  accuracyBarBg: {
    flex: 1,
    height: 8,
    backgroundColor: "#E8E8E8",
    borderRadius: 4,
    overflow: "hidden",
  },
  accuracyBarFill: {
    height: "100%",
    backgroundColor: COLORS.mint,
    borderRadius: 4,
  },
  accuracyPercent: {
    fontSize: 16,
    fontFamily: "Inter_700Bold",
    color: COLORS.dark,
    minWidth: 45,
    textAlign: "right",
  },
  accuracyDetails: {
    alignItems: "center",
  },
  accuracyDetailText: {
    fontSize: 12,
    fontFamily: "Inter_400Regular",
    color: COLORS.gray,
  },
  sectionTitle: {
    fontSize: 11,
    fontFamily: "Inter_600SemiBold",
    color: COLORS.gray,
    letterSpacing: 2,
    marginBottom: 12,
  },
  emptyState: {
    alignItems: "center",
    gap: 8,
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 14,
    fontFamily: "Inter_400Regular",
    color: COLORS.gray,
  },
  historyRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8F8F8",
    borderRadius: 12,
    padding: 14,
    marginBottom: 8,
    gap: 12,
  },
  historyRank: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: "#EFEFEF",
    alignItems: "center",
    justifyContent: "center",
  },
  historyRankText: {
    fontSize: 11,
    fontFamily: "Inter_600SemiBold",
    color: COLORS.gray,
  },
  historyInfo: {
    flex: 1,
    gap: 2,
  },
  historyScore: {
    fontSize: 15,
    fontFamily: "Inter_700Bold",
    color: COLORS.dark,
  },
  historyMeta: {
    fontSize: 11,
    fontFamily: "Inter_400Regular",
    color: COLORS.gray,
  },
  historyStreak: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
    backgroundColor: COLORS.orange + "15",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
  },
  historyStreakText: {
    fontSize: 12,
    fontFamily: "Inter_600SemiBold",
    color: COLORS.orange,
  },
});
