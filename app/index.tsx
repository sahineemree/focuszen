import { View, Text, StyleSheet } from "react-native";

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>FocusZen</Text>
      <Text style={styles.subtitle}>Sprint 0: Foundation</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center", justifyContent: "center", padding: 24 },
  title: { fontSize: 32, fontWeight: "700" },
  subtitle: { fontSize: 16, marginTop: 8, opacity: 0.7 },
});
