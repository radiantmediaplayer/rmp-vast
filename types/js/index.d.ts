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
     * @property {string} [textForInteractionUIOnMobile]
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
     * @property {boolean} [showControlsForAdPlayer] - Shows Ad player HTML5 default video controls. Default: false.
     * @property {boolean} [vastXmlInput] - Instead of a VAST URI, we provide directly to rmp-vast VAST XML. Default: false.
     * @property {boolean} [enableVpaid] - Enables VPAID support or not. Default: true.
     * @property {VpaidSettings} [vpaidSettings] - Information required to display VPAID creatives - note that it is up
     *  to the parent application of rmp-vast to provide those informations
     * @property {boolean} [useHlsJS] - Enables hls.js usage to display creatives delivered in HLS format on all devices. Include hls.js library (./externals/hls/hls.min.js) in your page before usage. Default: true.
     * @property {boolean} [debugHlsJS] - Enables debug log when hls.js is used to stream creatives. Default: false.
     * @property {boolean} [debugRawConsoleLogs] - Enables raw debug console log for Flutter apps and legacy platforms. Default: false.
    * @property {boolean} [omidSupport] - Enables OMID (OM Web SDK) support in rmp-vast. Default: false.
     * @property {string[]} [omidAllowedVendors] - List of allowed vendors for ad verification. Vendors not listed will
     *  be rejected. Default: [].
     * @property {boolean} [omidUnderEvaluation] - When in development/testing/staging set this to true. Default: false.
     * @property {boolean} [omidAutoplay] - The content player will autoplay or not. The possibility of autoplay is not
     *  determined by rmp-vast, this information needs to be passed to rmp-vast (see this
     *  script for example). Default: false (means a click to play is required).
     * @property {string} [partnerName] - partnerName for OMID. Default: 'rmp-vast'.
     * @property {string} [partnerVersion] - partnerVersion for OMID. Default: current rmp-vast version 'x.x.x'.
     * @property {Labels} [labels] - Information required to properly display VPAID creatives - note that it is up to the
     *  parent application of rmp-vast to provide those informations
     * @property {object} [macros] -
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
         * - Shows Ad player HTML5 default video controls. Default: false.
         */
        showControlsForAdPlayer?: boolean;
        /**
         * - Instead of a VAST URI, we provide directly to rmp-vast VAST XML. Default: false.
         */
        vastXmlInput?: boolean;
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
         * - Enables hls.js usage to display creatives delivered in HLS format on all devices. Include hls.js library (./externals/hls/hls.min.js) in your page before usage. Default: true.
         */
        useHlsJS?: boolean;
        /**
         * - Enables debug log when hls.js is used to stream creatives. Default: false.
         */
        debugHlsJS?: boolean;
        /**
         * - Enables raw debug console log for Flutter apps and legacy platforms. Default: false.
         */
        debugRawConsoleLogs?: boolean;
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
         * - partnerName for OMID. Default: 'rmp-vast'.
         */
        partnerName?: string;
        /**
         * - partnerVersion for OMID. Default: current rmp-vast version 'x.x.x'.
         */
        partnerVersion?: string;
        /**
         * - Information required to properly display VPAID creatives - note that it is up to the
         * parent application of rmp-vast to provide those informations
         */
        labels?: {
            skipMessage?: string;
            closeAd?: string;
            textForInteractionUIOnMobile?: string;
        };
        /**
         * -
         */
        macros?: object;
    });
    id: string;
    container: HTMLElement;
    contentWrapper: Element;
    currentContentPlayer: Element;
    rmpVastUtils: Utils;
    debugRawConsoleLogs: boolean;
    rmpVastContentPlayer: ContentPlayer;
    rmpVastTracking: Tracking;
    rmpVastCompanionCreative: CompanionCreative;
    environmentData: typeof Environment;
    _initInstanceVariables(): void;
    adContainer: any;
    rmpVastAdPlayer: AdPlayer;
    currentContentSrc: string;
    currentContentCurrentTime: number;
    params: {};
    events: {};
    isInFullscreen: boolean;
    contentCompleted: boolean;
    currentAdPlayer: any;
    rmpVastInitialized: boolean;
    adPod: boolean;
    adPodLength: number;
    adSequence: number;
    resetVariablesForNewLoadAds(): void;
    trackingTags: any[];
    vastErrorTags: any[];
    adErrorTags: any[];
    needsSeekAdjust: boolean;
    seekAdjustAttached: boolean;
    ad: {};
    creative: {};
    attachViewableObserverFn: any;
    viewableObserver: IntersectionObserver;
    viewablePreviousRatio: any;
    regulationsInfo: {};
    requireCategory: boolean;
    progressEvents: any[];
    rmpVastLinearCreative: LinearCreative;
    rmpVastNonLinearCreative: NonLinearCreative;
    rmpVastVpaidPlayer: any;
    adParametersData: string;
    rmpVastSimidPlayer: any;
    rmpVastIcons: any;
    __adTagUrl: string;
    __vastErrorCode: number;
    __adErrorType: string;
    __adErrorMessage: string;
    __adOnStage: boolean;
    dispatch(eventName: string, data: object): void;
    /**
     * @private
     */
    private _on;
    on(eventName: string, callback: Function): void;
    /**
     * @private
     */
    private _one;
    one(eventName: string, callback: Function): void;
    /**
     * @private
     */
    private _off;
    off(eventName: string, callback: Function): void;
    /**
     * @private
     */
    private _addTrackingEvents;
    /**
     * @private
     */
    private _handleIntersect;
    /**
     * @private
     */
    private _attachViewableObserver;
    /**
     * @private
     */
    private _initViewableImpression;
    /**
     * @private
     */
    private _loopAds;
    /**
     * @private
     */
    private _handleParsedVast;
    /**
     * @private
     */
    private _getVastTag;
    /**
     * @param {string} vastData - the URI to the VAST resource to be loaded - or raw VAST XML if params.vastXmlInput is true
     * @param {object} [regulationsInfo] - data for regulations as
     * @param {string} [regulationsInfo.regulations] - coppa|gdpr for REGULATIONS macro
     * @param {string} [regulationsInfo.limitAdTracking] - 0|1 for LIMITADTRACKING macro
     * @param {string} [regulationsInfo.gdprConsent] - Base64-encoded Cookie Value of IAB GDPR consent info for
     *  GDPRCONSENT macro
     * @param {boolean} [requireCategory] - for enforcement of VAST 4 Ad Categories
     * @return {void}
     */
    loadAds(vastData: string, regulationsInfo?: {
        regulations?: string;
        limitAdTracking?: string;
        gdprConsent?: string;
    }, requireCategory?: boolean): void;
    play(): void;
    pause(): void;
    stopAds(): void;
    destroy(): void;
    skipAd(): void;
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
    get environment(): {
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
     * @type {() => boolean}
     */
    get adPaused(): () => boolean;
    /**
     * @type {(level: number) => void}
     */
    set volume(level: () => number);
    /**
     * @type {() => number}
     */
    get volume(): () => number;
    /**
     * @type {(muted: boolean) => void}
     */
    set muted(muted: () => boolean);
    /**
     * @type {() => boolean}
     */
    get muted(): () => boolean;
    /**
     * @type {() => string}
     */
    get adTagUrl(): () => string;
    /**
     * @type {() => string}
     */
    get adMediaUrl(): () => string;
    /**
     * @type {() => boolean}
     */
    get adLinear(): () => boolean;
    /**
     * @typedef {object} AdSystem
     * @property {string} value
     * @property {string} version
     * @return {AdSystem}
     */
    get adSystem(): {
        value: string;
        version: string;
    };
    /**
     * @typedef {object} universalAdId
     * @property {string} idRegistry
     * @property {string} value
     * @return {universalAdId[]}
     */
    get adUniversalAdIds(): {
        idRegistry: string;
        value: string;
    }[];
    /**
     * @type {() => string}
     */
    get adContentType(): () => string;
    /**
     * @type {() => string}
     */
    get adTitle(): () => string;
    /**
     * @type {() => string}
     */
    get adDescription(): () => string;
    /**
     * @typedef {object} Advertiser
     * @property {string} id
     * @property {string} value
     * @return {Advertiser}
     */
    get adAdvertiser(): {
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
    get adPricing(): {
        value: string;
        model: string;
        currency: string;
    };
    /**
     * @type {() => string}
     */
    get adSurvey(): () => string;
    /**
     * @type {() => string}
     */
    get adAdServingId(): () => string;
    /**
     * @typedef {object} Category
     * @property {string} authority
     * @property {string} value
     * @return {Category[]}
     */
    get adCategories(): {
        authority: string;
        value: string;
    }[];
    /**
     * @typedef {object} BlockedAdCategory
     * @property {string} authority
     * @property {string} value
     * @return {BlockedAdCategory[]}
     */
    get adBlockedAdCategories(): {
        authority: string;
        value: string;
    }[];
    /**
     * @type {() => number}
     */
    get adDuration(): () => number;
    /**
     * @type {() => number}
     */
    get adCurrentTime(): () => number;
    /**
     * @type {() => number}
     */
    get adRemainingTime(): () => number;
    /**
     * @type {() => boolean}
     */
    get adOnStage(): () => boolean;
    /**
     * @type {() => number}
     */
    get adMediaWidth(): () => number;
    /**
     * @type {() => number}
     */
    get adMediaHeight(): () => number;
    /**
     * @type {() => string}
     */
    get clickThroughUrl(): () => string;
    /**
     * @type {() => number}
     */
    get skipTimeOffset(): () => number;
    /**
     * @type {() => boolean}
     */
    get isSkippableAd(): () => boolean;
    /**
     * @param {boolean} value
     * @return {void}
     */
    set contentPlayerCompleted(value: () => boolean);
    /**
     * @type {() => boolean}
     */
    get contentPlayerCompleted(): () => boolean;
    /**
     * @type {() => string}
     */
    get adErrorMessage(): () => string;
    /**
     * @type {() => number}
     */
    get adVastErrorCode(): () => number;
    /**
     * @type {() => string}
     */
    get adErrorType(): () => string;
    /**
     * @type {() => boolean}
     */
    get adSkippableState(): () => boolean;
    /**
     * @return {HTMLMediaElement|null}
     */
    get adPlayer(): HTMLMediaElement;
    /**
     * @return {HTMLMediaElement|null}
     */
    get contentPlayer(): HTMLMediaElement;
    /**
     * @type {() => boolean}
     */
    get initialized(): () => boolean;
    /**
     * @typedef {object} AdPod
     * @property {number} adPodCurrentIndex
     * @property {number} adPodLength
     * @return {AdPod}
     */
    get adPodInfo(): {
        adPodCurrentIndex: number;
        adPodLength: number;
    };
    /**
     * @type {() => string}
     */
    get companionAdsRequiredAttribute(): () => string;
    /**
     * @param {number} inputWidth
     * @param {number} inputHeight
     * @typedef {object} Companion
     * @property {string} adSlotId
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
        adSlotId: string;
        altText: string;
        companionClickThroughUrl: string;
        companionClickTrackingUrl: string;
        height: number;
        width: number;
        imageUrl: string;
        trackingEventsUri: string[];
    }[];
    /**
     * @param {number} index
     * @return {HTMLElement|null}
     */
    getCompanionAd(index: number): HTMLElement | null;
    initialize(): void;
    resizeAd(width: number, height: number, viewMode: string): void;
    expandAd(): void;
    collapseAd(): void;
    /**
     * @type {() => boolean}
     */
    get adExpanded(): () => boolean;
    /**
     * @type {() => string}
     */
    get vpaidCompanionAds(): () => string;
}
import Utils from './helpers/utils';
import ContentPlayer from './players/content-player';
import Tracking from './helpers/tracking';
import CompanionCreative from './creatives/companion';
type Environment = {
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
import Environment from './framework/environment';
import AdPlayer from './players/ad-player';
import LinearCreative from './creatives/linear';
import NonLinearCreative from './creatives/non-linear';
export {};
//# sourceMappingURL=index.d.ts.map