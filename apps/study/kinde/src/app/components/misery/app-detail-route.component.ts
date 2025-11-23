import { CommonModule } from "@angular/common";
import { Component, inject, OnInit } from "@angular/core";
import { ActivatedRoute, ParamMap, RouterModule } from "@angular/router";
import { Observable } from "rxjs";

@Component({
  selector: "app-detail-route",
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: "./app-detail-route.component.html",
})
export class DetailRouteComponent implements OnInit {
  private activatedRoute: ActivatedRoute = inject(ActivatedRoute);

  fragment$!: Observable<string | null>;
  paramMap$!: Observable<ParamMap>;
  queryParamMap$!: Observable<ParamMap>;

  ngOnInit(): void {
    this.paramMap$ = this.activatedRoute.paramMap;
    this.queryParamMap$ = this.activatedRoute.queryParamMap;
    this.fragment$ = this.activatedRoute.fragment;
  }
}
