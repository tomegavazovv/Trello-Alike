import Component from './Component';
import TaskListComponent from './TaskListComponent';
import { isValidTask } from '../utils/taskUtils';
import { addTask, reorderTasks } from '../service/taskService';
import store, { tasksColumnSelector, userIdSelector, useSelector } from '../store/store';
import { getNearestElementByMouseY } from '../utils/domUtils';
import { actions } from '../store/actions';
import { Column, Task } from '../models/Task';

type ColumnComponentProps = {
    id: string;
    title: string;
    handleDroppedInDifferentColumn: (event: DragEvent, toColumn: Column) => void;
}

class ColumnComponent extends Component {
    state: {
        userId: string;
        tasks: Task[];
    }

    constructor(props: ColumnComponentProps) {
        super(props);
        this.childComponents = [new TaskListComponent({
            columnId: this.props.id
        })]
    }

    setState(): void {
        this.state.tasks = useSelector(tasksColumnSelector(this.props.id), this)
        this.state.userId = useSelector(userIdSelector(), this)
    }

    handleAddTask = async (event: Event): Promise<void> => {
        const target = event.target as HTMLElement;
        const input = target.closest('.add-task').querySelector('textarea') as HTMLTextAreaElement;
        const value = input.value.trim();

        if (isValidTask(value)) {
            input.value = '';
            const order = Math.max(...this.state.tasks.map(task => task.order)) + 1;
            const newTask = await addTask(value, this.props.id, order, this.state.userId);
            store.dispatch(actions.addTask(newTask, this.props.id));
        }
    }

    handleDragOver = (event: DragEvent) => {
        event.preventDefault();
    }

    handleDrop = (event: DragEvent): void => {
        event.preventDefault();
        const fromColumn = event.dataTransfer.getData("fromColumn");
        const toColumn = this.props.id;

        if (fromColumn !== toColumn) {
            this.props.handleDroppedInDifferentColumn(event, toColumn);
        } else {
            this.handleDroppedInSameColumn(event);
        }
    }

    handleDroppedInSameColumn = (event: DragEvent): void => {
        const target = event.target as HTMLElement;
        const droppedTaskId = event.dataTransfer.getData("id");
        const toColumn = this.props.id;
        const targetTaskElement = target.closest(".task") as HTMLElement;
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
            const updatedTasks = reorderTasks(columnTasks, droppedTaskId, targetTaskId, this.state.userId);
            store.dispatch(actions.updateTasksOrder(updatedTasks, toColumn));
        }
    }

    renderAddTask = (): HTMLElement => {
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

    renderChildren = (): HTMLElement[] => {
        return this.childComponents.map(child => child.renderComponent());
    }

    render(): HTMLElement {
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
        this.dynamicWrapper.replaceChildren()

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