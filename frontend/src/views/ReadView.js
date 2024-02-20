import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';

import './ReadView.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWifi } from '@fortawesome/free-solid-svg-icons';
import Popup from './Popup';
import EnterStudentPopup from './EnterStudentPopup';
import StudentInfoPopup from './StudentInfoPopup';
import ConnectionQr from './ConnectionQr';
import { useSelector } from 'react-redux';
import { selectUser } from '../features/userSlice';

function ReadView() {
  const [popup, setPopup] = useState(null);
  const user = useSelector(selectUser);

  if (!useLocation().pathname.startsWith("/read")) {
    return;
  }

  const readSocket = new WebSocket((window.location.protocol === "https:" ? "wss://" : "ws://") + window.location.host + "/api/nfc");

  readSocket.addEventListener('message', (event) => {
    let data = JSON.parse(event.data);
    console.log(data);
    if (data.sessionId == user.userId) {
      setPopup(<StudentInfoPopup cardId={data.nfcId} />);
    }
  });

  return (
    <div className='readView'>
        <FontAwesomeIcon icon={faWifi} className='scannerIcon'/>
        <button onClick={() => setPopup(<ConnectionQr />)}>NFC-Scanner verbinden</button>
        <button onClick={() => setPopup(<EnterStudentPopup onSubmit={(input) => {console.log(input); setPopup(<StudentInfoPopup cardId={input} />)}} />)}>Kartennummer eingeben</button>
        
        {
          popup ? (
            <Popup content={popup} onClose={() => setPopup(null)}/>
          ) : null
        }
    </div>
  );
}

export default ReadView;