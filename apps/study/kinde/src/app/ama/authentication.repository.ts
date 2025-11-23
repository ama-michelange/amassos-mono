import { Injectable, OnDestroy } from "@angular/core";
import { BehaviorSubject, Observable, shareReplay } from "rxjs";
import { AuthUser } from "./authentication.model";

@Injectable({ providedIn: "root" })
export class AuthenticationRepository implements OnDestroy {
  private authenticatedUser?: AuthUser;

  get authUser(): AuthUser | undefined {
    return this.authenticatedUser;
  }

  protected set authUser(user: AuthUser | undefined) {
    this.authenticatedUser = user;
    this.emit();
  }

  get authenticated(): boolean {
    return !!this.authUser;
  }

  private subjectAuthenticated = new BehaviorSubject<boolean>(false);
  readonly authenticated$: Observable<boolean> = this.subjectAuthenticated
    .asObservable()
    .pipe(shareReplay(1));

  protected constructor() {
    this.emit();
  }

  private emit() {
    this.subjectAuthenticated.next(this.authenticated);
  }

  protected destroy(): void {
    this.subjectAuthenticated.complete();
  }

  ngOnDestroy(): void {
    this.destroy();
  }
}
