goog.module('omid.common.constants');

/**
 * List of all OMID ad event types.
 * @enum {string}
 * @public
 */
const AdEventType = {
  // Common ad event types

  /**
   * The OMID provider has recorded an impression for this ad.
   * For video ads, this corresponds to the VAST &lt;Impression&gt; and should
   * be fired simultaneously with that event.
   * Constant has value 'impression'.
   */
  IMPRESSION: 'impression',

  /**
   * The OM integration has loaded the display, video, or audio ad creative's
   * assets.  For video and audio ads, it has buffered the creative’s media to
   * the extent that it is ready to play the media.
   * Corresponds to the VAST 'loaded' event.
   * Constant has value 'loaded'.
   */
  LOADED: 'loaded',

  /**
   * The geometry state has changed. Specifically, this event is fired every
   * time the ad container state changes such that any field of the viewport or
   * ad view would change value from the previous report.
   * Provides full geometry data of the registered ad view including
   * obstructions along with any detected reason codes.
   * All size and location units reported in the event data are in
   * independent pixels, and all coordinates are relative to the screen
   * coordinates.
   * Constant has value 'geometryChange'.
   */
  GEOMETRY_CHANGE: 'geometryChange',

  // Session related event types

  /**
   * This event fires as soon as the OMID provider has initialized and has the
   * necessary data to fill in the 'context' and 'verificationParameters' of the
   * event data.
   * It does not imply that the ad has rendered or the video has started
   * playing; it only marks the initialization of the of the ad session.
   * This is always the first event fired for a session.
   * Constant has value 'sessionStart'.
   */
  SESSION_START: 'sessionStart',

  /**
   * This event is fired following a playback, rendering, or other ad-related
   * error, which may be session terminal or recoverable.
   * In the case of non-recoverable errors, this event does not replace
   * 'sessionFinish', which still must be fired following the 'sessionError'
   * event.
   * Constant has value 'sessionError'.
   */
  SESSION_ERROR: 'sessionError',

  /**
   * This event is fired when the ad session has terminated and indicates that
   * verification resources should start clean up and handle end-of-session
   * reporting.
   * This is the always the last event sent for a session.
   * Constant has value 'sessionFinish'.
   */
  SESSION_FINISH: 'sessionFinish',

  // Media ad event types

  /**
   * Convenient shorthand that registers for all media events:
   * 'loaded', 'start', 'firstQuartile', 'midpoint', 'thirdQuartile',
   * 'complete', 'pause', 'resume', 'bufferStart', 'bufferFinish', 'skipped',
   * 'volumeChange', 'playerStateChange', and 'adUserInteraction'.
   * OM SDK never sends events with this type.
   * Constant has value 'media'.
   */
  MEDIA: 'media',

  /**
   * Registers for the same events as 'media'.
   * Superseded by value 'media'; OM SDK continues to support this value for
   * backwards compatibility.
   * OM SDK never sends events with this type.
   * Constant has value 'video'.
   */
  VIDEO: 'video',

  /**
   * Media-only event. The player began playback of the video ad creative.
   * Corresponds to the VAST 'start' event.
   * Constant has value 'start'.
   */
  START: 'start',

  /**
   * Media-only event. The creative played continuously for at least 25% of the
   * total duration.
   * Corresponds to the VAST 'firstQuartile' event.
   * Constant has value 'firstQuartile'.
   */
  FIRST_QUARTILE: 'firstQuartile',

  /**
   * Media-only event. The creative played continuously for at least 50% of the
   * total duration.
   * Corresponds to the VAST midpoint event.
   * Constant has value 'midpoint'.
   */
  MIDPOINT: 'midpoint',

  /**
   * Media-only event. The creative played continuously for at least 75% of the
   * total duration.
   * Corresponds to the VAST 'thirdQuartile' event.
   * Constant has value 'thirdQuartile'.
   */
  THIRD_QUARTILE: 'thirdQuartile',

  /**
   * Media-only event. The creative played to the end for 100% of the total
   * duration.
   * Corresponds to the VAST 'complete' event.
   * Constant has value 'complete'.
   */
  COMPLETE: 'complete',

  /**
   * Media-only event. Playback was stopped in a way from which it may later be
   * resumed, due to user interaction.
   * Corresponds to the VAST 'pause' event.
   * Constant has value 'pause'.
   */
  PAUSE: 'pause',

  /**
   * Media-only event. Playback resumed following a user-originated pause.
   * Corresponds to the VAST 'resume' event.
   * Constant has value 'resume'.
   */
  RESUME: 'resume',

  /**
   * Media-only event. Playback was stopped in a way from which it may later be
   * resumed, due to a cause other than user interaction (generally buffering
   * from insufficient available video data).
   * Constant has value 'bufferStart'.
   */
  BUFFER_START: 'bufferStart',

  /**
   * Media-only event. Playback has resumed following a non-user-originated
   * pause.
   * Constant has value 'bufferFinish'.
   */
  BUFFER_FINISH: 'bufferFinish',

  /**
   * Media-only event. The user activated a control which caused ad playback
   * to terminate. Corresponds to the VAST 'skip' event.
   * Constant has value 'skipped'.
   */
  SKIPPED: 'skipped',

  /**
   * Media-only event. The player and/or device volume has changed.
   * Constant has value 'volumeChange'.
   */
  VOLUME_CHANGE: 'volumeChange',

  /**
   * Media-only event. The player has changed playback states, generally to
   * resize. This includes moving from non-fullscreen to fullscreen state.
   * The assumption is that at start time the video is in the normal state.
   * If playback begins when the player is in a minimized or fullscreen state,
   * then this event is fired immediately following start in order to reflect
   * the current state.
   * Constant has value 'playerStateChange'.
   */
  PLAYER_STATE_CHANGE: 'playerStateChange',

  /**
   * The user has interacted with the ad outside of any standard playback
   * controls (e.g. clicked the ad to load an ad landing page).
   * NOTE: If this interaction causes playback to pause, then this event should
   * be followed by a separate 'pause' event.
   * Constant has value 'adUserInteraction'.
   */
  AD_USER_INTERACTION: 'adUserInteraction',

  // TODO(OMSDK-719): Remove the following unused constant.

  /**
   * Not part of OMID API, and OM SDK never sends events with this type.
   * This constant will be removed in a future release of OM SDK.
   */
  STATE_CHANGE: 'stateChange',
};

/**
 * Enum for ad events type representing media events.
 * @enum {string}
 */

const MediaEventType = {
  // Media ad event types
  LOADED: 'loaded',
  START: 'start',
  FIRST_QUARTILE: 'firstQuartile',
  MIDPOINT: 'midpoint',
  THIRD_QUARTILE: 'thirdQuartile',
  COMPLETE: 'complete',
  PAUSE: 'pause',
  RESUME: 'resume',
  BUFFER_START: 'bufferStart',
  BUFFER_FINISH: 'bufferFinish',
  SKIPPED: 'skipped',
  VOLUME_CHANGE: 'volumeChange',
  PLAYER_STATE_CHANGE: 'playerStateChange',
  AD_USER_INTERACTION: 'adUserInteraction',
};

/**
 * The criterion for an ad session’s OMID impression event.
 * Declaring an impression type makes it easier to understand discrepancies
 * between measurers of the ad session, since many metrics depend on
 * impressions.
 * @enum {string}
 * @public
 */
const ImpressionType = {
  /**
   * Impression type needs to be set by JavaScript session script.
   * Constant has value 'definedByJavaScript'.
   */
  DEFINED_BY_JAVASCRIPT: 'definedByJavaScript',
  /**
   * The integration is not declaring the criteria for the OMID impression.
   * This is the default impression type for OMID 1.2 and for integrations that
   * don't set an impression type in an ad session.
   * Constant has value 'unspecified'.
   */
  UNSPECIFIED: 'unspecified',
  /**
   * The integration is using count-on-download criteria for the OMID impression.
   * Constant has value 'loaded'.
   */
  LOADED: 'loaded',
  /**
   * The integration is uing begin-to-render criteria for the OMID impression.
   * Constant has value 'beginToRender'.
   */
  BEGIN_TO_RENDER: 'beginToRender',
  /**
   * The integration is using one-pixel criteria for the OMID impression.
   * Constant has value 'onePixel'.
   */
  ONE_PIXEL: 'onePixel',
  /**
   * The integration is using viewable criteria (1 second for display, 2 seconds
   * for video) for the OMID impression.
   * Constant has value 'viewable'.
   */
  VIEWABLE: 'viewable',
  /**
   * The integration is using audible criteria (2 seconds of playback with
   * non-zero volume) for the OMID impression.
   * Constant has value 'audible'.
   */
  AUDIBLE: 'audible',
  /**
   * The integration's criteria uses none the above for the OMID impression.
   * Constant has value 'other'.
   */
  OTHER: 'other',
};

/**
 * The types of error notifications in 'sessionError' events.
 * @enum {string}
 * @public
 */
const ErrorType = {
  /**
   * The integration is publishing a generic error to verification scripts.
   * Used as a catch-all for non-media issues.
   * Constant has value 'generic'.
   */
  GENERIC: 'generic',
  /**
   * The integration is publishing a video error to verification scripts.
   * Used for video-related rendering or loading errors.
   * This type of error has been superseded by 'media'.
   * Constant has value 'video'.
   */
  VIDEO: 'video',
  /**
   * The integration is publishing a media error to verification scripts.
   * Used for media-related rendering or loading errors.
   * Constant has value 'media'.
   */
  MEDIA: 'media',
};

/**
 * Enum for Ad Session Type. Possible values include; "native" or "html"
 * or "javascript".
 * @enum {string}
 */
const AdSessionType = {
  NATIVE: 'native',
  HTML: 'html',
  JAVASCRIPT: 'javascript',
};

/**
 * Enum describing who owns an event type.
 * @enum {string}
 */
const EventOwner = {
  NATIVE: 'native',
  JAVASCRIPT: 'javascript',
  NONE: 'none',
};

/**
 * Enum for sandboxing mode. FULL implies both that verification code has access
 * to the creative element and that OMSDK will provide a reference to that
 * creative element via video/slotElement in the context.
 * @enum {string}
 */
const AccessMode = {
  FULL: 'full',
  DOMAIN: 'domain',
  LIMITED: 'limited',
};

/**
 * Enum for state of the native app.
 * @enum {string}
 */
const AppState = {
  BACKGROUNDED: 'backgrounded',
  FOREGROUNDED: 'foregrounded',
};

/**
 * Enum for Environment OM SDK JS is running in.
 * @enum {string}
 */
const Environment = {
  APP: 'app',
  WEB: 'web',
};

/**
 * Enum for category of device OM SDK is running on.
 * @enum {string}
 */
const DeviceCategory = {
  CTV: 'ctv',
  DESKTOP: 'desktop',
  MOBILE: 'mobile',
  OTHER: 'other',
};

/**
 * The types of user interactions with ads in a media player.
 * @enum {string}
 * @public
 */
const InteractionType = {
  /**
   * The user clicked to load the ad's landing page.
   * Constant has value 'click'.
   */
  CLICK: 'click',
  /**
   * The user engaged with ad content to load a separate experience.
   * Constant has value 'invitationAccept'.
   */
  INVITATION_ACCEPT: 'invitationAccept',
};

/**
 * The type of ad creative being measured in the ad session.
 * @enum {string}
 * @public
 */
const CreativeType = {
  /**
   * Creative type needs to be set by JavaScript session script.
   * Constant has value 'definedByJavaScript'.
   */
  DEFINED_BY_JAVASCRIPT: 'definedByJavaScript',
  /**
   * Creatives measured using display methodology that are trafficked as HTML.
   * Rendered in webview.
   * Verification scripts can wrap creative or be in resources.
   * Constant has value 'htmlDisplay'.
   */
  HTML_DISPLAY: 'htmlDisplay',
  /**
   * Creatives measured using display methodology that are trafficked as JSON
   * or other format for structured data.
   * Rendered by native code.
   * Verification scripts can be in resources only.
   * Constant has value 'nativeDisplay'.
   */
  NATIVE_DISPLAY: 'nativeDisplay',
  /**
   * Creatives measured using video methodology.
   * Rendered in many kinds of placements (such as instream, outstream, banner,
   * in-feed, etc.).
   * Verification scripts can be in resources only.
   * Constant has value 'video'.
   */
  VIDEO: 'video',
  /**
   * Creatives measured using audio methodology.
   * OMID does not provide any visibility data.
   * Verification scripts can be in resources only.
   * Constant has value 'audio'.
   */
  AUDIO: 'audio',
};

/**
 * Type of ad media.
 * @enum {string}
 */
const MediaType = {
  DISPLAY: 'display',
  VIDEO: 'video',
};

/**
 * Enum for reasons for viewability calculation results.
 * @enum {string}
 */
const Reason = {
  NOT_FOUND: 'notFound',
  HIDDEN: 'hidden',
  BACKGROUNDED: 'backgrounded',
  VIEWPORT: 'viewport',
  OBSTRUCTED: 'obstructed',
  CLIPPED: 'clipped',
  UNMEASURABLE: 'unmeasurable',
  NO_WINDOW_FOCUS: 'noWindowFocus',
  NO_OUTPUT_DEVICE: 'noOutputDevice',
};

/**
 * Enum for features supported by OM SDK JS.
 * @enum {string}
 */
const SupportedFeatures = {
  CONTAINER: 'clid',
  VIDEO: 'vlid',
};

/**
 * The positions of ads relative to media content.
 * @enum {string}
 * @public
 */
const VideoPosition = {
  /**
   * The ad plays preceding media content.
   * Constant has value 'preroll'.
   */
  PREROLL: 'preroll',
  /**
   * The ad plays in the middle of media content, or between two separate
   * content media.
   * Constant has value 'midroll'.
   */
  MIDROLL: 'midroll',
  /**
   * The ad plays following media content.
   * Constant has value 'postroll'.
   */
  POSTROLL: 'postroll',
  /**
   * The ad plays independently of any media content.
   * Constant has value 'standalone'.
   */
  STANDALONE: 'standalone',
};

/**
 * The playback states of the ad media player.
 * @enum {string}
 * @public
 */
const VideoPlayerState = {
  /**
   * The player is collapsed in such a way that the video is hidden.
   * The video may or may not still be progressing in this state, and sound may
   * be audible. This refers specifically to the video player state on the
   * page, and not the state of the browser window.
   * Constant has value 'minimized'.
   */
  MINIMIZED: 'minimized',
  /**
   * The player has been reduced from its original size.
   * The video is still potentially visible.
   * Constant has value 'collapsed'.
   */
  COLLAPSED: 'collapsed',
  /**
   * The player's default playback size.
   * Constant has value 'normal'.
   */
  NORMAL: 'normal',
  /**
   * The player has expanded from its original size.
   * Constant has value 'expanded'.
   */
  EXPANDED: 'expanded',
  /**
   * The player has entered fullscreen mode.
   * Constant has value 'fullscreen'.
   */
  FULLSCREEN: 'fullscreen',
};

/** @enum {string} */
const NativeViewKeys = {
  X: 'x',
  LEFT: 'left', // From DOMRect
  Y: 'y',
  TOP: 'top', // From DOMRect
  WIDTH: 'width',
  HEIGHT: 'height',
  AD_SESSION_ID: 'adSessionId',
  IS_FRIENDLY_OBSTRUCTION_FOR: 'isFriendlyObstructionFor',
  CLIPS_TO_BOUNDS: 'clipsToBounds',
  CHILD_VIEWS: 'childViews',
  END_X: 'endX',
  END_Y: 'endY',
  OBSTRUCTIONS: 'obstructions',
  OBSTRUCTION_CLASS: 'obstructionClass',
  OBSTRUCTION_PURPOSE: 'obstructionPurpose',
  OBSTRUCTION_REASON: 'obstructionReason',
  PIXELS: 'pixels',
  HAS_WINDOW_FOCUS: 'hasWindowFocus',
};

/**
 * Enum for state change sources.
 * @enum {string}
 */
const MeasurementStateChangeSource = {
  CONTAINER: 'container',
  CREATIVE: 'creative',
};

/**
 * Mark-up for DOM elements.
 * @enum {string}
 */
const ElementMarkup = {
  OMID_ELEMENT_CLASS_NAME: 'omid-element',
};

/** @enum {string} */
const CommunicationType = {
  NONE: 'NONE',
  DIRECT: 'DIRECT',
  POST_MESSAGE: 'POST_MESSAGE',
};

/**
 * Identifier of party providing OMID.
 * @enum {string}
 */
const OmidImplementer = {
  OMSDK: 'omsdk',
};

/**
 * Values for the `method` of a particular message sent to or from the OM SDK
 * service. The "method" identifies the purpose of the message and determines
 * how its arguments will be interpreted.
 * TODO(OMSDK-930): Include all methods used for client-service communication.
 * @enum {string}
 */
const MessageMethod = {
  IDENTIFY_SERVICE_WINDOW: 'identifyServiceWindow',
};

exports = {
  AccessMode,
  AdEventType,
  AdSessionType,
  AppState,
  CommunicationType,
  CreativeType,
  DeviceCategory,
  ElementMarkup,
  Environment,
  EventOwner,
  ErrorType,
  ImpressionType,
  InteractionType,
  MeasurementStateChangeSource,
  MediaType,
  MessageMethod,
  NativeViewKeys,
  OmidImplementer,
  Reason,
  SupportedFeatures,
  MediaEventType,
  VideoPosition,
  VideoPlayerState,
};
