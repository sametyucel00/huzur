import { useEffect, useState } from "react";
import { Modal, Pressable, StyleSheet, Text, View } from "react-native";
import { useAppTheme } from "@/theme/useAppTheme";

type DialogKind = "info" | "confirm";

interface DialogState {
  kind: DialogKind;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  destructive?: boolean;
  onConfirm?: () => void;
}

let activeListener: ((dialog: DialogState | null) => void) | null = null;

function emit(dialog: DialogState | null) {
  activeListener?.(dialog);
}

export function showInfo(title: string, message: string) {
  emit({
    kind: "info",
    title,
    message,
    confirmText: "Tamam"
  });
}

export function confirmAction(params: {
  title: string;
  message: string;
  confirmText: string;
  cancelText?: string;
  destructive?: boolean;
  onConfirm: () => void;
}) {
  emit({
    kind: "confirm",
    title: params.title,
    message: params.message,
    confirmText: params.confirmText,
    cancelText: params.cancelText ?? "İptal",
    destructive: params.destructive,
    onConfirm: params.onConfirm
  });
}

export function AppDialogHost() {
  const theme = useAppTheme();
  const [dialog, setDialog] = useState<DialogState | null>(null);

  useEffect(() => {
    activeListener = setDialog;
    return () => {
      activeListener = null;
    };
  }, []);

  const close = () => setDialog(null);
  const confirm = () => {
    const action = dialog?.onConfirm;
    close();
    action?.();
  };

  return (
    <Modal transparent visible={Boolean(dialog)} animationType="fade" onRequestClose={close}>
      <View style={styles.backdrop}>
        <View style={[styles.card, theme.shadows.deep, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
          <Text style={[styles.title, { color: theme.colors.text }]}>{dialog?.title}</Text>
          <Text style={[styles.message, { color: theme.colors.textMuted }]}>{dialog?.message}</Text>
          <View style={styles.actions}>
            {dialog?.kind === "confirm" ? (
              <Pressable
                accessibilityRole="button"
                accessibilityLabel={dialog.cancelText ?? "İptal"}
                onPress={close}
                style={[styles.button, { backgroundColor: theme.colors.surfaceMuted, borderColor: theme.colors.border }]}
              >
                <Text style={[styles.buttonText, { color: theme.colors.text }]}>{dialog.cancelText ?? "İptal"}</Text>
              </Pressable>
            ) : null}
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={dialog?.confirmText ?? "Tamam"}
              onPress={dialog?.kind === "confirm" ? confirm : close}
              style={[
                styles.button,
                {
                  backgroundColor: dialog?.destructive ? theme.colors.danger : theme.colors.primarySoft,
                  borderColor: dialog?.destructive ? theme.colors.danger : theme.colors.primarySoft
                }
              ]}
            >
              <Text style={[styles.buttonText, { color: "#FFF8ED" }]}>{dialog?.confirmText ?? "Tamam"}</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    alignItems: "center",
    backgroundColor: "rgba(7, 13, 24, 0.58)",
    flex: 1,
    justifyContent: "center",
    padding: 22
  },
  card: {
    borderRadius: 28,
    borderWidth: 1,
    gap: 14,
    maxWidth: 420,
    padding: 20,
    width: "100%"
  },
  title: {
    fontSize: 20,
    fontWeight: "900",
    lineHeight: 26
  },
  message: {
    fontSize: 15,
    fontWeight: "600",
    lineHeight: 22
  },
  actions: {
    flexDirection: "row",
    gap: 10,
    justifyContent: "flex-end"
  },
  button: {
    alignItems: "center",
    borderRadius: 999,
    borderWidth: 1,
    flex: 1,
    justifyContent: "center",
    minHeight: 48,
    paddingHorizontal: 16
  },
  buttonText: {
    fontSize: 14,
    fontWeight: "900"
  }
});
