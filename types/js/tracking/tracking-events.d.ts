export default TRACKING_EVENTS;
declare namespace TRACKING_EVENTS {
    function dispatch(event: any): void;
    function replaceMacros(url: any, trackingPixels: any): any;
    function pingURI(url: any): void;
    function error(errorCode: any): void;
    function wire(): void;
}
//# sourceMappingURL=tracking-events.d.ts.map