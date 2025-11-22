import { TestBed } from "@angular/core/testing";
import { provideRouter } from "@angular/router";
import { KindeAuthenticationService } from "./ama/kinde-authentication.service";
import { App } from "./app";

const MockKindeAuthenticationService = {};
describe(`Given ${App.name}`, () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [
        provideRouter([]),
        {
          provide: KindeAuthenticationService,
          useValue: MockKindeAuthenticationService,
        },
      ],
    }).compileComponents();
  });

  test("Then should render title", () => {
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector("h1")?.textContent).toContain(
      "KindeWrapper initializing"
    );
  });

  test(`Then should have as title 'study-kinde'`, () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    expect(app.title).toEqual("study-kinde");
  });
});
