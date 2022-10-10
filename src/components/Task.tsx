import React, {FC} from 'react';
import {observer} from "mobx-react-lite";
import ITask from "../store/interfaces/ITask";
import boards from "../store/boards";

interface TaskProps {
    task: ITask,
    completed: boolean,
    boardId: number
}

const Task: FC<TaskProps> = observer(({task, completed, boardId}) => {


    function completeTask(e: any, boardId: number) {
        console.log(e);
        if (e.target.checked) {
            boards.completeTask(task, boardId)
        }
        if (!e.target.checked) {
            boards.uncompleteTask(task, boardId)
        }

    }

    function deleteTask(boardId: number) {
        boards.deleteTask(task, boardId)
    }

    if (completed) {
        if (task.completed) {
            return (
                <div className={'taskCompleted'}>
                    <div className={"line1"}>
                        <div className={"left"}>
                        <input
                            type={"checkbox"}
                            defaultChecked={true}
                            onChange={(e) => completeTask(e, boardId)}
                        />
                        <div className="title">{task.title}</div>
                        </div>
                        <div className="right">
                            <div className="delete" onClick={(e) =>deleteTask(boardId)}>
                                delete
                            </div>
                        </div>
                    </div>
                    <div className={"line2"}>{task.date}</div>
                </div>
            );
        } else return <></>
    } else {
        if (task.completed) return <></>
    }

    return (
        <div>
            <div className={"line1"}>
                <div className={"left"}>
                    <input
                        type={"checkbox"}
                        onChange={(e) => completeTask(e, boardId)}
                        className={`priority${task.priority}`}
                    />
                    <div className="title">{task.title}</div>
                </div>
                <div className="right">
                    <div className="delete" onClick={(e) =>deleteTask(boardId)}>
                        delete
                    </div>
                </div>
            </div>
            <div className={"line2"}>{task.date}</div>
        </div>
    )

})

export default Task;
