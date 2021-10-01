export default ENV;
declare namespace ENV {
    export const devicePixelRatio: number;
    export const maxTouchPoints: number;
    export const isIpadOS: boolean;
    export { isIos };
    export const isAndroid: (number | boolean)[];
    export const isMacOSSafari: number | boolean;
    export const isFirefox: boolean;
    export const isMobile: boolean;
    export function canPlayType(type: any, codec: any): boolean;
    export const hasNativeFullscreenSupport: boolean;
}
declare const isIos: (number | boolean)[];
