import { useCallback, useEffect, useMemo, useState } from "react";

const durationToBpm = (ms: number) => 60_000.0 / ms;

const bpmToDuration = (bpm: number) => 60_000.0 / bpm;

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
  const [, setPrev] = useState(0);
  const bpm = useMemo(() => calcBPM(samples), [samples]);
  const tap = useCallback(() => {
    const t = window.performance.timeOrigin + window.performance.now();
    setTimeout(() => {
      setPrev((prev) => {
        if (!prev) {
          return t;
        }
        const delta = t - prev;
        if (delta < 166) {
          return prev;
        }
        if (delta > 2000) {
          setSamples([]);
          return 0;
        }

        setSamples((v) => [...v, delta].slice(-128));
        return t;
      });
    }, 0);
  }, []);

  useEffect(() => {
    document.body.addEventListener("keydown", tap);
    return () => {
      document.body.removeEventListener("keydown", tap);
    };
  }, [tap]);

  return (
    <div
      className="absolute inset-0 bg-base-200 text-base-content p-8"
      onPointerDown={tap}
    >
      {!!bpm && (
        <>
          <div className="stats stats-vertical md:stats-horizontal bg-base-100 shadow select-none">
            <div className="stat">
              <div className="stat-title">BPM</div>
              <div className="stat-value text-neutral-content">
                {bpm.toFixed(1)}
              </div>
              <div className="stat-desc">
                {bpmToDuration(bpm).toFixed(1) + "ms"}
              </div>
            </div>
            <div className="stat">
              <div className="stat-title">BPM / 2</div>
              <div className="stat-value text-neutral-content">
                {(bpm / 2).toFixed(1)}
              </div>
              <div className="stat-desc">
                {bpmToDuration(bpm / 2).toFixed(1) + "ms"}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
