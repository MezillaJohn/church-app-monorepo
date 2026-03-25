import { useAppAlert } from "@/context/AlertContext";
import { useEffect } from "react";

type SuccessCallback = () => void;

export const useDisplaySuccess = (
  isSuccess: boolean,
  message?: string,
  callback?: SuccessCallback
) => {
  const { alert } = useAppAlert();

  useEffect(() => {
    if (isSuccess) {
      if (message) {
        alert("success");
      }
      if (callback) {
        callback();
      }
    }
  }, [isSuccess]);
};
