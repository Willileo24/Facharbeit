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
            <span className='startTime'>{convertTime(lesson.startTime)}</span>
            <span className='subject'>{(lesson.su.length > 0 ? lesson.su[0].longname : "Kein Fach")}</span>
            <span className='teacher'>{(lesson.te.length > 0 ? lesson.te[0].longname : "Keine Leerkraft")}</span>
            <span className='room'>{(lesson.ro.length > 0 ? lesson.ro[0].name : "Kein Raum")}</span>
            <span className='endTime'>{convertTime(lesson.endTime)}</span>
        </div>
    );
}

function convertTime(untisTime) {
    let timeString = untisTime.toString();
    if (timeString.length === 3) {
        return timeString.substring(0, 1) + ":" + timeString.substring(1, 3);
    } else {
        return timeString.substring(0, 2) + ":" + timeString.substring(2, 4);
    }
}

export default UntisLesson;