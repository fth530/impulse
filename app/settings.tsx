import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Switch,
  Alert,
  Platform,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Feather, Ionicons } from "@expo/vector-icons";
import { COLORS } from "@/constants/colors";
import { useSettings } from "@/hooks/useSettings";
import { useGameHistory } from "@/hooks/useGameHistory";
import AsyncStorage from "@react-native-async-storage/async-storage";

const BEST_SCORE_KEY = "tek_tus_best_score";

export default function SettingsScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { settings, updateSetting } = useSettings();
  const { clearHistory } = useGameHistory();

  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const bottomPad = Platform.OS === "web" ? 34 : insets.bottom;

  const handleClearData = () => {
    if (Platform.OS === "web") {
      if (confirm("Tüm skor geçmişi ve en iyi skor sıfırlanacak. Emin misin?")) {
        doClear();
      }
      return;
    }
    Alert.alert(
      "Verileri Sıfırla",
      "Tüm skor geçmişi ve en iyi skor sıfırlanacak. Bu işlem geri alınamaz.",
      [
        { text: "İptal", style: "cancel" },
        {
          text: "Sıfırla",
          style: "destructive",
          onPress: doClear,
        },
      ],
    );
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
      {/* Header */}
      <View style={styles.header}>
        <Pressable
          style={styles.backButton}
          onPress={() => router.back()}
          hitSlop={12}
        >
          <Feather name="arrow-left" size={22} color={COLORS.dark} />
        </Pressable>
        <Text style={styles.headerTitle}>AYARLAR</Text>
        <View style={{ width: 36 }} />
      </View>

      <View style={styles.content}>
        {/* Haptic */}
        <View style={styles.settingRow}>
          <View style={styles.settingInfo}>
            <View style={styles.settingIconWrap}>
              <Ionicons name="phone-portrait-outline" size={18} color={COLORS.mint} />
            </View>
            <View>
              <Text style={styles.settingLabel}>Titreşim</Text>
              <Text style={styles.settingDesc}>Dokunmatik geri bildirim</Text>
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
              <Text style={styles.settingLabel}>Ses Efektleri</Text>
              <Text style={styles.settingDesc}>Müzik ve ses efektleri</Text>
            </View>
          </View>
          <Switch
            value={settings.soundEnabled}
            onValueChange={(val) => updateSetting("soundEnabled", val)}
            trackColor={{ false: "#E0E0E0", true: COLORS.mint + "60" }}
            thumbColor={settings.soundEnabled ? COLORS.mint : "#F5F5F5"}
          />
        </View>

        {/* Divider */}
        <View style={styles.divider} />

        {/* Clear Data */}
        <Pressable
          style={({ pressed }) => [
            styles.dangerButton,
            pressed && { opacity: 0.7 },
          ]}
          onPress={handleClearData}
        >
          <Ionicons name="trash-outline" size={18} color="#FF3B30" />
          <Text style={styles.dangerButtonText}>Verileri Sıfırla</Text>
        </Pressable>
        <Text style={styles.dangerHint}>
          Skor geçmişi ve en iyi skor silinir
        </Text>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>IMPULSE v1.0</Text>
        <Text style={styles.footerText}>Tek Tuş Matematik</Text>
      </View>
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
    paddingBottom: 24,
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
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  settingRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  settingInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  settingIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: "#F5F5F5",
    alignItems: "center",
    justifyContent: "center",
  },
  settingLabel: {
    fontSize: 15,
    fontFamily: "Inter_600SemiBold",
    color: COLORS.dark,
  },
  settingDesc: {
    fontSize: 12,
    fontFamily: "Inter_400Regular",
    color: COLORS.gray,
    marginTop: 1,
  },
  divider: {
    height: 1,
    backgroundColor: "#F0F0F0",
    marginVertical: 24,
  },
  dangerButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: "#FF3B30" + "10",
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#FF3B30" + "20",
  },
  dangerButtonText: {
    fontSize: 15,
    fontFamily: "Inter_600SemiBold",
    color: "#FF3B30",
  },
  dangerHint: {
    fontSize: 12,
    fontFamily: "Inter_400Regular",
    color: COLORS.gray,
    marginTop: 8,
    paddingLeft: 4,
  },
  footer: {
    alignItems: "center",
    gap: 2,
    paddingBottom: 8,
  },
  footerText: {
    fontSize: 11,
    fontFamily: "Inter_400Regular",
    color: COLORS.gray + "80",
  },
});
