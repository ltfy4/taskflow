import { useCallback, useState } from "react";
import {
  View,
  Text,
  FlatList,
  RefreshControl,
  TouchableOpacity,
  TextInput,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as Haptics from "expo-haptics";
import { useTodayTasks, useOverdueTasks, useCreateTask } from "@/hooks/useTasks";
import { TaskCard } from "@/components/tasks/TaskCard";

/** Returns formatted date like "Saturday, February 22" */
function formatTodayHeader(): string {
  return new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
}

export default function TodayScreen() {
  const {
    morningTasks,
    eveningTasks,
    isLoading,
    refetch: refetchToday,
  } = useTodayTasks();
  const {
    tasks: overdueTasks,
    refetch: refetchOverdue,
  } = useOverdueTasks();
  const { createTask } = useCreateTask();

  const [refreshing, setRefreshing] = useState(false);
  const [quickAddText, setQuickAddText] = useState("");
  const [showQuickAdd, setShowQuickAdd] = useState(false);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await Promise.all([refetchToday(), refetchOverdue()]);
    setRefreshing(false);
  }, [refetchToday, refetchOverdue]);

  const handleQuickAdd = useCallback(async () => {
    const title = quickAddText.trim();
    if (!title) return;

    const today = new Date().toISOString().split("T")[0];
    const { error } = await createTask(title, today);
    if (error) {
      Alert.alert("Error", error);
    } else {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      setQuickAddText("");
      setShowQuickAdd(false);
      refetchToday();
    }
  }, [quickAddText, createTask, refetchToday]);

  const handleTaskCompleted = useCallback(() => {
    // Refetch after animation delay
    setTimeout(() => {
      refetchToday();
      refetchOverdue();
    }, 350);
  }, [refetchToday, refetchOverdue]);

  // Build sections for FlatList
  type SectionItem =
    | { type: "header" }
    | { type: "section-title"; title: string; color?: string }
    | { type: "task"; task: typeof morningTasks[0] }
    | { type: "empty" }
    | { type: "quick-add" };

  const sections: SectionItem[] = [];

  // Header
  sections.push({ type: "header" });

  // Quick add
  sections.push({ type: "quick-add" });

  // Overdue section
  if (overdueTasks.length > 0) {
    sections.push({ type: "section-title", title: "Overdue", color: "#EF4444" });
    overdueTasks.forEach((task) =>
      sections.push({ type: "task", task })
    );
  }

  // Today section
  if (morningTasks.length > 0) {
    sections.push({ type: "section-title", title: "Today" });
    morningTasks.forEach((task) =>
      sections.push({ type: "task", task })
    );
  }

  // Evening section
  if (eveningTasks.length > 0) {
    sections.push({
      type: "section-title",
      title: "This Evening",
      color: "#6366F1",
    });
    eveningTasks.forEach((task) =>
      sections.push({ type: "task", task })
    );
  }

  // Empty state
  if (
    morningTasks.length === 0 &&
    eveningTasks.length === 0 &&
    overdueTasks.length === 0 &&
    !isLoading
  ) {
    sections.push({ type: "empty" });
  }

  const renderItem = ({ item }: { item: SectionItem }) => {
    switch (item.type) {
      case "header":
        return (
          <View style={{ paddingHorizontal: 16, paddingTop: 8, paddingBottom: 4 }}>
            <Text
              style={{
                fontSize: 28,
                fontWeight: "700",
                color: "#111827",
                letterSpacing: -0.5,
              }}
            >
              {formatTodayHeader()}
            </Text>
          </View>
        );

      case "quick-add":
        return (
          <View style={{ paddingHorizontal: 16, paddingVertical: 8 }}>
            {showQuickAdd ? (
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  backgroundColor: "#F9FAFB",
                  borderRadius: 10,
                  borderWidth: 1,
                  borderColor: "#4F46E5",
                  paddingHorizontal: 12,
                }}
              >
                <TextInput
                  value={quickAddText}
                  onChangeText={setQuickAddText}
                  placeholder="Add a task for today..."
                  placeholderTextColor="#9CA3AF"
                  autoFocus
                  onSubmitEditing={handleQuickAdd}
                  returnKeyType="done"
                  style={{
                    flex: 1,
                    paddingVertical: 12,
                    fontSize: 15,
                    color: "#111827",
                  }}
                />
                <TouchableOpacity
                  onPress={() => {
                    setShowQuickAdd(false);
                    setQuickAddText("");
                  }}
                >
                  <Text style={{ color: "#6B7280", fontSize: 14 }}>Cancel</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity
                onPress={() => setShowQuickAdd(true)}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  backgroundColor: "#F9FAFB",
                  borderRadius: 10,
                  paddingHorizontal: 12,
                  paddingVertical: 12,
                }}
              >
                <Text style={{ color: "#4F46E5", fontSize: 18, marginRight: 8 }}>
                  +
                </Text>
                <Text style={{ color: "#9CA3AF", fontSize: 15 }}>
                  Add to Today...
                </Text>
              </TouchableOpacity>
            )}
          </View>
        );

      case "section-title":
        return (
          <View
            style={{
              paddingHorizontal: 16,
              paddingTop: 20,
              paddingBottom: 4,
            }}
          >
            <Text
              style={{
                fontSize: 13,
                fontWeight: "600",
                color: item.color ?? "#6B7280",
                textTransform: "uppercase",
                letterSpacing: 0.5,
              }}
            >
              {item.title}
            </Text>
          </View>
        );

      case "task":
        return (
          <TaskCard task={item.task} onCompleted={handleTaskCompleted} />
        );

      case "empty":
        return (
          <View
            style={{
              alignItems: "center",
              paddingTop: 80,
              paddingHorizontal: 32,
            }}
          >
            <Text style={{ fontSize: 48, marginBottom: 16 }}>☀️</Text>
            <Text
              style={{
                fontSize: 18,
                fontWeight: "600",
                color: "#111827",
                textAlign: "center",
              }}
            >
              Your day is clear
            </Text>
            <Text
              style={{
                fontSize: 15,
                color: "#6B7280",
                textAlign: "center",
                marginTop: 8,
              }}
            >
              What will you accomplish today?
            </Text>
          </View>
        );

      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#FFFFFF" }} edges={["top"]}>
      <FlatList
        data={sections}
        renderItem={renderItem}
        keyExtractor={(item, index) => {
          if (item.type === "task") return `task-${item.task.id}`;
          return `${item.type}-${index}`;
        }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#4F46E5"
          />
        }
        contentContainerStyle={{ paddingBottom: 100 }}
      />
    </SafeAreaView>
  );
}
