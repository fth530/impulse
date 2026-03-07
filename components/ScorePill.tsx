import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { COLORS } from "@/constants/colors";

interface ScorePillProps {
    label: string;
    value: number;
    accent?: boolean;
}

export function ScorePill({ label, value, accent }: ScorePillProps) {
    return (
        <View style={[scorePillStyles.pill, accent && scorePillStyles.accentPill]}>
            <Text style={[scorePillStyles.label, accent && scorePillStyles.accentLabel]}>
                {label}
            </Text>
            <Text style={[scorePillStyles.value, accent && scorePillStyles.accentValue]}>
                {value}
            </Text>
        </View>
    );
}

const scorePillStyles = StyleSheet.create({
    pill: {
        alignItems: "center",
        paddingHorizontal: 20,
        paddingVertical: 10,
        backgroundColor: "#F5F5F5",
        borderRadius: 14,
        minWidth: 80,
    },
    accentPill: {
        backgroundColor: COLORS.navy,
    },
    label: {
        fontSize: 10,
        fontFamily: "Inter_600SemiBold",
        color: COLORS.gray,
        letterSpacing: 1.5,
        textTransform: "uppercase",
    },
    accentLabel: {
        color: "rgba(255,255,255,0.6)",
    },
    value: {
        fontSize: 26,
        fontFamily: "Inter_700Bold",
        color: COLORS.dark,
        lineHeight: 32,
    },
    accentValue: {
        color: "#FFFFFF",
    },
});
