import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';

import './ReadView.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWifi } from '@fortawesome/free-solid-svg-icons';
import Popup from './Popup';
import EnterStudentPopup from './EnterStudentPopup';
import StudentInfoPopup from './StudentInfoPopup';

function ReadView() {
  const [popup, setPopup] = useState(null);

  if (!useLocation().pathname.startsWith("/read")) {
    return;
  }

  const readSocket = new WebSocket("ws://localhost:5000/api/nfc");

  readSocket.addEventListener('message', (event) => {
    let data = JSON.parse(event.data);
    console.log(data);
    setPopup(<StudentInfoPopup id={data.nfcId} />);
  });

  return (
    <div className='readView'>
        <FontAwesomeIcon icon={faWifi} className='scannerIcon'/>
        <button>NFC-Scanner verbinden</button>
        <button onClick={() => setPopup(<EnterStudentPopup onSubmit={(input) => {console.log(input); setPopup(<StudentInfoPopup id={input} />)}} />)}>Kartennummer eingeben</button>
        
        {
          popup ? (
            <Popup content={popup} onClose={() => setPopup(null)}/>
          ) : null
        }
    </div>
  );
}

export default ReadView;