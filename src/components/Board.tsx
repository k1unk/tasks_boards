import React, {FC} from 'react';
import {observer} from "mobx-react-lite";
import IBoard from "../store/interfaces/IBoard";
import NewTaskInput from "./NewTaskInput";
import TasksList from "./TasksList";
import boards from "../store/boards";

interface BoardProps {
    board: IBoard
}

const Board: FC<BoardProps> = observer(({board}) => {
    let uncompletedCount = boards.uncompleted[board.order - 1].toString()
    if (uncompletedCount === '0') uncompletedCount = ''
    return (
        <div className="board">
            <div className="header">
                <div className="headerLeft">
                    <div className="title">{board.title}</div>
                    <div className="count">{uncompletedCount}</div>
                </div>
                <div className="headerRight">
                    <div className="optionsWrapper">
                        <div className="options">...</div>
                    </div>
                </div>
            </div>
            <NewTaskInput boardId={board.id}/>
            <div className="tasks">
                <TasksList board={board}/>
            </div>
        </div>
    );
})


export default Board;
