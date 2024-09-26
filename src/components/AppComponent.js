import BoardComponent from './BoardComponent.js';
import Component from './Component.js';

class AppComponent extends Component {
    constructor() {
        super();
        this.columns = [
            { id: 'todo', title: 'To Do' },
            { id: 'inprogress', title: 'In Progress' },
            { id: 'done', title: 'Done' }
        ];
        this.boardComponent = new BoardComponent({ columns: this.columns });
    }

    render() {
        return this.boardComponent.render();
    }

    mount() {
        document.body.innerHTML = '';
        document.body.appendChild(this.render());
    }
}

export default AppComponent;