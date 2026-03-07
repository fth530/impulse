import React, { useEffect } from "react";
import { View, StyleSheet } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  cancelAnimation,
  Easing,
  interpolateColor,
} from "react-native-reanimated";
import { COLORS } from "@/constants/colors";

interface TimerBarProps {
  equationKey: number;
  duration: number;
  active: boolean;
}

export function TimerBar({ equationKey, duration, active }: TimerBarProps) {
  const progress = useSharedValue(1);

  useEffect(() => {
    if (active) {
      progress.value = 1;
      progress.value = withTiming(0, {
        duration,
        easing: Easing.linear,
      });
    } else {
      cancelAnimation(progress);
      progress.value = 1;
    }
  }, [equationKey, active, progress]);

  const barStyle = useAnimatedStyle(() => ({
    width: `${progress.value * 100}%` as any,
    backgroundColor: interpolateColor(
      progress.value,
      [0, 0.3, 0.6, 1],
      ["#FF3B30", "#FF9500", "#FFD60A", COLORS.mint]
    ),
  }));

  return (
    <View style={timerStyles.track}>
      <Animated.View style={[timerStyles.bar, barStyle]} />
    </View>
  );
}

const timerStyles = StyleSheet.create({
  track: {
    width: "100%",
    height: 6,
    backgroundColor: "#F0F0F0",
    borderRadius: 3,
    overflow: "hidden",
  },
  bar: {
    height: "100%",
    borderRadius: 3,
  },
});
