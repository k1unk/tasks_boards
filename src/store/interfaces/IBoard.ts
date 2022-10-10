import ITask from "./ITask";

export default interface IBoard {
    "id": number,
    "title": string,
    "body": string,
    "disabled": boolean,
    "order": number,
    tasks: ITask[]
}
