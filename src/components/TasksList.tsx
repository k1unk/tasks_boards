import React, {FC, useState} from 'react';
import {observer} from "mobx-react-lite";
import IBoard from "../store/interfaces/IBoard";
import Task from "./Task";
import {Droppable, Draggable} from "react-beautiful-dnd";
import boards from "../store/boards";

interface TasksListProps {
    board: IBoard
}

const TasksList: FC<TasksListProps> = observer(({board}) => {
    let completed = board.tasks.find(e => e.completed)?.id
    let [tasksClass, setTasksClass] = useState('tasksVisible') //textVisible
    let [arrowClass, setArrowClass] = useState('arrowDown') //textVisible

    function changeTextClass() {
        tasksClass === 'tasksHidden'
            ? setTasksClass('tasksVisible')
            : setTasksClass('tasksHidden')
        arrowClass === 'arrowRight'
            ? setArrowClass('arrowDown')
            : setArrowClass('arrowRight')
    }

    let completedCount = boards.completed[board.order-1].toString()
    if (completedCount === '0') completedCount = ''
    return (
        <div>

            <Droppable key={board.id} droppableId={`${board.order}`}>
                {(provided, snapshot) => (
                    <div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                    >
                        {[...board.tasks]
                            .filter(e => !e.completed)
                            .sort(
                                (a, bb) => {
                                    return a.order > bb.order ? 1 : -1;
                                }
                            )
                            .map((t) => (
                                <Draggable
                                    key={t.id}
                                    draggableId={t.id.toString()}
                                    index={t.order}
                                >
                                    {(provided, snapshot) => (
                                        <div
                                            className={'task'}
                                            ref={provided.innerRef}
                                            {...provided.draggableProps}
                                            {...provided.dragHandleProps}
                                        >
                                            <Task
                                                key={t.id}
                                                task={t}
                                                completed={false}
                                                boardId={board.id}
                                            />
                                        </div>
                                    )}
                                </Draggable>
                            ))}

                        {provided.placeholder}

                    </div>
                )}
            </Droppable>
            {completed &&
                <div className="completed">
                    <div className="header">
                        <div className={`arrow ${arrowClass}`} onClick={changeTextClass}></div>
                        <div className='text'>Completed</div>
                        <div className="count">{completedCount}</div>
                    </div>
                    <div className={`tasks ${tasksClass}`}>
                        {[...board.tasks]
                            .filter(e => e.completed)
                            .sort(
                                (a, b) => {
                                    return a.order > b.order ? 1 : -1;
                                }
                            ).map(e => <div  key={e.id} className={'task'}>
                                <Task task={e} completed={true} boardId={board.id}/>
                            </div>)}
                    </div>
                </div>
            }

        </div>
    );
})

export default TasksList;
