export default class Tracking {
    constructor(rmpVast: any);
    _rmpVast: any;
    _debugRawConsoleLogs: any;
    _createTrackingApiEventMap(): void;
    _trackingApiEventMap: Map<any, any>;
    _dispatch(event: any): void;
    _ping(url: any): void;
    _onVolumeChange(): void;
    _onTimeupdate(): void;
    _firstQuartileEventFired: boolean;
    _midpointEventFired: boolean;
    _thirdQuartileEventFired: boolean;
    _onPause(): void;
    _onPlay(): void;
    _onPlaying(): void;
    _onEnded(): void;
    _dispatchTracking(event: any): void;
    replaceMacros(url: any, trackingPixels: any): any;
    pingURI(url: any): void;
    error(errorCode: any): void;
    reset(): void;
    _onPauseFn: any;
    _onPlayFn: any;
    _onPlayingFn: any;
    _onEndedFn: any;
    _onVolumeChangeFn: any;
    _onTimeupdateFn: any;
    dispatchTrackingAndApiEvent(apiEvent: any): void;
    destroy(): void;
    wire(): void;
}
//# sourceMappingURL=tracking.d.ts.map