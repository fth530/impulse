import React from "react";
import { View, Text, StyleSheet, Pressable, Modal, ScrollView } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { COLORS } from "@/constants/colors";
import { Ionicons, Feather } from "@expo/vector-icons";
import { useT } from "@/i18n/LanguageContext";

interface HowToPlayModalProps {
    visible: boolean;
    onClose: () => void;
}

export function HowToPlayModal({ visible, onClose }: HowToPlayModalProps) {
    const insets = useSafeAreaInsets();
    const t = useT();

    const rules = [
        { icon: "checkmark-circle" as const, color: COLORS.mint, title: t.howToRule1Title, desc: t.howToRule1Desc },
        { icon: "hand-left" as const, color: COLORS.navy, title: t.howToRule2Title, desc: t.howToRule2Desc },
        { icon: "flash" as const, color: COLORS.orange, title: t.howToRule3Title, desc: t.howToRule3Desc },
        { icon: "trending-up" as const, color: "#FF3B30", title: t.howToRule4Title, desc: t.howToRule4Desc },
    ];

    return (
        <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
            <Pressable style={s.backdrop} onPress={onClose} accessibilityRole="button" accessibilityLabel="Close" />
            <View style={[s.sheet, { paddingBottom: Math.max(insets.bottom, 20) }]}>
                <View style={s.handle} />
                <View style={s.header}>
                    <Text style={s.title}>{t.howToPlayTitle}</Text>
                    <Pressable onPress={onClose} style={s.closeBtn} accessibilityRole="button" accessibilityLabel="Close">
                        <Feather name="x" size={22} color={COLORS.gray} />
                    </Pressable>
                </View>
                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={s.content}>
                    {rules.map((rule, i) => (
                        <View key={i} style={s.ruleRow}>
                            <View style={[s.iconWrap, { backgroundColor: rule.color + "18" }]}>
                                <Ionicons name={rule.icon} size={24} color={rule.color} />
                            </View>
                            <View style={s.ruleText}>
                                <Text style={s.ruleTitle}>{rule.title}</Text>
                                <Text style={s.ruleDesc}>{rule.desc}</Text>
                            </View>
                        </View>
                    ))}
                    <View style={s.exampleBox}>
                        <Text style={s.exampleTitle}>{t.howToExample}</Text>
                        <Text style={s.exampleText}>{t.howToExampleText}</Text>
                    </View>
                </ScrollView>
            </View>
        </Modal>
    );
}

const s = StyleSheet.create({
    backdrop: { flex: 1, backgroundColor: "rgba(0,0,0,0.4)" },
    sheet: { backgroundColor: "#FFFFFF", borderTopLeftRadius: 28, borderTopRightRadius: 28, paddingTop: 12, maxHeight: "78%", shadowColor: "#000", shadowOffset: { width: 0, height: -4 }, shadowOpacity: 0.08, shadowRadius: 20, elevation: 20 },
    handle: { width: 40, height: 4, backgroundColor: "#E0E0E0", borderRadius: 2, alignSelf: "center", marginBottom: 20 },
    header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 24, marginBottom: 8 },
    title: { fontSize: 17, fontFamily: "Inter_700Bold", color: COLORS.dark, letterSpacing: 1.5 },
    closeBtn: { width: 36, height: 36, alignItems: "center", justifyContent: "center" },
    content: { padding: 24, gap: 20 },
    ruleRow: { flexDirection: "row", gap: 16, alignItems: "flex-start" },
    iconWrap: { width: 48, height: 48, borderRadius: 14, alignItems: "center", justifyContent: "center", flexShrink: 0 },
    ruleText: { flex: 1, gap: 3 },
    ruleTitle: { fontSize: 15, fontFamily: "Inter_600SemiBold", color: COLORS.dark },
    ruleDesc: { fontSize: 13, fontFamily: "Inter_400Regular", color: COLORS.gray, lineHeight: 19 },
    exampleBox: { backgroundColor: COLORS.mint + "10", borderRadius: 16, padding: 16, borderWidth: 1, borderColor: COLORS.mint + "30", gap: 6, marginTop: 4 },
    exampleTitle: { fontSize: 12, fontFamily: "Inter_600SemiBold", color: COLORS.mint, letterSpacing: 1.5, textTransform: "uppercase" },
    exampleText: { fontSize: 14, fontFamily: "Inter_400Regular", color: COLORS.dark, lineHeight: 21 },
});
