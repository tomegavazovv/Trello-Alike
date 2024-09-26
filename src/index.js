import './styling.css';
import store from './store/store.js';
import { getTasks } from './db/db.js';
import AppComponent from './components/AppComponent.js';

init()

async function init() {
  const tasks = await getTasks();
  store.setTasks(tasks);

  const appComponent = new AppComponent();
  appComponent.mount();

  store.addListener(() => {
    appComponent.mount();
  });
}
