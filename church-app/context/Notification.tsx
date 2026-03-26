import { useSendFCMTokenMutation } from "@/services/api/notification";
import { registerForPushNotificationsAsync } from "@/utils/registerForPushNotificationsAsync";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import { router } from "expo-router";
import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { Platform } from "react-native";

type Subscription = {
  remove: () => void;
};

interface NotificationContextType {
  expoPushToken: string | null;
  notification: Notifications.Notification | null;
  error: Error | null;
}

const NotificationContext = createContext<NotificationContextType | undefined>(
  undefined
);

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error("useNotification must be used within NotificationProvider");
  }
  return context;
};

interface NotificationProviderProps {
  children: ReactNode;
  authToken?: string | undefined;
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({
  children,
  authToken,
}) => {
  const [expoPushToken, setExpoPushToken] = useState<string | null>(null);
  const [notification, setNotification] =
    useState<Notifications.Notification | null>(null);
  const [error, setError] = useState<Error | null>(null);

  const notificationListener = useRef<Subscription | null>(null);
  const responseListener = useRef<Subscription | null>(null);

  const [sendFcmToken] = useSendFCMTokenMutation();

  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: true,
    }),
  });

  const handleNotificationNavigation = (
    data: Record<string, unknown>
  ) => {
    const type = data?.type as string;
    const resourceId = data?.resourceId as string;

    switch (type) {
      case "sermon":
        if (resourceId) {
          router.push({
            pathname: "/stack/videoDetailsScreen",
            params: { videoId: resourceId },
          });
        }
        break;
      case "book":
        if (resourceId) {
          router.push({
            pathname: "/stack/bookDetails",
            params: { bookId: resourceId },
          });
        }
        break;
      case "event":
        if (resourceId) {
          router.push({
            pathname: "/stack/eventDetails",
            params: { id: resourceId },
          });
        }
        break;
      case "announcement":
      default:
        router.push({
          pathname: "/stack/notificationDetails",
          params: {
            title: (data?.title as string) || "Notification",
            body: (data?.body as string) || "",
          },
        });
        break;
    }
  };

  // 📌 Get platform (android / ios)
  const platform = Platform.OS === "ios" ? "ios" : "android";

  // 📌 Create full device info object
  const deviceInfo = {
    brand: Device.brand,
    manufacturer: Device.manufacturer,
    modelName: Device.modelName,
    osName: Device.osName,
    osVersion: Device.osVersion,
    deviceType: Device.deviceType,
  };

  useEffect(() => {
    registerForPushNotificationsAsync()
      .then(
        async (token) => {
          setExpoPushToken(token);

          console.log(token, "token");

          if (token && authToken) {
            const payload = {
              token,
              platform,
              device_info: [deviceInfo],
            };

            try {
              await sendFcmToken(payload).unwrap();
              console.log("✅ FCM token sent successfully");
            } catch (err) {
              console.log("❌ Failed to send FCM token:", err);
            }
          }
        },
        (err) => setError(err)
      )
      .catch((err) => console.log(err, "token error"));

    // Handle cold start — app opened from killed state via notification tap
    Notifications.getLastNotificationResponseAsync().then((response) => {
      if (response) {
        const content = response.notification.request.content;
        const data = {
          ...content.data,
          title: content.title,
          body: content.body,
        };
        if (data) {
          setTimeout(() => handleNotificationNavigation(data), 1000);
        }
      }
    });

    // Listeners
    notificationListener.current =
      Notifications.addNotificationReceivedListener((notif) => {
        setNotification(notif);
      });

    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
        const content = response.notification.request.content;
        const data = {
          ...content.data,
          title: content.title,
          body: content.body,
        };
        if (data) {
          setTimeout(() => handleNotificationNavigation(data), 500);
        }
      });

    return () => {
      notificationListener.current?.remove();
      responseListener.current?.remove();
    };
  }, [authToken]);

  return (
    <NotificationContext.Provider
      value={{ expoPushToken, notification, error }}
    >
      {children}
    </NotificationContext.Provider>
  );
};
