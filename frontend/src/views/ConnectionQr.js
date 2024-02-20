import React from 'react';
import QRCode from 'react-qr-code';

import './ConnectionQr.css';
import { useSelector } from 'react-redux';
import { selectUser } from '../features/userSlice';

function ConnectionQr() {
    const connectionlink = window.location.protocol + "//" + window.location.host + "/api/nfc?sessionId=" + useSelector(selectUser).userId;
    return (
        <div className='connectionQr'>
            Smartphone als NFC-Scanner<br />verwenden
            <QRCode value={connectionlink} bgColor='none'/>
        </div>
    );
}

export default ConnectionQr;