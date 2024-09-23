function initDragEventListeners() {
  document.querySelectorAll(".column").forEach((column) => {
    column.addEventListener("dragover", allowDrop);
    column.addEventListener("drop", dropHandler);
  });
}

function listenDrag(el) {
  el.addEventListener("dragstart", dragHandler);
}

function dragHandler(event) {
  event.dataTransfer.setData("id", event.target.id);
}

function allowDrop(event) {
  event.preventDefault();
}


