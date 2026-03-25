import { useAuth } from "@/context/AuthContext";
import { NotificationProvider } from "@/context/Notification";
import { useAppVersionCheck } from "@/hooks/useAppVersionCheck";
import AppUpdate from "@/screens/appScreens/AppUpdate/AppUpdate";
import { clear } from "@/storage";
import { Redirect } from "expo-router";
import React, { useEffect, useState } from "react";

const AppNav = () => {
  const { authToken } = useAuth();
  const { requiresUpdate, downloadUrl, version } = useAppVersionCheck();
  const [updateVisible, setUpdateVisible] = useState(false);

  useEffect(() => {
    if (requiresUpdate) setUpdateVisible(true);
  }, [requiresUpdate]);

  return (
    <NotificationProvider authToken={authToken}>
      {authToken ? <Redirect href="/(tabs)" /> : <Redirect href="/(auth)" />}

      <AppUpdate
        visible={updateVisible}
        downloadUrl={downloadUrl}
        version={version}
        onClose={() => setUpdateVisible(false)}
      />
    </NotificationProvider>
  );
};

export default AppNav;
