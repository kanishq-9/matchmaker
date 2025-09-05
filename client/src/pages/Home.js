import React, { useCallback, useEffect, useState } from "react";
import "./css/home.css";
import Card from "../components/Card";
import { useNavigate } from "react-router";

function Home() {
  const [allUser, setAllUser] = useState(null);
  const [userDetails, setUserDetails] = useState(null);
  const [showCards, setShowCards] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [title, setTitle] = useState("Loading...");
  const navigate = useNavigate();
  const URL = "";

  const fetchUsers = useCallback(async (userName) => {
    const userId = sessionStorage.getItem("id");
    let dataFetched = await fetch(URL + "/api/user", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userName }),
    });

    dataFetched = await dataFetched.json();
    if (dataFetched.success) {
      const response = await fetch(URL + `/api/journey/all`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId })
      });
      const dataRes = await response.json();
      const arrayData = dataFetched.data.map((user) => {
        const {
          id,
          age = "N/A",
          full_name = "Unknown",
          profile_photo = "https://randomuser.me/api/portraits/women/87.jpg",
          location = "Not specified",
          single= dataRes.data[Number(id)].matchCommitted?false:true
        } = user;
        return { id, age, full_name, profile_photo, location, single };
      });
      setUserDetails(arrayData);
      setAllUser(arrayData);

      if (arrayData.length > 0) {
        setTitle("All Customers");
        setShowCards(true);
      } else {
        setShowCards(false);
      }
    }
  }, []);

  function handleSearch(event) {
    const search = event.target.value.toLowerCase();
    setSearchText(search);
    setShowCards(false);

    const newSearch = allUser.filter((user) => {
      const { age, full_name, location } = user;
      return (
        age.toString().includes(search) ||
        full_name.toLowerCase().includes(search) ||
        location.toLowerCase().includes(search)
      );
    });

    setUserDetails(newSearch);
    setShowCards(newSearch.length > 0);
  }

  function displayCards() {
    return userDetails.map((user) => (
      <Card
        key={user.id}
        id={user.id}
        age={user.age}
        full_name={user.full_name}
        profile_photo={user.profile_photo}
        location={user.location}
        match={user.match_percentage}
        single={user.single}
      />
    ));
  }

    async function handleAiMatch() {
    setShowCards(false);
    setTitle("Computing...");
    const userId = sessionStorage.getItem("id");

    // Fetch AI matches
    const response = await fetch(URL + "/api/ai/" + userId);
    const data = await response.json();

    // Fetch journey data
    const journeyRes = await fetch(URL + `/api/journey/all`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId }),
    });
    const journeyData = await journeyRes.json();

    // Normalize
    const arrayData = data.map((user) => {
      const {
        id,
        age = "N/A",
        full_name = "Unknown",
        profile_photo = "https://randomuser.me/api/portraits/men/42.jpg",
        location = "Not specified",
        match_percentage = 0,
        single = journeyData.data[Number(user.id)].matchCommitted
          ? false
          : true,
      } = user;
      return { id, age, full_name, profile_photo, location, match_percentage, single };
    });

    setAllUser(arrayData);
    setUserDetails(arrayData);
    setTitle(arrayData.length > 0 ? "AI Matched Customers" : "No Matches Found");
    setShowCards(arrayData.length > 0);
  }

  async function handleAdvanceAiMatch() {
    setShowCards(false);
    setTitle("Computing...");
    const userId = sessionStorage.getItem("id");

    // Fetch AI+ matches
    const response = await fetch(URL + "/api/google/ai/" + userId);
    const data = await response.json();

    // Fetch journey data
    const journeyRes = await fetch(URL + `/api/journey/all`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId }),
    });
    const journeyData = await journeyRes.json();

    // Normalize
    const arrayData = data.map((user) => {
      const {
        id,
        age = "N/A",
        full_name = "Unknown",
        profile_photo = "https://randomuser.me/api/portraits/men/42.jpg",
        location = "Not specified",
        match_percentage = 0,
        single = journeyData.data[Number(user.id)].matchCommitted
          ? false
          : true,
      } = user;
      return { id, age, full_name, profile_photo, location, match_percentage, single };
    });

    setAllUser(arrayData);
    setUserDetails(arrayData);
    setTitle(arrayData.length > 0 ? "AI+ Matched Customers" : "No Matches Found");
    setShowCards(arrayData.length > 0);
  }


  useEffect(() => {
    const userName = sessionStorage.getItem("userName");
    if (userName) {
      navigate("/home");
      fetchUsers(userName);
    } else {
      navigate("/login");
    }
  }, [navigate, fetchUsers]);

  return (
    <div className="home-main">
      <h1 className="dashboard-title">Dashboard</h1>

      <div className="search-container">
        <input
          className="search-bar"
          type="text"
          value={searchText}
          onChange={handleSearch}
          placeholder="🔍 Search by name, age, or location"
        />
      </div>

      <div className="buttons-container">
        <button className="btn ai-match-btn" onClick={handleAiMatch}>
          AI Match
        </button>
        <button
          className="btn advanced-ai-match-btn"
          onClick={handleAdvanceAiMatch}
        >
          AI Match +
        </button>
      </div>

      <div className="section-title">{title}</div>

      <div className="cards-container">
        {showCards ? (
          displayCards()
        ) : (
          <div className="spinner-border text-light" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        )}
      </div>
    </div>
  );
}

export default Home;
