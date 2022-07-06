export default VPAID;
declare namespace VPAID {
    function getAdWidth(): any;
    function getAdHeight(): any;
    function getAdDuration(): any;
    function getAdRemainingTime(): any;
    function getCreativeUrl(): any;
    function getVpaidCreative(): any;
    function getAdVolume(): any;
    function getAdPaused(): any;
    function getAdExpanded(): any;
    function getAdSkippableState(): any;
    function getAdIcons(): any;
    function getAdCompanions(): any;
    function resizeAd(width: any, height: any, viewMode: any): void;
    function stopAd(): void;
    function pauseAd(): void;
    function resumeAd(): void;
    function expandAd(): void;
    function collapseAd(): void;
    function skipAd(): void;
    function setAdVolume(volume: any): void;
    function loadCreative(creativeUrl: any, vpaidSettings: any): void;
    function destroy(): void;
}
//# sourceMappingURL=vpaid.d.ts.map