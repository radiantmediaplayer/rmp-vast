export default class OmSdkManager {
    constructor(adVerifications: any, rmpVast: any);
    _rmpVast: any;
    VastProperties: any;
    _adEvents: any;
    _mediaEvents: any;
    _adSession: any;
    _lastVideoTime: number;
    _adVerifications: any;
    _onFullscreenChangeFn: any;
    _contentPlayer: any;
    _adPlayer: any;
    _params: any;
    _isSkippableAd: any;
    _skipTimeOffset: any;
    _destroy(): void;
    _onFullscreenChange(): void;
    _pingVerificationNotExecuted(verification: any, reasonCode: any): void;
    _adPlayerDidDispatchTimeUpdate(): void;
    _adPlayerDidDispatchEvent(event: any): void;
    _onOMWebLoaded(): void;
    init(): void;
}
//# sourceMappingURL=omsdk.d.ts.map