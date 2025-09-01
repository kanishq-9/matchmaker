import React from 'react';
import { GoEye,GoNote } from "react-icons/go";
import "./css/card.css";
import { useNavigate } from 'react-router';

function Card({id,age,full_name,profile_photo,location}) {
    const navigate = useNavigate();
    function handleProfile(){
        navigate(`/${id}`);
    }
  return (
    <div className='card-main p-3 rounded m-3 d-flex flex-column justify-content-center align-items-center'>
        <img src={profile_photo} className='rounded-circle m-2' alt='profile'/>
        <div className='h4 fw-bold m-2'>{full_name}</div>
        <div className='text-secondary m-2'>{age}</div>
        <span className='text-secondary m2'>{location}</span>
        <div className='d-flex flex-row align-items-center justify-content-around w-100' onClick={handleProfile} style={{cursor:"pointer"}}>
            <span className='d-flex flex-row justify-content-around align-items-center text-info'>
                <GoEye className='mx-1'/>View
                </span>
                <span className='d-flex flex-row justify-content-around align-items-center text-danger'> 
                    <GoNote className='mx-1'/>
                    Notes</span></div>
    </div>
  )
}

export default Card