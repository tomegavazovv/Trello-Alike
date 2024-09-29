import Component from './Component';
import { registerUser } from '../service/authService';
import store from '../store/store';
import { actions } from '../store/actions';

class RegisterComponent extends Component {
    constructor(props: { onSwitchToLogin: () => void }) {
        super(props);
    }

    handleRegister = async (event: Event) => {
        event.preventDefault();
        const email = (document.getElementById('register-email') as HTMLInputElement).value;
        const password = (document.getElementById('register-password') as HTMLInputElement).value;

        try {
            const userCredential = await registerUser(email, password);
            store.dispatch(actions.setUser(userCredential.user));
        } catch (error) {   
            store.dispatch(actions.setAuthError('User with this email already exists'));
        }
    }

    render(): HTMLElement {
        const registerForm = document.createElement('form');
        registerForm.className = 'auth-form';

        const emailInput = document.createElement('input');
        emailInput.type = 'email';
        emailInput.id = 'register-email';
        emailInput.placeholder = 'Email';
        emailInput.required = true;

        const passwordInput = document.createElement('input');
        passwordInput.type = 'password';
        passwordInput.id = 'register-password';
        passwordInput.placeholder = 'Password';
        passwordInput.required = true;

        const errorMessage = document.createElement('p');
        errorMessage.id = 'error-message';
        errorMessage.textContent = store.state.authError;

        const submitButton = document.createElement('button');
        submitButton.type = 'submit';
        submitButton.textContent = 'Register';

        

        const loginLink = document.createElement('a');
        loginLink.href = '#';
        loginLink.textContent = 'Already a member? Login here';
        loginLink.addEventListener('click', this.props.onSwitchToLogin);

        registerForm.appendChild(emailInput);
        registerForm.appendChild(passwordInput);
        registerForm.appendChild(errorMessage);
        registerForm.appendChild(submitButton);
        registerForm.appendChild(loginLink);
        registerForm.addEventListener('submit', this.handleRegister);

        return registerForm;
    }
}

export default RegisterComponent;