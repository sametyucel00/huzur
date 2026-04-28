import * as Notifications from "expo-notifications";
import { Platform } from "react-native";
import type { LocalUserProfile, NotificationTemplate } from "@sukut/shared";

const ANDROID_DEFAULT_CHANNEL_ID = "sukut-gentle-reminders";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    priority: Notifications.AndroidNotificationPriority.DEFAULT
  })
});

export interface NotificationPermissionResult {
  granted: boolean;
  status: Notifications.PermissionStatus;
}

export async function initializeLocalNotifications(): Promise<void> {
  if (Platform.OS === "web") {
    return;
  }

  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync(ANDROID_DEFAULT_CHANNEL_ID, {
      name: "Sükût hatırlatmaları",
      importance: Notifications.AndroidImportance.DEFAULT,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#D8A84E",
      lockscreenVisibility: Notifications.AndroidNotificationVisibility.PRIVATE,
      sound: "default"
    }).catch(() => undefined);
  }
}

export async function getLocalNotificationPermission(): Promise<NotificationPermissionResult> {
  if (Platform.OS === "web") {
    return {
      granted: false,
      status: Notifications.PermissionStatus.UNDETERMINED
    };
  }

  const permissions = await Notifications.getPermissionsAsync();

  return {
    granted: permissions.granted,
    status: permissions.status
  };
}

export async function requestLocalNotificationPermission(): Promise<NotificationPermissionResult> {
  if (Platform.OS === "web") {
    return {
      granted: false,
      status: Notifications.PermissionStatus.UNDETERMINED
    };
  }

  await initializeLocalNotifications();
  const permissions = await Notifications.requestPermissionsAsync();

  return {
    granted: permissions.granted,
    status: permissions.status
  };
}

export async function scheduleGentleDailyReminder(params: {
  title: string;
  body: string;
  hour: number;
  minute: number;
}): Promise<string | null> {
  await initializeLocalNotifications();
  const permission = await getLocalNotificationPermission();

  if (!permission.granted) {
    return null;
  }

  try {
    return await Notifications.scheduleNotificationAsync({
      content: {
        title: params.title,
        body: params.body
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DAILY,
        hour: params.hour,
        minute: params.minute,
        channelId: ANDROID_DEFAULT_CHANNEL_ID
      }
    });
  } catch {
    return null;
  }
}

export async function scheduleEnabledLocalReminders(params: {
  profile: LocalUserProfile;
  templates: NotificationTemplate[];
}): Promise<string[]> {
  const scheduledIds: string[] = [];
  const dailyTemplate = params.templates.find((template) => template.type === "daily" && template.isActive);
  const eventTemplate = params.templates.find((template) => template.type === "event" && template.isActive);

  if (params.profile.notificationPreferences.dailyContent && dailyTemplate) {
    const id = await scheduleGentleDailyReminder({
      title: dailyTemplate.title,
      body: dailyTemplate.body,
      hour: 9,
      minute: 0
    });
    if (id) scheduledIds.push(id);
  }

  if (params.profile.notificationPreferences.specialDays && eventTemplate) {
    const id = await scheduleGentleDailyReminder({
      title: eventTemplate.title,
      body: eventTemplate.body,
      hour: 10,
      minute: 30
    });
    if (id) scheduledIds.push(id);
  }

  return scheduledIds;
}
