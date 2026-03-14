import React, { useEffect } from "react";
import { StyleSheet } from "react-native";
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withSequence,
    withTiming,
    withRepeat,
    interpolateColor,
} from "react-native-reanimated";
import { COLORS } from "@/constants/colors";
import { useT } from "@/i18n/LanguageContext";

interface RuleBadgeProps {
    label: string;
    flash: boolean;
}

export function RuleBadge({ label, flash }: RuleBadgeProps) {
    const t = useT();
    const flashValue = useSharedValue(0);

    useEffect(() => {
        if (flash) {
            flashValue.value = withRepeat(
                withSequence(
                    withTiming(1, { duration: 130 }),
                    withTiming(0, { duration: 130 })
                ),
                5, // 5 times
                true
            );
        } else {
            flashValue.value = 0; // reset
        }
    }, [flash, flashValue]);

    const animatedContainerStyle = useAnimatedStyle(() => {
        const bgColor = interpolateColor(
            flashValue.value,
            [0, 1],
            [COLORS.mint + "18", "#FFD60A30"]
        );
        const borderColor = interpolateColor(
            flashValue.value,
            [0, 1],
            [COLORS.mint, "#FFD60A"]
        );
        return {
            backgroundColor: bgColor,
            borderColor: borderColor,
        };
    });

    const animatedTextStyle = useAnimatedStyle(() => {
        const color = interpolateColor(
            flashValue.value,
            [0, 1],
            [COLORS.mint, "#9A7800"]
        );
        return { color };
    });

    return (
        <Animated.View style={[ruleStyles.badge, animatedContainerStyle]}>
            <Animated.Text style={[ruleStyles.kural, animatedTextStyle]}>
                {t.ruleBadgeLabel}
            </Animated.Text>
            <Animated.Text style={[ruleStyles.label, animatedTextStyle]}>
                {label}
            </Animated.Text>
        </Animated.View>
    );
}

const ruleStyles = StyleSheet.create({
    badge: {
        alignItems: "center",
        paddingHorizontal: 28,
        paddingVertical: 14,
        borderRadius: 20,
        borderWidth: 2,
        gap: 2,
    },
    kural: {
        fontSize: 11,
        fontFamily: "Inter_600SemiBold",
        letterSpacing: 3,
    },
    label: {
        fontSize: 22,
        fontFamily: "Inter_700Bold",
        letterSpacing: 1,
    },
});
