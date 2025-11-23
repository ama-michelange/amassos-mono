import { Component } from "@angular/core";
import { RouterModule } from "@angular/router";
import { AppAmaKindeComponent } from "./components/app-ama-kinde.component";

@Component({
  selector: "app-root",
  imports: [AppAmaKindeComponent, RouterModule],
  templateUrl: "./app.html",
  styleUrl: "./app.scss",
})
export class App {
  title = "study-kinde";
}
