import { CommonModule, NgOptimizedImage } from "@angular/common";
import { Component, inject } from "@angular/core";
import { KindeAuthenticationService } from "../../ama/kinde-authentication.service";

@Component({
  selector: "app-logged-in",
  standalone: true,
  imports: [CommonModule, NgOptimizedImage],
  templateUrl: "./logged-in.component.html",
  styles: `
    button {margin-right: 16px;}`,
})
export class LoggedInComponent {
  showToken = false;

  kinde: KindeAuthenticationService = inject(KindeAuthenticationService);

  logout() {
    this.kinde.logout();
  }

  toggleToken(): void {
    this.showToken = !this.showToken;
    this.getClaims();
  }

  toggleUserOrganizations() {
    // if (this.subjectOrganization.getValue()) {
    //   this.subjectOrganization.next(null);
    // } else {
    //   this.kinde.getUserOrganizations().subscribe((orgs) => this.subjectOrganization.next(orgs));
    // }
  }

  getClaims(): void {
    // const toClaims = [
    //   "given_name",
    //   "family_name",
    //   "name",
    //   "picture",
    //   "aud",
    //   "azp",
    //   "iss",
    //   "sub",
    //   "org_code",
    //   "scp",
    //   "scope", // This claim is undefined in Kinde
    // ];
    // toClaims.forEach((claim) => {
    //   this.authService
    //     .getClaim(claim, "id_token")
    //     .pipe(
    //       finalize(() => {
    //         console.log("getClaims", claim, "id_token", "finalize");
    //       })
    //     )
    //     .subscribe((value) => {
    //       console.log("getClaims", claim, "id_token", "subscribe", "value", value);
    //     });
    //
    //   this.authService
    //     .getClaim(claim, "access_token")
    //     .pipe(
    //       finalize(() => {
    //         console.log("getClaims", claim, "access_token", "finalize");
    //       })
    //     )
    //     .subscribe((value) => {
    //       console.log("getClaims", claim, "access_token", "subscribe", "value", value);
    //     });
    // });
  }
}
