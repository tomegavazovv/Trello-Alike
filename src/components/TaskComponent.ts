import store from '../store/store';
import { actions } from '../store/actions';
import { taskSelector, userIdSelector, useSelector } from '../store/store';
import { deleteTaskFromColumn, updateTaskText } from '../service/taskService';
import Component from './Component';
import { Task } from '../models/Task';

class TaskComponent extends Component {
    state: {
        userId: string;
        task: Task;
    }
    
    constructor(props: {task: Task, column: string}) {
        super(props);
    }

    setState(): void {
        this.state.userId = useSelector(userIdSelector(), this)
        this.state.task = useSelector(taskSelector(this.props.task.id, this.props.task.column), this)
    }

    handleDelete = (): void => {
        store.dispatch(actions.deleteTask(this.state.task.id, this.state.task.column));
        deleteTaskFromColumn(this.state.task.id, this.state.userId);
    }

    handleDoubleClick = (event: Event): void => {
        const target = event.target as HTMLElement;
        target.contentEditable = 'true';
        target.focus();
    }

    handleBlur = (event: Event): void  => {
        const target = event.target as HTMLElement;
        target.contentEditable = 'false';
        const updatedText = target.textContent.trim();
        if (updatedText !== this.state.task.text) {
            const updatedTask = {
                ...this.state.task,
                text: updatedText,
            };
            store.dispatch(actions.updateTask(updatedTask));
            updateTaskText(updatedTask, this.state.userId);
        }
    }

    handleDragStart = (event: DragEvent) => {
        const target = event.target as HTMLElement;
        event.dataTransfer.setData('id', target.id);
        event.dataTransfer.setData('fromColumn', this.state.task.column);
        target.classList.add('dragging');
    }

    handleDragEnd = (event: DragEvent) => {
        const target = event.target as HTMLElement;
        target.classList.remove('dragging');
    }

    render(): HTMLElement {
        const taskEl = document.createElement('div');
        taskEl.className = 'task';
        taskEl.id = this.state.task.id;
        taskEl.draggable = true;

        const taskTextEl = document.createElement('span');
        taskTextEl.className = 'task-text';
        taskTextEl.id = `task-text-${this.state.task.id}`;
        taskTextEl.textContent = this.state.task.text;
        taskTextEl.dataset.originalText = this.state.task.text;
        taskTextEl.addEventListener('dblclick', this.handleDoubleClick);
        taskTextEl.addEventListener('blur', this.handleBlur);

        const deleteBtnEl = document.createElement('button');
        deleteBtnEl.className = 'delete-btn';
        deleteBtnEl.id = `delete-${this.state.task.id}`;
        deleteBtnEl.textContent = 'X';
        deleteBtnEl.addEventListener('click', this.handleDelete);

        taskEl.appendChild(taskTextEl);
        taskEl.appendChild(deleteBtnEl);

        taskEl.addEventListener('dragstart', this.handleDragStart);
        taskEl.addEventListener('dragend', this.handleDragEnd);

        return taskEl;
    }
}

export default TaskComponent;