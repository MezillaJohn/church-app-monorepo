import { useAppDispatch, useAppSelector } from "@/hooks/useTypedSelector";
import {
  setAndroidVersion,
  setBothVersions,
  setIosVersion,
} from "@/redux/slice/appVersion";
import { useGetSocialLinksQuery } from "@/services/api/public";
import { useEffect, useMemo } from "react";
import { Platform } from "react-native";

/** Compare two version strings safely */
const compareVersions = (local?: string | null, api?: string | null) => {
  if (!local || !api) return false;

  const L = local.split(".").map(Number);
  const A = api.split(".").map(Number);

  for (let i = 0; i < 3; i++) {
    if ((A[i] || 0) > (L[i] || 0)) return true;
    if ((A[i] || 0) < (L[i] || 0)) return false;
  }
  return false;
};

export const useAppVersionCheck = () => {
  const dispatch = useAppDispatch();
  const { androidVersion, iosVersion } = useAppSelector((s) => s.appVersion);

  const { data } = useGetSocialLinksQuery(null);

  const androidApi = data?.data?.attributes?.app_info?.android?.version ?? null;
  const iosApi = data?.data?.attributes?.app_info?.ios?.version ?? null;

  const iosDownloadUrl =
    data?.data?.attributes?.app_info?.ios?.download_url ?? null;
  const androidDownloadUrl =
    data?.data?.attributes?.app_info?.android?.download_url ?? null;

  /** Sync Redux only if not already stored */
  useEffect(() => {
    if (androidApi && iosApi && (!androidVersion || !iosVersion)) {
      dispatch(setBothVersions({ android: androidApi, ios: iosApi }));
      return;
    }

    if (androidApi && !androidVersion) dispatch(setAndroidVersion(androidApi));
    if (iosApi && !iosVersion) dispatch(setIosVersion(iosApi));
  }, [androidApi, iosApi]);

  /** Detect if user must update */
  const requiresUpdate = useMemo(() => {
    if (!androidApi || !iosApi) return false;
    if (!androidVersion && !iosVersion) return false;

    return Platform.OS === "android"
      ? compareVersions(androidVersion, androidApi)
      : compareVersions(iosVersion, iosApi);
  }, [androidVersion, iosVersion, androidApi, iosApi]);

  return {
    requiresUpdate,
    version: Platform.OS === "android" ? androidApi : iosApi,
    downloadUrl:
      Platform.OS === "android" ? androidDownloadUrl : iosDownloadUrl,
  };
};
