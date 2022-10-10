import {makeAutoObservable} from 'mobx';
import * as mobx from "mobx";

class newTask {
    priority: number = 1
    date: Date = new Date()
    dateStr: string = this.date.toLocaleDateString()

    constructor() {
        makeAutoObservable(this)
    }

    setPriority = (priority: number) => {
        this.priority = priority
    }
    setDate = (date: Date) => {
        this.date = date
        this.dateStr = date.toLocaleDateString()
    }
}
export default new newTask()
