import { ENV } from "@/config";

export const delay = () => {
  if (ENV === "development")
    return new Promise((resolve) => setTimeout(resolve, 5000));
};
