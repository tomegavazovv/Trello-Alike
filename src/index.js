import './styling.css';
import { renderTasks } from "./utils/tasks/taskRenderUtils";
import {
  handleAddTask,
  deleteTaskHandler,
  handleTaskTextUpdate,
  handleTaskDoubleClick,
  dragStartHandler,
  dragEndHandler,
  allowDrop,
  dropHandler,
} from "./utils/tasks/taskEventHandlers";
import { isAddTaskButton, isDeleteButton, isTask, isTaskText } from "./utils/classChecks";
import state from './state.js';

async function init() {
  state.addListener(renderTasks);
  await state.initState();
  renderTasks();

  const boardElement = document.querySelector(".board");
  const columns = document.querySelectorAll(".column");
  addTaskEventListeners(boardElement);
  addDragEventListeners(boardElement, columns);
}

function addTaskEventListeners(boardElement) {
  boardElement.addEventListener("click", async (event) => {
    const target = event.target;
    if (isAddTaskButton(target)) {
      await handleAddTask(event);
    } else if (isDeleteButton(target)) {
      await deleteTaskHandler(event);
    }
  });

    boardElement.addEventListener("dblclick", (event) => {
      if (isTaskText(event.target)) {
        handleTaskDoubleClick(event);
      }
    });

    boardElement.addEventListener("blur", async (event) => {
      if (isTaskText(event.target)) {
        handleTaskTextUpdate(event);
      }
    }, true);
}

function addDragEventListeners(boardElement, columns) {
  boardElement.addEventListener("dragstart", (event) => {
    if (isTask(event.target)) {
      dragStartHandler(event);
    }
  });

  boardElement.addEventListener("dragend", (event) => {
    if (isTask(event.target)) {
      dragEndHandler(event);
    }
  });

  columns.forEach((column) => {
    column.addEventListener("dragover", allowDrop);
    column.addEventListener("drop", dropHandler);
  });
}

init()