import appStateReducer from "@/redux/slice/appState";
import appVersionReducer from "@/redux/slice/appVersion";
import downloadReducer from "@/redux/slice/downloadSlice";
import pdfProgressReducer from "@/redux/slice/pdfProgressSlice";
import signupReducer from "@/redux/slice/signupSlice";
import { combineReducers, configureStore, Middleware } from "@reduxjs/toolkit";
import {
  FLUSH,
  PAUSE,
  PERSIST,
  persistReducer,
  persistStore,
  PURGE,
  REGISTER,
  REHYDRATE,
} from "redux-persist";

import { authenticatedBase, unAuthenticatedBase } from "@/services";
import { MMKV } from "react-native-mmkv";

// ===================
// MMKV storage setup
// ===================
const storage = new MMKV();
const mmkvStorage = {
  setItem: (key: string, value: string) => {
    storage.set(key, value);
    return Promise.resolve(true);
  },
  getItem: (key: string) => {
    const value = storage.getString(key);
    return Promise.resolve(value ?? null);
  },
  removeItem: (key: string) => {
    storage.delete(key);
    return Promise.resolve();
  },
};

// ===================
// Root reducer
// ===================
const appReducer = combineReducers({
  signupSlice: signupReducer,
  appstate: appStateReducer,
  downloads: downloadReducer,
  appVersion: appVersionReducer,
  pdfProgress: pdfProgressReducer,

  [authenticatedBase.reducerPath]: authenticatedBase.reducer,
  [unAuthenticatedBase.reducerPath]: unAuthenticatedBase.reducer,
});

// Wrap reducer to handle RESET_STORE action
const rootReducer = (state: any, action: any) => {
  if (action.type === "RESET_STORE") {
    state = undefined; // reset all slices
  }
  return appReducer(state, action);
};

// ===================
// Persist config
// ===================
const persistConfig = {
  key: "root",
  storage: mmkvStorage,
  whitelist: ["downloads", "appVersion", "pdfProgress"],
  blacklist: ["signupSlice", "appstate"],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

// ===================
// Store
// ===================
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }).concat(
      authenticatedBase.middleware as Middleware,
      unAuthenticatedBase.middleware as Middleware
    ),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const persistor = persistStore(store);

export const resetStore = () => ({
  type: "RESET_STORE",
});
