import { initializeApp } from "firebase/app";
import { clientConfig, emulatorConfig } from "./auth-config";

export const app = initializeApp(
  process.env.NEXT_PUBLIC_NODE_ENV === "development"
    ? emulatorConfig
    : clientConfig
);
