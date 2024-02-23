import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { selectUser } from '../features/userSlice';

import './StudentInfoPopup.css';
import UntisTimetableView from './UntisTimetableView';
import EditStudentPopup from './EditStudentPopup';
import { hasPermission } from '../features/permissions';

function StudentInfoPopup({ id, cardId, setPopup }) {
    const user = useSelector(selectUser);
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
                { student.name ? (
                <div className='studentInfoSection'>
                    <span className='tiny'>Name</span>
                    {student.name}
                </div>
                ) : null}
                { student.firstName ? (
                <div className='studentInfoSection'>
                    <span className='tiny'>Vorname</span>
                    {student.firstName}
                </div>
                ) : null}
                { student.birthDate ? (
                <div className='studentInfoSection'>
                    <span className='tiny'>Gebturtsdatum</span>
                    {new Date(student.birthDate).toLocaleDateString()}
                </div>
                ) : null}
                { student.address ? (
                <div className='studentInfoSection'>
                    <span className='tiny'>Adresse</span>
                    {student.address}
                </div>
                ) : null}
                { student.studentEmail ? (
                <div className='studentInfoSection'>
                    <span className='tiny'>E-Mail</span>
                    <a href={'mailto:' + student.studentEmail} target='_blank' rel='noreferrer'>{student.studentEmail}</a>
                </div>
                ) : null}
                { student.class ? (
                <div className='studentInfoSection'>
                    <span className='tiny'>Klasse</span>
                    {student.class}
                </div>
                ) : null}
                { student.lockerID ? (
                <div className='studentInfoSection'>
                    <span className='tiny'>Schließfachnummer</span>
                    {student.lockerID}
                </div>
                ) : null}
                { student.cardLocked ? (
                <div className='studentInfoSection'>
                    <span className='tiny'>Ausweis gesperrt</span>
                    {(JSON.parse(student.cardLocked) ? "Ja" : "Nein")}
                </div>
                ) : null}
                { student.parentEmails ? (
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
                ) : null}
                { student.phoneNumbers ? (
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
                ) : null}
            </div>
            { hasPermission(user.permissions, "student.data.timetable") ? (
            <div className='studentInfoSection'>
                <span className='tiny'>Stundenplan</span>
                <UntisTimetableView id={student.id} />
            </div>
            ) : null}
            { hasPermission(user.permissions, "admin.students") ? (
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
            ) : null}
        </div>
    );
}

export default StudentInfoPopup;