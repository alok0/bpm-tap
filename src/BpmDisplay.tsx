import { ReactNode } from "react";

const bpmToDuration = (bpm: number) => 60_000.0 / bpm;

const SingleStat = ({ title, bpm }: { title: ReactNode; bpm: number }) => {
  return (
    <div className="stat">
      <div className="stat-title">{title}</div>
      <div className="stat-value text-neutral-content">
        {!bpm ? "--" : bpm.toFixed(1)}
      </div>
      <div className="stat-desc">
        {(!bpm ? "-- " : bpmToDuration(bpm).toFixed(1)) + "ms"}
      </div>
    </div>
  );
};

export const BpmDisplay = ({ bpm }: { bpm: number | null }) => {
  const value = !bpm || !Number.isFinite(bpm) ? 0 : bpm;
  return (
    <>
      <div className="grid w-48 md:w-112 min-h-60 md:min-h-30">
        <div className="stats stats-vertical md:stats-horizontal md:grid-cols-2 bg-base-100 shadow select-none">
          <SingleStat title="BPM" bpm={value} />
          <SingleStat title="BPM / 2" bpm={value / 2} />
        </div>
      </div>
    </>
  );
};
