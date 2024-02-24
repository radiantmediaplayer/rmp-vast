// TODO
// Check fullscreen management
// Check common error and error code reporting
// Add non-linear support
// Check mid-post-roll/adpod support
// Evalaute iOS support

import {
  SimidProtocol,
  ProtocolMessage,
  MediaMessage,
  PlayerMessage,
  CreativeMessage,
  CreativeErrorCode,
  PlayerErrorCode,
  StopCode
} from './simid_protocol';
import Utils from '../../framework/utils';
import FW from '../../framework/fw';
import Tracking from '../../tracking/tracking';

const NO_REQUESTED_DURATION = 0;
const UNLIMITED_DURATION = -2;


/** 
 * All the logic for a simple SIMID player
 */
export default class SimidPlayer {

  /**
   * Sets up the creative iframe and starts listening for messages
   * from the creative.
   */
  constructor(url, rmpVast) {
    /**
     * The protocol for sending and receiving messages.
     * @protected {!SimidProtocol}
     */
    this.simidProtocol = new SimidProtocol();

    this.addListeners_();

    this.rmpVast_ = rmpVast;
    this.simidData_ = rmpVast.creative.simid;
    this.adContainer_ = rmpVast.adContainer;
    this.playerDiv_ = rmpVast.contentWrapper;
    this.adPlayerUrl_ = url;
    this.adParameters_ = rmpVast.creative.simid.adParameters;
    this.adId_ = rmpVast.creative.adId;
    this.creativeId_ = rmpVast.creative.id;
    this.adServingId_ = rmpVast.ad.adServingId;
    this.clickThroughUrl_ = rmpVast.creative.clickThroughUrl;


    /**
     * A reference to the video player on the players main page
     * @private {!Element}
     */
    this.contentVideoElement_ = rmpVast.__contentPlayer;

    /**
     * A reference to a video player for playing ads.
     * @private {!Element}
     */
    this.adVideoElement_ = rmpVast.__adPlayer;

    /**
     * A reference to the iframe holding the SIMID creative.
     * @private {?Element}
     */
    this.simidIframe_ = null;

    /**
     * A reference to the promise returned when initialization was called.
     * @private {?Promise}
     */
    this.initializationPromise_ = null;

    /**
     * A map of events tracked on the ad video element.
     * @private {!Map}
     */
    this.adVideoTrackingEvents_ = new Map();

    /**
     * A map of events tracked on the content video element.
     * @private {!Map}
     */
    this.contentVideoTrackingEvents_ = new Map();

    /**
     * A boolean indicating what type of creative ad is.
     * @const @private {boolean}
     */
    this.isLinearAd_ = rmpVast.creative.isLinear;

    /**
     * A number indicating when the non linear ad started.
     * @private {?number}
     */
    this.nonLinearStartTime_ = null;

    /**
     * The duration requested by the ad.
     * @private {number}
     */
    this.requestedDuration_ = NO_REQUESTED_DURATION;

    /**
     * Resolution function for the session created message
     * @private {?Function}
     */
    this.resolveSessionCreatedPromise_ = null;

    /**
     * A promise that resolves once the creative creates a session.
     * @private {!Promise}
     */
    this.sessionCreatedPromise_ = new Promise((resolve) => {
      this.resolveSessionCreatedPromise_ = resolve;
    });

    /**
     * Resolution function for the ad being initialized.
     * @private {?Function}
     */
    this.resolveInitializationPromise_ = null;

    /**
     * Reject function for the ad being initialized.
     * @private {?Function}
     */
    this.rejectInitializationPromise_ = null;

    /**
     * An object containing the resized nonlinear creative's dimensions.
     * @private {?Object}
     */
    this.nonLinearDimensions_ = null;

    /** The unique ID for the interval used to compares the requested change 
     *  duration and the current ad time.
     * @private {number}
     */
    this.durationInterval_ = null;

    /**
     * A promise that resolves once the creative responds to initialization with resolve.
     * @private {!Promise}
     */
    this.initializationPromise_ = new Promise((resolve, reject) => {
      this.resolveInitializationPromise_ = resolve;
      this.rejectInitializationPromise_ = reject;
    });


    this.trackEventsOnAdVideoElement_();
    this.trackEventsOnContentVideoElement_();
    this.hideAdPlayer_();
    console.log(`${FW.consolePrepend} SIMID: player created`, FW.consoleStyle, '');
  }

  /**
   * Initializes an ad. This should be called before an ad plays.
   * Creates an iframe with the creative in it, then uses a promise
   * to call init on the creative as soon as the creative initializes
   * a session.
   */
  initializeAd() {
    if (!this.isLinearAd_ && !this.isValidDimensions_(this.getNonlinearDimensions_())) {
      console.log(`${FW.consolePrepend} SIMID: Unable to play a non-linear ad with dimensions bigger than the player. Please modify dimensions to a smaller size.`, FW.consoleStyle, '');
      return;
    }

    // After the iframe is created the player will wait until the ad
    // initializes the communication channel. Then it will call
    // sendInitMessage.
    this.simidIframe_ = this.createSimidIframe_();

    if (!this.isLinearAd_) {
      this.displayNonlinearCreative_();
    }

    this.requestDuration_ = NO_REQUESTED_DURATION;

    // Prepare for the case that init fails before sending
    // the init message. Initialization failing means abandoning
    // the ad.
    this.initializationPromise_.catch((e) => {
      this.onAdInitializedFailed_(e);
    });

    // Using a promise means that the init message will
    // send as soon as the session is created. If the session
    // is already created this will send the init message immediately.
    this.sessionCreatedPromise_.then(() => {
      this.sendInitMessage_();
    });
    console.log(`${FW.consolePrepend} SIMID: initializeAd`, FW.consoleStyle, '');
  }

  /**
   * Plays a SIMID  creative once it has responded to the initialize ad message.
   */
  playAd() {

    // This example waits for the ad to be initialized, before playing video.
    // NOTE: Not all players will wait for session creation and initialization
    // before they start playback.
    this.initializationPromise_.then(() => {
      this.startCreativePlayback_();
    }).catch(e => {
      console.log(`${FW.consolePrepend} SIMID: playAd failed with following error`, FW.consoleStyle, '');
      console.log(e);
    });
  }

  /** Plays the video ad element. */
  playAdVideo() {
    this.adVideoElement_.play();
  }

  /**
   * Sets up an iframe for holding the simid element.
   *
   * @return {!Element} The iframe where the simid element lives.
   * @private
   */
  createSimidIframe_() {
    const simidIframe = document.createElement('iframe');
    simidIframe.style.display = 'none';
    // The target of the player to send messages to is the newly
    // created iframe.
    this.playerDiv_.appendChild(simidIframe);

    if (this.isLinearAd_) {
      // Set up css to overlay the SIMID iframe over the entire video creative
      // only if linear. Non-linear ads will have dimension inputs for placement
      simidIframe.classList.add('rmp-linear-simid-creative');
    }

    this.simidProtocol.setMessageTarget(simidIframe.contentWindow);
    simidIframe.setAttribute('allowFullScreen', '');
    simidIframe.setAttribute('allow', 'geolocation');
    simidIframe.src = this.simidData_.fileURL;
    return simidIframe;
  }

  /**
   * Listens to all relevant messages from the SIMID add.
   * @private
   */
  addListeners_() {
    this.simidProtocol.addListener(ProtocolMessage.CREATE_SESSION, this.onSessionCreated_.bind(this));
    this.simidProtocol.addListener(CreativeMessage.REQUEST_FULL_SCREEN, this.onRequestFullScreen.bind(this));
    this.simidProtocol.addListener(CreativeMessage.REQUEST_PLAY, this.onRequestPlay.bind(this));
    this.simidProtocol.addListener(CreativeMessage.REQUEST_PAUSE, this.onRequestPause.bind(this));
    this.simidProtocol.addListener(CreativeMessage.FATAL_ERROR, this.onCreativeFatalError.bind(this));
    this.simidProtocol.addListener(CreativeMessage.REQUEST_SKIP, this.onRequestSkip.bind(this));
    this.simidProtocol.addListener(CreativeMessage.REQUEST_STOP, this.onRequestStop.bind(this));
    this.simidProtocol.addListener(CreativeMessage.REQUEST_CHANGE_AD_DURATION,
      this.onRequestChangeAdDuration.bind(this));
    this.simidProtocol.addListener(CreativeMessage.GET_MEDIA_STATE, this.onGetMediaState.bind(this));
    this.simidProtocol.addListener(CreativeMessage.LOG, this.onReceiveCreativeLog.bind(this));
    this.simidProtocol.addListener(CreativeMessage.EXPAND_NONLINEAR, this.onExpandResize.bind(this));
    this.simidProtocol.addListener(CreativeMessage.COLLAPSE_NONLINEAR, this.onCollapse.bind(this));
    this.simidProtocol.addListener(CreativeMessage.REQUEST_RESIZE, this.onRequestResize.bind(this));
  }

  /**
   * Resolves the session created promise.
   * @private
   */
  onSessionCreated_() {
    // Anything that must happen after the session is created can now happen
    // since this promise is resolved.
    this.resolveSessionCreatedPromise_();
  }

  /**
   * Destroys the existing simid iframe.
   * @private
   */
  destroySimidIframe_() {
    if (this.simidIframe_) {
      this.simidIframe_.remove();
      this.simidIframe_ = null;
      this.simidProtocol.reset();
    }
    for (let [key, func] of this.adVideoTrackingEvents_) {
      this.adVideoElement_.removeEventListener(key, func, true);
    }
    for (let [key, func] of this.contentVideoTrackingEvents_) {
      this.contentVideoElement_.removeEventListener(key, func, true);
    }
    this.adVideoTrackingEvents_.clear();
    this.contentVideoTrackingEvents_.clear();
  }

  /**
   * Returns the full dimensions of an element within the player div.
   * @private
   * @return {!Object}
   */
  getFullDimensions_(elem) {
    const videoRect = elem.getBoundingClientRect();

    return {
      'x': 0,
      'y': 0,
      'width': videoRect.width,
      'height': videoRect.height,
    };
  }

  /**
   * Checks whether the input dimensions are valid and fit in the player window.
   * @private
   * @param {!Object} dimensions A dimension that contains x, y, width & height fields.
   * @return {boolean}
   */
  isValidDimensions_(dimensions) {
    const playerRect = this.playerDiv_.getBoundingClientRect();

    const heightFits = parseInt(dimensions.y) + parseInt(dimensions.height) <= parseInt(playerRect.height);
    const widthFits = parseInt(dimensions.x) + parseInt(dimensions.width) <= parseInt(playerRect.width);

    return heightFits && widthFits;
  }

  /**
   * Returns the specified dimensions of the non-linear creative.
   * @private
   * @return {!Object}
   */
  getNonlinearDimensions_() {
    if (this.nonLinearDimensions_) {
      return this.nonLinearDimensions_;
    }
    let newDimensions = {};
    newDimensions.x = document.getElementById('x_val').value;
    newDimensions.y = document.getElementById('y_val').value;
    newDimensions.width = document.getElementById('width').value;
    newDimensions.height = document.getElementById('height').value;
    return newDimensions;
  }

  /** 
   * Validates and displays the non-linear creative.
   * @private
   */
  displayNonlinearCreative_() {
    const newDimensions = this.getNonlinearDimensions_();

    if (!this.isValidDimensions_(newDimensions)) {
      console.log(`${FW.consolePrepend} SIMID: Unable to play a non-linear ad with dimensions bigger than the player. Please modify dimensions to a smaller size.`, FW.consoleStyle, '');
      return;
    } else {
      this.setSimidIframeDimensions_(newDimensions);
      this.simidIframe_.style.position = 'absolute';

      this.contentVideoElement_.play();

      const nonLinearDuration = document.getElementById('duration').value;
      this.requestedDuration_ = nonLinearDuration;
    }
  }

  /**
   * Changes the simid iframe dimensions to the given dimensions.
   * @private
   * @param {!Object} resizeDimensions A dimension that contains an x,y,width & height fields.
   */
  setSimidIframeDimensions_(resizeDimensions) {
    this.simidIframe_.style.height = resizeDimensions.height;
    this.simidIframe_.style.width = resizeDimensions.width;
    this.simidIframe_.style.left = `${resizeDimensions.x}px`;
    this.simidIframe_.style.top = `${resizeDimensions.y}px`;
  }

  /** 
   * The creative wants to expand the ad.
   * @param {!Object} incomingMessage Message sent from the creative to the player
   */
  onExpandResize(incomingMessage) {
    if (this.isLinearAd_) {
      const errorMessage = {
        errorCode: CreativeErrorCode.EXPAND_NOT_POSSIBLE,
        message: 'Linear resize not yet supported.'
      };
      this.simidProtocol.reject(incomingMessage, errorMessage);
      console.log(`${FW.consolePrepend} SIMID: ${errorMessage.message}`, FW.consoleStyle, '');


    } else {
      const fullDimensions = this.getFullDimensions_(this.contentVideoElement_);
      this.setSimidIframeDimensions_(fullDimensions);

      this.contentVideoElement_.pause();
      this.simidProtocol.resolve(incomingMessage);
    }
  }

  /** 
   * The creative wants to collapse the ad. 
   * @param {!Object} incomingMessage Message sent from the creative to the player
   */
  onCollapse(incomingMessage) {
    const newDimensions = this.getNonlinearDimensions_();

    if (this.isLinearAd_) {
      const errorMessage = {
        message: 'Cannot collapse linear ads.'
      };
      this.simidProtocol.reject(incomingMessage, errorMessage);
      console.log(`${FW.consolePrepend} SIMID: ${errorMessage.message}`, FW.consoleStyle, '');

    } else if (!this.isValidDimensions_(newDimensions)) {
      const errorMessage = {
        message: 'Unable to collapse to dimensions bigger than the player. Please modify dimensions to a smaller size.'
      };
      this.simidProtocol.reject(incomingMessage, errorMessage);
      console.log(`${FW.consolePrepend} SIMID: ${errorMessage.message}`, FW.consoleStyle, '');

    } else {
      this.setSimidIframeDimensions_(newDimensions);
      this.simidIframe_.style.position = 'absolute';

      this.contentVideoElement_.play();
      this.simidProtocol.resolve(incomingMessage);
    }
  }

  /**
   * The creative wants to resize the ad.
   * @param {!Object} incomingMessage Message sent from the creative to the player.
   */
  onRequestResize(incomingMessage) {
    if (this.isLinearAd_) {
      const errorMessage = {
        errorCode: CreativeErrorCode.EXPAND_NOT_POSSIBLE,
        message: 'Linear resize not yet supported.'
      };
      this.simidProtocol.reject(incomingMessage, errorMessage);
      console.log(`${FW.consolePrepend} SIMID: ${errorMessage.message}`, FW.consoleStyle, '');

    } else if (!this.isValidDimensions_(incomingMessage.args.creativeDimensions)) {
      const errorMessage = {
        errorCode: CreativeErrorCode.EXPAND_NOT_POSSIBLE,
        message: 'Unable to resize a non-linear ad with dimensions bigger than the player. Please modify dimensions to a smaller size.'
      };
      this.simidProtocol.reject(incomingMessage, errorMessage);
      console.log(`${FW.consolePrepend} SIMID: ${errorMessage.message}`, FW.consoleStyle, '');

    } else {
      this.nonLinearDimensions_ = incomingMessage.args.creativeDimensions;
      this.setSimidIframeDimensions_(incomingMessage.args.creativeDimensions);
      this.simidProtocol.resolve(incomingMessage);
    }
  }

  /**
   * Initializes the SIMID creative with all data it needs.
   * @private
   */
  sendInitMessage_() {
    const videoDimensions = this.getFullDimensions_(this.contentVideoElement_);
    // Since the creative starts as hidden it will take on the
    // video element dimensions, so tell the ad about those dimensions.
    const creativeDimensions = this.isLinearAd_ ?
      this.getFullDimensions_(this.contentVideoElement_) :
      this.getNonlinearDimensions_();

    const environmentData = {
      'videoDimensions': videoDimensions,
      'creativeDimensions': creativeDimensions,
      'fullscreen': false,
      'fullscreenAllowed': true,
      'variableDurationAllowed': true,
      'skippableState': 'adHandles', // This player does not render a skip button.
      'siteUrl': document.location.host,
      'appId': '', // This is not relevant on desktop
      'useragent': window.navigator.userAgent, // This should be filled in for sdks and players
      'deviceId': '', // This should be filled in on mobile
      'muted': this.adVideoElement_.muted,
      'volume': this.adVideoElement_.volume
    };

    const creativeData = {
      'adParameters': this.adParameters_,
      // These values should be populated from the VAST response.
      'adId': this.adId_,
      'creativeId': this.creativeId_,
      'adServingId': this.adServingId_,
      'clickThroughUrl': this.clickThroughUrl_
    };

    if (!this.isLinearAd_) {
      creativeData['duration'] = document.getElementById('duration').value;
    }

    const initMessage = {
      'environmentData': environmentData,
      'creativeData': creativeData
    };
    const initPromise = this.simidProtocol.sendMessage(
      PlayerMessage.INIT, initMessage);
    initPromise.then((args) => {
      this.resolveInitializationPromise_(args);
    }).catch((args) => {
      this.rejectInitializationPromise_(args);
    });
  }

  /**
   * Called once the creative responds positively to being initialized.
   * @private
   */
  startCreativePlayback_() {
    // Once the ad is successfully initialized it can start.
    // If the ad is not visible it must be made visible here.
    this.showSimidIFrame_();

    if (this.isLinearAd_) {
      this.playLinearVideoAd_();
    } else {
      this.nonLinearStartTime_ = this.contentVideoElement_.currentTime;
      this.contentVideoElement_.play();
    }

    this.simidProtocol.sendMessage(PlayerMessage.START_CREATIVE);
    // TODO: handle creative rejecting startCreative message.
  }

  /** 
   * Pauses content video and plays linear ad.
   * @private 
   */
  playLinearVideoAd_() {
    this.contentVideoElement_.pause();
    this.showAdPlayer_();
    this.adVideoElement_.src = this.adPlayerUrl_;
    // we need this extra load for Chrome data saver mode in mobile or desktop
    this.adVideoElement_.load();
    this.adVideoElement_.play();
  }

  /**
   * Called if the creative responds with reject after the player
   * initializes the ad.
   * @param {!Object} data
   * @private
   */
  onAdInitializedFailed_(data) {
    const errorData = JSON.stringify(data);
    console.log(`${FW.consolePrepend} SIMID: Ad init failed. ${errorData}`, FW.consoleStyle, '');
    this.destroyIframeAndResumeContent_(true, errorData.errorCode);
  }

  /** @private */
  hideSimidIFrame_() {
    this.simidIframe_.style.display = 'none';
  }

  /** @private */
  showSimidIFrame_() {
    this.simidIframe_.style.display = 'block';
  }

  /** @private */
  showAdPlayer_() {
    // show the ad video element
    this.adVideoElement_.style.display = 'block';
    this.adContainer_.style.display = 'block';
  }

  /** @private */
  hideAdPlayer_() {
    // Unload the video
    this.adVideoElement_.style.display = 'none';
    this.adContainer_.style.display = 'none';
  }

  /**
   * Tracks the events on the ad video element specified by the simid spec
   * @private
   */
  trackEventsOnAdVideoElement_() {
    this.adVideoTrackingEvents_.set('durationchange', () => {
      this.simidProtocol.sendMessage(MediaMessage.DURATION_CHANGE,
        { 'duration': this.adVideoElement_.duration });
    });
    this.adVideoTrackingEvents_.set('ended', this.videoComplete.bind(this));
    this.adVideoTrackingEvents_.set('error', () => {
      this.simidProtocol.sendMessage(MediaMessage.ERROR,
        {
          'error': '',  // TODO fill in these values correctly
          'message': ''
        });
    });
    this.adVideoTrackingEvents_.set('pause', () => {
      this.simidProtocol.sendMessage(MediaMessage.PAUSE);
    });
    this.adVideoTrackingEvents_.set('play', () => {
      this.simidProtocol.sendMessage(MediaMessage.PLAY);
    });
    this.adVideoTrackingEvents_.set('playing', () => {
      this.simidProtocol.sendMessage(MediaMessage.PLAYING);
    });
    this.adVideoTrackingEvents_.set('seeked', () => {
      this.simidProtocol.sendMessage(MediaMessage.SEEKED);
    });
    this.adVideoTrackingEvents_.set('seeking', () => {
      this.simidProtocol.sendMessage(MediaMessage.SEEKING);
    });
    this.adVideoTrackingEvents_.set('timeupdate', () => {
      this.simidProtocol.sendMessage(MediaMessage.TIME_UPDATE,
        { 'currentTime': this.adVideoElement_.currentTime });
      this.compareAdAndRequestedDurations_();
    });
    this.adVideoTrackingEvents_.set('volumechange', () => {
      this.simidProtocol.sendMessage(MediaMessage.VOLUME_CHANGE,
        { 'volume': this.adVideoElement_.volume });
    });

    for (let [key, func] of this.adVideoTrackingEvents_) {
      this.adVideoElement_.addEventListener(key, func, true);
    }
  }

  /**
   * Tracks the events on the content video element.
   * @private
   */
  trackEventsOnContentVideoElement_() {
    this.contentVideoTrackingEvents_.set('timeupdate', () => {
      if (this.nonLinearStartTime_ !== null &&
        (this.contentVideoElement_.currentTime - this.nonLinearStartTime_ > this.requestedDuration_)) {
        this.stopAd(StopCode.NON_LINEAR_DURATION_COMPLETE);
      }
    });

    for (let [key, func] of this.contentVideoTrackingEvents_) {
      this.contentVideoElement_.addEventListener(key, func, true);
    }
  }

  /**
   * Stops the ad and destroys the ad iframe.
   * @param {StopCode} reason The reason the ad will stop.
   */
  stopAd(reason = StopCode.PLAYER_INITATED, error, errorCode) {
    // The iframe is only hidden on ad stoppage. The ad might still request
    // tracking pixels before it is cleaned up.
    if (this.simidIframe_) {
      this.hideSimidIFrame_();
      /*const closeMessage = {
        'code': reason,
      };*/
      // Wait for the SIMID creative to acknowledge stop and then clean
      // up the iframe.
      console.log(`${FW.consolePrepend} SIMID: stopAd ${reason}`, FW.consoleStyle, '');
      this.simidProtocol.sendMessage(PlayerMessage.AD_STOPPED)
        .then(() => this.destroyIframeAndResumeContent_(error, errorCode));
    }
  }

  /**
   * Skips the ad and destroys the ad iframe.
   */
  skipAd() {
    // The iframe is only hidden on ad skipped. The ad might still request
    // tracking pixels before it is cleaned up.
    this.hideSimidIFrame_();
    // Wait for the SIMID creative to acknowledge skip and then clean
    // up the iframe.
    this.simidProtocol.sendMessage(PlayerMessage.AD_SKIPPED)
      .then(() => this.destroyIframeAndResumeContent_());
  }

  /**
   * Removes the simid ad entirely and resumes video playback.
   * @private
   */
  destroyIframeAndResumeContent_(error, errorCode) {
    //this.hideAdPlayer_();
    //this.adVideoElement_.src = '';
    this.destroySimidIframe_();
    //this.contentVideoElement_.play();
    if (error) {
      Utils.processVastErrors.call(this.rmpVast_, errorCode, true);
    } else if (this.rmpVast_.rmpVastAdPlayer) {
      this.rmpVast_.rmpVastAdPlayer.resumeContent();
    }
  }

  /** The creative wants to go full screen. */
  onRequestFullScreen(incomingMessage) {
    // The spec currently says to only request fullscreen for the iframe.
    let promise = null;
    if (this.simidIframe_.requestFullscreen) {
      promise = this.simidIframe_.requestFullscreen();
    } else if (this.simidIframe_.mozRequestFullScreen) {
      // Our tests indicate firefox will probably not respect the request.
      promise = this.simidIframe_.mozRequestFullScreen();
    } else if (this.simidIframe_.webkitRequestFullscreen) {
      promise = this.simidIframe_.webkitRequestFullscreen();
    } else if (this.simidIframe_.msRequestFullscreen) {
      // Our tests indicate IE will probably not respect the request.
      promise = this.simidIframe_.msRequestFullscreen();
    }
    if (promise) {
      promise.then(() => this.simidProtocol.resolve(incomingMessage));
    } else {
      // TODO: Many browsers are not returning promises but are still
      // going full screen. Assuming resolve (bad).
      this.simidProtocol.resolve(incomingMessage);
    }
  }

  /** The creative wants to play video. */
  onRequestPlay(incomingMessage) {
    if (this.isLinearAd_) {
      this.adVideoElement_.play()
        .then(() => this.simidProtocol.resolve(incomingMessage))
        .catch(() => {
          const errorMessage = {
            errorCode: PlayerErrorCode.VIDEO_COULD_NOT_LOAD,
            message: 'The SIMID media could not be loaded.'
          };
          this.simidProtocol.reject(incomingMessage, errorMessage);
        });
    } else {
      const errorMessage = {
        errorCode: CreativeErrorCode.PLAYBACK_AREA_UNUSABLE,
        message: 'Non linear ads do not play video.'
      };
      this.simidProtocol.reject(incomingMessage, errorMessage);
    }
  }

  /** The creative wants to pause video. */
  onRequestPause(incomingMessage) {
    this.adVideoElement_.pause();
    this.simidProtocol.resolve(incomingMessage);
  }

  /** Pauses the video ad element. */
  pauseAd() {
    this.adVideoElement_.pause();
  }

  /** The creative wants to stop with a fatal error. */
  onCreativeFatalError(incomingMessage) {
    this.simidProtocol.resolve(incomingMessage);
    this.stopAd(StopCode.CREATIVE_INITIATED, true, 1100);
  }

  /** The creative wants to skip this ad. */
  onRequestSkip(incomingMessage) {
    this.simidProtocol.resolve(incomingMessage);
    this.skipAd();
  }

  /** The creative wants to stop the ad early. */
  onRequestStop(incomingMessage) {
    this.simidProtocol.resolve(incomingMessage);
    this.stopAd(StopCode.CREATIVE_INITIATED);
  }

  /**
   * The player must implement sending tracking pixels from the creative.
   * This sample implementation does not show how to send tracking pixels or
   * replace macros. That should be done using the players standard workflow.
   */
  onReportTracking(incomingMessage) {
    const requestedUrlArray = incomingMessage.args['trackingUrls'];
    requestedUrlArray.forEach(url => {
      Tracking.pingURI.call(this.rmpVast_, url);
    });

    console.log(`${FW.consolePrepend} SIMID: The creative has asked for the player to ping ${requestedUrlArray}`, FW.consoleStyle, '');
  }

  /**
   * Called when video playback is complete.
   * @private
   */
  videoComplete() {
    this.simidProtocol.sendMessage(MediaMessage.ENDED);

    if (this.requestedDuration_ == NO_REQUESTED_DURATION) {
      this.stopAd(StopCode.MEDIA_PLAYBACK_COMPLETE);
    }

    //If the request duration is longer than the ad duration, the ad extends for the requested amount of time
    else if (this.requestedDuration_ != UNLIMITED_DURATION) {
      const durationChangeMs = (this.requestedDuration_ - this.adVideoElement_.duration) * 1000;
      setTimeout(() => {
        this.stopAd(StopCode.CREATIVE_INITIATED);
      }, durationChangeMs);
    }
  }

  /**
   * Called when creative requests a change in duration of ad.
   * @private
   */
  onRequestChangeAdDuration(incomingMessage) {
    const newRequestedDuration = incomingMessage.args['duration'];
    if (newRequestedDuration != UNLIMITED_DURATION && newRequestedDuration < 0) {
      const durationErrorMessage = {
        errorCode: PlayerErrorCode.UNSUPPORTED_TIME,
        message: 'A negative duration is not valid.'
      };
      this.simidProtocol.reject(incomingMessage, durationErrorMessage);
    }
    else {
      this.requestedDuration_ = newRequestedDuration;
      //If requested duration is any other acceptable value
      this.compareAdAndRequestedDurations_();
      this.simidProtocol.resolve(incomingMessage);
    }
  }

  /**
   * Compares the duration of the ad with the requested change duration.
   * If request duration is the same as the ad duration, ad ends as normal.
   * If request duration is unlimited, ad stays on screen until user closes ad.
   * If request duration is shorter, the ad stops early. 
   * @private
   */
  compareAdAndRequestedDurations_() {
    if (this.requestedDuration_ == NO_REQUESTED_DURATION ||
      this.requestedDuration_ == UNLIMITED_DURATION) {
      //Note: Users can end the ad with unlimited duration with
      // the close ad button on the player
      return;
    }
    else if (this.adVideoElement_.currentTime >= this.requestedDuration_) {
      //Creative requested a duration shorter than the ad
      this.stopAd(StopCode.CREATIVE_INITATED);
    }
  }

  onGetMediaState(incomingMessage) {
    const mediaState = {
      'currentSrc': this.adVideoElement_.currentSrc,
      'currentTime': this.adVideoElement_.currentTime,
      'duration': this.adVideoElement_.duration,
      'ended': this.adVideoElement_.ended,
      'muted': this.adVideoElement_.muted,
      'paused': this.adVideoElement_.paused,
      'volume': this.adVideoElement_.volume,
      'fullscreen': this.adVideoElement_.fullscreen,
    };
    this.simidProtocol.resolve(incomingMessage, mediaState);
  }

  onReceiveCreativeLog(incomingMessage) {
    const logMessage = incomingMessage.args['message'];
    console.log(`${FW.consolePrepend} SIMID: Received message from creative: ${logMessage}`, FW.consoleStyle, '');
  }

  sendLog(outgoingMessage) {
    const logMessage = {
      'message': outgoingMessage,
    };
    this.simidProtocol.sendMessage(PlayerMessage.LOG, logMessage);
  }
}
