import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { COLORS } from "@/constants/colors";

interface Props {
  data: { score: number }[];
  currentScore?: number;
}

export function MiniBarChart({ data, currentScore }: Props) {
  if (data.length === 0 && currentScore === undefined) return null;

  // Build items: previous games + current
  const items: { score: number; isCurrent: boolean }[] = data.map((d) => ({
    score: d.score,
    isCurrent: false,
  }));
  if (currentScore !== undefined) {
    items.push({ score: currentScore, isCurrent: true });
  }

  const maxVal = Math.max(...items.map((i) => i.score), 1);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>SKOR GEÇMİŞİ</Text>
        <Text style={styles.subtitle}>{items.length} oyun</Text>
      </View>

      <View style={styles.chartArea}>
        {/* Horizontal grid lines */}
        <View style={styles.gridLines}>
          <View style={styles.gridLine} />
          <View style={styles.gridLine} />
          <View style={styles.gridLine} />
        </View>

        {/* Bars */}
        <View style={styles.barsRow}>
          {items.map((item, i) => {
            const ratio = maxVal > 0 ? item.score / maxVal : 0;
            const barH = Math.max(ratio * 56, 3);

            return (
              <View key={i} style={styles.barCol}>
                <View style={styles.barArea}>
                  <View
                    style={[
                      styles.bar,
                      {
                        height: barH,
                        backgroundColor: item.isCurrent
                          ? COLORS.mint
                          : COLORS.mint + "35",
                      },
                    ]}
                  >
                    {/* Score dot on top */}
                    <View
                      style={[
                        styles.dotWrap,
                        item.isCurrent && styles.dotWrapCurrent,
                      ]}
                    >
                      <Text
                        style={[
                          styles.dotText,
                          item.isCurrent && styles.dotTextCurrent,
                        ]}
                      >
                        {item.score}
                      </Text>
                    </View>
                  </View>
                </View>
                <Text
                  style={[
                    styles.label,
                    item.isCurrent && styles.labelCurrent,
                  ]}
                >
                  {item.isCurrent ? "Şimdi" : `#${i + 1}`}
                </Text>
              </View>
            );
          })}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    backgroundColor: "#F8F8F8",
    borderRadius: 16,
    padding: 16,
    gap: 12,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    fontSize: 10,
    fontFamily: "Inter_600SemiBold",
    color: COLORS.gray,
    letterSpacing: 2,
  },
  subtitle: {
    fontSize: 10,
    fontFamily: "Inter_400Regular",
    color: COLORS.gray + "80",
  },
  chartArea: {
    height: 100,
    justifyContent: "flex-end",
  },
  gridLines: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 16,
    justifyContent: "space-between",
  },
  gridLine: {
    height: 1,
    backgroundColor: "#E8E8E8",
  },
  barsRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 6,
    paddingBottom: 16,
  },
  barCol: {
    flex: 1,
    alignItems: "center",
    gap: 6,
  },
  barArea: {
    width: "100%",
    alignItems: "center",
    justifyContent: "flex-end",
  },
  bar: {
    width: 14,
    borderRadius: 7,
    minHeight: 3,
    alignItems: "center",
  },
  dotWrap: {
    position: "absolute",
    top: -20,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 5,
    paddingVertical: 2,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 3,
    elevation: 1,
  },
  dotWrapCurrent: {
    backgroundColor: COLORS.mint,
  },
  dotText: {
    fontSize: 10,
    fontFamily: "Inter_700Bold",
    color: COLORS.dark,
  },
  dotTextCurrent: {
    color: "#FFFFFF",
  },
  label: {
    fontSize: 9,
    fontFamily: "Inter_400Regular",
    color: COLORS.gray + "80",
  },
  labelCurrent: {
    fontFamily: "Inter_700Bold",
    color: COLORS.mint,
    fontSize: 9,
  },
});
