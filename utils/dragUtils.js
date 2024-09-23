function initDragEventListeners() {
  document.querySelectorAll(".column").forEach((column) => {
    column.addEventListener("dragover", allowDrop);
    column.addEventListener("drop", dropHandler);
  });
}

function listenDrag(el) {
  el.addEventListener("dragstart", dragStartHandler);
  el.addEventListener("dragend", dragEndHandler);
}

function dragStartHandler(event) {
  event.dataTransfer.setData("id", event.target.id);
  event.dataTransfer.effectAllowed = "move";
  event.target.style.opacity = "0.3";
}

function dragEndHandler(event) {
  event.target.style.opacity = "1";
}
function dragHandler(event) {
  event.dataTransfer.setData("id", event.target.id);
}

function allowDrop(event) {
  event.preventDefault();
}
