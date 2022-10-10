import {makeAutoObservable} from 'mobx';
import {boardsApi} from "../api/boardsApi";
import IBoard from "./interfaces/IBoard";
import ITask from "./interfaces/ITask";

class Boards {
    boards: IBoard[] = []
    completed: number[] = []
    uncompleted: number[] = []

    constructor() {
        makeAutoObservable(this)
    }

    setBoards = () => {
        boardsApi.getBoards().then((e: any) => {
                this.setBoards_(e.data)
            }
        )
    }

    setBoards_ = (boards: IBoard[]) => {
        this.boards = boards.sort((a, b) => {
            return a.order > b.order ? 1 : -1
        })
        this.completed = []
        this.uncompleted = []
        boards.map((board: IBoard, index: number) => {
            this.completed.push(0)
            this.uncompleted.push(0)
            board.tasks.map((task: ITask) => {
                if (task.completed) this.completed[index] += 1
                else this.uncompleted[index] += 1
            })
        })
    }
    updateBoard = (board: IBoard) => {
        let boardsWithoutUpdated = this.boards.filter(e => e.id !== board.id)
        this.setBoards_([...boardsWithoutUpdated, board])
    }

    addTask = (boardId: number, title: string, date: string, priority: number) => {
        boardsApi.getLastOrder(boardId).then((e: number) => {
            boardsApi.setTask(boardId, {
                "id": Date.now(),
                "title": title,
                "body": '',
                "completed": false,
                "order": e + 1,
                "priority": priority,
                "tags": '',
                "date": date
            }).then((e: any) => {
                    this.updateBoard(e.data)
                }
            )
        })
    }

    changeOrder = (startBoardOrder: number, startTaskOrder: number,
                   endBoardOrder: number, endTaskOrder: number) => {
        let boards = this.boards
        let board;
        for (let i = 0; i < boards.length; i++) {
            if (boards[i].order == startBoardOrder) {
                board = boards[i]
            }
        }
        if (startBoardOrder == endBoardOrder) {
            if (startTaskOrder != endTaskOrder) {
                // @ts-ignore
                let tasks = board.tasks
                    .map((e: any) => {
                        if (startTaskOrder < endTaskOrder) {
                            if (e.order > startTaskOrder && e.order <= endTaskOrder) {
                                e.order -= 1
                                return e
                            }
                            if (e.order == startTaskOrder) {
                                e.order = endTaskOrder
                            }
                        } else {
                            if (e.order < startTaskOrder && e.order >= endTaskOrder) {
                                e.order += 1
                                return e
                            }
                            if (e.order == startTaskOrder) {
                                e.order = endTaskOrder
                            }
                        }
                        return e
                    })
                // @ts-ignore
                let newBoard = {...board, tasks: tasks}
                // @ts-ignore
                this.updateBoard(newBoard)
            }
        } else {

            let task;
            // @ts-ignore
            let tasks = board.tasks.filter((e: any) => {
                if (startTaskOrder == e.order) task = e
                return startTaskOrder !== e.order
            })
                .map((e: any) => {
                    if (e.order > startTaskOrder) {
                        e.order -= 1
                    }
                    return e
                })
            // @ts-ignore
            task.order = endTaskOrder

            let newBoard = {...board, tasks: tasks}
            // @ts-ignore
            this.updateBoard(newBoard)

            let boardEnd;
            for (let i = 0; i < boards.length; i++) {
                if (boards[i].order == endBoardOrder) {
                    boardEnd = boards[i]
                }
            }
            // @ts-ignore
            let tasksEnd = boardEnd.tasks.map((e: any) => {
                if (e.order >= endTaskOrder) {
                    e.order += 1
                }
                return e
            })
            tasksEnd.splice(endTaskOrder - 1, 0, task);

            let newBoard2 = {...boardEnd, tasks: tasksEnd}
            // @ts-ignore
            this.updateBoard(newBoard2)
        }

        boardsApi.drop(startBoardOrder, startTaskOrder, endBoardOrder, endTaskOrder).then((e: any) => {
                this.setBoards_(e.data)
            }
        )
    }

    completeTask(task: ITask, boardId: number) {
        boardsApi.completeTask(task, boardId).then((e: any) => {
            this.updateBoard(e.data)
        })
    }

    uncompleteTask(task: ITask, boardId: number) {
        boardsApi.uncompleteTask(task, boardId).then((e: any) => {
            this.updateBoard(e.data)
        })
    }
    deleteTask(task: ITask, boardId: number) {
        boardsApi.deleteTask(task, boardId).then((e: any) => {
            this.updateBoard(e.data)
        })
    }
}

export default new Boards()
