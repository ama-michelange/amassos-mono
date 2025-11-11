import { Component } from "@angular/core";
import { RouterModule } from "@angular/router";
import { Welcome } from "./welcome.component";

@Component({
  imports: [Welcome, RouterModule],
  selector: "app-root",
  templateUrl: "./app.html",
  styleUrl: "./app.scss",
})
export class App {
  protected title = "first";
}
