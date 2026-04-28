import { useMemo, useState } from "react";
import { Modal, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { includesTurkishSearch, TURKEY_PRAYER_CITIES } from "@sukut/shared";
import { useAppTheme } from "@/theme/useAppTheme";

interface CityPickerModalProps {
  visible: boolean;
  selectedCity: string;
  onClose: () => void;
  onSelect: (city: string) => void;
}

export function CityPickerModal({ visible, selectedCity, onClose, onSelect }: CityPickerModalProps) {
  const theme = useAppTheme();
  const [query, setQuery] = useState("");
  const cities = useMemo(
    () => TURKEY_PRAYER_CITIES.filter((item) => includesTurkishSearch(item.city, query)),
    [query]
  );

  return (
    <Modal animationType="slide" transparent visible={visible} onRequestClose={onClose}>
      <Pressable style={styles.backdrop} onPress={onClose}>
        <View style={[styles.sheet, { backgroundColor: theme.colors.surface }]} onStartShouldSetResponder={() => true}>
          <View style={styles.handle} />
          <Text style={[theme.typography.section, { color: theme.colors.text }]}>Şehir seç</Text>
          <Text style={[theme.typography.caption, { color: theme.colors.textMuted }]}>
            Konum izni vermeden manuel şehir seçebilirsin.
          </Text>
          <TextInput
            autoCapitalize="words"
            autoCorrect={false}
            placeholder="Şehir ara"
            placeholderTextColor={theme.colors.textMuted}
            value={query}
            onChangeText={setQuery}
            style={[
              styles.search,
              {
                backgroundColor: theme.colors.surfaceMuted,
                borderColor: theme.colors.border,
                color: theme.colors.text
              }
            ]}
          />
          <ScrollView style={styles.scrollArea} showsVerticalScrollIndicator={false}>
            <View style={styles.grid}>
              {cities.map((item) => {
                const selected = item.city === selectedCity;

                return (
                  <Pressable
                    key={item.city}
                    onPress={() => {
                      onSelect(item.city);
                      setQuery("");
                      onClose();
                    }}
                    style={[
                      styles.cityButton,
                      {
                        backgroundColor: selected ? theme.colors.calm : theme.colors.surfaceMuted,
                        borderColor: selected ? theme.colors.calm : theme.colors.border
                      }
                    ]}
                  >
                    <Text style={[styles.cityText, { color: selected ? "#101C34" : theme.colors.text }]}>{item.city}</Text>
                  </Pressable>
                );
              })}
            </View>
          </ScrollView>
        </View>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    backgroundColor: "rgba(16, 28, 52, 0.45)",
    flex: 1,
    justifyContent: "flex-end"
  },
  sheet: {
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    gap: 12,
    padding: 20,
    paddingBottom: 30
  },
  handle: {
    alignSelf: "center",
    backgroundColor: "rgba(102, 112, 133, 0.35)",
    borderRadius: 999,
    height: 4,
    width: 42
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10
  },
  scrollArea: {
    maxHeight: 360
  },
  search: {
    borderRadius: 16,
    borderWidth: 1,
    fontSize: 16,
    minHeight: 48,
    paddingHorizontal: 14
  },
  cityButton: {
    borderRadius: 999,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 10
  },
  cityText: {
    fontSize: 14,
    fontWeight: "700"
  }
});
