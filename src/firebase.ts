import { initializeApp } from "firebase/app";
import { clientConfig } from "./auth-config";

export const app = initializeApp(clientConfig);
