export default class Environment {
    static _filterVersion(pattern: any): number;
    static get _testVideo(): HTMLVideoElement;
    static get _hasTouchEvents(): boolean;
    static get userAgent(): string;
    static get devicePixelRatio(): number;
    static get maxTouchPoints(): number;
    static get isIos(): (number | boolean)[];
    static get isIpadOS(): boolean;
    static get isMacOS(): (number | boolean)[];
    static get isSafari(): (number | boolean)[];
    static get isMacOSSafari(): number | boolean;
    static get isAndroid(): (number | boolean)[];
    static get isMobile(): boolean;
    static get hasNativeFullscreenSupport(): boolean;
    static checkCanPlayType(type: any, codec: any): boolean;
}
//# sourceMappingURL=environment.d.ts.map