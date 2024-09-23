function saveToLocalStorageAsJSON(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function readFromLocalStorageAsJSON(key) {
  return JSON.parse(localStorage.getItem(key));
}
