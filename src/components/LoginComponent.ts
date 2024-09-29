import Component from './Component';
import { loginUser } from '../service/authService';
import store from '../store/store';
import { actions } from '../store/actions';

class LoginComponent extends Component {
    constructor(props: { onSwitchToRegister: () => void }) {
        super(props);
    }

    handleLogin = async (event: Event) => {
        event.preventDefault();
        const email = (document.getElementById('email') as HTMLInputElement).value;
        const password = (document.getElementById('password') as HTMLInputElement).value;

        try {
            const userCredential = await loginUser(email, password);

            store.dispatch(actions.setAuthError(null));
            store.dispatch(actions.setUser(userCredential.user));
        } catch (error) {
            store.dispatch(actions.setAuthError('Invalid credentials.'));
        }
    }

    render(): HTMLElement {
        const loginForm = document.createElement('form');
        loginForm.className = 'auth-form';
    
        const emailInput = document.createElement('input');
        emailInput.type = 'email';
        emailInput.id = 'email';
        emailInput.placeholder = 'Email';
        emailInput.required = true;
    
        const passwordInput = document.createElement('input');
        passwordInput.type = 'password';
        passwordInput.id = 'password';
        passwordInput.placeholder = 'Password';
        passwordInput.required = true;

        const errorMessage = document.createElement('p');
        errorMessage.id = 'error-message';
        errorMessage.textContent = store.state.authError;
    
        const submitButton = document.createElement('button');
        submitButton.type = 'submit';
        submitButton.textContent = 'Login';
    
        const registerLink = document.createElement('a');
        registerLink.href = '#';
        registerLink.textContent = 'Not a member yet? Register here';
        registerLink.addEventListener('click', this.props.onSwitchToRegister);
    
        loginForm.appendChild(emailInput);
        loginForm.appendChild(passwordInput);
        loginForm.appendChild(errorMessage);
        loginForm.appendChild(submitButton);
        loginForm.appendChild(registerLink);
    
        loginForm.addEventListener('submit', this.handleLogin);
    
        return loginForm;
    }
}

export default LoginComponent;