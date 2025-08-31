import React from 'react';
import { GoPerson, GoLock } from "react-icons/go";

import "./css/login.css";

export default function Login() {

  function handleSubmit(event){
    event.preventDefault();
    console.log("form submitted");
    
  }


  return (
    <div className='login p-2 rounded d-flex flex-column align-items-center'>
      <div className='display-4'>Login</div>
      <form onSubmit={handleSubmit} className='m-2 d-flex flex-column h5'>
        <span>
          <GoPerson/>
        <input className='m-2 border-0' type="text" placeholder="Username"/>
        </span>
        <span>
          <GoLock />
    <input className='m-2 border-0' type="password" placeholder='password'/>
        </span>
        
        

        <button className='btn login-btn m-2' type='submit'>Login</button>

      </form>
    </div>

  )
}
