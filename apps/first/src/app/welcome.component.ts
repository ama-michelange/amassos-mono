import { CommonModule } from "@angular/common";
import {
  Component,
  OnDestroy,
  signal,
  ViewEncapsulation,
  WritableSignal,
} from "@angular/core";

const ALL_IMAGES = [
  "./img/amassos-logo-2-clean_line-black_white.svg",
  "./img/amassos-logo-2_line-black.svg",
  "./img/amassos-logo-2_line-black_white.svg",
  "./img/amassos-logo-2_line-black_red.svg",
  "./img/amassos-logo-2_line-black_green.svg",
  "./img/amassos-logo-2_line-black_blue.svg",
  "./img/amassos-logo-2_line-white.svg",
  "./img/amassos-logo-2_line-white_black.svg",
  "./img/amassos-logo-2_line-white_red.svg",
  "./img/amassos-logo-2_line-white_green.svg",
  "./img/amassos-logo-2_line-white_blue.svg",
];

@Component({
  selector: "app-welcome",
  imports: [CommonModule],
  template: `
    <style>
      html {
        height: 100%;
        width: 100%;
      }

      body {
        height: 100%;
        width: 100%;
        margin: 0;
        padding: 0;
      }

      h1,
      h2,
      p,
      pre {
        margin: 0;
      }

      *,
      ::before,
      ::after {
        box-sizing: border-box;
        border-width: 0;
        border-style: solid;
        border-color: currentColor;
      }

      h1,
      h2 {
        font-size: inherit;
        font-weight: inherit;
      }

      a {
        color: inherit;
        text-decoration: inherit;
      }

      .main {
        height: 100vh;
        width: 100vw;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
        background-color: #252525;
      }

      .tile-container {
        display: flex;
        flex-direction: row;
        align-items: flex-end;
        justify-content: center;
        width: 100vw;
        height: 100vh;
      }

      .image-svg {
        max-height: 100%;
        max-width: 100%;
      }
    </style>
    <div class="main">
      <div class="tile-container">
        <img
          [src]="$image()"
          class="image-svg"
          alt="amassos"
          id="welcomeLogo"
        />
      </div>
    </div>
  `,
  styles: [],
  encapsulation: ViewEncapsulation.None,
})
export class Welcome implements OnDestroy {
  protected $image: WritableSignal<string> = signal(ALL_IMAGES[0]);
  private readonly intervalKey: number | undefined;

  constructor() {
    this.$image.set(this.randomizeImage());
    this.intervalKey = setInterval(() => {
      this.$image.set(this.randomizeImage());
    }, 1000 * 13);
  }
  ngOnDestroy(): void {
    clearInterval(this.intervalKey);
  }
  randomizeImage(): string {
    const randomIndex = Math.floor(Math.random() * ALL_IMAGES.length);
    return ALL_IMAGES[randomIndex];
  }
}
