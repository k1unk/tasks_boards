import api from './api';
import ITask from "../store/interfaces/ITask";

export default interface ISetTask {
    "id": number,
    "title": string,
    "body": string,
    "completed": boolean,
    "order": number,
    "priority": number,
    "tags": string,
    "date": string
}

export const boardsApi = {
    async getLastOrder(boardId: number) {
        let res = await api.get(`/boards/${boardId}`)
        let lastOrder = 0;
        res.data.tasks.map((e: any) => {
            if (e.order > lastOrder && e.completed === false) lastOrder = e.order
        })
        return lastOrder
    },
    getBoards() {
        return api.get('/boards')
    },

    async drop(startBoardOrder: number, startTaskOrder: number,
               endBoardOrder: number, endTaskOrder: number) {
        let boards = await api.get('/boards')
        let boardId = boards.data.find((e: any) => e.order == startBoardOrder).id
        let res = await api.get(`/boards/${boardId}`)

        if (startBoardOrder == endBoardOrder) {
            if (startTaskOrder == endTaskOrder) return api.get('/boards');

            let tasks = res.data.tasks
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

            let newBoard = {...res.data, tasks: tasks}
            await api.put(`/boards/${boardId}`, newBoard)
        } else {
            let task;
            let tasks = res.data.tasks.filter((e: any) => {
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

            let newBoard = {...res.data, tasks: tasks}
            await api.put(`/boards/${boardId}`, newBoard)

            let boardIdEnd = boards.data.find((e: any) => e.order == endBoardOrder).id
            let resEnd = await api.get(`/boards/${boardIdEnd}`)
            let tasksEnd = resEnd.data.tasks.map((e: any) => {
                if (e.order >= endTaskOrder) {
                    e.order += 1
                }
                return e
            })
            tasksEnd.splice(endTaskOrder - 1, 0, task);

            let newBoard2 = {...resEnd.data, tasks: tasksEnd}
            await api.put(`/boards/${boardIdEnd}`, newBoard2)
        }
        return api.get('/boards')
    },

    async setTask(boardId: number, task: ISetTask) {
        let res = await api.get(`/boards/${boardId}`)
        let tasks = res.data.tasks
        tasks.push(task)
        let newBoard = {...res.data, tasks: tasks}
        return api.put(`/boards/${boardId}`, newBoard)
    },

    async completeTask(task: ITask, boardId: number) {
        let res = await api.get(`/boards/${boardId}`)
        let tasks = res.data.tasks.map((e: any) => {
            if (e.id != task.id) return e
            e.completed = true
            e.order = -1
            return e
        }).map((e: any) => {
            if (e.order > task.order) {
                e.order -= 1
            }
            return e
        })
        let newBoard = {...res.data, tasks: tasks}
        await api.put(`/boards/${boardId}`, newBoard)
        return api.get(`/boards/${boardId}`)
    },

    async uncompleteTask(task: ITask, boardId: number) {
        let res = await api.get(`/boards/${boardId}`)
        let order = await this.getLastOrder(boardId)
        let tasks = res.data.tasks.map((e: any) => {
            if (e.id != task.id) return e
            e.completed = false
            e.order = order + 1
            return e
        })
        let newBoard = {...res.data, tasks: tasks}
        await api.put(`/boards/${boardId}`, newBoard)
        return api.get(`/boards/${boardId}`)
    },

    async deleteTask(task: ITask, boardId: number) {
        let res = await api.get(`/boards/${boardId}`)
        let tasks = res.data.tasks.filter((e: any) => {
            return e.id !== task.id
        })
        let newBoard = {...res.data, tasks: tasks}
        await api.put(`/boards/${boardId}`, newBoard)
        return api.get(`/boards/${boardId}`)
    }
}
