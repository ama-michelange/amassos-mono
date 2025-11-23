import { TestBed } from "@angular/core/testing";
import { provideRouter } from "@angular/router";
import { KindeAuthenticationService } from "../ama/kinde-authentication.service";
import { AppAmaKindeComponent } from "./app-ama-kinde.component";

const MockKindeAuthenticationService = {};

describe(`Given ${AppAmaKindeComponent.name}`, () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [
        provideRouter([]),
        {
          provide: KindeAuthenticationService,
          useValue: MockKindeAuthenticationService,
        },
      ],
      imports: [AppAmaKindeComponent],
    }).compileComponents();
  });

  test("Then should create the app", () => {
    const fixture = TestBed.createComponent(AppAmaKindeComponent);
    const app = fixture.componentInstance;
    expect(app).toBeDefined();
  });
});
