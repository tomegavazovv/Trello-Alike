import Component from './Component.js';
import TaskComponent from './TaskComponent.js';

class TaskListComponent extends Component {
    constructor(props) {
        super(props);
        this.taskComponents = {};
    }

    handleDragOver = (event) => {
        event.preventDefault();
    }

    renderTasks() {
        return this.props.tasks.map(task => {
            this.taskComponents[task.id] = new TaskComponent({
                task,
            });
            return this.taskComponents[task.id].render();
        });
    }

    render() {
        const tasksEl = document.createElement('div');
        tasksEl.className = 'tasks';
        tasksEl.addEventListener('dragover', this.handleDragOver);
        tasksEl.addEventListener('drop', this.handleDrop);

        const taskElements = this.renderTasks();
        taskElements.forEach(taskEl => tasksEl.appendChild(taskEl));

        return tasksEl;
    }
}

export default TaskListComponent;