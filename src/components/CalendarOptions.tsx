import React, {FC, useEffect, useRef, useState} from 'react';
import Calendar from "react-calendar";
import newTask from "../store/newTask";
import {observer} from "mobx-react-lite";

const CalendarOptions: FC = observer(() => {
    let [optionsVisible, setOptionsVisible] = useState<boolean>(false)

    let changeDate = (e: any) => {
        newTask.setDate(e)
    }

    return (
        <div className={"calendarOptionsContainer"}>
            <img src={require("../images/calendarIcon.png")}
                 alt=""
                 onClick={() => setOptionsVisible(true)}
            />
            {optionsVisible &&
                <div className="optionsCalendar">
                    <div className="outside" onClick={() => setOptionsVisible(false)}></div>
                    <div className="content">
                        <div className={"calendar"}>
                            <Calendar
                                value={newTask.date}
                                onChange={changeDate}
                            />
                        </div>
                    </div>
                </div>
            }
        </div>
    );
})

export default CalendarOptions;
