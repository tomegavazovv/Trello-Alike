import { logoutUser } from '../service/authService';
import { actions } from '../store/actions';
import store from '../store/store';
import BoardComponent from './BoardComponent';
import Component from './Component';
import LoginComponent from './LoginComponent';
import RegisterComponent from './RegisterComponent';

class AppComponent extends Component {
    private columns: { id: string, title: string }[];
    private boardComponent: BoardComponent;
    private loginComponent: LoginComponent;
    private registerComponent: RegisterComponent;
    private isRegistering: boolean;

    constructor() {
        super();
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

    switchAuthState = (): void => {
        if (store.state.authError) {
            store.dispatch(actions.setAuthError(null));
        }
        this.isRegistering = !this.isRegistering;
        this.mount()
    }

    handleLogout = (): void => {
        try {
            logoutUser();
            store.dispatch(actions.clearUser());
        } catch (error) {
            console.error('Logout error:', error);
        }
    }

    renderAuth(): HTMLElement {
        if(this.isRegistering){
            return this.registerComponent.renderComponent()
        }
        return this.loginComponent.renderComponent()
    }

    render(): HTMLElement {
        if (store.state.user) {
            const container = document.createElement('div');
            const logoutButton = document.createElement('button');
            logoutButton.textContent = 'Logout';
            logoutButton.addEventListener('click', this.handleLogout);
            logoutButton.className = 'logout-button';
            container.appendChild(logoutButton);
            container.appendChild(this.boardComponent.renderComponent());
            return container
        } else {
            return this.renderAuth()
        }
    }

    mount(): void {
        const root = document.querySelector('.root');
        root.innerHTML = '';
        root.appendChild(this.renderComponent());
    }
}

export default AppComponent;