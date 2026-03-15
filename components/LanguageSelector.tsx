import React from "react";
import { View, Text, StyleSheet, Pressable, Platform } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { COLORS } from "@/constants/colors";
import { useLanguage } from "@/i18n/LanguageContext";
import { Language, LANGUAGES } from "@/i18n/translations";

interface Props {
  onComplete: () => void;
}

export function LanguageSelector({ onComplete }: Props) {
  const insets = useSafeAreaInsets();
  const { language, setLanguage } = useLanguage();

  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const bottomPad = Platform.OS === "web" ? 34 : insets.bottom;

  const handleSelect = (lang: Language) => {
    setLanguage(lang);
  };

  return (
    <View
      style={[
        styles.container,
        { paddingTop: topPad + 40, paddingBottom: bottomPad + 20 },
      ]}
    >
      <View style={styles.header}>
        <Text style={styles.globe}>🌍</Text>
        <Text style={styles.title}>Choose Your Language</Text>
        <Text style={styles.subtitle}>Select your preferred language</Text>
      </View>

      <View style={styles.grid}>
        {LANGUAGES.map((lang) => (
          <Pressable
            key={lang.code}
            style={({ pressed }) => [
              styles.langCard,
              language === lang.code && styles.langCardSelected,
              pressed && { opacity: 0.8 },
            ]}
            onPress={() => handleSelect(lang.code)}
          >
            <Text style={styles.flag}>{lang.flag}</Text>
            <Text
              style={[
                styles.langName,
                language === lang.code && styles.langNameSelected,
              ]}
            >
              {lang.name}
            </Text>
          </Pressable>
        ))}
      </View>

      <Pressable
        style={({ pressed }) => [
          styles.continueButton,
          pressed && { transform: [{ scale: 0.96 }], shadowOpacity: 0.15 },
        ]}
        onPress={onComplete}
      >
        <Text style={styles.continueText}>
          {language === "tr"
            ? "DEVAM ET"
            : language === "de"
              ? "WEITER"
              : language === "pt"
                ? "CONTINUAR"
                : language === "es"
                  ? "CONTINUAR"
                  : language === "fr"
                    ? "CONTINUER"
                    : language === "ja"
                      ? "続ける"
                      : language === "ko"
                        ? "계속하기"
                        : "CONTINUE"}
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    paddingHorizontal: 24,
    justifyContent: "space-between",
  },
  header: {
    alignItems: "center",
    gap: 8,
  },
  globe: {
    fontSize: 48,
    marginBottom: 8,
  },
  title: {
    fontSize: 24,
    fontFamily: "Inter_700Bold",
    color: COLORS.dark,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 15,
    fontFamily: "Inter_400Regular",
    color: COLORS.gray,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    justifyContent: "center",
  },
  langCard: {
    width: "47%",
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: "#F8F8F8",
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderWidth: 2,
    borderColor: "transparent",
  },
  langCardSelected: {
    borderColor: COLORS.mint,
    backgroundColor: COLORS.mint + "08",
  },
  flag: {
    fontSize: 28,
  },
  langName: {
    fontSize: 15,
    fontFamily: "Inter_600SemiBold",
    color: COLORS.dark,
  },
  langNameSelected: {
    color: COLORS.mint,
  },
  continueButton: {
    backgroundColor: COLORS.mint,
    paddingVertical: 18,
    borderRadius: 50,
    alignItems: "center",
    shadowColor: COLORS.mint,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 16,
    elevation: 8,
  },
  continueText: {
    fontSize: 18,
    fontFamily: "Inter_700Bold",
    color: "#FFFFFF",
    letterSpacing: 2,
  },
});
