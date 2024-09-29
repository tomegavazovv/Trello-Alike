import Component from './Component.js';
import TaskListComponent from './TaskListComponent.js';
import { isValidTask } from '../utils/taskUtils.js';
import { addTask, reorderTasks } from '../service/taskService.js';
import store, { tasksColumnSelector, userIdSelector, useSelector } from '../store/store.js';
import { getNearestElementByMouseY } from '../utils/domUtils.js';
import { actions } from '../store/actions.js';
class ColumnComponent extends Component {
    constructor(props) {
        super(props);
        this.childComponents = [new TaskListComponent({
            columnId: this.props.id
        })]
    }

    setState() {
        this.state.tasks = useSelector(tasksColumnSelector(this.props.id), this)
        this.userId = useSelector(userIdSelector(), this)
    }

    handleAddTask = async (event) => {
        const input = event.target.previousElementSibling;
        const value = input.value.trim();
        if (isValidTask(value)) {
            input.value = '';
            const order = Math.max(this.state.tasks.map(task => task.order)) + 1;
            const newTask = await addTask(value, this.props.id, order, this.userId);
            store.dispatch(addTask(newTask, this.props.id));
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
            this.props.handleDroppedInDifferentColumn(event, toColumn);
        } else {
            this.handleDroppedInSameColumn(event);
        }
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

    renderChildren = () => {
        return this.childComponents.map(child => child.renderComponent());
    }

    _render = () => {
        if (this.dirty || !this.isMounted) {
            this.element = document.createElement('div');
            this.element.className = 'column';
            this.element.id = this.props.id;

            this.element.addEventListener('dragover', this.handleDragOver);
            this.element.addEventListener('drop', this.handleDrop);
            this.dynamicWrapper = document.createElement('div');
            this.dynamicWrapper.className = 'tasks';
            this.element.appendChild(this.dynamicWrapper);
        }
        this.dynamicWrapper.replaceChildren([])

        const titleEl = document.createElement('h2');
        titleEl.textContent = this.props.title;
        this.dynamicWrapper.appendChild(titleEl);

        const children = this.renderChildren()
        children.forEach(child => {
            this.dynamicWrapper.appendChild(child)
        });

        if (this.props.id === 'todo') {
            const addTaskEl = this.renderAddTask();
            this.dynamicWrapper.appendChild(addTaskEl);
        }

        return this.element;
    }

}

export default ColumnComponent;