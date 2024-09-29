
export function getNearestElementByMouseY(selector: string, mouseY: number): HTMLElement {
    const elementsInColumn = Array.from(document.querySelectorAll(`${selector}`));
    const result = elementsInColumn.reduce((closest, element) => {
        const box = element.getBoundingClientRect();
        const offset = mouseY - box.top - box.height / 2;
        const absOffset = Math.abs(offset);
        if (absOffset < Math.abs(closest.offset)) {
            return { offset: offset, element: element };
        } else {
            return closest;
        }
    }, { offset: Infinity, element: null });

    return result.element;
}

