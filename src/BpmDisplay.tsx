import type { ReactNode } from "react";

const bpmToDuration = (bpm: number) => 60_000.0 / bpm;

const SingleStat = ({ title, bpm }: { title: ReactNode; bpm: number }) => {
  return (
    <div
      style={{
        minWidth: "15ch",
        borderColor: "#fff3",
        borderStyle: "solid",
        borderWidth: 1,
        borderRadius: 4,
        padding: "1rem",
      }}
    >
      <div style={{ opacity: 0.5, fontSize: "1rem" }}>{title}</div>
      <div style={{ fontSize: "1.5rem", margin: "0.5rem 0", lineHeight: 1 }}>
        {!bpm ? "--" : bpm.toFixed(1)}
      </div>
      <div style={{ opacity: 0.5, fontSize: "1rem" }}>
        {(!bpm ? "-- " : bpmToDuration(bpm).toFixed(1)) + "ms"}
      </div>
    </div>
  );
};

export const BpmDisplay = ({ bpm }: { bpm: number | null }) => {
  const value = !bpm || !Number.isFinite(bpm) ? 0 : bpm;
  return (
    <>
      <div
        style={{
          userSelect: "none",
          display: "grid",
          gridTemplateColumns: "1fr",
          gap: ".5rem",
          justifyItems: "start",
        }}
      >
        <SingleStat title="BPM" bpm={value} />
        <SingleStat title="BPM / 2" bpm={value / 2} />
      </div>
    </>
  );
};
