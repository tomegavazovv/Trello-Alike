import { logoutUser } from '../service/authService.js';
import store, { actions } from '../store/store.js';
import BoardComponent from './BoardComponent.js';
import Component from './Component.js';
import LoginComponent from './LoginComponent.js';
import RegisterComponent from './RegisterComponent.js';

class AppComponent extends Component {
    constructor(props) {
        super(props);
        this.columns = [
            { id: 'todo', title: 'To Do' },
            { id: 'inprogress', title: 'In Progress' },
            { id: 'done', title: 'Done' }
        ];
        this.boardComponent = new BoardComponent({ columns: this.columns });
        this.loginComponent = new LoginComponent({ onSwitchToRegister: this.switchAuthState });
        this.registerComponent = new RegisterComponent({ onSwitchToLogin: this.switchAuthState });
        this.isRegistering = false;
    }

    switchAuthState = () => {
        if(store.state.authError){
            store.dispatch(actions.setAuthError(null));
        }
        this.isRegistering = !this.isRegistering;
        this.mount()
    }

    handleLogout = () => {
        try{
            logoutUser();
            store.dispatch(actions.clearUser());
        } catch (error) {
            console.error('Logout error:', error);
        }
    }

    render() {
        if (store.state.user) {
            console.log(store.state.user)
            const container = document.createElement('div');
            const logoutButton = document.createElement('button');
            logoutButton.textContent = 'Logout';
            logoutButton.addEventListener('click', this.handleLogout);
            logoutButton.className = 'logout-button';
            container.appendChild(logoutButton);
            container.appendChild(this.boardComponent.render());
            return container;
        } else {
            return this.isRegistering 
                ? this.registerComponent.render() 
                : this.loginComponent.render();
        }
    }

    setState(newState) {
        this.state = { ...this.state, ...newState };
        this.mount();
    }

    mount() {
        document.body.innerHTML = '';
        document.body.appendChild(this.render());
    }
}

export default AppComponent;