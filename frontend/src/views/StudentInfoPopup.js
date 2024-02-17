import React, { useEffect, useState } from 'react';
import axios from 'axios';

import './StudentInfoPopup.css';
import UntisTimetableView from './UntisTimetableView';

function StudentInfoPopup({ id }) {
    const [student, setStudent] = useState(false);

    useEffect(() => {
        console.log(id)
        axios.get('/api/students/getStudent?cardId=' + id, {})
        .then((response) => {
            setStudent(response.data);
        }).catch((e) => {
            console.log(e);
        });
    }, []);

    if (student == false) {
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
                    <a href={'mailto:' + student.studentEmail} target='_blank'>{student.studentEmail}</a>
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
                    {(student.cardLocked ? "Ja" : "Nein")}
                </div>
                <div className='studentInfoSection'>
                    <span className='tiny'>Eltern E-Mails</span>
                    {student.parentEmails.map((email) => {
                        return (
                            <div>
                                <a href={'mailto:' + email.email} target='_blank'>{email.email}</a>
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
                                <a href={'tel:' + number.phoneNumber.replace(/\s/g, "")} target='_blank'>{number.phoneNumber}</a>
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
        </div>
    );
}

export default StudentInfoPopup;