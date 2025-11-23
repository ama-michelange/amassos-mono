import createKindeClient, {
  AuthOptions,
  ClaimTokenKey,
  KindeClaim,
  KindeClient,
  KindeClientOptions,
  KindeFlag,
  KindeFlagTypeCode,
  KindeFlagValueType,
  KindeOrganization,
  KindeOrganizations,
  KindePermission,
  KindePermissions,
  KindeUser,
  OrgOptions,
} from "@kinde-oss/kinde-auth-pkce-js";
import { Observable, ReplaySubject } from "rxjs";
import { KindeConfiguration } from "./kinde.model";

export class KindeWrapper {
  protected tsConfiguration: KindeConfiguration | undefined;
  get configuration(): KindeConfiguration | undefined {
    return this.tsConfiguration;
  }

  set configuration(value: KindeConfiguration | undefined) {
    this.tsConfiguration = value;
    this.createClient();
  }

  private subjectInitialized = new ReplaySubject<boolean>(1);
  readonly initialized$: Observable<boolean> =
    this.subjectInitialized.asObservable();

  protected kindeClient!: KindeClient;

  get initialized(): boolean {
    return this.kindeClient !== undefined;
  }

  constructor(config?: KindeConfiguration) {
    this.subjectInitialized.next(this.initialized);
    this.configuration = config;
  }

  protected toKindeClientOptions(): KindeClientOptions | undefined {
    if (this.configuration) {
      return {
        audience: this.configuration.audience,
        client_id: this.configuration.clientId,
        redirect_uri: this.configuration.redirectUri,
        domain: this.configuration.domain,
        is_dangerously_use_local_storage: this.configuration.useLocalStorage,
        logout_uri: this.configuration.logoutUri,
        scope: this.configuration.scope,
        on_redirect_callback: this.configuration.onRedirectCallback,
      };
    }
    return undefined;
  }

  protected createClient(): void {
    const kindeConfig = this.toKindeClientOptions();
    if (kindeConfig) {
      createKindeClient(kindeConfig)
        .then((value: KindeClient) => {
          this.kindeClient = value;
          this.subjectInitialized.next(this.initialized);
        })
        .catch((err) => {
          console.error("Error in createClient:", err);
          this.kindeClient = undefined as unknown as KindeClient;
          this.subjectInitialized.next(this.initialized);
        });
    }
  }

  protected assertInitialized(): void {
    if (!this.kindeClient) {
      throw new Error("The client is missing, configure it before using it.");
    }
  }

  login(options?: AuthOptions): Promise<void> {
    this.assertInitialized();
    return this.kindeClient?.login(options);
  }

  register(options?: AuthOptions): Promise<void> {
    this.assertInitialized();
    return this.kindeClient.register(options);
  }

  logout(): Promise<void> {
    this.assertInitialized();
    return this.kindeClient.logout();
  }

  isAuthenticated(): Promise<boolean> {
    this.assertInitialized();
    return this.kindeClient.isAuthenticated();
  }

  getUser(): KindeUser | undefined {
    this.assertInitialized();
    return this.kindeClient.getUser();
  }

  getUserProfile(): Promise<KindeUser | undefined> {
    this.assertInitialized();
    return this.kindeClient.getUserProfile();
  }

  getToken(): Promise<string | undefined> {
    this.assertInitialized();
    return this.kindeClient.getToken();
  }

  getIdToken(): Promise<string | undefined> {
    this.assertInitialized();
    return this.kindeClient.getIdToken();
  }

  createOrg(options?: OrgOptions): Promise<void> {
    this.assertInitialized();
    return this.kindeClient.createOrg(options);
  }

  getClaim(claim: string, tokenKey?: ClaimTokenKey): KindeClaim | null {
    this.assertInitialized();
    return this.kindeClient.getClaim(claim, tokenKey);
  }

  getFlag<T extends KindeFlagTypeCode>(
    code: string,
    defaultValue?: KindeFlagValueType[T],
    flagType?: T
  ): KindeFlag<T> {
    this.assertInitialized();
    return this.kindeClient.getFlag<T>(code, defaultValue, flagType);
  }

  getBooleanFlag(code: string, defaultValue?: boolean): boolean | Error {
    this.assertInitialized();
    return this.kindeClient.getBooleanFlag(code, defaultValue);
  }

  getStringFlag(code: string, defaultValue: string): string | Error {
    this.assertInitialized();
    return this.kindeClient.getStringFlag(code, defaultValue);
  }

  getIntegerFlag(code: string, defaultValue: number): number | Error {
    this.assertInitialized();
    return this.kindeClient.getIntegerFlag(code, defaultValue);
  }

  getPermissions(): KindePermissions {
    this.assertInitialized();
    return this.kindeClient.getPermissions();
  }

  getPermission(key: string): KindePermission {
    this.assertInitialized();
    return this.kindeClient.getPermission(key);
  }

  getOrganization(): KindeOrganization {
    this.assertInitialized();
    return this.kindeClient.getOrganization();
  }

  getUserOrganizations(): KindeOrganizations {
    this.assertInitialized();
    return this.kindeClient.getUserOrganizations();
  }
}
