import React, { useEffect, useCallback, useState } from "react";
import "./css/journeytracker.css";

export default function JourneyTracker({ userId, id, liked, trackLike }) {
  const [steps, setSteps] = useState([
    { label: "Profile Viewed", status: false },
    { label: "Match Request Sent", status: false },
    { label: "Match Committed", status: false },
  ]);
  const [acceptRequestShow, setAcceptRequestShow] = useState(false);

  const URL = "";

  const keyOrder = [
    "profileViewed",
    "matchRequestSent",
    "matchCommitted",
  ];

  const fetchStage = useCallback(async () => {
    try {
      const response = await fetch(URL + `/api/journey`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, profileId: id })
      });

      const data = await response.json();

      if (data.success) {
        fetch(URL + `/api/journey/update`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ updateType: "single", userId, profileId: id, profileViewed: true })
        });

        trackLike(data.data["matchRequestSent"] ? data.data["matchRequestSent"] : false);
        setAcceptRequestShow(data.data["accept"] === true && !data.data["matchCommitted"]);
        const orderedSteps = keyOrder.map(key => {
          const value = data.data[key] || false;
          const label = key
            .replace(/([A-Z])/g, " $1")
            .replace(/^./, str => str.toUpperCase());
          return { label, status: value };
        });

        setSteps(orderedSteps);
      }
    } catch (error) {
      console.error("Error fetching journey stages:", error);
    }
  }, [id, userId]);

  const likedFetch = useCallback(async () => {
    try {
      const response = await fetch(URL + `/api/journey/update`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ updateType: "single", userId, accept: true, profileId: id, matchRequestSent: true })
      });
      const data = await response.json();
      if (data.success) {
        console.log("Liked updated successfully");
      }
    } catch (error) {
      console.error("Error updating liked:", error);
    }
  }, [id, userId]);

  useEffect(() => {
    fetchStage();
  }, [fetchStage]);

  useEffect(() => {
    if (liked) {
      likedFetch().then(() => {
        setSteps(prev =>
          prev.map(step =>
            step.label === "Match Request Sent"
              ? { ...step, status: true }
              : step
          )
        );
      });
    }
  }, [liked, likedFetch]);

  const handleAccept = async () => {
    console.log("Request Accepted");
    try {
      const response = await fetch(URL + `/api/journey/update`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ updateType: "multiple", userId, profileId: id, matchRequestSent: true, accept: false, matchCommitted: true })
      });
      const data = await response.json();
      if (data.success) {
        setSteps(prev =>
          prev.map(step => ({ ...step, status: true }))
        );
        trackLike(true);
        setAcceptRequestShow(false);
      }
    } catch (error) {
      console.error("Error cancelling", error);
    }
  };

  const handleCancel = async () => {
    console.log("Request Cancelled");
    try {
      const response = await fetch(URL + `/api/journey/update`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ updateType: "multiple", userId, profileId: id, matchRequestSent: false, accept: false, matchCommitted: false })
      });
      const data = await response.json();
      if (data.success) {
        setSteps([
          { label: "Profile Viewed", status: true },
          { label: "Match Request Sent", status: false },
          { label: "Match Committed", status: false },
        ]
        );
        trackLike(false);
        setAcceptRequestShow(false);
      }
    } catch (error) {
      console.error("Error cancelling", error);
    }
  };


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
      {acceptRequestShow ? (<div className="accept-request">
        <p>Accept Request?</p>
        <button
          className="btn accept-btn"
          onClick={() => handleAccept()}
        >
          Accept
        </button>
        <button
          className="btn cancel-btn"
          onClick={() => handleCancel()}
        >
          Cancel
        </button>
      </div>) : <></>}
    </div>
  );
}
