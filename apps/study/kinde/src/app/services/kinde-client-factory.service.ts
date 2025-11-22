import { InjectionToken } from "@angular/core";
import createKindeBrowserClient, {
  KindeClientOptions,
} from "@kinde-oss/kinde-auth-pkce-js";

export class KindeClientFactory {
  static createClient(config: KindeClientOptions) {
    return createKindeBrowserClient({
      ...config,
    });
  }
}

export const KINDE_FACTORY_TOKEN = new InjectionToken<KindeClientFactory>(
  "KINDE_FACTORY_TOKEN"
);
