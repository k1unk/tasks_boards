import React, {FC, useEffect, useRef, useState} from 'react';
import boards from "../store/boards";
// @ts-ignore
import {ReactComponent as ArrowDown} from './../../images/arrow-down.svg';
import 'react-calendar/dist/Calendar.css';
import PriorityOptions from "./PriorityOptions";
import CalendarOptions from "./CalendarOptions";
import newTask from "../store/newTask";

interface NewTaskInputProps {
    boardId: number
}

const NewTaskInput: FC<NewTaskInputProps> = ({boardId}) => {
    let [optionsVisible, setOptionsVisible] = useState<boolean>(false)
    let [CN, setCN] = useState<string>('false')
    let clickIn = () => {
        setOptionsVisible(true)
        setCN('true')
    }
    let clickOut = () => {
        setOptionsVisible(false)
        setCN('false')
    }

    let [inputValue, setInputValue] = useState<string>('')
    const componentRef = useRef();

    useEffect(() => {
        document.addEventListener("mousedown", handleClick);
        return () => document.removeEventListener("mousedown", handleClick);

        function handleClick(e: any) {
            if (componentRef && componentRef.current) {
                const ref: any = componentRef.current
                if (!ref.contains(e.target)) {
                    clickOut()
                }
            }
        }
    }, []);

    let addTask = (e: any) => {
        e.preventDefault()
        boards.addTask(boardId, inputValue, newTask.dateStr, newTask.priority)

        setInputValue('')
    }


    return (
        <div className={`newTaskInput newTaskInput${CN}`}
             onMouseDown={clickIn}
             ref={componentRef as any}>
            <div className={"newTaskInputWrapper"}>
                <form
                    autoComplete="off"
                    onSubmit={addTask}
                >
                    <input
                        type="text"
                        className={`${CN}`}
                        id="name"
                        placeholder=" + New Task"
                        autoComplete="off"
                        value={inputValue}
                        onChange={e => setInputValue(e.target.value)}
                    />
                </form>

                {optionsVisible &&
                    <div className={"optionsButtons"}>
                        <CalendarOptions/>
                        <PriorityOptions/>
                    </div>}
            </div>
        </div>
    );
};

export default NewTaskInput;
