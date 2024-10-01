import Component from './Component';
import store from '../store/store';
import { actions } from '../store/actions';

class CardComponent extends Component {
    constructor(props: { error: string }) {
        super(props);
        this.startTimer();
    }

    startTimer(): void {
        setTimeout(() => {
            store.dispatch(actions.setAppError(null));
        }, 3000);
    }

    render(): HTMLElement {
        const card = document.createElement('div');
        card.className = 'error-card';

        const message = document.createElement('p');
        message.textContent = this.props.error;
        card.appendChild(message);

        const closeButton = document.createElement('button');
        closeButton.textContent = 'X';
        closeButton.className = 'error-card-close';
        closeButton.addEventListener('click', () => {
            store.dispatch(actions.setAppError(null));
        });
        card.appendChild(closeButton);

        return card;
    }
}

export default CardComponent;