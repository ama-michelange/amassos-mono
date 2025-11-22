import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { AuthenticationRepository } from "./authentication.repository";

@Injectable()
export abstract class AuthenticationService extends AuthenticationRepository {
  protected constructor() {
    super();
  }

  abstract initialize(): Observable<void>;

  abstract login(options?: object): Observable<void>;

  abstract register(options?: object): Observable<void>;

  abstract logout(): Observable<void>;
}
