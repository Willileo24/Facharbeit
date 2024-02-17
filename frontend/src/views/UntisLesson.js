import React from 'react';

import './UntisLesson.css';

function UntisLesson({ lesson }) {
    var classes = "untisLesson";
    if (lesson.code && lesson.code == "cancelled") {
        classes += " cancelled";
    }
    const date = new Date();
    const currentTime = date.getHours()*100 + date.getMinutes();
    if (currentTime > lesson.startTime && currentTime < lesson.endTime) {
        classes += " current";
    }
    return (
        <div className={classes}>
            <span className='startTime'>{lesson.startTime}</span>
            <span className='subject'>{lesson.su[0].longname}</span>
            <span className='teacher'>{lesson.te[0].longname}</span>
            <span className='room'>{lesson.ro[0].name}</span>
            <span className='endTime'>{lesson.endTime}</span>
        </div>
    );
}

export default UntisLesson;