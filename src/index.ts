import { FirebaseError } from '@firebase/util';
import AppComponent from './components/AppComponent';
import { getCurrentUser } from './service/authService';
import { getTasks } from './service/taskService';
import { actions } from './store/actions';
import store from './store/store';
import './styling.css';


init()

async function init() {
    const user = await getCurrentUser();
    if (user) {
        store.dispatch(actions.setUser(user));
        await refreshTasks();
    }

    const appComponent = new AppComponent();
    appComponent.mount();

    store.addListener(() => {
        appComponent.mount();
    });

    store.addLoginUserListener(async () => {
        await refreshTasks();
    })
}

async function refreshTasks() {
    const tasks = await getTasks();
    store.dispatch(actions.refreshTasks(tasks));
}

window.addEventListener('unhandledrejection', function(event) {
    if(event.reason.name === 'FirebaseError' || event.reason instanceof FirebaseError) {
        event.preventDefault();
        event.stopPropagation();
        store.dispatch(actions.setAppError('Something went wrong. Please try again later.'));
    }
});