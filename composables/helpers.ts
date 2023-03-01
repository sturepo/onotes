export const beforeUnloadListener = (event) => {
    event.preventDefault();
    return event.returnValue = '';
};
