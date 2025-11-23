import { CommonModule } from "@angular/common";
import { Component, inject } from "@angular/core";
import { KindeAuthenticationService } from "../../ama/kinde-authentication.service";

@Component({
  selector: "app-logged-out",
  standalone: true,
  imports: [CommonModule],
  templateUrl: "./logged-out.component.html",
  styles: `
    button {margin-right: 16px;}`,
})
export class LoggedOutComponent {
  kinde: KindeAuthenticationService = inject(KindeAuthenticationService);

  login() {
    this.kinde.login();
  }

  register() {
    this.kinde.register();
  }
}
