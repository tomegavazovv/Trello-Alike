import store from '../store/store.js';
import { actions } from '../store/actions.js';
import { taskSelector, userIdSelector, useSelector } from '../store/store.js';
import { deleteTaskFromColumn, updateTaskText } from '../service/taskService.js';
import Component from './Component';

class TaskComponent extends Component {
    constructor(props) {
        super(props);
    }

    setState() {
        this.userId = useSelector(userIdSelector(), this)
        this.task = useSelector(taskSelector(this.props.task.id, this.props.task.column), this)
    }

    handleDelete = () => {
        store.dispatch(actions.deleteTask(this.task.id, this.task.column));
        deleteTaskFromColumn(this.task.id, this.userId);
    }

    handleDoubleClick = (event) => {
        event.target.contentEditable = true;
        event.target.focus();
    }

    handleBlur = async (event) => {
        event.target.contentEditable = false;
        const updatedText = event.target.textContent.trim();
        if (updatedText !== this.task.text) {
            const updatedTask = {
                ...this.task,
                text: updatedText,
            };
            store.dispatch(actions.updateTask(updatedTask));
            updateTaskText(updatedTask, this.userId);
        }
    }

    handleDragStart = (event) => {
        event.dataTransfer.setData('id', event.target.id);
        event.dataTransfer.setData('fromColumn', this.task.column);
        event.target.classList.add('dragging');
    }

    handleDragEnd = (event) => {
        event.target.classList.remove('dragging');
    }

    _render() {
        const taskEl = document.createElement('div');
        taskEl.className = 'task';
        taskEl.id = this.task.id;
        taskEl.draggable = true;

        const taskTextEl = document.createElement('span');
        taskTextEl.className = 'task-text';
        taskTextEl.id = `task-text-${this.task.id}`;
        taskTextEl.textContent = this.task.text;
        taskTextEl.dataset.originalText = this.task.text;
        taskTextEl.addEventListener('dblclick', this.handleDoubleClick);
        taskTextEl.addEventListener('blur', this.handleBlur);

        const deleteBtnEl = document.createElement('button');
        deleteBtnEl.className = 'delete-btn';
        deleteBtnEl.id = `delete-${this.task.id}`;
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