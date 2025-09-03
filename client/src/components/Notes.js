// Notes.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router';
import "./css/notes.css";

export default function Notes({ isOpen, onClose, profileId }) {
    const [note, setNote] = useState("");
    const navigate = useNavigate();
    const URL = 'http://localhost:8000'
    const senderId = sessionStorage.getItem("id");

    useEffect(() => {
        if (!isOpen) return;


        if (!senderId) {
            navigate("/login");
            return;
        }

        const fetchNotes = async () => {
            let res = await fetch(URL + "/api/notes", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    functionality: "get",
                    senderId,
                    profileId,
                }),
            });
            res = await res.json();
            if (res.data.success) {
                setNote(res.data.note || "");
            }
        };

        fetchNotes();
    }, [isOpen, profileId, navigate, senderId]);


    if (!isOpen) return null;

    async function handleSave() {
        let res = await fetch(URL + "/api/notes", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                functionality: "save",
                senderId,
                profileId,
                notes: note
            }),
        });
        res = await res.json();
        if (res.success)
            onClose();
    }

    return (
        <>
            <div className="notes-modal">
                <div className="notes-box">
                    <div className="notes-header">
                        <h5>Notes</h5>
                        <button onClick={onClose} className="close-btn">✖</button>
                    </div>

                    <textarea
                        className="notes-textarea"
                        rows="8"
                        value={note}
                        onChange={(e) => setNote(e.target.value)}
                        placeholder="Write your notes here..."
                    />

                    <div className="notes-footer">
                        <button className="save-btn" onClick={handleSave}>
                            Save
                        </button>
                    </div>
                </div>
            </div>

            {/* Backdrop */}
            <div className="notes-backdrop" onClick={onClose}></div>
        </>
    );
}
