import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
  provideZoneChangeDetection,
} from "@angular/core";
import { provideRouter } from "@angular/router";
import {
  KINDE_CONFIGURATION_TOKEN,
  KindeConfiguration,
} from "./ama/kinde.model";
import { appRoutes } from "./app.routes";

// const kindeClientConfig: KindeClientOptions = {
//   domain: "https://amassos.kinde.com",
//   client_id: "fdeba9567a3c4d988a22386ec76a836f",
//   redirect_uri: "http://localhost:4200",
//   logout_uri: "http://localhost:4200",
// };

const kindeConfiguration: KindeConfiguration = {
  domain: "https://amassos.kinde.com",
  // domain: "https://auth.amassos.fr",
  clientId: "fdeba9567a3c4d988a22386ec76a836f",
  redirectUri: "http://localhost:4200",
  // redirectUri: "https://test.auth.amassos.fr",
  logoutUri: "http://localhost:4200",
  // logoutUri: "https://test.auth.amassos.fr",
  useLocalStorage: true,
};

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    {
      provide: KINDE_CONFIGURATION_TOKEN,
      useValue: kindeConfiguration,
    },
    // {
    //   provide: KINDE_FACTORY_TOKEN,
    //   useFactory: KindeClientFactory.createClient,
    //   deps: [kindeConfigToken],
    // },
    provideRouter(appRoutes),
  ],
};
