import { useCallback, useEffect, useMemo, useState } from "react";
import { BpmDisplay } from "./BpmDisplay";
import { Welcome } from "./Welcome";

const durationToBpm = (ms: number) => 60_000.0 / ms;

const averageFn1 = (samples: number[]): number => {
  const weighted = [
    ...samples,
    ...samples.slice(-4),
    ...samples.slice(-8),
    ...samples.slice(-16),
    ...samples.slice(-32),
    ...samples.slice(-64),
  ].toSorted();
  const outlierIndex = Math.floor(weighted.length / 10);

  const middleSet = weighted.slice(outlierIndex, -outlierIndex);
  return middleSet.reduce((a, b) => a + b) / middleSet.length;
};

const calcBPM = (samples: number[]): number | null => {
  if (samples.length < 3) {
    return null;
  }
  if (samples.length > 10) {
    return durationToBpm(averageFn1(samples));
  }

  return durationToBpm(samples.reduce((p, c) => (p + c) / 2));
};

export const App = () => {
  const [samples, setSamples] = useState([] as number[]);
  const [prev, setPrev] = useState(0);
  const bpm = useMemo(() => calcBPM(samples), [samples]);
  const tap = useCallback(() => {
    const t = window.performance.timeOrigin + window.performance.now();
    setTimeout(() => {
      setPrev((prev) => {
        const delta = t - prev;
        if (delta < 110) {
          return prev;
        }
        if (delta > 2000) {
          setSamples([]);
          return t;
        }

        setSamples((v) => [...v, delta].slice(-128));
        return t;
      });
    }, 0);
  }, []);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === " " || e.key === "Enter" || e.key === "Escape") {
        tap();
      }
    };
    document.body.addEventListener("keydown", handler);
    return () => {
      document.body.removeEventListener("keydown", handler);
    };
  }, [tap]);

  return (
    <div
      className="absolute inset-0 bg-base-200 text-base-content p-8"
      onPointerDown={tap}
    >
      {!prev ? <Welcome /> : <BpmDisplay bpm={bpm} />}
    </div>
  );
};
