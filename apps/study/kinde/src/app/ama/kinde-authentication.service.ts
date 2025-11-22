import { DOCUMENT } from "@angular/common";
import { inject, Injectable, OnDestroy } from "@angular/core";
import { DefaultUrlSerializer, Router } from "@angular/router";
import { AuthOptions, KindeUser } from "@kinde-oss/kinde-auth-pkce-js";
import {
  combineLatestWith,
  defer,
  filter,
  from,
  iif,
  map,
  Observable,
  of,
  Subject,
  switchMap,
  takeUntil,
} from "rxjs";
import { AdditionalProvider, AuthUser } from "./authentication.model";
import { AuthenticationService } from "./authentication.service";
import { KindeWrapper } from "./kinde-wrapper";
import { KINDE_CONFIGURATION_TOKEN, KindeConfiguration } from "./kinde.model";

type AppState = { redirectTo?: Location };

const PROVIDER_KINDE = "KINDE";

const SESSION_ITEM_APP_STATE = `${PROVIDER_KINDE}_SESSION_ITEM_APP_STATE`;

@Injectable({ providedIn: "root" })
export class KindeAuthenticationService
  extends AuthenticationService
  implements OnDestroy
{
  initialized$: Observable<boolean>;

  private destructor$ = new Subject<void>();
  private kindeWrapper: KindeWrapper;
  private injectedConfiguration = inject(KINDE_CONFIGURATION_TOKEN);
  private injectedDocument = inject(DOCUMENT);
  private injectedRouter = inject(Router);

  constructor() {
    super();
    this.kindeWrapper = new KindeWrapper();
    this.initialized$ = this.kindeWrapper.initialized$;

    this.doInitialization(false);
    console.log(
      "KindeAuthenticationService",
      "constructor",
      "\n\t",
      "injectedConfiguration",
      this.injectedConfiguration,
      "\n\t",
      "injectedDocument",
      this.injectedDocument,
      "\n\t",
      "location.href",
      this.injectedDocument.location.href
    );

    this.initialized$
      .pipe(
        filter((init) => init),
        switchMap(() => {
          return this.kindeWrapper.isAuthenticated();
        }),
        switchMap((authenticated) =>
          iif(
            () => authenticated,
            defer(() => this.kindeWrapper.getUserProfile()),
            of(undefined)
          )
        ),
        switchMap((user) => this.doBuildAuthUser(user)),
        takeUntil(this.destructor$)
      )
      .subscribe((user) => {
        console.log("initialized$", "subscribe", "user", user);
        this.authUser = user;
        this.doNavigate();
      });

    this.authenticated$
      .pipe(takeUntil(this.destructor$))
      .subscribe((authenticated) => {
        console.log(
          "authenticated$",
          "subscribe",
          "authenticated",
          authenticated
        );
      });
  }

  override initialize(): Observable<void> {
    this.doInitialization();
    return this.kindeWrapper.initialized$.pipe(
      filter((init) => init),
      map(() => void 0)
    );
  }

  protected findConfiguration(): KindeConfiguration | undefined {
    if (this.injectedConfiguration) {
      return this.adaptConfiguration(this.injectedConfiguration);
    }
    return undefined;
  }

  protected adaptConfiguration(config: KindeConfiguration): KindeConfiguration {
    if (config && !config.onRedirectCallback) {
      config.onRedirectCallback = this.doOnRedirectCallback;
    }
    return config;
  }

  protected doOnRedirectCallback(user: KindeUser, appState?: AppState) {
    console.log("doOnRedirectCallback", "user", user);
    console.log("doOnRedirectCallback", "appState", appState);
    if (appState) {
      sessionStorage.setItem(SESSION_ITEM_APP_STATE, JSON.stringify(appState));
    }
  }

  protected doInitialization(throwError = true): void {
    if (!this.kindeWrapper.initialized) {
      const config = this.findConfiguration();
      if (config) {
        this.kindeWrapper.configuration = config;
      } else if (throwError) {
        throw new Error(`Unable to initialize, configuration not found!`);
      }
    }
  }

  protected doNavigate(): void {
    const storedItem = sessionStorage.getItem(SESSION_ITEM_APP_STATE);
    if (storedItem) {
      sessionStorage.removeItem(SESSION_ITEM_APP_STATE);
      const appState = JSON.parse(storedItem) as AppState;
      if (appState.redirectTo) {
        const serializer = new DefaultUrlSerializer();
        const urlTree = serializer.parse(
          `${appState.redirectTo.pathname}${appState.redirectTo.search}${appState.redirectTo.hash}`
        );
        this.injectedRouter.navigateByUrl(urlTree, { replaceUrl: true }).then();
      }
    }
  }

  override login(options?: object): Observable<void> {
    return from(this.kindeWrapper.login(this.adaptRedirectOptions(options)));
  }

  override register(options?: object): Observable<void> {
    return from(this.kindeWrapper.register(this.adaptRedirectOptions(options)));
  }

  protected adaptRedirectOptions(options?: object): object {
    const ret: AuthOptions = options ?? {};
    const redirectTo = this.injectedDocument.location;
    if (ret.app_state) {
      if (!(ret.app_state as AppState).redirectTo) {
        (ret.app_state as AppState).redirectTo = redirectTo;
      }
    } else {
      ret.app_state = { redirectTo };
    }
    return ret;
  }

  override logout(): Observable<void> {
    return from(this.kindeWrapper.logout());
  }

  override ngOnDestroy(): void {
    super.ngOnDestroy();
    this.destructor$.next();
    this.destructor$.complete();
  }

  protected doBuildAuthUser(
    kindeUser?: KindeUser
  ): Observable<AuthUser | undefined> {
    if (kindeUser) {
      return from(this.kindeWrapper.getIdToken()).pipe(
        combineLatestWith(from(this.kindeWrapper.getToken())),
        map(([idToken, accessToken]) => {
          return this.toAuthUser(kindeUser, idToken, accessToken);
        })
      );
    }
    return of(undefined);
  }

  protected toAuthUser(
    kindeUser: KindeUser,
    idToken?: string,
    accessToken?: string
  ): AuthUser {
    const additional: AdditionalProvider = {
      provider: PROVIDER_KINDE,
      firstName: kindeUser.given_name ?? undefined,
      lastName: kindeUser.family_name ?? undefined,
      email: kindeUser.email ?? undefined,
      picture: kindeUser.picture ?? undefined,
      idToken,
      accessToken,
    };
    return new AuthUser({
      id: kindeUser.id ?? "",
      name: additional.firstName,
      imageUrl: kindeUser.picture ?? undefined,
      additional,
    });
  }
}
