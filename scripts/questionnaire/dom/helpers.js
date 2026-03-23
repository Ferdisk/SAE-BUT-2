export function appendChildren(parent, ...children) {
    children.forEach((child) => parent.appendChild(child));
}

export function setDisabledForControls(disabled, exceptId = null) {
    document.querySelectorAll("input, textarea, select, button").forEach((el) => {
        if (exceptId && el.id === exceptId) return;
        el.disabled = disabled;
    });
}
