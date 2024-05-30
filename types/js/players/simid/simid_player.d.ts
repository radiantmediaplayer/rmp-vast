/**
 * All the logic for a simple SIMID player
 */
export default class SimidPlayer {
    /**
     * Sets up the creative iframe and starts listening for messages
     * from the creative.
     */
    constructor(url: any, rmpVast: any);
    /**
     * The protocol for sending and receiving messages.
     * @protected {!SimidProtocol}
     */
    protected simidProtocol: SimidProtocol;
    rmpVast_: any;
    _debugRawConsoleLogs: any;
    simidData_: any;
    adContainer_: any;
    playerDiv_: any;
    adPlayerUrl_: any;
    adParameters_: any;
    adId_: any;
    creativeId_: any;
    adServingId_: any;
    clickThroughUrl_: any;
    /**
     * A reference to the video player on the players main page
     * @private {!Element}
     */
    private contentVideoElement_;
    /**
     * A reference to a video player for playing ads.
     * @private {!Element}
     */
    private adVideoElement_;
    /**
     * A reference to the iframe holding the SIMID creative.
     * @private {?Element}
     */
    private simidIframe_;
    /**
     * A reference to the promise returned when initialization was called.
     * @private {?Promise}
     */
    private initializationPromise_;
    /**
     * A map of events tracked on the ad video element.
     * @private {!Map}
     */
    private adVideoTrackingEvents_;
    /**
     * A map of events tracked on the content video element.
     * @private {!Map}
     */
    private contentVideoTrackingEvents_;
    /**
     * A boolean indicating what type of creative ad is.
     * @const @private {boolean}
     */
    private isLinearAd_;
    /**
     * A number indicating when the non linear ad started.
     * @private {?number}
     */
    private nonLinearStartTime_;
    /**
     * The duration requested by the ad.
     * @private {number}
     */
    private requestedDuration_;
    /**
     * Resolution function for the session created message
     * @private {?Function}
     */
    private resolveSessionCreatedPromise_;
    /**
     * A promise that resolves once the creative creates a session.
     * @private {!Promise}
     */
    private sessionCreatedPromise_;
    /**
     * Resolution function for the ad being initialized.
     * @private {?Function}
     */
    private resolveInitializationPromise_;
    /**
     * Reject function for the ad being initialized.
     * @private {?Function}
     */
    private rejectInitializationPromise_;
    /**
     * An object containing the resized nonlinear creative's dimensions.
     * @private {?Object}
     */
    private nonLinearDimensions_;
    /** The unique ID for the interval used to compares the requested change
     *  duration and the current ad time.
     * @private {number}
     */
    private durationInterval_;
    /**
     * Initializes an ad. This should be called before an ad plays.
     * Creates an iframe with the creative in it, then uses a promise
     * to call init on the creative as soon as the creative initializes
     * a session.
     */
    initializeAd(): void;
    requestDuration_: number;
    /**
     * Plays a SIMID  creative once it has responded to the initialize ad message.
     */
    playAd(): void;
    /** Plays the video ad element. */
    playAdVideo(): void;
    /**
     * Sets up an iframe for holding the simid element.
     *
     * @return {!Element} The iframe where the simid element lives.
     * @private
     */
    private createSimidIframe_;
    /**
     * Listens to all relevant messages from the SIMID add.
     * @private
     */
    private addListeners_;
    /**
     * Resolves the session created promise.
     * @private
     */
    private onSessionCreated_;
    /**
     * Destroys the existing simid iframe.
     * @private
     */
    private destroySimidIframe_;
    /**
     * Returns the full dimensions of an element within the player div.
     * @private
     * @return {!Object}
     */
    private getFullDimensions_;
    /**
     * Checks whether the input dimensions are valid and fit in the player window.
     * @private
     * @param {!Object} dimensions A dimension that contains x, y, width & height fields.
     * @return {boolean}
     */
    private isValidDimensions_;
    /**
     * Returns the specified dimensions of the non-linear creative.
     * @private
     * @return {!Object}
     */
    private getNonlinearDimensions_;
    /**
     * Validates and displays the non-linear creative.
     * @private
     */
    private displayNonlinearCreative_;
    /**
     * Changes the simid iframe dimensions to the given dimensions.
     * @private
     * @param {!Object} resizeDimensions A dimension that contains an x,y,width & height fields.
     */
    private setSimidIframeDimensions_;
    /**
     * The creative wants to expand the ad.
     * @param {!Object} incomingMessage Message sent from the creative to the player
     */
    onExpandResize(incomingMessage: any): void;
    /**
     * The creative wants to collapse the ad.
     * @param {!Object} incomingMessage Message sent from the creative to the player
     */
    onCollapse(incomingMessage: any): void;
    /**
     * The creative wants to resize the ad.
     * @param {!Object} incomingMessage Message sent from the creative to the player.
     */
    onRequestResize(incomingMessage: any): void;
    /**
     * Initializes the SIMID creative with all data it needs.
     * @private
     */
    private sendInitMessage_;
    /**
     * Called once the creative responds positively to being initialized.
     * @private
     */
    private startCreativePlayback_;
    /**
     * Pauses content video and plays linear ad.
     * @private
     */
    private playLinearVideoAd_;
    /**
     * Called if the creative responds with reject after the player
     * initializes the ad.
     * @param {!Object} data
     * @private
     */
    private onAdInitializedFailed_;
    /** @private */
    private hideSimidIFrame_;
    /** @private */
    private showSimidIFrame_;
    /** @private */
    private showAdPlayer_;
    /** @private */
    private hideAdPlayer_;
    /**
     * Tracks the events on the ad video element specified by the simid spec
     * @private
     */
    private trackEventsOnAdVideoElement_;
    /**
     * Tracks the events on the content video element.
     * @private
     */
    private trackEventsOnContentVideoElement_;
    /**
     * Stops the ad and destroys the ad iframe.
     * @param {StopCode} reason The reason the ad will stop.
     */
    stopAd(reason: {
        UNSPECIFIED: number;
        USER_INITIATED: number;
        MEDIA_PLAYBACK_COMPLETE: number;
        PLAYER_INITATED: number;
        CREATIVE_INITIATED: number;
        NON_LINEAR_DURATION_COMPLETE: number;
    }, error: any, errorCode: any): void;
    /**
     * Skips the ad and destroys the ad iframe.
     */
    skipAd(): void;
    /**
     * Removes the simid ad entirely and resumes video playback.
     * @private
     */
    private destroyIframeAndResumeContent_;
    /** The creative wants to go full screen. */
    onRequestFullScreen(incomingMessage: any): void;
    /** The creative wants to play video. */
    onRequestPlay(incomingMessage: any): void;
    /** The creative wants to pause video. */
    onRequestPause(incomingMessage: any): void;
    /** Pauses the video ad element. */
    pauseAd(): void;
    /** The creative wants to stop with a fatal error. */
    onCreativeFatalError(incomingMessage: any): void;
    /** The creative wants to skip this ad. */
    onRequestSkip(incomingMessage: any): void;
    /** The creative wants to stop the ad early. */
    onRequestStop(incomingMessage: any): void;
    /**
     * The player must implement sending tracking pixels from the creative.
     * This sample implementation does not show how to send tracking pixels or
     * replace macros. That should be done using the players standard workflow.
     */
    onReportTracking(incomingMessage: any): void;
    /**
     * Called when video playback is complete.
     * @private
     */
    private videoComplete;
    /**
     * Called when creative requests a change in duration of ad.
     * @private
     */
    private onRequestChangeAdDuration;
    /**
     * Compares the duration of the ad with the requested change duration.
     * If request duration is the same as the ad duration, ad ends as normal.
     * If request duration is unlimited, ad stays on screen until user closes ad.
     * If request duration is shorter, the ad stops early.
     * @private
     */
    private compareAdAndRequestedDurations_;
    onGetMediaState(incomingMessage: any): void;
    onReceiveCreativeLog(incomingMessage: any): void;
    sendLog(outgoingMessage: any): void;
}
import { SimidProtocol } from './simid_protocol';
//# sourceMappingURL=simid_player.d.ts.map