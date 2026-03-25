import { useAppDispatch } from "@/hooks/useTypedSelector";
import { persistor, resetStore } from "@/redux/store/store";
import { storage } from "@/storage";
import { User } from "@/services/api/unAuth/type";
import {
  createContext,
  FC,
  PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useMemo,
} from "react";
import { useMMKVBoolean, useMMKVString } from "react-native-mmkv";

export type AuthContextType = {
  isAuthenticated: boolean;
  authToken?: string;
  authUser: User;
  isUserReady: boolean;
  setAuthToken: (token?: string) => void;
  setAuthUser: (user: User) => void;
  setIsUserReady: (ready: boolean) => void;
  logout: () => void;
};

export const AuthContext = createContext<AuthContextType | null>(null);

export interface AuthProviderProps {}

export const AuthProvider: FC<PropsWithChildren<AuthProviderProps>> = ({
  children,
}) => {
  const [authToken, setAuthToken] = useMMKVString("AuthProvider.authToken");
  const [authUserRaw, setAuthUserRaw] = useMMKVString("AuthProvider.authUser");
  const [isUserReady, setIsUserReady] = useMMKVBoolean(
    "AuthProvider.isUserReady"
  );

  useEffect(() => {
    if (isUserReady === undefined) {
      setIsUserReady(false);
    }
  }, [isUserReady, setIsUserReady]);

  const authUser: User = useMemo(() => {
    return authUserRaw ? JSON.parse(authUserRaw) : null;
  }, [authUserRaw]);

  const setAuthUser = useCallback(
    (user: any) => {
      if (user) {
        setAuthUserRaw(JSON.stringify(user));
      } else {
        setAuthUserRaw(undefined);
      }
    },
    [setAuthUserRaw]
  );

  const dispatch = useAppDispatch();

  const logout = useCallback(() => {
    setAuthToken(undefined);
    setAuthUserRaw(undefined);
    setIsUserReady(false);
    storage.delete("AuthProvider.refreshToken");

    dispatch(resetStore()); // ✅ clears Redux store
    persistor.purge(); // ✅ clears MMKV storage
  }, [dispatch]);

  const value: AuthContextType = {
    isAuthenticated: !!authToken,
    authToken,
    authUser,
    isUserReady: isUserReady ?? false,
    setAuthToken,
    setAuthUser,
    setIsUserReady,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};
