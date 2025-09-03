import React, { useCallback, useEffect, useState } from 'react'
import { useParams } from 'react-router';
import "./css/userdata.css";
import { GoMail, GoNote } from "react-icons/go";
import Notes from '../components/Notes';


function UserDetails() {
  const { id } = useParams();
  const URL = "http://localhost:8000";
  const [userInfo, setUserInfo] = useState(null);
  const [showNotes, setShowNotes] = useState(false);


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
    const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(to)}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.open(gmailUrl, "_blank");
  }



  async function handleMail() {
    try {
      const currentUserId = sessionStorage.getItem('id');

      const userResponse = await fetch(URL + `/api/${currentUserId}`);
      const data = await userResponse.json();

      if (!data.success) {
        console.error("Failed to fetch current user:", data);
        return;
      }

      if (!userInfo) {
        console.error("Target profile data (userInfo) not loaded yet.");
        return;
      }

      const response = await fetch(URL + `/api/sendmail`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          profileData: userInfo,
          userData: data.data,
        }),
      });

      const resJson = await response.json();  // parse backend response
      if (!response.ok) {
        console.error("Mail API failed:", resJson);
      } else {
        console.log("Mail API success:", resJson);
        openGmailCompose(userInfo.email, resJson.data.subject, resJson.data.body);

      }
    } catch (err) {
      console.error("Error in handleMail:", err);
    }
  }


  return (
    <div className='rounded info-main py-5'>
      {userInfo ?
        <>
          <div className='display-4 fw-bold m-4'>Customer Details</div>
          <div className='d-flex  w-100 align-items-center'>
            <img src={userInfo.profile_photo} className='rounded-circle mx-5' alt="user profile" />
            <div className='d-flex flex-column justify-content-center  h-100 h2 text-secondary'>
              <div>{userInfo.full_name}</div>
              <div>{userInfo.age} years</div>
              <div>{userInfo.location}</div>
              <div className='d-flex justify-content-around m-2'>
                <div className='bg-danger text-white h5 rounded-circle p-1' style={{ cursor: "pointer" }} onClick={() => setShowNotes(true)}><GoNote className='px-1' size={25} /></div>
                <div className='bg-success text-white h5 rounded-circle p-1' style={{ cursor: "pointer" }} onClick={handleMail} ><GoMail className='px-1' size={25} /></div>
              </div>
            </div>

          </div>

          <ul className="nav nav-pills mb-3 my-5" id="pills-tab" role="tablist">
            <li className="nav-item" role="presentation">
              <button className="nav-link active" id="pills-personal-tab" data-bs-toggle="pill" data-bs-target="#pills-personal" type="button" role="tab" aria-controls="pills-personal" aria-selected="true">Personal Info</button>
            </li>
            <li className="nav-item" role="presentation">
              <button className="nav-link" id="pills-contact-tab" data-bs-toggle="pill" data-bs-target="#pills-contact" type="button" role="tab" aria-controls="pills-contact" aria-selected="false">Contact Info</button>
            </li>
            <li className="nav-item" role="presentation">
              <button className="nav-link" id="pills-education-tab" data-bs-toggle="pill" data-bs-target="#pills-education" type="button" role="tab" aria-controls="pills-education" aria-selected="false">Education & Career</button>
            </li>
            <li className="nav-item" role="presentation">
              <button className="nav-link" id="pills-family-tab" data-bs-toggle="pill" data-bs-target="#pills-family" type="button" role="tab" aria-controls="pills-family" aria-selected="false">Family & Background</button>
            </li>
          </ul>
          <div className="tab-content" id="pills-tabContent">
            <div className="tab-pane fade show active" id="pills-personal" role="tabpanel" aria-labelledby="pills-personal-tab">
              <div>Caste: <span>{userInfo.caste}</span></div>
              <div>Date of Birth: <span>{userInfo.dob}</span></div>
              <div>Gender: <span>{userInfo.gender}</span></div>
              <div>Height(cm): <span>{userInfo.height_cm}</span></div>
              <div>Weight(Kg): <span>{userInfo.weight_kg}</span></div>
              <div>Hobbies: <span>{userInfo.hobbies.join(",")}</span></div>
              <div>Marital Status: <span>{userInfo.marital_status}</span></div>
              <div>Mother Tongue: <span>{userInfo.mother_tongue}</span></div>
              <div>Religion: <span>{userInfo.religion}</span></div>
              <div  >Expectations: <span >{userInfo.expectations}</span></div>

            </div>
            <div className="tab-pane fade" id="pills-contact" role="tabpanel" aria-labelledby="pills-contact-tab">
              <div>Email: <span>{userInfo.email}</span></div>
            </div>
            <div className="tab-pane fade" id="pills-education" role="tabpanel" aria-labelledby="pills-education-tab">
              <div>College: <span>{userInfo.college}</span></div>
              <div>Degree: <span>{userInfo.education}</span></div>
              <div>Company: <span>{userInfo.company}</span></div>
              <div>Occupation: <span>{userInfo.occupation}</span></div>
              <div>Salary(INR): <span>{userInfo.salary_inr}</span></div>
            </div>
            <div className="tab-pane fade" id="pills-family" role="tabpanel" aria-labelledby="pills-family-tab">
              <div>Caste: <span>{userInfo.caste}</span></div>
              <div>Father Name: <span>{userInfo.father_name}</span></div>
              <div>Father Occupation: <span>{userInfo.father_occupation}</span></div>
              <div>Mother Name: <span>{userInfo.mother_name}</span></div>
              <div>Mother Occupation: <span>{userInfo.mother_occupation}</span></div>
              <div>Siblings: <span>{userInfo.siblings}</span></div>
            </div>
          </div>
        </>
        :
        <div className="text-center m-5">
          <div className="spinner-border text-secondary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      }
            <Notes isOpen={showNotes} onClose={() => setShowNotes(false)} profileId={userInfo?.id}/>

    </div>
  )
}

export default UserDetails