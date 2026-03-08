import React, { useEffect } from "react";
import { Text, StyleSheet } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSequence,
  withTiming,
  withSpring,
  Easing,
} from "react-native-reanimated";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "@/constants/colors";

interface Props {
  streak: number;
}

export function StreakBadge({ streak }: Props) {
  const scale = useSharedValue(1);
  const opacity = useSharedValue(streak > 0 ? 1 : 0);

  useEffect(() => {
    if (streak > 0) {
      opacity.value = withTiming(1, { duration: 150 });
      scale.value = withSequence(
        withTiming(1.3, { duration: 100, easing: Easing.out(Easing.quad) }),
        withSpring(1, { damping: 8, stiffness: 200 }),
      );
    } else {
      opacity.value = withTiming(0, { duration: 150 });
    }
  }, [streak]);

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  const isHot = streak >= 5;
  const isFire = streak >= 10;

  return (
    <Animated.View
      style={[
        styles.container,
        isHot && styles.containerHot,
        isFire && styles.containerFire,
        animStyle,
      ]}
    >
      <Ionicons
        name={isFire ? "flame" : isHot ? "flash" : "trending-up"}
        size={14}
        color={isFire ? "#FF3B30" : isHot ? COLORS.orange : COLORS.mint}
      />
      <Text
        style={[
          styles.text,
          isHot && styles.textHot,
          isFire && styles.textFire,
        ]}
      >
        {streak}x
      </Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: COLORS.mint + "15",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: COLORS.mint + "30",
  },
  containerHot: {
    backgroundColor: COLORS.orange + "15",
    borderColor: COLORS.orange + "40",
  },
  containerFire: {
    backgroundColor: "#FF3B30" + "15",
    borderColor: "#FF3B30" + "40",
  },
  text: {
    fontSize: 13,
    fontFamily: "Inter_700Bold",
    color: COLORS.mint,
    letterSpacing: 0.5,
  },
  textHot: {
    color: COLORS.orange,
  },
  textFire: {
    color: "#FF3B30",
  },
});
