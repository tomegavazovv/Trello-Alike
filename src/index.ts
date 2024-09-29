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
    await refreshTasks(user.uid);
  }

  const appComponent = new AppComponent();
  appComponent.mount();

  store.addListener(() => {
    appComponent.mount();
  });

  store.addLoginUserListener(async () => {
    await refreshTasks(store.state.user.uid);
  })
}

async function refreshTasks(userId: string) {
  const tasks = await getTasks(userId);
  store.dispatch(actions.refreshTasks(tasks));
}