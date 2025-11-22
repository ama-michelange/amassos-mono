import { Injectable, OnDestroy } from "@angular/core";
import {
  combineLatestWith,
  debounceTime,
  defer,
  finalize,
  fromEvent,
  interval,
  map,
  Observable,
  ReplaySubject,
  Subject,
  take,
  takeUntil,
  tap,
  throttleTime,
} from "rxjs";

@Injectable({
  providedIn: "root",
})
export class PlayWithRxjsService implements OnDestroy {
  private destroy$ = new Subject<void>();

  timingQuick$: Observable<number>;
  timingSlow$: Observable<number>;

  private accessTiming$ = new ReplaySubject<number>(1);
  private accessTimingStream$: Observable<number>;

  constructor() {
    console.log("constructor");
    this.timingSlow$ = interval(1333).pipe(
      take(10),
      takeUntil(this.destroy$),
      finalize(() => {
        console.log("timingSlow$", "finalize");
      })
    );
    this.timingQuick$ = interval(333).pipe(
      take(20),
      tap({
        next: (timing) => {
          console.log("timingQuick$", "tap", "next", timing);
          this.accessTiming$.next(timing);
        },
        error: (err) => {
          console.log("timingQuick$", "tap", "error", err);
        },
        complete: () => {
          console.log("timingQuick$", "tap", "complete");
        },
      }),
      takeUntil(this.destroy$),
      finalize(() => {
        console.log("timingQuick$", "finalize");
      })
    );
    this.timingQuick$.subscribe({
      next: (timing) => {
        console.log("timingQuick$", "subscribe", "next", timing);
        this.accessTiming$.next(timing);
      },
      error: (err) => {
        console.log("timingQuick$", "subscribe", "error", err);
      },
      complete: () => {
        console.log("timingQuick$", "subscribe", "complete");
      },
    });
    this.timingSlow$.subscribe({
      next: (timing) => {
        console.log("timingSlow$", "subscribe", "next", timing);
      },
      error: (err) => {
        console.log("timingSlow$", "subscribe", "error", err);
      },
      complete: () => {
        console.log("timingSlow$", "subscribe", "complete");
      },
    });

    this.accessTiming$
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => {
          console.log("accessTiming$", "finalize");
        })
      )
      .subscribe((timing) => {
        console.log("accessTiming$", "subscribe", timing);
      });

    this.accessTimingStream$ = this.accessTiming$.pipe(
      combineLatestWith(this.timingSlow$),
      map(([quick, slow]) => {
        console.log("accessTimingStream$", "quick", quick, "slow", slow);
        return quick * slow;
      })
    );

    this.accessTimingStream$
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => {
          console.log("accessTimingStream$", "finalize");
        })
      )
      .subscribe((timing) => {
        console.log("accessTimingStream$", "subscribe", timing);
      });

    const clicksDirect = defer(() => {
      return fromEvent(document, "click");
    });
    clicksDirect
      .pipe(takeUntil(this.destroy$))
      .subscribe((x) => console.log("clicksDirect", x));
    const clicksDebounce = defer(() => {
      return fromEvent(document, "click").pipe(debounceTime(1000));
    });
    clicksDebounce
      .pipe(takeUntil(this.destroy$))
      .subscribe((x) => console.log("clicksDebounce", x));
    const clicksThrottle = defer(() => {
      return fromEvent(document, "click").pipe(throttleTime(1000));
    });
    clicksThrottle
      .pipe(takeUntil(this.destroy$))
      .subscribe((x) => console.log("clicksThrottle", x));

    const clicksOrInterval = defer(() => {
      return Math.random() > 0.5
        ? fromEvent(document, "click")
        : this.accessTimingStream$;
    });
    clicksOrInterval
      .pipe(takeUntil(this.destroy$))
      .subscribe((x) => console.log("clicksOrInterval", x));
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
