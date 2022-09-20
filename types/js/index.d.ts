/**
 * The class to instantiate RmpVast
 * @export
 * @class RmpVast
*/
export default class RmpVast {
    /**
     * @constructor
     * @param {string}  id - the id for the player container. Required parameter.
     * @typedef {object} VpaidSettings
     * @property {number} [width]
     * @property {number} [height]
     * @property {string} [viewMode]
     * @property {number} [desiredBitrate]
     * @typedef {object} Labels
     * @property {string} [skipMessage]
     * @property {string} [closeAd]
     * @property {string} [textForClickUIOnMobile]
     * @typedef {object} RmpVastParams
     * @property {number} [ajaxTimeout] - timeout in ms for an AJAX request to load a VAST tag from the ad server.
     *  Default 8000.
     * @property {number} [creativeLoadTimeout] - timeout in ms to load linear media creative from the server.
     *  Default 10000.
     * @property {boolean} [ajaxWithCredentials] - AJAX request to load VAST tag from ad server should or should not be
     *  made with credentials. Default: false.
     * @property {number} [maxNumRedirects] - the number of VAST wrappers the player should follow before triggering an
     *  error. Default: 4. Capped at 30 to avoid infinite wrapper loops.
     * @property {boolean} [outstream] - Enables outstream ad mode. Default: false.
     * @property {boolean} [showControlsForVastPlayer] - Shows VAST player HTML5 default video controls. Default: false.
     * @property {boolean} [enableVpaid] - Enables VPAID support or not. Default: true.
     * @property {VpaidSettings} [vpaidSettings] - Information required to display VPAID creatives - note that it is up
     *  to the parent application of rmp-vast to provide those informations
     * @property {boolean} [useHlsJS] - Enables hls.js usage to display creatives delivered in HLS format on all devices. Include hls.js library (./externals/hls/hls.min.js) in your page before usage. Default: false.
     * @property {boolean} [debugHlsJS] - Enables debug log when hls.js is used to stream creatives. Default: false.
     * @property {boolean} [omidSupport] - Enables OMID (OM Web SDK) support in rmp-vast. Default: false.
     * @property {string[]} [omidAllowedVendors] - List of allowed vendors for ad verification. Vendors not listed will
     *  be rejected. Default: [].
     * @property {boolean} [omidUnderEvaluation] - When in development/testing/staging set this to true. Default: false.
     * @property {boolean} [omidAutoplay] - The content player will autoplay or not. The possibility of autoplay is not
     *  determined by rmp-vast, this information needs to be passed to rmp-vast (see this
     *  script for example). Default: false (means a click to play is required).
     * @property {string} [partnerName] - partnerName for OMID. Default: 'Radiantmediaplayer'.
     * @property {string} [partnerVersion] - partnerVersion for OMID. Default: '6.0.0'.
     * @property {Labels} [labels] - Information required to properly display VPAID creatives - note that it is up to the
     *  parent application of rmp-vast to provide those informations
     * @param {RmpVastParams} [params] - An object representing various parameters that can be passed to a rmp-vast
     *  instance and that will affect the player inner-workings. Optional parameter.
     */
    constructor(id: string, params?: {
        /**
         * - timeout in ms for an AJAX request to load a VAST tag from the ad server.
         * Default 8000.
         */
        ajaxTimeout?: number;
        /**
         * - timeout in ms to load linear media creative from the server.
         * Default 10000.
         */
        creativeLoadTimeout?: number;
        /**
         * - AJAX request to load VAST tag from ad server should or should not be
         * made with credentials. Default: false.
         */
        ajaxWithCredentials?: boolean;
        /**
         * - the number of VAST wrappers the player should follow before triggering an
         * error. Default: 4. Capped at 30 to avoid infinite wrapper loops.
         */
        maxNumRedirects?: number;
        /**
         * - Enables outstream ad mode. Default: false.
         */
        outstream?: boolean;
        /**
         * - Shows VAST player HTML5 default video controls. Default: false.
         */
        showControlsForVastPlayer?: boolean;
        /**
         * - Enables VPAID support or not. Default: true.
         */
        enableVpaid?: boolean;
        /**
         * - Information required to display VPAID creatives - note that it is up
         * to the parent application of rmp-vast to provide those informations
         */
        vpaidSettings?: {
            width?: number;
            height?: number;
            viewMode?: string;
            desiredBitrate?: number;
        };
        /**
         * - Enables hls.js usage to display creatives delivered in HLS format on all devices. Include hls.js library (./externals/hls/hls.min.js) in your page before usage. Default: false.
         */
        useHlsJS?: boolean;
        /**
         * - Enables debug log when hls.js is used to stream creatives. Default: false.
         */
        debugHlsJS?: boolean;
        /**
         * - Enables OMID (OM Web SDK) support in rmp-vast. Default: false.
         */
        omidSupport?: boolean;
        /**
         * - List of allowed vendors for ad verification. Vendors not listed will
         * be rejected. Default: [].
         */
        omidAllowedVendors?: string[];
        /**
         * - When in development/testing/staging set this to true. Default: false.
         */
        omidUnderEvaluation?: boolean;
        /**
         * - The content player will autoplay or not. The possibility of autoplay is not
         * determined by rmp-vast, this information needs to be passed to rmp-vast (see this
         * script for example). Default: false (means a click to play is required).
         */
        omidAutoplay?: boolean;
        /**
         * - partnerName for OMID. Default: 'Radiantmediaplayer'.
         */
        partnerName?: string;
        /**
         * - partnerVersion for OMID. Default: '6.0.0'.
         */
        partnerVersion?: string;
        /**
         * - Information required to properly display VPAID creatives - note that it is up to the
         * parent application of rmp-vast to provide those informations
         */
        labels?: {
            skipMessage?: string;
            closeAd?: string;
            textForClickUIOnMobile?: string;
        };
    });
    id: string;
    container: HTMLElement;
    contentWrapper: Element;
    contentPlayer: Element;
    /**
     * @typedef {object} Environment
     * @property {number} devicePixelRatio
     * @property {number} maxTouchPoints
     * @property {boolean} isIpadOS
     * @property {array} isIos
     * @property {array} isAndroid
     * @property {boolean} isMacOSSafari
     * @property {boolean} isFirefox
     * @property {boolean} isMobile
     * @property {boolean} hasNativeFullscreenSupport
     * @return {Environment}
     */
    getEnvironment(): {
        devicePixelRatio: number;
        maxTouchPoints: number;
        isIpadOS: boolean;
        isIos: any[];
        isAndroid: any[];
        isMacOSSafari: boolean;
        isFirefox: boolean;
        isMobile: boolean;
        hasNativeFullscreenSupport: boolean;
    };
    /**
     * @private
     */
    private _addTrackingEvents;
    /**
     * @private
     */
    private _parseCompanion;
    validCompanionAds: any[];
    companionAdsRequiredAttribute: any;
    /**
     * @private
     */
    private _handleIntersect;
    viewablePreviousRatio: any;
    /**
     * @private
     */
    private _attachViewableObserver;
    viewableObserver: IntersectionObserver;
    /**
     * @private
     */
    private _initViewableImpression;
    attachViewableObserver: any;
    /**
     * @private
     */
    private _loopAds;
    adPod: boolean;
    adPodLength: number;
    adSequence: number;
    /**
     * @private
     */
    private _getVastTag;
    adTagUrl: string;
    /**
     * @param {string} vastUrl - the URI to the VAST resource to be loaded
     * @param {object} [regulationsInfo] - data for regulations as
     * @param {string} [regulationsInfo.regulations] - coppa|gdpr for REGULATIONS macro
     * @param {string} [regulationsInfo.limitAdTracking] - 0|1 for LIMITADTRACKING macro
     * @param {string} [regulationsInfo.gdprConsent] - Base64-encoded Cookie Value of IAB GDPR consent info for
     *  GDPRCONSENT macro
     * @param {boolean} [requireCategory] - for enforcement of VAST 4 Ad Categories
     * @return {void}
     */
    loadAds(vastUrl: string, regulationsInfo?: {
        regulations?: string;
        limitAdTracking?: string;
        gdprConsent?: string;
    }, requireCategory?: boolean): void;
    requireCategory: boolean;
    currentContentSrc: any;
    currentContentCurrentTime: any;
    /**
     * @type {() => void}
     */
    play(): void;
    /**
     * @type {() => void}
     */
    pause(): void;
    /**
     * @type {() => boolean}
     */
    getAdPaused(): boolean;
    /**
     * @type {(level: number) => void}
     */
    setVolume(level: number): void;
    /**
     * @type {() => number}
     */
    getVolume(): number;
    /**
     * @type {(muted: boolean) => void}
     */
    setMute(muted: boolean): void;
    /**
     * @type {() => boolean}
     */
    getMute(): boolean;
    /**
     * @type {() => boolean}
     */
    getFullscreen(): boolean;
    /**
     * @type {() => void}
     */
    stopAds(): void;
    /**
     * @type {() => void}
     */
    skipAd(): void;
    /**
     * @type {() => string}
     */
    getAdTagUrl(): string;
    /**
     * @type {() => string}
     */
    getAdMediaUrl(): string;
    /**
     * @type {() => boolean}
     */
    getAdLinear(): boolean;
    /**
     * @typedef {object} AdSystem
     * @property {string} value
     * @property {string} version
     * @return {AdSystem}
     */
    getAdSystem(): {
        value: string;
        version: string;
    };
    /**
     * @typedef {object} universalAdId
     * @property {string} idRegistry
     * @property {string} value
     * @return {universalAdId[]}
     */
    getAdUniversalAdIds(): {
        idRegistry: string;
        value: string;
    }[];
    /**
     * @type {() => string}
     */
    getAdContentType(): string;
    /**
     * @type {() => string}
     */
    getAdTitle(): string;
    /**
     * @type {() => string}
     */
    getAdDescription(): string;
    /**
     * @typedef {object} Advertiser
     * @property {string} id
     * @property {string} value
     * @return {Advertiser}
     */
    getAdAdvertiser(): {
        id: string;
        value: string;
    };
    /**
     * @typedef {object} Pricing
     * @property {string} value
     * @property {string} model
     * @property {string} currency
     * @return {Pricing}
     */
    getAdPricing(): {
        value: string;
        model: string;
        currency: string;
    };
    /**
     * @type {() => string}
     */
    getAdSurvey(): string;
    /**
     * @type {() => string}
     */
    getAdAdServingId(): string;
    /**
     * @typedef {object} Category
     * @property {string} authority
     * @property {string} value
     * @return {Category[]}
     */
    getAdCategories(): {
        authority: string;
        value: string;
    }[];
    /**
     * @typedef {object} BlockedAdCategory
     * @property {string} authority
     * @property {string} value
     * @return {BlockedAdCategory[]}
     */
    getAdBlockedAdCategories(): {
        authority: string;
        value: string;
    }[];
    /**
     * @type {() => number}
     */
    getAdDuration(): number;
    /**
     * @type {() => number}
     */
    getAdCurrentTime(): number;
    /**
     * @type {() => number}
     */
    getAdRemainingTime(): number;
    /**
     * @type {() => boolean}
     */
    getAdOnStage(): boolean;
    /**
     * @type {() => number}
     */
    getAdMediaWidth(): number;
    /**
     * @type {() => number}
     */
    getAdMediaHeight(): number;
    /**
     * @type {() => string}
     */
    getClickThroughUrl(): string;
    /**
     * @type {() => number}
     */
    getSkipTimeOffset(): number;
    /**
     * @type {() => boolean}
     */
    getIsSkippableAd(): boolean;
    /**
     * @type {() => boolean}
     */
    getContentPlayerCompleted(): boolean;
    /**
     * @param {boolean} value
     * @return {void}
     */
    setContentPlayerCompleted(value: boolean): void;
    contentPlayerCompleted: boolean;
    /**
     * @type {() => string}
     */
    getAdErrorMessage(): string;
    /**
     * @type {() => number}
     */
    getAdVastErrorCode(): number;
    /**
     * @type {() => string}
     */
    getAdErrorType(): string;
    /**
     * @type {() => boolean}
     */
    getIsUsingContentPlayerForAds(): boolean;
    /**
     * @type {() => boolean}
     */
    getAdSkippableState(): boolean;
    /**
     * @return {HTMLMediaElement|null}
     */
    getVastPlayer(): HTMLMediaElement | null;
    /**
     * @return {HTMLMediaElement|null}
     */
    getContentPlayer(): HTMLMediaElement | null;
    /**
     * @param {number} inputWidth
     * @param {number} inputHeight
     * @typedef {object} Companion
     * @property {string} adSlotID
     * @property {string} altText
     * @property {string} companionClickThroughUrl
     * @property {string} companionClickTrackingUrl
     * @property {number} height
     * @property {number} width
     * @property {string} imageUrl
     * @property {string[]} trackingEventsUri
     * @return {Companion[]}
     */
    getCompanionAdsList(inputWidth: number, inputHeight: number): {
        adSlotID: string;
        altText: string;
        companionClickThroughUrl: string;
        companionClickTrackingUrl: string;
        height: number;
        width: number;
        imageUrl: string;
        trackingEventsUri: string[];
    }[];
    companionAdsList: any[];
    /**
     * @param {number} index
     * @return {HTMLElement|null}
     */
    getCompanionAd(index: number): HTMLElement | null;
    /**
     * @type {() => string}
     */
    getCompanionAdsRequiredAttribute(): string;
    /**
     * @type {() => void}
     */
    initialize(): void;
    /**
     * @type {() => boolean}
     */
    getInitialized(): boolean;
    /**
     * @type {() => void}
     */
    destroy(): void;
    /**
     * @typedef {object} AdPod
     * @property {number} adPodCurrentIndex
     * @property {number} adPodLength
     * @return {AdPod}
     */
    getAdPodInfo(): {
        adPodCurrentIndex: number;
        adPodLength: number;
    };
    /**
     * @type {(width: number, height: number, viewMode: string) => void}
     */
    resizeAd(width: number, height: number, viewMode: string): void;
    /**
     * @type {() => void}
     */
    expandAd(): void;
    /**
     * @type {() => void}
     */
    collapseAd(): void;
    /**
     * @type {() => boolean}
     */
    getAdExpanded(): boolean;
    /**
     * @type {() => string}
     */
    getVPAIDCompanionAds(): string;
}
//# sourceMappingURL=index.d.ts.map