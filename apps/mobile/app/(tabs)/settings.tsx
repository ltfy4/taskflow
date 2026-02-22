import { View, Text, TouchableOpacity, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuthStore } from "@/store/auth";

export default function SettingsScreen() {
  const { user, signOut } = useAuthStore();

  const handleSignOut = () => {
    Alert.alert("Sign Out", "Are you sure you want to sign out?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Sign Out",
        style: "destructive",
        onPress: signOut,
      },
    ]);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#FFFFFF" }} edges={["top"]}>
      <View style={{ paddingHorizontal: 16, paddingTop: 8 }}>
        <Text
          style={{
            fontSize: 28,
            fontWeight: "700",
            color: "#111827",
            letterSpacing: -0.5,
            marginBottom: 24,
          }}
        >
          Settings
        </Text>

        {/* Account Section */}
        <View
          style={{
            backgroundColor: "#F9FAFB",
            borderRadius: 12,
            padding: 16,
            marginBottom: 16,
          }}
        >
          <Text
            style={{
              fontSize: 11,
              fontWeight: "600",
              color: "#6B7280",
              textTransform: "uppercase",
              letterSpacing: 0.5,
              marginBottom: 12,
            }}
          >
            Account
          </Text>
          <Text style={{ fontSize: 16, color: "#111827", fontWeight: "500" }}>
            {user?.email ?? "Not signed in"}
          </Text>
          <Text style={{ fontSize: 13, color: "#6B7280", marginTop: 4 }}>
            Free plan
          </Text>
        </View>

        {/* Preferences */}
        <View
          style={{
            backgroundColor: "#F9FAFB",
            borderRadius: 12,
            padding: 16,
            marginBottom: 16,
          }}
        >
          <Text
            style={{
              fontSize: 11,
              fontWeight: "600",
              color: "#6B7280",
              textTransform: "uppercase",
              letterSpacing: 0.5,
              marginBottom: 12,
            }}
          >
            Preferences
          </Text>
          <View style={{ gap: 16 }}>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              <Text style={{ fontSize: 15, color: "#111827" }}>Theme</Text>
              <Text style={{ fontSize: 15, color: "#6B7280" }}>System</Text>
            </View>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              <Text style={{ fontSize: 15, color: "#111827" }}>Week starts on</Text>
              <Text style={{ fontSize: 15, color: "#6B7280" }}>Monday</Text>
            </View>
          </View>
        </View>

        {/* Sign Out */}
        <TouchableOpacity
          onPress={handleSignOut}
          style={{
            backgroundColor: "#FEF2F2",
            borderRadius: 12,
            padding: 16,
            alignItems: "center",
          }}
        >
          <Text style={{ fontSize: 16, fontWeight: "600", color: "#EF4444" }}>
            Sign Out
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
