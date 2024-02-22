import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import Popup from './Popup';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';

import './SearchView.css';
import StudentInfoPopup from './StudentInfoPopup';
import EditStudentPopup from './EditStudentPopup';

function SearchView() {
    const [query, setQuery] = useState();
    const [results, setResults] = useState([]);
    const [popup, setPopup] = useState(null);

    useEffect(() => {
        if (query !== "") {
            axios.get("/api/students/getStudents?name=" + query)
            .then((response) => {
                setResults(response.data);
            }).catch((e) => {
                console.log(e);
            });
        } else {
            setResults([]);
        }
    }, [query]);

    if (!useLocation().pathname.startsWith("/search")) {
        return;
    }

    return (
        <div className='searchView'>
            <div className='top'>
                <div className='search'>
                    <FontAwesomeIcon icon={faMagnifyingGlass} />
                    <input id='query' placeholder="Suche" onChange={() => {setQuery(document.getElementById('query').value)}}></input>
                </div>
                <button onClick={() => setPopup(<EditStudentPopup onFinish={() => setPopup(null)}/>)}>Hinzufügen</button>
            </div>
            <table>
                <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Vorname</th>
                    <th>Klasse</th>
                </tr>
                {results.map((student) => {
                    return (
                        <tr className='studentEntry' onClick={() => setPopup(<StudentInfoPopup id={student.id} setPopup={setPopup} />)}>
                            <td>{student.id}</td>
                            <td>{student.name}</td>
                            <td>{student.firstName}</td>
                            <td>{student.class}</td>
                        </tr>
                    )
                })}
            </table>
            {results.length === 0 ? (
                <div className='noResults'>
                    Keine Ergebnisse
                    <FontAwesomeIcon icon={faMagnifyingGlass} className='icon'/>
                </div>
            ) : null}
            {
                popup ? (
                    <Popup content={popup} onClose={() => setPopup(null)}/>
                ) : null
            }
        </div>
    );
}

export default SearchView;