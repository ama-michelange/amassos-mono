import { TestBed } from "@angular/core/testing";
import { App } from "./app";
import { Welcome } from "./welcome.component";

describe("App", () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App, Welcome],
    }).compileComponents();
  });

  test("Then should render title", () => {
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    const imgElement = compiled.querySelector("#welcomeLogo");
    expect(imgElement).toBeTruthy();
    expect(imgElement instanceof HTMLImageElement).toBeTruthy();
    expect(imgElement?.tagName).toEqual("IMG");
    expect(imgElement?.getAttribute("src")).toContain("amassos-logo-2");
    expect(imgElement?.getAttribute("src")).toContain(".svg");
  });
});
