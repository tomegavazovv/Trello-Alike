import { tasksColumnSelector, useSelector } from '../store/store.js';
import Component from './Component.js';
import TaskComponent from './TaskComponent.js';

class TaskListComponent extends Component {
    constructor(props) {
        super(props);
    }

    setState() {
        this.tasks = useSelector(tasksColumnSelector(this.props.columnId), this).sort((a, b) => a.order - b.order)
    }
    
    handleDragOver = (event) => {
        event.preventDefault();
    }

    renderChildren() {
        return this.tasks.map(task => new TaskComponent({ task }).renderComponent())
    }

    _render() {
        if (this.dirty || !this.isMounted) {
            this.element = document.createElement('div');
            this.element.className = 'tasks';
            this.element.addEventListener('dragover', this.handleDragOver);
            this.element.addEventListener('drop', this.handleDrop);
            
            this.dynamicWrapper = document.createElement('div');
            this.dynamicWrapper.className = 'task-wrapper';
            this.element.appendChild(this.dynamicWrapper);
        }

        this.dynamicWrapper.replaceChildren([])
        const children = this.renderChildren();
        children.forEach(child => this.dynamicWrapper.appendChild(child));

        return this.element;
    }
}

export default TaskListComponent;