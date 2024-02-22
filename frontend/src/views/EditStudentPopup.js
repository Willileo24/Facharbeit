import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faTrashCan } from '@fortawesome/free-solid-svg-icons';

import './EditStudentPopup.css';

function EditStudentPopup({ id, onFinish }) {
  const [student, setStudent] = useState(false);
  const [newStundent, setNewStudent] = useState({});

  useEffect(() => {
      axios.get('/api/students/getStudent?id=' + id, {})
      .then((response) => {
          setStudent(response.data);
          setNewStudent(response.data);
      }).catch((e) => {
          console.log(e);
      });
  }, [id]);

  if (student === false) {
    console.log(student);
    return (
        <div className='studentInfoPopup'>
            <>Lade Schüler*in...</>
        </div>
    );
}
if (student == null) {
    return (
        <div className='studentInfoPopup'>
            <>Schüler*in nicht gefunden</>
        </div>
    );
}

  return (
    <div className='editStudentPopup'>
      <div>
        <div className='studentInfoSection'>
            <span className='tiny'>Name</span>
            <input type='text' value={newStundent.name} onChange={(e) => setNewStudent({...newStundent, name: e.target.value})}></input>
        </div>
        <div className='studentInfoSection'>
            <span className='tiny'>Vorname</span>
            <input type='text' value={newStundent.firstName} onChange={(e) => setNewStudent({...newStundent, firstName: e.target.value})}></input>
        </div>
        <div className='studentInfoSection'>
            <span className='tiny'>Gebturtsdatum</span>
            <input type='date' value={JSON.stringify((new Date(newStundent.birthDate)).toJSON()).substring(1, 11)} onChange={(e) => setNewStudent({...newStundent, birthDate: e.target.value})}></input>
        </div>
        <div className='studentInfoSection'>
            <span className='tiny'>Adresse</span>
            <input type='text' value={newStundent.address} onChange={(e) => setNewStudent({...newStundent, address: e.target.value})}></input>
        </div>
        <div className='studentInfoSection'>
            <span className='tiny'>E-Mail</span>
            <input type='text' value={newStundent.studentEmail} onChange={(e) => setNewStudent({...newStundent, studentEmail: e.target.value})}></input>
        </div>
        <div className='studentInfoSection'>
            <span className='tiny'>Klasse</span>
            <input type='text' value={newStundent.class} onChange={(e) => setNewStudent({...newStundent, class: e.target.value})}></input>
        </div>
        <div className='studentInfoSection'>
            <span className='tiny'>Schließfachnummer</span>
            <input type='number' value={newStundent.lockerID} onChange={(e) => setNewStudent({...newStundent, class: e.target.value})}></input>
        </div>
        <div className='studentInfoSection'>
            <span className='tiny'>Untis SchülerID</span>
            <input type='text' value={newStundent.untisID} onChange={(e) => setNewStudent({...newStundent, untisID: e.target.value})}></input>
        </div>
        <div className='studentInfoSection'>
            <span className='tiny'>Ausweisnummer</span>
            <input type='number' value={newStundent.cardID} onChange={(e) => setNewStudent({...newStundent, cardID: e.target.value})}></input>
        </div>
      </div>
      <div>
        <div className='multiInfoSection'>
            <span className='tiny'>Eltern E-Mails</span>
            {newStundent.parentEmails.map((email, i) => {
                if (email.action === "remove") {
                    return;
                }
                return (
                    <>
                        <span>{email.email}</span>
                        <span>{" (" + email.description + ")"}</span>
                        <button onClick={() => {
                            setNewStudent({
                                ...newStundent,
                                parentEmails: [
                                    ...newStundent.parentEmails.filter((elem) => elem.email !== email.email),
                                    {
                                        ...email,
                                        action: "remove"
                                    }
                                ]
                            })
                        }}><FontAwesomeIcon icon={faTrashCan} /></button>
                    </>
                )
            })}
            <input type='text' placeholder='E-Mail' id='newEmail'></input>
            <input type='text' placeholder='Beschreibung' id='newEmailDescription'></input>
            <button onClick={() => {
                setNewStudent({
                    ...newStundent,
                    parentEmails: [
                        ...newStundent.parentEmails,
                        {
                            action: "new",
                            email: document.getElementById('newEmail').value,
                            description: document.getElementById('newEmailDescription').value
                        }
                    ]
                });
            }}><FontAwesomeIcon icon={faPlus}/></button>
        </div>
        <div className='multiInfoSection'>
            <span className='tiny'>Telefonnummern</span>
            {newStundent.phoneNumbers.map((number) => {
                if (number.action === "remove") {
                    return;
                }
                return (
                    <>
                        <span>{number.phoneNumber}</span>
                        <span>{" (" + number.description + ")"}</span>
                        <button onClick={() => {
                            setNewStudent({
                                ...newStundent,
                                phoneNumbers: [
                                    ...newStundent.phoneNumbers.filter((elem) => elem.phoneNumber !== number.phoneNumber),
                                    {
                                        ...number,
                                        action: "remove"
                                    }
                                ]
                            })
                        }}><FontAwesomeIcon icon={faTrashCan} /></button>
                    </>
                )
            })}
            <input type='text' placeholder='Telefonnummer' id='newPhone'></input>
            <input type='text' placeholder='Beschreibung' id='newPhoneDescription'></input>
            <button onClick={() => {
                setNewStudent({
                    ...newStundent,
                    phoneNumbers: [
                        ...newStundent.phoneNumbers,
                        {
                            action: "new",
                            phoneNumber: document.getElementById('newPhone').value,
                            description: document.getElementById('newPhoneDescription').value
                        }
                    ]
                });
            }}><FontAwesomeIcon icon={faPlus} /></button>
        </div>
      </div>
      <div className='controls'>
            <button onClick={() => {
                let payload = {};
                Object.keys(newStundent).forEach((key) => {
                    if (key !== "id" && student[key] !== newStundent[key]) {
                        payload[key] = newStundent[key];
                    }
                });
                if (id) {
                    axios.post("/api/students/editStudent", {id, ...payload})
                    .then(() => {
                        onFinish();
                    })
                    .catch((err) => {
                        console.log(err);
                    });
                } else {
                    axios.post("/api/students/addStudent", payload)
                    .then(() => {
                        onFinish();
                    })
                    .catch((err) => {
                        console.log(err);
                    });
                }
            }}>Speichern</button>
      </div>
    </div>
  );
}

export default EditStudentPopup;