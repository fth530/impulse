import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Switch,
  Alert,
  Platform,
  Linking,
  ScrollView,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Feather, Ionicons } from "@expo/vector-icons";
import { COLORS } from "@/constants/colors";
import { useSettings } from "@/hooks/useSettings";
import { useGameHistory } from "@/hooks/useGameHistory";
import { useLanguage, useT } from "@/i18n/LanguageContext";
import { LANGUAGES, Language } from "@/i18n/translations";
import AsyncStorage from "@react-native-async-storage/async-storage";

const BEST_SCORE_KEY = "tek_tus_best_score";

export default function SettingsScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { settings, updateSetting } = useSettings();
  const { clearHistory } = useGameHistory();
  const { language, setLanguage } = useLanguage();
  const t = useT();

  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const bottomPad = Platform.OS === "web" ? 34 : insets.bottom;

  const currentLang = LANGUAGES.find((l) => l.code === language);

  const handleClearData = () => {
    if (Platform.OS === "web") {
      if (confirm(t.clearDataConfirmMsg)) {
        doClear();
      }
      return;
    }
    Alert.alert(t.clearDataConfirmTitle, t.clearDataConfirmMsg, [
      { text: t.cancel, style: "cancel" },
      { text: t.reset, style: "destructive", onPress: doClear },
    ]);
  };

  const handleLanguageChange = () => {
    const options = LANGUAGES.map((l) => ({
      text: `${l.flag} ${l.nativeName}`,
      onPress: () => setLanguage(l.code),
    }));
    options.push({ text: t.cancel, onPress: () => {} });

    if (Platform.OS === "web") return;
    Alert.alert(t.language, "", options);
  };

  const doClear = async () => {
    await clearHistory();
    await AsyncStorage.removeItem(BEST_SCORE_KEY);
    router.back();
  };

  return (
    <View
      style={[
        styles.container,
        { paddingTop: topPad + 16, paddingBottom: bottomPad + 20 },
      ]}
    >
      <View style={styles.header}>
        <Pressable style={styles.backButton} onPress={() => router.back()} hitSlop={12}>
          <Feather name="arrow-left" size={22} color={COLORS.dark} />
        </Pressable>
        <Text style={styles.headerTitle}>{t.settingsTitle}</Text>
        <View style={{ width: 36 }} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Haptic */}
        <View style={styles.settingRow}>
          <View style={styles.settingInfo}>
            <View style={styles.settingIconWrap}>
              <Ionicons name="phone-portrait-outline" size={18} color={COLORS.mint} />
            </View>
            <View>
              <Text style={styles.settingLabel}>{t.vibration}</Text>
              <Text style={styles.settingDesc}>{t.vibrationDesc}</Text>
            </View>
          </View>
          <Switch
            value={settings.hapticEnabled}
            onValueChange={(val) => updateSetting("hapticEnabled", val)}
            trackColor={{ false: "#E0E0E0", true: COLORS.mint + "60" }}
            thumbColor={settings.hapticEnabled ? COLORS.mint : "#F5F5F5"}
          />
        </View>

        {/* Sound */}
        <View style={styles.settingRow}>
          <View style={styles.settingInfo}>
            <View style={styles.settingIconWrap}>
              <Ionicons name="volume-medium-outline" size={18} color={COLORS.mint} />
            </View>
            <View>
              <Text style={styles.settingLabel}>{t.soundEffects}</Text>
              <Text style={styles.settingDesc}>{t.soundDesc}</Text>
            </View>
          </View>
          <Switch
            value={settings.soundEnabled}
            onValueChange={(val) => updateSetting("soundEnabled", val)}
            trackColor={{ false: "#E0E0E0", true: COLORS.mint + "60" }}
            thumbColor={settings.soundEnabled ? COLORS.mint : "#F5F5F5"}
          />
        </View>

        {/* Language */}
        <Pressable
          style={({ pressed }) => [styles.linkRow, pressed && { opacity: 0.6 }]}
          onPress={handleLanguageChange}
        >
          <View style={styles.settingInfo}>
            <View style={styles.settingIconWrap}>
              <Ionicons name="globe-outline" size={18} color={COLORS.mint} />
            </View>
            <View>
              <Text style={styles.settingLabel}>{t.language}</Text>
              <Text style={styles.settingDesc}>{currentLang?.flag} {currentLang?.nativeName}</Text>
            </View>
          </View>
          <Feather name="chevron-right" size={16} color={COLORS.gray} />
        </Pressable>

        <View style={styles.divider} />

        {/* Privacy Policy */}
        <Pressable
          style={({ pressed }) => [styles.linkRow, pressed && { opacity: 0.6 }]}
          onPress={() => Linking.openURL("https://github.com/fth530/mathpulse/blob/main/PRIVACY_POLICY.md")}
        >
          <View style={styles.settingInfo}>
            <View style={styles.settingIconWrap}>
              <Ionicons name="shield-checkmark-outline" size={18} color={COLORS.mint} />
            </View>
            <Text style={styles.settingLabel}>{t.privacyPolicy}</Text>
          </View>
          <Feather name="external-link" size={16} color={COLORS.gray} />
        </Pressable>

        {/* Support */}
        <Pressable
          style={({ pressed }) => [styles.linkRow, pressed && { opacity: 0.6 }]}
          onPress={() => Linking.openURL("mailto:mathpulse.app@gmail.com")}
        >
          <View style={styles.settingInfo}>
            <View style={styles.settingIconWrap}>
              <Ionicons name="mail-outline" size={18} color={COLORS.mint} />
            </View>
            <Text style={styles.settingLabel}>{t.supportContact}</Text>
          </View>
          <Feather name="external-link" size={16} color={COLORS.gray} />
        </Pressable>

        <View style={styles.divider} />

        {/* Clear Data */}
        <Pressable
          style={({ pressed }) => [styles.dangerButton, pressed && { opacity: 0.7 }]}
          onPress={handleClearData}
        >
          <Ionicons name="trash-outline" size={18} color="#FF3B30" />
          <Text style={styles.dangerButtonText}>{t.clearData}</Text>
        </Pressable>
        <Text style={styles.dangerHint}>{t.clearDataHint}</Text>
      </ScrollView>

      <View style={styles.footer}>
        <Text style={styles.footerText}>MathPulse v1.0.0 (Build 1)</Text>
        <Text style={styles.footerText}>{t.appTagline}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 20, paddingBottom: 24 },
  backButton: { width: 36, height: 36, borderRadius: 12, backgroundColor: "#F5F5F5", alignItems: "center", justifyContent: "center" },
  headerTitle: { fontSize: 14, fontFamily: "Inter_700Bold", color: COLORS.dark, letterSpacing: 3 },
  content: { flex: 1, paddingHorizontal: 20 },
  settingRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: "#F0F0F0" },
  settingInfo: { flexDirection: "row", alignItems: "center", gap: 12 },
  settingIconWrap: { width: 36, height: 36, borderRadius: 10, backgroundColor: "#F5F5F5", alignItems: "center", justifyContent: "center" },
  settingLabel: { fontSize: 15, fontFamily: "Inter_600SemiBold", color: COLORS.dark },
  settingDesc: { fontSize: 12, fontFamily: "Inter_400Regular", color: COLORS.gray, marginTop: 1 },
  divider: { height: 1, backgroundColor: "#F0F0F0", marginVertical: 24 },
  dangerButton: { flexDirection: "row", alignItems: "center", gap: 10, backgroundColor: "#FF3B30" + "10", paddingHorizontal: 20, paddingVertical: 14, borderRadius: 14, borderWidth: 1, borderColor: "#FF3B30" + "20" },
  dangerButtonText: { fontSize: 15, fontFamily: "Inter_600SemiBold", color: "#FF3B30" },
  dangerHint: { fontSize: 12, fontFamily: "Inter_400Regular", color: COLORS.gray, marginTop: 8, paddingLeft: 4 },
  linkRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: "#F0F0F0" },
  footer: { alignItems: "center", gap: 2, paddingBottom: 8 },
  footerText: { fontSize: 11, fontFamily: "Inter_400Regular", color: COLORS.gray + "80" },
});
