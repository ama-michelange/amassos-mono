import { Route } from "@angular/router";
import { AppMiseryOlaComponent } from "./components/misery/app-misery-ola.component";
import { AppMiseryComponent } from "./components/misery/app-misery.component";

export const appRoutes: Route[] = [
  {
    path: "misery",
    component: AppMiseryComponent,
    children: [
      { path: "ola/:id", component: AppMiseryOlaComponent },
      { path: ":id", component: AppMiseryComponent },
    ],
  },
];
