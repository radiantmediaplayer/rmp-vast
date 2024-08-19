export default class VpaidPlayer {
    constructor(rmpVast: any);
    getAdWidth(): any;
    getAdHeight(): any;
    getAdDuration(): any;
    getAdRemainingTime(): number;
    getCreativeUrl(): string;
    getAdVolume(): any;
    getAdPaused(): boolean;
    getAdExpanded(): any;
    getAdSkippableState(): any;
    getAdCompanions(): any;
    resizeAd(width: any, height: any, viewMode: any): void;
    stopAd(): void;
    pauseAd(): void;
    resumeAd(): void;
    expandAd(): void;
    collapseAd(): void;
    skipAd(): void;
    setAdVolume(volume: any): void;
    init(creativeUrl: any, vpaidSettings: any): void;
    destroy(): void;
    #private;
}
//# sourceMappingURL=vpaid-player.d.ts.map