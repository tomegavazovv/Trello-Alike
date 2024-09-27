import './styling.css';
import store, { actions } from './store/store.js';
import { getTasks } from './db/db.js';
import AppComponent from './components/AppComponent.js';
import { getCurrentUser } from './service/authService.js';

init()

async function init() {
  const user = await getCurrentUser();
  if (user) {
    store.dispatch(actions.setUser(user));
    await refreshTasks(user.uid);
  }

  const appComponent = new AppComponent();
  appComponent.mount();

  store.addLoginUserListener(async () => {
    await refreshTasks(store.state.user.uid);
  })

  store.addListener(() => {
    appComponent.mount();
  });

}

async function refreshTasks(userId) {
  const tasks = await getTasks(userId);
  store.dispatch(actions.refreshTasks(tasks));
}