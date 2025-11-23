import { Location as NgLocation } from "@angular/common";
import { Inject, Injectable, OnDestroy } from "@angular/core";
import {
  AuthOptions,
  ClaimTokenKey,
  KindeClaim,
  KindeClient,
  KindeOrganizations,
  KindeUser,
} from "@kinde-oss/kinde-auth-pkce-js";
import {
  defer,
  iif,
  map,
  Observable,
  of,
  Subject,
  switchMap,
  takeUntil,
  tap,
} from "rxjs";
import { AuthStateService } from "./auth-state.service";

import { KINDE_FACTORY_TOKEN } from "./kinde-client-factory.service";
import { LOCATION_TOKEN } from "./tokens/location.token";

@Injectable({
  providedIn: "root",
})
export class KindeAngularService implements OnDestroy {
  private unsubscribe$ = new Subject<void>();

  // @ts-expect-error "user is not defined in AuthStateService"
  user$: Observable<KindeUser | null | undefined> = this.authState.user$;
  // @ts-expect-error "isAuthenticated is not defined in AuthStateService"
  isAuthenticated$: Observable<boolean> = this.authState.isAuthenticated$;
  // @ts-expect-error "isLoading is not defined in AuthStateService"
  isLoading$: Observable<boolean> = this.authState.isLoading$;
  accessToken$: Observable<string | null | undefined> =
    // @ts-expect-error "accessToken is not defined in 'AuthStateService'"
    this.authState.accessToken$;

  constructor(
    // eslint-disable-next-line @angular-eslint/prefer-inject
    @Inject(KINDE_FACTORY_TOKEN) private kindeClient: KindeClient,
    // eslint-disable-next-line @angular-eslint/prefer-inject
    @Inject(LOCATION_TOKEN) private location: Location,
    // eslint-disable-next-line @angular-eslint/prefer-inject
    private ngLocation: NgLocation,
    // eslint-disable-next-line @angular-eslint/prefer-inject
    private authState: AuthStateService
  ) {
    this.shouldHandleCallback()
      .pipe(
        switchMap((shouldHandleCallback) =>
          iif(
            () => shouldHandleCallback,
            defer(() => this.handleCallback()),
            of(false)
          )
        ),
        tap(() => authState.setIsLoading(false)),
        takeUntil(this.unsubscribe$)
      )
      .subscribe();

    this.isAuthenticated$
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((value) => {
        console.log("isAuthenticated$", "subscribe", "value", value);
      });
    this.authState.isAuthenticatedStream$
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((value) => {
        console.log(
          "authState.isAuthenticatedStream$",
          "subscribe",
          "value",
          value
        );
      });
    this.authState.isLoading$
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((value) => {
        console.log("authState.isLoading$", "subscribe", "value", value);
      });
    this.authState.accessToken$
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((value) => {
        console.log("authState.accessToken$", "subscribe", "value", value);
      });
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  getClaim<T>(
    claim: string,
    type?: ClaimTokenKey
  ): Observable<KindeClaim | null> {
    // todo: make reusable function to handle isAuthenticated
    return this.isAuthenticated$.pipe(
      switchMap((isAuthenticated) =>
        iif(
          () => isAuthenticated,
          of(this.kindeClient.getClaim(claim, type)),
          of(null)
        )
      )
    );
  }

  getUserOrganizations(): Observable<KindeOrganizations> {
    // todo: check L59
    return this.isAuthenticated$.pipe(
      switchMap((isAuthenticated) =>
        iif(
          () => isAuthenticated,
          of(this.kindeClient.getUserOrganizations()),
          of({ orgCodes: [] })
        )
      )
    );
  }

  getAccessToken(): Promise<string | undefined> {
    return this.kindeClient.getToken();
  }

  async login(options?: AuthOptions): Promise<void> {
    return await this.kindeClient.login(options);
  }

  async logout(): Promise<void> {
    return await this.kindeClient.logout();
  }

  async register(options?: AuthOptions): Promise<void> {
    return await this.kindeClient.register(options);
  }

  private shouldHandleCallback(): Observable<boolean> {
    // console.log("shouldHandleCallback", "location.search", this.location.search);
    // console.log("shouldHandleCallback", "ngLocation.path", this.ngLocation.path());
    // const urlParams = new URLSearchParams(this.ngLocation.path());
    // console.log("shouldHandleCallback", "urlParams", urlParams);
    // console.log("shouldHandleCallback", "urlParams.code", urlParams.has("code"));
    // console.log("shouldHandleCallback", "urlParams.state", urlParams.has("state"));
    return of(this.ngLocation.path()).pipe(
      map((search) => new URLSearchParams(search)),
      map((params) => params.has("code") || params.has("state"))
    );
    // return of(this.location.search).pipe(
    //   map((search) => new URLSearchParams(search)),
    //   map((params) => params.has("code") || params.has("state"))
    // );
  }

  async handleCallback(): Promise<void> {
    // try {
    //   console.log("handleCallback", "this.location.toString()", this.location.toString());
    //   console.log("handleCallback", "window.location.toString()", window.location.toString());
    //   console.log("handleCallback", "this.ngLocation", this.ngLocation);
    //   console.log("handleCallback", "this.ngLocation.path()", this.ngLocation.path());
    //
    //   const urlLocation = new URL(this.location.toString());
    //   console.log("handleCallback", "urlLocation", urlLocation);
    //   const urlExternal = this.ngLocation.prepareExternalUrl(this.ngLocation.path());
    //   console.log("handleCallback", "urlExternal", urlExternal);
    //   // const urlNgLocation = new URL(this.ngLocation.path());
    //   // console.log("handleCallback", "urlNgLocation", urlNgLocation);
    //
    //   await this.kindeClient.handleRedirectToApp(new URL(window.location.toString()));
    //   const token = await this.kindeClient.getToken();
    //   this.authState.setAccessToken(token);
    //   const url = new URL(window.location.toString());
    //   url.search = "";
    //
    //   window.history.pushState({}, "", url);
    // } catch (e) {
    //   console.log(e);
    // }
  }
}
