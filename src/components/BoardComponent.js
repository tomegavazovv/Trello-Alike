import ColumnComponent from "./ColumnComponent";
import Component from "./Component";
import store from "../store/store";

class BoardComponent extends Component {
    constructor(props) {
        super(props);
    }

    renderColumns = () => {
        return this.props.columns.map(column => {
            const columnComponent = new ColumnComponent({
                id: column.id,
                title: column.title,
                tasks: store.state.tasks[column.id].sort((a, b) => a.order - b.order),
            });
            return columnComponent.render();
        });
    }

    render() {
        const boardElement = document.createElement('div');
        boardElement.className = 'board';

        const columnElements = this.renderColumns();
        columnElements.forEach(columnElement => {
            boardElement.appendChild(columnElement);
        });

        return boardElement;
    }


}

export default BoardComponent;