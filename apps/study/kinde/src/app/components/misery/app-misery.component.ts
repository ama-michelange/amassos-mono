import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
import { RouterModule } from "@angular/router";
import { DetailRouteComponent } from "./app-detail-route.component";

@Component({
  selector: "app-misery",
  standalone: true,
  imports: [CommonModule, RouterModule, DetailRouteComponent],
  templateUrl: "./app-misery.component.html",
})
export class AppMiseryComponent {}
