import React, { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router";
import { GoMail, GoNote } from "react-icons/go";
import { FaHeart } from "react-icons/fa";
import Notes from "../components/Notes";
import "./css/userdata.css";

function UserDetails() {
  const { id } = useParams();
  const URL = "http://localhost:8000";
  const [userInfo, setUserInfo] = useState(null);
  const [showNotes, setShowNotes] = useState(false);
  const [liked, setLiked] = useState(false);

  const fetchUser = useCallback(async (id) => {
    const response = await fetch(URL + `/api/${id}`);
    const data = await response.json();
    if (data.success) {
      setUserInfo(data.data);
    }
  }, []);

  useEffect(() => {
    fetchUser(id);
  }, [id, fetchUser]);

  function openGmailCompose(to, subject, body) {
    const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(
      to
    )}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.open(gmailUrl, "_blank");
  }

  async function handleMail() {
    try {
      const currentUserId = sessionStorage.getItem("id");
      const userResponse = await fetch(URL + `/api/${currentUserId}`);
      const data = await userResponse.json();

      if (!data.success) return;

      if (!userInfo) return;

      const response = await fetch(URL + `/api/sendmail`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          profileData: userInfo,
          userData: data.data,
        }),
      });

      const resJson = await response.json();
      if (response.ok) {
        openGmailCompose(
          userInfo.email,
          resJson.data.subject,
          resJson.data.body
        );
      }
    } catch (err) {
      console.error("Error in handleMail:", err);
    }
  }
  const toggleLike = () => {
    setLiked(!liked);
  };

  return (
    <div className="user-details-container py-5">
      {userInfo ? (
        <>
          {/* Profile Header */}
          <div className="profile-card shadow-lg rounded-4 p-4">
            <div className="d-flex align-items-center">
              <img
                src={userInfo.profile_photo}
                className="rounded-circle border border-3 border-light shadow-sm profile-img"
                alt="user profile"
              />
              <div className="ms-4">
                <h2 className="fw-bold text-dark">{userInfo.full_name}</h2>
                <p className="mb-1 text-muted">{userInfo.age} years old</p>
                <p className="mb-2 text-muted">
                  <i className="bi bi-geo-alt-fill"></i> {userInfo.location}
                </p>

                <div className="d-flex gap-3 mt-3">
                  <button
                    className="btn btn-outline-primary icon-circle"
                    onClick={() => setShowNotes(true)}
                  >
                    <GoNote size={22} />
                  </button>
                  <button
                    className="btn btn-outline-success icon-circle"
                    onClick={handleMail}
                  >
                    <GoMail size={22} />
                  </button>
                  <div className="heart-container">
                    <FaHeart
                      onClick={toggleLike}
                      className={`heart-icon ${liked ? "liked" : ""}`}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="card mt-4 shadow-sm rounded-4">
            <div className="card-header bg-white border-0">
              <ul
                className="nav nav-pills justify-content-center"
                id="pills-tab"
                role="tablist"
              >
                {[
                  { id: "personal", label: "Personal Info" },
                  { id: "contact", label: "Contact Info" },
                  { id: "education", label: "Education & Career" },
                  { id: "family", label: "Family & Background" },
                ].map((tab, i) => (
                  <li key={tab.id} className="nav-item" role="presentation">
                    <button
                      className={`nav-link ${i === 0 ? "active" : ""}`}
                      id={`pills-${tab.id}-tab`}
                      data-bs-toggle="pill"
                      data-bs-target={`#pills-${tab.id}`}
                      type="button"
                      role="tab"
                      aria-controls={`pills-${tab.id}`}
                      aria-selected={i === 0}
                    >
                      {tab.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <div className="card-body tab-content" id="pills-tabContent">
              {/* Personal Info */}
              <div
                className="tab-pane fade show active"
                id="pills-personal"
                role="tabpanel"
              >
                <ul className="list-unstyled">
                  <li><strong>Caste:</strong> {userInfo.caste}</li>
                  <li><strong>Date of Birth:</strong> {userInfo.dob}</li>
                  <li><strong>Gender:</strong> {userInfo.gender}</li>
                  <li><strong>Height:</strong> {userInfo.height_cm} cm</li>
                  <li><strong>Weight:</strong> {userInfo.weight_kg} kg</li>
                  <li><strong>Hobbies:</strong> {userInfo.hobbies.join(", ")}</li>
                  <li><strong>Marital Status:</strong> {userInfo.marital_status}</li>
                  <li><strong>Mother Tongue:</strong> {userInfo.mother_tongue}</li>
                  <li><strong>Religion:</strong> {userInfo.religion}</li>
                  <li><strong>Expectations:</strong> {userInfo.expectations}</li>
                </ul>
              </div>

              {/* Contact */}
              <div className="tab-pane fade" id="pills-contact" role="tabpanel">
                <p><strong>Email:</strong> {userInfo.email}</p>
              </div>

              {/* Education */}
              <div className="tab-pane fade" id="pills-education" role="tabpanel">
                <p><strong>College:</strong> {userInfo.college}</p>
                <p><strong>Degree:</strong> {userInfo.education}</p>
                <p><strong>Company:</strong> {userInfo.company}</p>
                <p><strong>Occupation:</strong> {userInfo.occupation}</p>
                <p><strong>Salary:</strong> ₹{userInfo.salary_inr.toLocaleString()}</p>
              </div>

              {/* Family */}
              <div className="tab-pane fade" id="pills-family" role="tabpanel">
                <p><strong>Caste:</strong> {userInfo.caste}</p>
                <p><strong>Father:</strong> {userInfo.father_name} ({userInfo.father_occupation})</p>
                <p><strong>Mother:</strong> {userInfo.mother_name} ({userInfo.mother_occupation})</p>
                <p><strong>Siblings:</strong> {userInfo.siblings}</p>
              </div>
            </div>
          </div>

          <Notes
            isOpen={showNotes}
            onClose={() => setShowNotes(false)}
            profileId={userInfo?.id}
          />
        </>
      ) : (
        <div className="text-center my-5">
          <div className="spinner-border text-primary" role="status" />
        </div>
      )}
    </div>
  );
}

export default UserDetails;
