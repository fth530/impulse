import React from "react";
import { View, Text, StyleSheet, Pressable, Modal, ScrollView } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { COLORS } from "@/constants/colors";
import { Ionicons, Feather } from "@expo/vector-icons";

interface HowToPlayModalProps {
    visible: boolean;
    onClose: () => void;
}

export function HowToPlayModal({ visible, onClose }: HowToPlayModalProps) {
    const insets = useSafeAreaInsets();

    const rules = [
        {
            icon: "checkmark-circle" as const,
            color: COLORS.mint,
            title: "Kurala uyuyorsa DOKUN",
            desc: "Süre bitmeden önce ekrana dokun. Geç kalırsan yanarsın!",
        },
        {
            icon: "hand-left" as const,
            color: COLORS.navy,
            title: "Kurala uymuyorsa DOKUNMA",
            desc: "Bekle ve sürenin bitmesini izle. Dokunursan yanarsın!",
        },
        {
            icon: "flash" as const,
            color: COLORS.orange,
            title: "Kural değişiyor",
            desc: "Her 3-5 turda bir kural değişir. Sarı yanıp söndüğünde dikkat et!",
        },
        {
            icon: "trending-up" as const,
            color: "#FF3B30",
            title: "Zorluk artıyor",
            desc: "Her doğru hamlede süre kısalır. Ne kadar dayanabilirsin?",
        },
    ];

    return (
        <Modal
            visible={visible}
            animationType="slide"
            transparent
            onRequestClose={onClose}
        >
            <Pressable style={modalStyles.backdrop} onPress={onClose} accessibilityRole="button" accessibilityLabel="Close modal background" />
            <View
                style={[
                    modalStyles.sheet,
                    { paddingBottom: Math.max(insets.bottom, 20) },
                ]}
            >
                <View style={modalStyles.handle} />
                <View style={modalStyles.header}>
                    <Text style={modalStyles.title}>NASIL OYNANIR?</Text>
                    <Pressable onPress={onClose} style={modalStyles.closeBtn} accessibilityRole="button" accessibilityLabel="Close How To Play Modal">
                        <Feather name="x" size={22} color={COLORS.gray} />
                    </Pressable>
                </View>
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={modalStyles.content}
                >
                    {rules.map((rule, i) => (
                        <View key={i} style={modalStyles.ruleRow}>
                            <View
                                style={[modalStyles.iconWrap, { backgroundColor: rule.color + "18" }]}
                            >
                                <Ionicons name={rule.icon} size={24} color={rule.color} />
                            </View>
                            <View style={modalStyles.ruleText}>
                                <Text style={modalStyles.ruleTitle}>{rule.title}</Text>
                                <Text style={modalStyles.ruleDesc}>{rule.desc}</Text>
                            </View>
                        </View>
                    ))}

                    <View style={modalStyles.exampleBox}>
                        <Text style={modalStyles.exampleTitle}>Örnek</Text>
                        <Text style={modalStyles.exampleText}>
                            Kural{" "}
                            <Text style={{ color: COLORS.mint, fontFamily: "Inter_700Bold" }}>
                                ÇİFT SAYI
                            </Text>{" "}
                            ise ve denklem{" "}
                            <Text style={{ fontFamily: "Inter_700Bold", color: COLORS.dark }}>
                                3 + 5
                            </Text>{" "}
                            ise (sonuç = 8, çift) → <Text style={{ color: COLORS.mint, fontFamily: "Inter_600SemiBold" }}>DOKUN!</Text>
                        </Text>
                    </View>
                </ScrollView>
            </View>
        </Modal>
    );
}

const modalStyles = StyleSheet.create({
    backdrop: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.4)",
    },
    sheet: {
        backgroundColor: "#FFFFFF",
        borderTopLeftRadius: 28,
        borderTopRightRadius: 28,
        paddingTop: 12,
        maxHeight: "78%",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.08,
        shadowRadius: 20,
        elevation: 20,
    },
    handle: {
        width: 40,
        height: 4,
        backgroundColor: "#E0E0E0",
        borderRadius: 2,
        alignSelf: "center",
        marginBottom: 20,
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 24,
        marginBottom: 8,
    },
    title: {
        fontSize: 17,
        fontFamily: "Inter_700Bold",
        color: COLORS.dark,
        letterSpacing: 1.5,
    },
    closeBtn: {
        width: 36,
        height: 36,
        alignItems: "center",
        justifyContent: "center",
    },
    content: {
        padding: 24,
        gap: 20,
    },
    ruleRow: {
        flexDirection: "row",
        gap: 16,
        alignItems: "flex-start",
    },
    iconWrap: {
        width: 48,
        height: 48,
        borderRadius: 14,
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
    },
    ruleText: {
        flex: 1,
        gap: 3,
    },
    ruleTitle: {
        fontSize: 15,
        fontFamily: "Inter_600SemiBold",
        color: COLORS.dark,
    },
    ruleDesc: {
        fontSize: 13,
        fontFamily: "Inter_400Regular",
        color: COLORS.gray,
        lineHeight: 19,
    },
    exampleBox: {
        backgroundColor: COLORS.mint + "10",
        borderRadius: 16,
        padding: 16,
        borderWidth: 1,
        borderColor: COLORS.mint + "30",
        gap: 6,
        marginTop: 4,
    },
    exampleTitle: {
        fontSize: 12,
        fontFamily: "Inter_600SemiBold",
        color: COLORS.mint,
        letterSpacing: 1.5,
        textTransform: "uppercase",
    },
    exampleText: {
        fontSize: 14,
        fontFamily: "Inter_400Regular",
        color: COLORS.dark,
        lineHeight: 21,
    },
});
