import { useState, useCallback } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { supabase } from "@/lib/supabase";
import { useAuthStore } from "@/store/auth";
import { TaskCard } from "@/components/tasks/TaskCard";
import type { Task } from "@taskflow/core";

export default function SearchScreen() {
  const user = useAuthStore((s) => s.user);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Task[]>([]);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = useCallback(
    async (text: string) => {
      setQuery(text);
      if (!user || text.trim().length < 2) {
        setResults([]);
        setHasSearched(false);
        return;
      }

      setHasSearched(true);
      const { data, error } = await supabase
        .from("tasks")
        .select("*")
        .eq("user_id", user.id)
        .is("deleted_at", null)
        .or(`title.ilike.%${text}%,notes.ilike.%${text}%`)
        .order("created_at", { ascending: false })
        .limit(30);

      if (!error && data) {
        setResults(data as unknown as Task[]);
      }
    },
    [user]
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#FFFFFF" }} edges={["top"]}>
      {/* Search Header */}
      <View style={{ paddingHorizontal: 16, paddingTop: 8, paddingBottom: 12 }}>
        <Text
          style={{
            fontSize: 28,
            fontWeight: "700",
            color: "#111827",
            letterSpacing: -0.5,
            marginBottom: 12,
          }}
        >
          Search
        </Text>
        <TextInput
          value={query}
          onChangeText={handleSearch}
          placeholder="Search tasks..."
          placeholderTextColor="#9CA3AF"
          autoCorrect={false}
          clearButtonMode="while-editing"
          style={{
            backgroundColor: "#F3F4F6",
            borderRadius: 10,
            paddingHorizontal: 16,
            paddingVertical: 12,
            fontSize: 16,
            color: "#111827",
          }}
        />
      </View>

      <FlatList
        data={results}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <TaskCard task={item} />}
        ListEmptyComponent={
          hasSearched ? (
            <View style={{ alignItems: "center", paddingTop: 60 }}>
              <Text style={{ fontSize: 48, marginBottom: 16 }}>🔍</Text>
              <Text style={{ fontSize: 16, color: "#6B7280" }}>
                No results found
              </Text>
            </View>
          ) : (
            <View style={{ alignItems: "center", paddingTop: 60 }}>
              <Text style={{ fontSize: 15, color: "#9CA3AF" }}>
                Type to search your tasks
              </Text>
            </View>
          )
        }
        contentContainerStyle={{ paddingBottom: 100 }}
      />
    </SafeAreaView>
  );
}
