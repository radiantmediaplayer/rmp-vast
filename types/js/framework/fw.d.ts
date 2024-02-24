export default class FW {
    static _getStyleAttributeData(element: any, style: any): number;
    static createSyntheticEvent(eventName: any, element: any): void;
    static setStyle(element: any, styleObject: any): void;
    static getWidth(element: any): any;
    static getHeight(element: any): any;
    static show(element: any): void;
    static hide(element: any): void;
    static removeElement(element: any): void;
    static isEmptyObject(obj: any): boolean;
    static get consoleStyle(): string;
    static get consoleStyle2(): string;
    static get consolePrepend2(): "om-sdk-manager:" | "om-sdk-manager%c";
    static get consolePrepend(): "RMP-VAST:" | "%crmp-vast%c";
    static logVideoEvents(video: any, type: any): void;
    static isNumber(n: any): boolean;
    static openWindow(link: any): void;
    static ajax(url: any, timeout: any, withCredentials: any): Promise<any>;
    static addEvents(events: any, domElement: any, callback: any): void;
    static removeEvents(events: any, domElement: any, callback: any): void;
    static clearTimeout(timeoutCallback: any): void;
    static clearInterval(intervalCallback: any): void;
}
//# sourceMappingURL=fw.d.ts.map