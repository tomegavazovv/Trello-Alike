import { Task } from '../models/Task';
import { tasksColumnSelector, useSelector } from '../store/store';
import Component from './Component';
import TaskComponent from './TaskComponent';

class TaskListComponent extends Component {
    state: {
        tasks: Task[];
    }
    
    constructor(props: { columnId: string }) {
        super(props);
    }

    setState(): void {
        this.state.tasks = useSelector(tasksColumnSelector(this.props.columnId), this).sort((a: Task, b: Task) => a.order - b.order)
    }
    
    handleDragOver = (event: DragEvent): void => {
        event.preventDefault();
    }

    renderChildren(): HTMLElement[] {
        return this.state.tasks.map(task => new TaskComponent({task: task, column: this.props.columnId}).renderComponent())
    }

    render(): HTMLElement {
        if (this.dirty || !this.isMounted) {
            this.element = document.createElement('div');
            this.element.className = 'tasks';
            this.element.addEventListener('dragover', this.handleDragOver);
            
            this.dynamicWrapper = document.createElement('div');
            this.dynamicWrapper.className = 'task-wrapper';
            this.element.appendChild(this.dynamicWrapper);
        }

        this.dynamicWrapper.replaceChildren()
        const children = this.renderChildren();
        children.forEach(child => this.dynamicWrapper.appendChild(child));

        return this.element;
    }
}

export default TaskListComponent;