import Component from './Component.js';
import TaskListComponent from './TaskListComponent.js';
import { isValidTask } from '../utils/taskUtils.js';
import { addTask, moveTaskToColumn, reorderTasks } from '../service/taskService.js';
import store, { actions } from '../store/store.js';
import { getNearestElementByMouseY } from '../utils/domUtils.js';

class ColumnComponent extends Component {
    constructor(props) {
        super(props);
    }

    handleAddTask = async (event) => {
        const input = event.target.previousElementSibling;
        const value = input.value.trim();
        if (isValidTask(value)) {
            input.value = '';
            const order = Math.max(...store.state.tasks[this.props.id].map(task => task.order)) + 1;
            const newTask = await addTask(value, this.props.id, order, store.state.user.uid);
            store.dispatch(actions.addTask(newTask, this.props.id));
        }
    }

    handleDragOver = (event) => {
        event.preventDefault();
    }

    handleDrop = (event) => {
        event.preventDefault();
        const fromColumn = event.dataTransfer.getData("fromColumn");
        const toColumn = this.props.id;

        if (fromColumn !== toColumn) {
            this.handleDroppedInDifferentColumn(event);
        } else {
            this.handleDroppedInSameColumn(event);
        }
    }

    handleDroppedInDifferentColumn = (event) => {
        const droppedTaskId = event.dataTransfer.getData("id");
        const fromColumn = event.dataTransfer.getData("fromColumn");
        const toColumn = this.props.id;
        const order = Math.max(...store.state.tasks[toColumn].map(task => task.order)) + 1;
        store.dispatch(actions.transferTask(droppedTaskId, fromColumn, toColumn, order));
        moveTaskToColumn(droppedTaskId, toColumn, order, store.state.user.uid);
    }

    handleDroppedInSameColumn = (event) => {
        const droppedTaskId = event.dataTransfer.getData("id");
        const toColumn = this.props.id;
        const targetTaskElement = event.target.closest(".task");
        let targetTaskId = null;

        if (targetTaskElement) {
            targetTaskId = targetTaskElement.id;
        } else {
            const mouseY = event.clientY;
            const selector = `#${toColumn} .task`;
            targetTaskId = getNearestElementByMouseY(selector, mouseY)?.id;
        }

        if (targetTaskId && targetTaskId !== droppedTaskId) {
            const columnTasks = [...store.state.tasks[toColumn]];
            const updatedTasks = reorderTasks(columnTasks, droppedTaskId, targetTaskId);
            store.dispatch(actions.updateTasksOrder(updatedTasks, toColumn));
        }
    }

    renderAddTask = () => {
        const addTaskEl = document.createElement('div');
        addTaskEl.className = 'add-task';

        const textarea = document.createElement('textarea');
        textarea.id = `${this.props.id}-input`;
        textarea.placeholder = 'New task';
        textarea.rows = 1;

        const addButton = document.createElement('button');
        addButton.className = 'add-task-btn';
        addButton.textContent = 'Add';
        addButton.addEventListener('click', this.handleAddTask);

        addTaskEl.appendChild(textarea);
        addTaskEl.appendChild(addButton);

        return addTaskEl;
    }

    render = () => {
        const columnEl = document.createElement('div');
        columnEl.className = 'column';
        columnEl.id = this.props.id;

        columnEl.addEventListener('dragover', this.handleDragOver);
        columnEl.addEventListener('drop', this.handleDrop);

        const titleEl = document.createElement('h2');
        titleEl.textContent = this.props.title;
        columnEl.appendChild(titleEl);

        const taskListComponent = new TaskListComponent({
            tasks: this.props.tasks,
            columnId: this.props.id
        });

        columnEl.appendChild(taskListComponent.render());

        if (this.props.id === 'todo') {
            const addTaskEl = this.renderAddTask();
            columnEl.appendChild(addTaskEl);
        }

        return columnEl;
    }

}

export default ColumnComponent;