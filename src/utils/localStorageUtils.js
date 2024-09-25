export function saveToLocalStorageAsJSON(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

export function readFromLocalStorageAsJSON(key) {
  return JSON.parse(localStorage.getItem(key));
}
