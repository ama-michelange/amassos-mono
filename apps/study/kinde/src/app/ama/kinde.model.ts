import { InjectionToken } from "@angular/core";
import { KindeUser } from "@kinde-oss/kinde-auth-pkce-js";

export type KindeCallback = (user: KindeUser, appState?: object) => void;

export interface KindeConfiguration {
  audience?: string;
  clientId: string;
  domain: string;
  logoutUri?: string;
  redirectUri: string;
  scope?: string;
  useLocalStorage?: boolean;
  onRedirectCallback?: KindeCallback;
}

export const KINDE_CONFIGURATION_TOKEN = new InjectionToken<KindeConfiguration>(
  "Kinde Configuration Token"
);
