export default OmSdkManager;
declare class OmSdkManager {
    constructor(adVerifications: any, videoElement: any, params: any, isSkippableAd: any, skipTimeOffset: any);
    adEvents: any;
    mediaEvents: any;
    adSession: any;
    OMIframe: HTMLIFrameElement;
    VastProperties: any;
    lastVideoTime: number;
    videoElement: any;
    adVerifications: any;
    params: any;
    isSkippableAd: any;
    skipTimeOffset: any;
    videoPosition: string;
    init(): void;
    destroy(): void;
    _pingVerificationNotExecuted(verification: any, reasonCode: any): void;
    _createOMIframe(): HTMLIFrameElement;
    _vastPlayerDidDispatchTimeUpdate(): void;
    _vastPlayerDidDispatchEvent(event: any): void;
    _onOMWebIframeLoaded(): void;
}
//# sourceMappingURL=omsdk.d.ts.map