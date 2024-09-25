import { getNearestElementByMouseY, getTaskInputElement, resetInput } from "../domUtils";
import { isValidTask } from "./taskUtils";
import { addTask, deleteTaskFromColumn, moveTaskAfter, moveTaskToColumn, updateTaskText } from "./taskService";

export async function handleAddTask(event) {
    const column = event.target.closest(".column").id;
    const input = getTaskInputElement(column);
    const value = input.value;

    if (isValidTask(value)) {
        resetInput(input);
        await addTask(value, column);
    }
}

export async function deleteTaskHandler(event) {
    const taskId = event.target.closest(".task").id;
    const column = event.target.closest(".column").id;

    deleteTaskFromColumn(taskId, column);
}

export async function handleTaskTextUpdate(event) {
    event.target.contentEditable = false;
    const taskId = event.target.closest(".task").id;
    const column = event.target.closest(".column").id;
    const updatedText = event.target.textContent.trim();
    const originalText = event.target.dataset.originalText;

    if (updatedText !== originalText) {
        updateTaskText(taskId, updatedText, column);
    }
}

export function handleTaskDoubleClick(event) {
    const taskText = event.target;
    taskText.contentEditable = true;
    taskText.focus();
}

export async function dropHandler(event) {
    event.preventDefault();
    const fromColumn = event.dataTransfer.getData("fromColumn");
    const toColumn = event.target.closest(".column").id;

    if (fromColumn === toColumn) {
        _handleSameColumnDrop(event);
    }
    else {
        _handleDifferentColumnDrop(event);
    }

}

export function dragStartHandler(event) {
    event.dataTransfer.setData("id", event.target.id);
    event.dataTransfer.setData("fromColumn", event.target.closest(".column").id);
    event.dataTransfer.effectAllowed = "move";
    event.target.style.opacity = "0.3";
}

export function dragEndHandler(event) {
    event.target.style.opacity = "1";
}

export function allowDrop(event) {
    event.preventDefault();
}

function _handleSameColumnDrop(event) {
    const droppedTaskId = event.dataTransfer.getData("id");
    const targetTaskElement = event.target.closest(".task");
    const column = event.target.closest(".column").id;

    let targetTaskId = null;

    if (targetTaskElement) {
        targetTaskId = targetTaskElement.id;
    } else {
        const mouseY = event.clientY;
        const selector = `#${column} .task`;
        targetTaskId = getNearestElementByMouseY(selector, mouseY)?.id;
    }

    if (targetTaskId && targetTaskId !== droppedTaskId) {
        moveTaskAfter(droppedTaskId, targetTaskId, column);
    }
}

function _handleDifferentColumnDrop(event) {
    const droppedTaskId = event.dataTransfer.getData("id");
    const fromColumn = event.dataTransfer.getData("fromColumn");
    const toColumn = event.target.closest(".column").id;

    moveTaskToColumn(droppedTaskId, fromColumn, toColumn);
}