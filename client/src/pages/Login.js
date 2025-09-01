import React, { useState } from 'react';
import { GoPerson, GoLock } from "react-icons/go";
import {useNavigate} from 'react-router-dom';

import "./css/login.css";

export default function Login() {
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const URL = "http://localhost:8000";


  function handleUsername(event){
    event.preventDefault();
    setUserName(event.target.value);
  }

  function handlePassword(event){
    event.preventDefault();
    setPassword(event.target.value);
  }

  async function handleSubmit(event){
    event.preventDefault();    
    try{
      if(sessionStorage.getItem("userName")){
        navigate("/home");
        return;
      }

      let data = await fetch(URL+"/api/login",{
        method:"POST",
        headers:{
          'Content-Type': 'application/json',
        },
        body:JSON.stringify({
          userName,
          password
        })
      });
      data = await data.json();
      console.log(data);
      if(data.success){
        sessionStorage.setItem("userName", data.userName);
        navigate("/home");
      }
      
      
    }catch(err){
      console.log(err);
    }
    
  }


  return (
    <div className='login-main'>
    <div className='login p-2 rounded d-flex flex-column align-items-center'>
      <div className='display-4'>Login</div>
      <form onSubmit={handleSubmit} className='m-2 d-flex flex-column h5'>
        <span>
          <GoPerson/>
        <input className='m-2 border-0' value={userName} onChange={handleUsername} type="text" placeholder="Username"/>
        </span>
        <span>
          <GoLock />
    <input className='m-2 border-0' value={password} onChange={handlePassword} type="password" placeholder='password'/>
        </span>
        
        

        <button className='btn login-btn m-2' type='submit'>Login</button>

      </form>
    </div>
    </div>

  )
}
