import React from 'react';

import './Popup.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';

function Popup({ content, onClose }) {
  return (
    <div className='popupWrapper'>
        <div className='popupBackground'>
            <div className='popup'>
                <div>
                    <button className='closeButton' onClick={() => onClose()}><FontAwesomeIcon icon={faXmark} /></button>
                </div>
                <div className='popupContent'>
                    {content}
                </div>
            </div>
        </div>
    </div>
  );
}

export default Popup;