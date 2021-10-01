export default OmSdkManager;
declare class OmSdkManager {
    constructor(adVerifications: any, videoElement: any, params: any, isSkippableAd: any, skipTimeOffset: any, log: any);
    adEvents: any;
    mediaEvents: any;
    adSession: any;
    OMIframe: HTMLIFrameElement;
    VastProperties: any;
    lastVideoTime: number;
    videoElement: any;
    log: any;
    adVerifications: any;
    params: any;
    isSkippableAd: any;
    skipTimeOffset: any;
    videoPosition: string;
    init(): void;
    destroy(): void;
    pingVerificationNotExecuted_(verification: any, reasonCode: any): void;
    createOMIframe_(): HTMLIFrameElement;
    vastPlayerDidDispatchTimeUpdate_(): void;
    vastPlayerDidDispatchEvent_(event: any): void;
    onOMWebIframeLoaded_(): void;
}
