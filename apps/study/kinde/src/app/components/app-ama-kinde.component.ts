import { CommonModule } from "@angular/common";
import { Component, inject } from "@angular/core";
import { KindeAuthenticationService } from "../ama/kinde-authentication.service";
import { LoggedInComponent } from "./logged-in/logged-in.component";
import { LoggedOutComponent } from "./logged-out/logged-out.component";
import { NavComponent } from "./nav/nav.component";

@Component({
  selector: "app-ama-kinde",
  standalone: true,
  imports: [CommonModule, LoggedInComponent, LoggedOutComponent, NavComponent],

  templateUrl: "./app-ama-kinde.component.html",
  styleUrl: "./app-ama-kinde.component.scss",
})
export class AppAmaKindeComponent {
  title = "AppAmaKindeComponent";

  kinde: KindeAuthenticationService = inject(KindeAuthenticationService);
  constructor() {
    console.log("AppAmaKindeComponent", "constructor", "kinde", this.kinde);
  }

  login(): void {
    this.kinde.login().subscribe();
  }

  logout(): void {
    this.kinde.logout().subscribe();
  }
}
