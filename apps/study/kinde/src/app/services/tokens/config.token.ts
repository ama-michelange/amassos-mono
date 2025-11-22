import { InjectionToken } from "@angular/core";
import { KindeClientOptions } from "@kinde-oss/kinde-auth-pkce-js";

export const kindeConfigToken = new InjectionToken<KindeClientOptions>(
  "[kinde angular] configToken"
);
