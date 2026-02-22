import { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  RefreshControl,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { supabase } from "@/lib/supabase";
import { useAuthStore } from "@/store/auth";
import { TaskCard } from "@/components/tasks/TaskCard";
import type { Task } from "@taskflow/core";

interface DateSection {
  date: string;
  label: string;
  tasks: Task[];
}

function formatSectionDate(dateStr: string): string {
  const date = new Date(dateStr + "T00:00:00");
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const todayStr = today.toISOString().split("T")[0];
  const tomorrowStr = tomorrow.toISOString().split("T")[0];

  if (dateStr === todayStr) return "Today";
  if (dateStr === tomorrowStr) return "Tomorrow";

  return date.toLocaleDateString("en-US", {
    weekday: "long",
    month: "short",
    day: "numeric",
  });
}

export default function UpcomingScreen() {
  const user = useAuthStore((s) => s.user);
  const [sections, setSections] = useState<DateSection[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const fetchTasks = useCallback(async () => {
    if (!user) return;

    const today = new Date().toISOString().split("T")[0];
    const twoWeeksOut = new Date();
    twoWeeksOut.setDate(twoWeeksOut.getDate() + 14);
    const endDate = twoWeeksOut.toISOString().split("T")[0];

    const { data, error } = await supabase
      .from("tasks")
      .select("*")
      .eq("user_id", user.id)
      .eq("status", "active")
      .gte("scheduled_date", today)
      .lte("scheduled_date", endDate)
      .is("deleted_at", null)
      .order("scheduled_date", { ascending: true })
      .order("sort_order", { ascending: true });

    if (!error && data) {
      const grouped: Record<string, Task[]> = {};
      (data as unknown as Task[]).forEach((task) => {
        const date = task.scheduledDate ?? "";
        if (!grouped[date]) grouped[date] = [];
        grouped[date].push(task);
      });

      const result: DateSection[] = Object.keys(grouped)
        .sort()
        .map((date) => ({
          date,
          label: formatSectionDate(date),
          tasks: grouped[date],
        }));

      setSections(result);
    }
    setIsLoading(false);
  }, [user]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchTasks();
    setRefreshing(false);
  }, [fetchTasks]);

  type ListItem =
    | { type: "header" }
    | { type: "section"; label: string }
    | { type: "task"; task: Task }
    | { type: "empty" };

  const items: ListItem[] = [{ type: "header" }];

  sections.forEach((section) => {
    items.push({ type: "section", label: section.label });
    section.tasks.forEach((task) => items.push({ type: "task", task }));
  });

  if (sections.length === 0 && !isLoading) {
    items.push({ type: "empty" });
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#FFFFFF" }} edges={["top"]}>
      <FlatList
        data={items}
        keyExtractor={(item, i) =>
          item.type === "task" ? `task-${item.task.id}` : `${item.type}-${i}`
        }
        renderItem={({ item }) => {
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
                    Upcoming
                  </Text>
                </View>
              );
            case "section":
              return (
                <View style={{ paddingHorizontal: 16, paddingTop: 20, paddingBottom: 4 }}>
                  <Text
                    style={{
                      fontSize: 15,
                      fontWeight: "600",
                      color: "#111827",
                    }}
                  >
                    {item.label}
                  </Text>
                </View>
              );
            case "task":
              return <TaskCard task={item.task} onCompleted={fetchTasks} />;
            case "empty":
              return (
                <View style={{ alignItems: "center", paddingTop: 80 }}>
                  <Text style={{ fontSize: 48, marginBottom: 16 }}>📅</Text>
                  <Text style={{ fontSize: 18, fontWeight: "600", color: "#111827" }}>
                    Nothing scheduled
                  </Text>
                  <Text style={{ fontSize: 15, color: "#6B7280", marginTop: 8 }}>
                    Schedule tasks to see them here
                  </Text>
                </View>
              );
            default:
              return null;
          }
        }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#4F46E5" />
        }
        contentContainerStyle={{ paddingBottom: 100 }}
      />
    </SafeAreaView>
  );
}
