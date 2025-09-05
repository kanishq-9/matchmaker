import { GoEye } from "react-icons/go";
import "./css/card.css";
import { useNavigate } from "react-router";

function Card({ id, age, full_name, profile_photo, location, match, single }) {
  const navigate = useNavigate();

  function handleProfile() {
    navigate(`/${id}`);
  }

  function handleMatch() {
    if (match) {
      let color = "danger";
      if (match > 75) {
        color = "success";
      } else if (match > 50) {
        color = "warning";
      }
      return (
        <div className={`fw-bold mt-2 text-${color}`}>
          {match}% Matched
        </div>
      );
    }
    return null;
  }

  return (
    <div className="card-main">
      <div className="card-inner">
        <img
          src={profile_photo}
          className="profile-img"
          alt="profile"
        />
        <div className="h5 fw-bold text-dark mt-3">{full_name}</div>
        <div className="text-muted">{age} yrs</div>
        <div className="text-secondary small">{location}</div>
        <div
          className={`px-3 py-1 mt-2 rounded-pill fw-semibold small ${single
              ? "bg-success bg-opacity-10 text-success border border-success border-opacity-25"
              : "bg-secondary bg-opacity-10 text-secondary border border-secondary border-opacity-25"
            }`}
        >
          {single ? "Single" : "Committed"}
        </div>

        <div
          className="view-btn mt-3"
          onClick={handleProfile}
        >
          <GoEye className="me-2" /> View Profile
        </div>

        {handleMatch()}
      </div>
    </div>
  );
}

export default Card;
