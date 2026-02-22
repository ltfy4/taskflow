import { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useLocalSearchParams, useRouter, Stack } from "expo-router";
import * as Haptics from "expo-haptics";
import { supabase } from "@/lib/supabase";
import type { Task, ChecklistItem } from "@taskflow/core";

export default function TaskDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();

  const [task, setTask] = useState<Task | null>(null);
  const [checklistItems, setChecklistItems] = useState<ChecklistItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [title, setTitle] = useState("");
  const [notes, setNotes] = useState("");

  const fetchTask = useCallback(async () => {
    if (!id) return;
    const { data, error } = await supabase
      .from("tasks")
      .select("*")
      .eq("id", id)
      .single();

    if (!error && data) {
      const t = data as unknown as Task;
      setTask(t);
      setTitle(t.title);
      setNotes(t.notes ?? "");
    }

    // Fetch checklist items
    const { data: items } = await supabase
      .from("checklist_items")
      .select("*")
      .eq("task_id", id)
      .is("deleted_at", null)
      .order("sort_order", { ascending: true });

    if (items) {
      setChecklistItems(items as unknown as ChecklistItem[]);
    }

    setIsLoading(false);
  }, [id]);

  useEffect(() => {
    fetchTask();
  }, [fetchTask]);

  const saveTask = useCallback(async () => {
    if (!id || !title.trim()) return;
    await supabase
      .from("tasks")
      .update({
        title: title.trim(),
        notes: notes.trim() || null,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id);
  }, [id, title, notes]);

  const handleComplete = useCallback(async () => {
    if (!id) return;
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    await supabase
      .from("tasks")
      .update({
        status: "completed",
        completed_at: new Date().toISOString(),
      })
      .eq("id", id);
    router.back();
  }, [id, router]);

  const handleDelete = useCallback(() => {
    Alert.alert("Delete Task", "This task will be moved to trash.", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
          await supabase
            .from("tasks")
            .update({ deleted_at: new Date().toISOString() })
            .eq("id", id);
          router.back();
        },
      },
    ]);
  }, [id, router]);

  const toggleChecklistItem = useCallback(
    async (itemId: string, completed: boolean) => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      await supabase
        .from("checklist_items")
        .update({ completed: !completed })
        .eq("id", itemId);
      fetchTask();
    },
    [fetchTask]
  );

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#4F46E5" />
      </View>
    );
  }

  if (!task) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text style={{ fontSize: 16, color: "#6B7280" }}>Task not found</Text>
      </View>
    );
  }

  return (
    <>
      <Stack.Screen
        options={{
          headerTitle: "",
          headerRight: () => (
            <TouchableOpacity onPress={handleComplete}>
              <Text style={{ color: "#4F46E5", fontSize: 16, fontWeight: "600" }}>
                Complete
              </Text>
            </TouchableOpacity>
          ),
        }}
      />
      <ScrollView
        style={{ flex: 1, backgroundColor: "#FFFFFF" }}
        contentContainerStyle={{ padding: 16 }}
        keyboardDismissMode="on-drag"
      >
        {/* Title */}
        <TextInput
          value={title}
          onChangeText={setTitle}
          onBlur={saveTask}
          placeholder="Task title"
          placeholderTextColor="#9CA3AF"
          multiline
          style={{
            fontSize: 22,
            fontWeight: "600",
            color: "#111827",
            marginBottom: 16,
            lineHeight: 28,
          }}
        />

        {/* Metadata */}
        <View
          style={{
            backgroundColor: "#F9FAFB",
            borderRadius: 12,
            padding: 16,
            marginBottom: 16,
            gap: 12,
          }}
        >
          <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
            <Text style={{ fontSize: 14, color: "#6B7280" }}>Scheduled</Text>
            <Text style={{ fontSize: 14, color: "#111827" }}>
              {task.scheduledDate ?? "Not scheduled"}
            </Text>
          </View>
          <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
            <Text style={{ fontSize: 14, color: "#6B7280" }}>Deadline</Text>
            <Text
              style={{
                fontSize: 14,
                color: task.deadline ? "#EF4444" : "#111827",
              }}
            >
              {task.deadline ?? "None"}
            </Text>
          </View>
          <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
            <Text style={{ fontSize: 14, color: "#6B7280" }}>Priority</Text>
            <Text
              style={{
                fontSize: 14,
                color:
                  task.priority === "high"
                    ? "#EF4444"
                    : task.priority === "medium"
                      ? "#F59E0B"
                      : "#111827",
                fontWeight: task.priority !== "none" ? "600" : "400",
              }}
            >
              {task.priority === "none"
                ? "None"
                : task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
            </Text>
          </View>
          {task.scheduledTimeSlot && (
            <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
              <Text style={{ fontSize: 14, color: "#6B7280" }}>Time slot</Text>
              <Text style={{ fontSize: 14, color: "#111827" }}>
                {task.scheduledTimeSlot === "evening" ? "Evening" : "Morning"}
              </Text>
            </View>
          )}
        </View>

        {/* Checklist */}
        {checklistItems.length > 0 && (
          <View style={{ marginBottom: 16 }}>
            <Text
              style={{
                fontSize: 13,
                fontWeight: "600",
                color: "#6B7280",
                textTransform: "uppercase",
                letterSpacing: 0.5,
                marginBottom: 8,
              }}
            >
              Checklist ({checklistItems.filter((i) => i.completed).length}/
              {checklistItems.length})
            </Text>
            {checklistItems.map((item) => (
              <TouchableOpacity
                key={item.id}
                onPress={() => toggleChecklistItem(item.id, item.completed)}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  paddingVertical: 8,
                }}
              >
                <View
                  style={{
                    width: 20,
                    height: 20,
                    borderRadius: 4,
                    borderWidth: 2,
                    borderColor: item.completed ? "#4F46E5" : "#D1D5DB",
                    backgroundColor: item.completed ? "#4F46E5" : "transparent",
                    alignItems: "center",
                    justifyContent: "center",
                    marginRight: 10,
                  }}
                >
                  {item.completed && (
                    <Text style={{ color: "#fff", fontSize: 11, fontWeight: "700" }}>
                      ✓
                    </Text>
                  )}
                </View>
                <Text
                  style={{
                    fontSize: 15,
                    color: item.completed ? "#9CA3AF" : "#111827",
                    textDecorationLine: item.completed ? "line-through" : "none",
                  }}
                >
                  {item.title}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Notes */}
        <Text
          style={{
            fontSize: 13,
            fontWeight: "600",
            color: "#6B7280",
            textTransform: "uppercase",
            letterSpacing: 0.5,
            marginBottom: 8,
          }}
        >
          Notes
        </Text>
        <TextInput
          value={notes}
          onChangeText={setNotes}
          onBlur={saveTask}
          placeholder="Add notes..."
          placeholderTextColor="#9CA3AF"
          multiline
          textAlignVertical="top"
          style={{
            fontSize: 15,
            color: "#111827",
            lineHeight: 22,
            minHeight: 120,
            backgroundColor: "#F9FAFB",
            borderRadius: 12,
            padding: 16,
            marginBottom: 24,
          }}
        />

        {/* Delete Button */}
        <TouchableOpacity
          onPress={handleDelete}
          style={{
            backgroundColor: "#FEF2F2",
            borderRadius: 12,
            padding: 16,
            alignItems: "center",
            marginBottom: 40,
          }}
        >
          <Text style={{ fontSize: 16, fontWeight: "600", color: "#EF4444" }}>
            Delete Task
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </>
  );
}
