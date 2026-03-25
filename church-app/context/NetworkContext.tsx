import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import * as Network from "expo-network";
import { AppState, AppStateStatus } from "react-native";

interface NetworkContextType {
  isConnected: boolean;
  isInternetReachable: boolean;
  networkType: Network.NetworkStateType | null;
  checkConnection: () => Promise<void>;
}

const NetworkContext = createContext<NetworkContextType | undefined>(undefined);

export function NetworkProvider({ children }: { children: ReactNode }) {
  const [isConnected, setIsConnected] = useState(true);
  const [isInternetReachable, setIsInternetReachable] = useState(true);
  const [networkType, setNetworkType] =
    useState<Network.NetworkStateType | null>(null);

  const checkConnection = async () => {
    try {
      const state = await Network.getNetworkStateAsync();
      setIsConnected(state.isConnected ?? false);
      setIsInternetReachable(state.isInternetReachable ?? false);
      setNetworkType(state.type ?? null);
    } catch (error) {
      console.error("Error checking network state:", error);
      setIsConnected(false);
      setIsInternetReachable(false);
    }
  };

  useEffect(() => {
    checkConnection();

    const handleAppStateChange = (nextAppState: AppStateStatus) => {
      if (nextAppState === "active") {
        checkConnection();
      }
    };

    const subscription = AppState.addEventListener(
      "change",
      handleAppStateChange
    );

    const interval = setInterval(checkConnection, 10000);

    return () => {
      subscription.remove();
      clearInterval(interval);
    };
  }, []);

  return (
    <NetworkContext.Provider
      value={{
        isConnected,
        isInternetReachable,
        networkType,
        checkConnection,
      }}
    >
      {children}
    </NetworkContext.Provider>
  );
}

export function useNetwork() {
  const context = useContext(NetworkContext);
  if (context === undefined) {
    throw new Error("useNetwork must be used within a NetworkProvider");
  }
  return context;
}

export function useIsOffline() {
  const { isConnected, isInternetReachable } = useNetwork();
  return !isConnected || !isInternetReachable;
}
