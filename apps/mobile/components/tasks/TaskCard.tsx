import { useState } from "react";
import { View, Text, TouchableOpacity, Pressable } from "react-native";
import { useRouter } from "expo-router";
import * as Haptics from "expo-haptics";
import Animated, {
  useAnimatedStyle,
  withTiming,
  withSequence,
  withDelay,
  runOnJS,
} from "react-native-reanimated";
import type { Task } from "@taskflow/core";
import { useCompleteTask } from "@/hooks/useTasks";

interface TaskCardProps {
  task: Task;
  onCompleted?: () => void;
}

export function TaskCard({ task, onCompleted }: TaskCardProps) {
  const router = useRouter();
  const { completeTask } = useCompleteTask();
  const [isCompleting, setIsCompleting] = useState(false);

  const handleComplete = async () => {
    setIsCompleting(true);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

    // Small delay for visual feedback, then complete
    setTimeout(async () => {
      await completeTask(task.id);
      onCompleted?.();
    }, 300);
  };

  const handlePress = () => {
    router.push(`/task/${task.id}`);
  };

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: isCompleting ? withTiming(0, { duration: 250 }) : 1,
    transform: [
      {
        translateX: isCompleting ? withTiming(-40, { duration: 250 }) : 0,
      },
    ],
  }));

  const priorityColor =
    task.priority === "high"
      ? "#EF4444"
      : task.priority === "medium"
        ? "#F59E0B"
        : task.priority === "low"
          ? "#3B82F6"
          : "transparent";

  const isOverdue =
    task.deadline && task.deadline < new Date().toISOString().split("T")[0];

  return (
    <Animated.View style={animatedStyle}>
      <Pressable
        onPress={handlePress}
        style={({ pressed }) => ({
          flexDirection: "row",
          alignItems: "flex-start",
          paddingVertical: 12,
          paddingHorizontal: 16,
          backgroundColor: pressed ? "#F3F4F6" : "transparent",
        })}
      >
        {/* Checkbox */}
        <TouchableOpacity
          onPress={handleComplete}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          style={{
            width: 22,
            height: 22,
            borderRadius: 11,
            borderWidth: 2,
            borderColor: isCompleting
              ? "#4F46E5"
              : priorityColor !== "transparent"
                ? priorityColor
                : "#D1D5DB",
            backgroundColor: isCompleting ? "#4F46E5" : "transparent",
            alignItems: "center",
            justifyContent: "center",
            marginTop: 1,
            marginRight: 12,
          }}
        >
          {isCompleting && (
            <Text style={{ color: "#fff", fontSize: 12, fontWeight: "700" }}>
              ✓
            </Text>
          )}
        </TouchableOpacity>

        {/* Content */}
        <View style={{ flex: 1 }}>
          <Text
            style={{
              fontSize: 15,
              color: "#111827",
              lineHeight: 20,
            }}
            numberOfLines={2}
          >
            {task.title}
          </Text>

          {/* Metadata row */}
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginTop: 4,
              gap: 8,
            }}
          >
            {task.deadline && (
              <Text
                style={{
                  fontSize: 12,
                  color: isOverdue ? "#EF4444" : "#6B7280",
                  fontWeight: isOverdue ? "600" : "400",
                }}
              >
                📅 {task.deadline}
              </Text>
            )}
            {task.projectId && (
              <View
                style={{
                  backgroundColor: "#EEF2FF",
                  paddingHorizontal: 6,
                  paddingVertical: 2,
                  borderRadius: 4,
                }}
              >
                <Text style={{ fontSize: 11, color: "#4F46E5" }}>
                  Project
                </Text>
              </View>
            )}
          </View>
        </View>
      </Pressable>
    </Animated.View>
  );
}
