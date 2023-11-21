import { List } from "./list";

export class Task {
    id: string;
    name: string;
    completed: boolean = false;
    list: List;
}
