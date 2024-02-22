import React, { useEffect, useState } from 'react';
import axios from 'axios';

import './StudentInfoPopup.css';
import UntisTimetableView from './UntisTimetableView';
import EditStudentPopup from './EditStudentPopup';

function StudentInfoPopup({ id, cardId, setPopup }) {
    const [student, setStudent] = useState(false);

    useEffect(() => {
        var url = '/api/students/getStudent?';
        if (id) {
            url += "id=" + id;
        } else {
            url += "cardId=" + cardId;
        }
        axios.get(url, {})
        .then((response) => {
            setStudent(response.data);
        }).catch((e) => {
            console.log(e);
        });
    }, [id, cardId]);

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
        <div className='studentInfoPopup'>
            <div>
                <div className='studentInfoSection'>
                    <span className='tiny'>Name</span>
                    {student.name}
                </div>
                <div className='studentInfoSection'>
                    <span className='tiny'>Vorname</span>
                    {student.firstName}
                </div>
                <div className='studentInfoSection'>
                    <span className='tiny'>Gebturtsdatum</span>
                    {new Date(student.birthDate).toLocaleDateString()}
                </div>
                <div className='studentInfoSection'>
                    <span className='tiny'>Adresse</span>
                    {student.address}
                </div>
                <div className='studentInfoSection'>
                    <span className='tiny'>E-Mail</span>
                    <a href={'mailto:' + student.studentEmail} target='_blank' rel='noreferrer'>{student.studentEmail}</a>
                </div>
                <div className='studentInfoSection'>
                    <span className='tiny'>Klasse</span>
                    {student.class}
                </div>
                <div className='studentInfoSection'>
                    <span className='tiny'>Schließfachnummer</span>
                    {student.lockerID}
                </div>
                <div className='studentInfoSection'>
                    <span className='tiny'>Ausweis gesperrt</span>
                    {(JSON.parse(student.cardLocked) ? "Ja" : "Nein")}
                </div>
                <div className='studentInfoSection'>
                    <span className='tiny'>Eltern E-Mails</span>
                    {student.parentEmails.map((email) => {
                        return (
                            <div>
                                <a href={'mailto:' + email.email} target='_blank' rel='noreferrer'>{email.email}</a>
                                {" (" + email.description + ")"}
                            </div>
                        )
                    })}
                </div>
                <div className='studentInfoSection'>
                    <span className='tiny'>Telefonnummern</span>
                    {student.phoneNumbers.map((number) => {
                        return (
                            <div>
                                <a href={'tel:' + number.phoneNumber.replace(/\s/g, "")} target='_blank' rel='noreferrer'>{number.phoneNumber}</a>
                                {" (" + number.description + ")"}
                            </div>
                        )
                    })}
                </div>
            </div>
            <div className='studentInfoSection'>
                <span className='tiny'>Stundenplan</span>
                <UntisTimetableView id={student.id} />
            </div>
            <div className='controls'>
                <button onClick={() => {
                    axios.post('/api/students/editStudent', {id: student.id, cardLocked: (JSON.parse(student.cardLocked) ? false : true)})
                    .then((response) => {
                        setStudent(response.data);
                    })
                    .catch((err) => {
                        console.log(err);
                    });
                }}>Ausweis {(JSON.parse(student.cardLocked) ? "entsperren" : "sperren")}</button>
                <button onClick={() => setPopup(<EditStudentPopup id={student.id} onFinish={() => setPopup(null)} />)}>Schüler*in bearbeiten</button>
                <button onClick={() => {
                    if (window.confirm(`${student.firstName} ${student.name} wirklich löschen?`)) {
                        axios.get('/api/students/deleteStudent?id=' + student.id)
                        .then(() => {
                            setPopup(null);
                        })
                        .catch((err) => {
                            console.log(err);
                        });
                    }
                }}>Schüler*in löschen</button>
            </div>
        </div>
    );
}

export default StudentInfoPopup;