import React, { useEffect, useState } from 'react';
import axios from 'axios';

import './UntisTimetableView.css';
import UntisLesson from './UntisLesson';

function UntisTimetableView({ id }) {
    const [timetable, setTimetable] = useState([]);

    useEffect(() => {
        axios.get('/api/students/getStudentTimetable?id=' + id, {})
        .then((response) => {
            let data = response.data;
            data = data.sort((a, b) => a.startTime - b.startTime);
            console.log(data);
            setTimetable(data);
        }).catch((e) => {
            console.log(e);
        });
    }, [id]);
    return (
        <div className='untisTimetableView'>
            {timetable.map((lesson) => {
                return (<UntisLesson lesson={lesson} />);
            })}
        </div>
    )
}

export default UntisTimetableView;