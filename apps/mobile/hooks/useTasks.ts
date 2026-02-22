import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import { useAuthStore } from "@/store/auth";
import type { Task } from "@taskflow/core";

/**
 * Returns today's date as YYYY-MM-DD string
 */
function getTodayString(): string {
  return new Date().toISOString().split("T")[0];
}

/**
 * Fetches today's active tasks for the logged-in user.
 * Returns morning + unslotted tasks and evening tasks separately.
 */
export function useTodayTasks() {
  const user = useAuthStore((s) => s.user);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchTasks = useCallback(async () => {
    if (!user) return;
    setIsLoading(true);

    const today = getTodayString();
    const { data, error } = await supabase
      .from("tasks")
      .select("*")
      .eq("user_id", user.id)
      .eq("scheduled_date", today)
      .eq("status", "active")
      .is("deleted_at", null)
      .order("sort_order", { ascending: true });

    if (!error && data) {
      setTasks(data as unknown as Task[]);
    }
    setIsLoading(false);
  }, [user]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const morningTasks = tasks.filter((t) => t.scheduledTimeSlot !== "evening");
  const eveningTasks = tasks.filter((t) => t.scheduledTimeSlot === "evening");

  return { tasks, morningTasks, eveningTasks, isLoading, refetch: fetchTasks };
}

/**
 * Fetches overdue tasks (scheduled before today, still active)
 */
export function useOverdueTasks() {
  const user = useAuthStore((s) => s.user);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchTasks = useCallback(async () => {
    if (!user) return;
    setIsLoading(true);

    const today = getTodayString();
    const { data, error } = await supabase
      .from("tasks")
      .select("*")
      .eq("user_id", user.id)
      .lt("scheduled_date", today)
      .eq("status", "active")
      .is("deleted_at", null)
      .order("scheduled_date", { ascending: true });

    if (!error && data) {
      setTasks(data as unknown as Task[]);
    }
    setIsLoading(false);
  }, [user]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  return { tasks, isLoading, refetch: fetchTasks };
}

/**
 * Completes a task by setting status to 'completed'
 */
export function useCompleteTask() {
  const completeTask = useCallback(async (taskId: string) => {
    const { error } = await supabase
      .from("tasks")
      .update({
        status: "completed",
        completed_at: new Date().toISOString(),
      })
      .eq("id", taskId);

    return { error: error?.message ?? null };
  }, []);

  return { completeTask };
}

/**
 * Creates a new task
 */
export function useCreateTask() {
  const user = useAuthStore((s) => s.user);

  const createTask = useCallback(
    async (title: string, scheduledDate?: string) => {
      if (!user) return { error: "Not authenticated" };

      const { error } = await supabase.from("tasks").insert({
        user_id: user.id,
        title,
        status: "active",
        priority: "none",
        scheduled_date: scheduledDate ?? null,
        sort_order: Date.now(),
      });

      return { error: error?.message ?? null };
    },
    [user]
  );

  return { createTask };
}
