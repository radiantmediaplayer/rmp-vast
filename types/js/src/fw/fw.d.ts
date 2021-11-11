export default FW;
declare namespace FW {
    function nullFn(): any;
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
    function logVideoEvents(video: any, type: any): void;
    function isNumber(n: any): boolean;
    function openWindow(link: any): void;
}
