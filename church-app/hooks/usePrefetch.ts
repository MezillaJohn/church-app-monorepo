import { useAppDispatch } from "@/hooks/useTypedSelector";
import { publicEndpoints } from "@/services/api/public";

import { useEffect } from "react";

export const usePrefetch = (authToken: string | undefined) => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (authToken) {
      dispatch(
        publicEndpoints.util.prefetch("churchCenters", null, {
          force: true,
        })
      );
      dispatch(
        publicEndpoints.util.prefetch("books", null, {
          force: true,
        })
      );
      dispatch(
        publicEndpoints.util.prefetch("events", null, {
          force: true,
        })
      );
    }
  }, [authToken]);
};
