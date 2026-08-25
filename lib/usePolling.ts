import { useEffect, useRef } from "react";

/**
 * Polls `fn` every `intervalMs` milliseconds while the document is visible.
 * `fn` runs immediately on mount, then on each tick. Polling pauses when the
 * tab is hidden and resumes (with an immediate tick) when it becomes visible.
 * Overlapping ticks are skipped. Set `enabled=false` to stop polling entirely.
 */
export function usePolling(
  fn: () => Promise<void> | void,
  intervalMs: number,
  enabled = true
) {
  const fnRef = useRef(fn);
  fnRef.current = fn;

  useEffect(() => {
    if (!enabled) return;

    let disposed = false;
    let timer: ReturnType<typeof setTimeout> | null = null;
    let running = false;

    const run = async () => {
      if (running || disposed) return;
      running = true;
      try {
        await fnRef.current();
      } catch {
        // Polling is best-effort; transient errors are ignored.
      } finally {
        running = false;
      }
    };

    const schedule = () => {
      if (disposed) return;
      timer = setTimeout(async () => {
        if (disposed) return;
        if (document.visibilityState === "visible") {
          await run();
        }
        schedule();
      }, intervalMs);
    };

    const onVisibility = () => {
      if (document.visibilityState !== "visible") return;
      run();
      if (timer) clearTimeout(timer);
      schedule();
    };

    run();
    schedule();
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      disposed = true;
      if (timer) clearTimeout(timer);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [intervalMs, enabled]);
}
