import React, { useEffect, useState } from 'react';
import axios from 'axios';

import './AddApplicationPopup.css';

function AddApplicationPopup({ onFinish }) {
    const [name, setName] = useState("");
    const [secret, setSecret] = useState("");

    useEffect(() => {
        const allowedChars = "AaBbCcDdEeFfGgHhIiJjKkLlMmNnOoPpQqRrSsTtUuVvWwXxYyZz0123456789";
        for (let i = 0; i < 40; i++) {
            setSecret(secret => secret + allowedChars[Math.floor(Math.random() * allowedChars.length)]);
        }
    }, []);

    return (
        <div className='addApplicationPopup'>
            <label for="name"><b>Anwendungsname</b></label>
            <input type='text' id='name' value={name} onChange={(e) => setName(e.target.value)}></input>
            <label for="secret"><b>Schlüssel</b></label>
            <input type='text' id='secret' value={secret}></input>
            <i>Der Schlüssel kann nicht erneut angezeigt werden</i>
            <button onClick={() => {
                axios.post('/api/system/addApp', {name, secret})
                .then(() => {
                    onFinish()
                })
                .catch((err) => {
                    console.log(err);
                });
            }}>Speichern</button>
        </div>
    );
}

export default AddApplicationPopup;