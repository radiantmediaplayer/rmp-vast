export default OmSdkManager;
declare class OmSdkManager {
    constructor(adVerifications: any, contentPlayer: any, vastPlayer: any, params: any, isSkippableAd: any, skipTimeOffset: any);
    adEvents: any;
    mediaEvents: any;
    adSession: any;
    VastProperties: any;
    lastVideoTime: number;
    contentPlayer: any;
    vastPlayer: any;
    adVerifications: any;
    params: any;
    isSkippableAd: any;
    skipTimeOffset: any;
    onFullscreenChange: any;
    init(): void;
    destroy(): void;
    _onFullscreenChange(): void;
    _pingVerificationNotExecuted(verification: any, reasonCode: any): void;
    _vastPlayerDidDispatchTimeUpdate(): void;
    _vastPlayerDidDispatchEvent(event: any): void;
    _onOMWebLoaded(): void;
}
//# sourceMappingURL=omsdk.d.ts.map