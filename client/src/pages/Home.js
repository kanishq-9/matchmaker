import React, { useCallback, useEffect, useState } from 'react';
import "./css/home.css";
import Card from '../components/Card';
import { useNavigate } from 'react-router';

function Home() {
  const [allUser, setAllUser] = useState(null);
  const [userDetails, setUserDetails] = useState(null);
  const [showCards, setShowCards] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [title, setTitle] = useState("Loading...");
  const navigate = useNavigate();
  const URL = "http://localhost:8000";
  const fetchUsers = useCallback(async (userName) => {
    let dataFetched = await fetch(URL + "/api/user", {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userName
      })
    });
    dataFetched = await dataFetched.json();
    if (dataFetched.success) {
      const arrayData = dataFetched.data.map(user => {
        const {
          id,
          age = "N/A",
          full_name = "Unknown",
          profile_photo = "https://randomuser.me/api/portraits/women/87.jpg",
          location = "Not specified" } = user;
        return { id, age, full_name, profile_photo, location }
      })
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

    const newSearch = allUser.filter(user => {
      const { age, full_name, location } = user;

      return (
        age.toString().includes(search) ||
        full_name.toLowerCase().includes(search) ||
        location.toLowerCase().includes(search)
      );
    });
    setUserDetails(newSearch);
    if (newSearch.length > 0) {
      setShowCards(true);
    } else {
      setShowCards(false);
    }

  }

  function displayCards() {
    const renderUserData = userDetails.map(user => {
      return <Card key={user.id} id={user.id} age={user.age} full_name={user.full_name} profile_photo={user.profile_photo} location={user.location} match={user.match_percentage} />
    });
    return renderUserData;
  }

  async function handleAiMatch(){
    setShowCards(false);
    setTitle("Computing...");
    const id = sessionStorage.getItem("id");
    const response = await fetch(URL+"/api/ai/"+id);
    const data = await response.json();
    setAllUser(data);
    setUserDetails(data);
    if (data.length > 0) {
      setTitle("AI Matched Customers");
      setShowCards(true);
    } else {
      setShowCards(false);
    }
    
  }

  async function handleAdvanceAiMatch(){
    setShowCards(false);
    setTitle("Computing...");
    const id = sessionStorage.getItem("id");
    const response = await fetch(URL+"/api/google/ai/"+id);
    const data = await response.json();    
    setAllUser(data);
    setUserDetails(data);
    if (data.length > 0) {
      setTitle("AI+ Matched Customers");
      setShowCards(true);
    } else {
      setShowCards(false);
    }
    
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
    <div className='home-main'>
      <div className='text-light display-4 m-5'>
        Dashboard
      </div>
      <div className='m-3 d-flex '>
        <input className='border-0 rounded simple-search-bar' type='text' value={searchText} onChange={handleSearch} placeholder='Search' />
      </div>
      <div className='m-3'>
        <button className='btn ai-match-btn mx-3' onClick={handleAiMatch}>AI Match</button>
        <button className='btn advanced-ai-match-btn mx-3' onClick={handleAdvanceAiMatch}>AI Match +</button>
      </div>
      <div className='text-secondary fw-bold m-3'>{title}</div>
      <div className='d-flex flex-wrap justify-content-center align-items-center' style={{ width: "75%" }}>
        {showCards ? displayCards() : <div class="spinner-border text-secondary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>}

      </div>
    </div>
  )
}

export default Home