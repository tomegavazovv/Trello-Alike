import ColumnComponent from "./ColumnComponent";
import Component from "./Component";
import store, { tasksSelector, userIdSelector, useSelector } from "../store/store";
import { moveTaskToColumn } from "../service/taskService";
import { actions, transferTask } from "../store/actions";

class BoardComponent extends Component {
    constructor(props) {
        super(props);
        this.childComponents = this.props.columns.map(column => (
            new ColumnComponent({
                id: column.id,
                title: column.title,
                handleDroppedInDifferentColumn: this.handleDroppedInDifferentColumn
            })
        ))
    }

    setState() {
        this.state.tasks = useSelector(tasksSelector(), this)
        this.state.userId = useSelector(userIdSelector(), this)
    }

    handleDroppedInDifferentColumn = (event, toColumn) => {
        const droppedTaskId = event.dataTransfer.getData("id");
        const fromColumn = event.dataTransfer.getData("fromColumn");
        const order = Math.max(...this.state.tasks[toColumn].map(task => task.order)) + 1;
        store.dispatch(actions.transferTask(droppedTaskId, fromColumn, toColumn, order));
        moveTaskToColumn(droppedTaskId, toColumn, order, this.state.userId);
    }

    renderChildren = () => {
        return this.childComponents.map(child => child.renderComponent());
    }

    _render() {
        if (this.dirty || !this.isMounted) {
            this.element = document.createElement('div');
            this.element.className = 'board';

            this.dynamicWrapper = document.createElement('div');
            this.dynamicWrapper.className = 'columns';
            this.element.appendChild(this.dynamicWrapper);
        }
        
        this.dynamicWrapper.replaceChildren([])
        const children = this.renderChildren();
        children.forEach(child => {
            this.dynamicWrapper.appendChild(child);
        });

        return this.element;
    }


}

export default BoardComponent;