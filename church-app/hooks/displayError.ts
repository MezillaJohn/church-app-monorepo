import { useAppAlert } from "@/context/AlertContext";
import { useEffect } from "react";

export const useDisplayError = (error: any) => {
  const { alert } = useAppAlert();
  useEffect(() => {
    if (error) {
      alert(
        "‼️" + error?.data?.message ||
          error?.message ||
          error?.error ||
          error?.error?.message ||
          "An error occured"
      );
    }
  }, [error]);
};
