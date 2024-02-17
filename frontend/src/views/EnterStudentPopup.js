import React from 'react';

import './EnterStudentPopup.css';

function EnterStudentPopup({ onSubmit }) {
  return (
    <div className='enterStudentPopup'>
        <input id='input' placeholder='XXXXXXXXXX' maxLength="10"></input>
        <button onClick={() => onSubmit(document.getElementById('input').value)}>Fortfahren</button>
    </div>
  );
}

export default EnterStudentPopup;