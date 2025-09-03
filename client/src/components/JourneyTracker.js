import React from "react";
import "./css/journeytracker.css";

export default function JourneyTracker() {
  const steps = [
    { label: "Profile Viewed", status: false },
    { label: "Match Request Sent", status: false },
    { label: "Match Response", status: false },
    { label: "Continue Meeting", status: false },
    { label: "Stop Meeting", status: false },
    { label: "Match Committed", status: false },
    { label: "Single Again", status: false }
  ];

  return (
    <div className="journey-wrapper">
      <h4 className="journey-title">Journey Progress</h4>
      <div className="journey-steps">
        {steps.map((stage, idx) => (
          <div
            key={idx}
            className={`journey-step ${stage.status ? "done" : "pending"}`}
          >
            <div className="circle">{idx + 1}</div>
            <p>{stage.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
