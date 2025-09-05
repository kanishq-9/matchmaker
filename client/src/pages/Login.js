import React, { useState } from "react";
import { GoPerson, GoLock } from "react-icons/go";
import { useNavigate } from "react-router-dom";
import "./css/login.css";

export default function Login() {
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const URL = "";

  function handleUsername(event) {
    setUserName(event.target.value);
  }

  function handlePassword(event) {
    setPassword(event.target.value);
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setLoading(true);
    try {
      let data = await fetch(URL + "/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userName,
          password,
        }),
      });
      data = await data.json();
      console.log(data);
      if (data.success) {
        sessionStorage.setItem("userName", data.userName);
        sessionStorage.setItem("id", data.id);
        navigate("/home");
      }
    } catch (err) {
      console.log(err);
    }
    setLoading(false);
  }

  return (
    <div className="login-main">
      <div className="login-card">
        <h2 className="login-title">Welcome</h2>
        <form onSubmit={handleSubmit} className="login-form">
          <div className="input-group">
            <GoPerson className="icon" />
            <input
              className="input-field"
              value={userName}
              onChange={handleUsername}
              type="text"
              placeholder="Username"
              required
            />
          </div>

          <div className="input-group">
            <GoLock className="icon" />
            <input
              className="input-field"
              value={password}
              onChange={handlePassword}
              type="password"
              placeholder="Password"
              required
            />
          </div>

          <button className="login-btn" type="submit">
            {loading?(<div className="spinner-border text-light" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>):`Login`}
          </button>
        </form>
      </div>
    </div>
  );
}
