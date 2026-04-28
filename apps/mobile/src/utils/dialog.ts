import { Alert, Platform } from "react-native";

export function showInfo(title: string, message: string) {
  if (Platform.OS === "web" && typeof window !== "undefined") {
    window.alert(`${title}\n\n${message}`);
    return;
  }

  Alert.alert(title, message);
}

export function confirmAction(params: {
  title: string;
  message: string;
  confirmText: string;
  cancelText?: string;
  destructive?: boolean;
  onConfirm: () => void;
}) {
  if (Platform.OS === "web" && typeof window !== "undefined") {
    if (window.confirm(`${params.title}\n\n${params.message}`)) {
      params.onConfirm();
    }
    return;
  }

  Alert.alert(params.title, params.message, [
    { text: params.cancelText ?? "Vazgeç", style: "cancel" },
    {
      text: params.confirmText,
      style: params.destructive ? "destructive" : "default",
      onPress: params.onConfirm
    }
  ]);
}
