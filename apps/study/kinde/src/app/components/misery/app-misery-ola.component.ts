import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
import { DetailRouteComponent } from "./app-detail-route.component";

@Component({
  selector: "app-misery-ola",
  standalone: true,
  imports: [CommonModule, DetailRouteComponent],
  templateUrl: "./app-misery-ola.component.html",
})
export class AppMiseryOlaComponent {}
