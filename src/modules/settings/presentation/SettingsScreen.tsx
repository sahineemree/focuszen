import { useEffect, useState } from "react";
import { View, Text, StyleSheet, Switch } from "react-native";
import { storage } from "../../../platform/storage";

const KEY = "focuszen_setting_offline_toggle";

export function SettingsScreen() {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    load();
  }, []);

  async function load() {
    const value = await storage.get(KEY);
    if (value !== null) setEnabled(value === "true");
  }

  async function toggle(value: boolean) {
    setEnabled(value);
    await storage.set(KEY, value.toString());
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Settings</Text>

      <View style={styles.row}>
        <Text style={styles.label}>Offline persistence test</Text>
        <Switch value={enabled} onValueChange={toggle} />
      </View>

      <Text style={styles.help}>
        Toggle&apos;ı değiştir, app’i kapat/aç. Değerin korunması persistence’ın çalıştığını gösterir.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24 },
  title: { fontSize: 28, fontWeight: "700", marginBottom: 20 },
  row: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  label: { fontSize: 16 },
  help: { marginTop: 16, opacity: 0.7 },
});
