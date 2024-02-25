import { faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useState } from 'react';
import axios from 'axios';

import './PermissionEntry.css';
import { hasPermission } from '../features/permissions';

function ApplicationEntry({ id, name, permissions }) {
    const [expanded, setExpanded] = useState(false);

    return (
        <div className='permissionEntry'>
            <div className='top' onClick={() => setExpanded(!expanded)}>
                <span className='name'>{(name === "public" ? "Öffentlicher Zugang" : name)}</span>
                <FontAwesomeIcon icon={(expanded ? faChevronUp : faChevronDown)} />
            </div>
            { expanded ? (
                <>
                <div className='permissions'>
                    <div className='permissiongroup'>
                        <b>Allgemein</b>
                        <div>
                            <input type='checkbox' id='application.active' defaultChecked={hasPermission(permissions, "application.active")} />
                            <label for='application.active'>Anwendung aktivieren</label>
                        </div>
                    </div>
                    <div className='permissiongroup'>
                        <b>Zugriff auf Schüler*innendaten</b>
                        <div>
                            <input type='checkbox' id='students.data.name' defaultChecked={hasPermission(permissions, "students.data.name")} />
                            <label for='students.data.name'>Nachname</label>
                        </div>
                        <div>
                            <input type='checkbox' id='students.data.firstName' defaultChecked={hasPermission(permissions, "students.data.firstName")} />
                            <label for='students.data.firstName'>Vorname</label>
                        </div>
                        <div>
                            <input type='checkbox' id='students.data.birthDate' defaultChecked={hasPermission(permissions, "students.data.birthDate")} />
                            <label for='students.data.birthDate'>Geburtsdatum</label>
                        </div>
                        <div>
                            <input type='checkbox' id='students.data.address' defaultChecked={hasPermission(permissions, "students.data.address")} />
                            <label for='students.data.address'>Adresse</label>
                        </div>
                        <div>
                            <input type='checkbox' id='students.data.studentEmail' defaultChecked={hasPermission(permissions, "students.data.studentEmail")} />
                            <label for='students.data.studentEmail'>E-Mail Adresse</label>
                        </div>
                        <div>
                            <input type='checkbox' id='students.data.class' defaultChecked={hasPermission(permissions, "students.data.class")} />
                            <label for='students.data.class'>Klasse</label>
                        </div>
                    </div>
                    <div className='permissiongroup'>
                        <div>
                            <input type='checkbox' id='students.data.lockerID' defaultChecked={hasPermission(permissions, "students.data.lockerID")} />
                            <label for='students.data.lockerID'>Schließfachnummer</label>
                        </div>
                        <div>
                            <input type='checkbox' id='students.data.cardID' defaultChecked={hasPermission(permissions, "students.data.cardID")} />
                            <label for='students.data.cardID'>Ausweisnummer</label>
                        </div>
                        <div>
                            <input type='checkbox' id='students.data.cardLocked' defaultChecked={hasPermission(permissions, "students.data.cardLocked")} />
                            <label for='students.data.cardLocked'>Ausweisstatus</label>
                        </div>
                        <div>
                            <input type='checkbox' id='students.data.timetable' defaultChecked={hasPermission(permissions, "students.data.timetable")} />
                            <label for='students.data.timetable'>Stundenplan</label>
                        </div>
                        <div>
                            <input type='checkbox' id='students.data.parentEmails' defaultChecked={hasPermission(permissions, "students.data.parentEmails")} />
                            <label for='students.data.parentEmails'>Eltern E-Mail Adressen</label>
                        </div>
                        <div>
                            <input type='checkbox' id='students.data.phoneNumbers' defaultChecked={hasPermission(permissions, "students.data.phoneNumbers")} />
                            <label for='students.data.phoneNumbers'>Telefonnummern</label>
                        </div>
                        <div>
                            <input type='checkbox' id='students.data.mensaID' defaultChecked={hasPermission(permissions, "students.data.phoneNumbers")} />
                            <label for='students.data.mensaID'>Mensamax ID</label>
                        </div>
                    </div>
                </div>
                <button onClick={() => {
                    let permissions = [];
                    for (let i = 0; i < document.getElementsByTagName('input').length; i++) {
                        const input = document.getElementsByTagName('input')[i];
                        if (input.type === "checkbox" && input.checked) {
                            permissions.push(input.id);
                        }
                    }
                    console.log(id);
                    axios.post("/api/system/setAppPermissions", {id, permissions})
                        .then(() => {})
                        .catch((err) => {
                            console.log(err);
                    });
                }}>Speichern</button>
                { name !== "public" ? (
                    <button onClick={() => {
                        axios.post("/api/system/deleteApp", {id})
                            .then(() => {})
                            .catch((err) => {
                                console.log(err);
                        });
                    }}>Anwendung löschen</button>
                ) : null}
                </>
            ) : null}
        </div>
    );
}

export default ApplicationEntry;