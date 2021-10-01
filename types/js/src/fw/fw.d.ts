export default FW;
declare namespace FW {
    function nullFn(): any;
    function addClass(element: any, className: any): void;
    function removeClass(element: any, className: any): void;
    function createStdEvent(eventName: any, element: any): void;
    function setStyle(element: any, styleObject: any): void;
    function getWidth(element: any): any;
    function getHeight(element: any): any;
    function show(element: any): void;
    function hide(element: any): void;
    function removeElement(element: any): void;
    function isEmptyObject(obj: any): boolean;
    function log(text: any, data: any): void;
    function trace(data: any): void;
    function hasDOMParser(): boolean;
    function vastReadableTime(time: any): string;
    function generateCacheBusting(): string;
    function getNodeValue(element: any, http: any): string;
    function isValidDuration(duration: any): boolean;
    function convertDurationToSeconds(duration: any): number;
    function isValidOffset(offset: any): boolean;
    function convertOffsetToSeconds(offset: any, duration: any): number;
    function logVideoEvents(video: any, type: any): void;
    function isNumber(n: any): boolean;
    function isObject(obj: any): boolean;
    function openWindow(link: any): void;
}
