export default DispatcherEvent;
declare class DispatcherEvent {
    constructor(eventName: any);
    eventName: any;
    callbacks: any[];
    registerCallback(callback: any): void;
    unregisterCallback(callback: any): void;
    fire(data: any): void;
}
//# sourceMappingURL=dispatcher-event.d.ts.map