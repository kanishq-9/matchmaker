import React, { useState } from "react";
import { GoPerson, GoLock } from "react-icons/go";
import { useNavigate } from "react-router-dom";
import "./css/login.css";

export default function Login() {
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const URL = "http://localhost:8000";

  function handleUsername(event) {
    setUserName(event.target.value);
  }

  function handlePassword(event) {
    setPassword(event.target.value);
  }

  async function handleSubmit(event) {
    event.preventDefault();
    try {
      if (sessionStorage.getItem("userName")) {
        navigate("/home");
        return;
      }

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
            Login
          </button>
        </form>
      </div>
    </div>
  );
}
