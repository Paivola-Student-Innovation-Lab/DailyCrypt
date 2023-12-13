const eventBus = {
    on(event: any, callback: (arg0: any) => any) {
        document.addEventListener(event, (e) => callback(e.detail));
    },
    dispatch(event: string, data: any) {
        document.dispatchEvent(new CustomEvent(event, { detail: data }));
    },
    remove(event: any, callback: (this: Document, ev: any) => any) {
        document.removeEventListener(event, callback);
    },
};
export default eventBus;