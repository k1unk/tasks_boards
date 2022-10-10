import React, {useEffect} from 'react';
import boards from "../store/boards";
import {observer} from "mobx-react-lite";
import {DragDropContext} from "react-beautiful-dnd";
import Board from "./Board";

const Boards = observer(() => {
    useEffect(() => {
        boards.setBoards()
    }, [])

    let onDragEnd = (result) => {
        const {source, destination} = result;
        boards.changeOrder(
            source.droppableId,
            source.index,
            destination.droppableId,
            destination.index
        )
    }

    return (
        <div className={"boards"}>
            <DragDropContext onDragEnd={onDragEnd}>
                {[...boards.boards]
                    .sort((a, b) => a.order > b.order ? 1 : -1)
                    .map(b => <Board key={b.id} board={b}/>)}
            </DragDropContext>
        </div>
    );
})

export default Boards;
