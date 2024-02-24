export default class Dispatcher {
    constructor(eventName: any);
    eventName: any;
    callbacks: any[];
    registerCallback(callback: any): void;
    unregisterCallback(callback: any): void;
    fire(data: any): void;
}
//# sourceMappingURL=dispatcher.d.ts.map