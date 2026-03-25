import AlertNotification from "@/components/AlertNotification";
import React, { createContext, ReactNode, useContext, useState } from "react";

type AlertContextType = {
  alert: (
    text: string,
    direction?: "top" | "bottom" | "left" | "right"
  ) => void;
};

const AlertContext = createContext<AlertContextType>({
  alert: () => {},
});

export const AppAlertProvider = ({ children }: { children: ReactNode }) => {
  const [alertConfig, setAlertConfig] = useState<{
    text: string;
    direction?: "top" | "bottom" | "left" | "right";
    visible: boolean;
  }>({ text: "", visible: false });

  const showAlert = (
    text: string,
    direction: "top" | "bottom" | "left" | "right" = "top"
  ) => {
    setAlertConfig({ text, direction, visible: true });
  };

  const handleClose = () =>
    setAlertConfig((prev) => ({ ...prev, visible: false }));

  return (
    <AlertContext.Provider value={{ alert: showAlert }}>
      {children}
      {alertConfig.visible && (
        <AlertNotification
          text={alertConfig.text}
          direction={alertConfig.direction}
          onClose={handleClose}
        />
      )}
    </AlertContext.Provider>
  );
};

export const useAppAlert = () => useContext(AlertContext);
