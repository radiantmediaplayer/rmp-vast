# rmp-vast

A client-side JavaScript solution to load, parse and display VAST resources (advertising).

It aims at closely implementing the [IAB VAST 3 specification](https://www.iab.com/guidelines/digital-video-ad-serving-template-vast-3-0/) for web-based environments 
(e.g. browser, WebView ...) where both HTML5 video and JavaScript are available.

rmp-vast is used and maintained by [Radiant Media Player](https://www.radiantmediaplayer.com/).

rmp-vast is an open-source project released under [MIT license](https://github.com/radiantmediaplayer/rmp-vast/blob/master/LICENSE). It is built with ES2015 JavaScript and ported to ES5 JavaScript with Babel.

## Documentation sections
- [Supported VAST 3 features](#supported-vast-3-features)
- [Supported environments](#supported-environments)
- [CORS requirements](#cors-requirements)
- [Quick start guide](#quick-start-guide)
- [Parameters, API events and methods](#parameters-api-events-and-methods)
  * [Parameters when creating a rmp-vast instance](#parameters-when-creating-a-rmp-vast-instance)
  * [Starting the rmp-vast player](#starting-the-rmp-vast-player)
  * [Importing rmp-vast as a ES2015 module](#importing-rmp-vast-as-a-es2015-module)
  * [API events](#api-events)
  * [API methods](#api-methods)
- [Companion ads support](#companion-ads-support)
- [VPAID support](#vpaid-support)
- [Autoplay support](#autoplay-support)
- [Fullscreen management](#fullscreen-management)
- [Pre, mid and post rolls](#pre-mid-and-post-rolls)
- [Outstream ads](#outstream-ads)
- [Contributing](#contributing)

## Supported VAST 3 features
- Inline and Wrapper Ads
- Linear Ads (MP4/WebM or HLS, DASH where natively supported)
- Skippable Linear Ads (MP4/WebM or HLS, DASH where natively supported)
- Non Linear Ads (Images)
- Companion Ads (Images) - BETA
- Tracking Events (tracking URLs must return an image - typically a 1px GIF/PNG/JPG)
- Error Reporting
- Industry Icons
- VAST 3 Macros
- VPAID 1 and 2 JavaScript
- Outstream ads
- Ad Pods
- Audio Ads (MP3/M4A/HLS where natively supported) in HTML5 video

VAST 2 resources should also be compatible with rmp-vast.

rmp-vast scope is not to implement all aspects of the VAST 3 specification but rather provide 
enough coverage to support current industry requirements and best practices.

### Additional supported features
- Mobile compatible (Android + iOS)
- Autoplay support (muted autoplay on iOS, Android, Desktop Chrome 66+ and Desktop Safari 11+)
- API to build a fully fledged player on top of rmp-vast

### Currently unsupported VAST features
- VAST 4 specific features
- VMAP

[Back to documentation sections](#documentation-sections)

## Supported environments

### Browsers
- Chrome for Android 5+
- Chrome for Desktop
- Firefox for Android 5+
- Firefox for Desktop
- Samsung Internet 5+ for Android 5+
- Safari 10+ for macOS
- Safari for iOS 10+
- MS Edge for Desktop
- Internet Explorer 11+ for Desktop

Specifically we support the latest stable release for each browser

### WebViews
- Android 5+
- iOS 10+

It is fairly possible that rmp-vast would work in other environments but they are not officially supported.

[Back to documentation sections](#documentation-sections)

## CORS requirements
rmp-vast uses JavaScript XMLHttpRequests to load VAST tags. Hence proper [CORS configuration](https://enable-cors.org/) is required on your ad-server in order for rmp-vast to be able to retrieve VAST tags. Refer to this [Google documentation](https://developers.google.com/interactive-media-ads/docs/sdks/html5/cors) for more information.

[Back to documentation sections](#documentation-sections)

## Quick start guide
First download latest rmp-vast package from the [release tab](https://github.com/radiantmediaplayer/rmp-vast/releases).

You must use rmp-vast in a well-formed HTML document. This means a web-page with a valid HTML5 DOCTYPE and other elements that are commonly available in today's web. See app/index.html for an example.

- Include rmp-vast.min.css
- Include rmp-vast.min.js - for debug logs include rmp-vast.js instead
- In order to use rmp-vast you must adhere to a specific HTML layout pattern. This pattern is as follows: 
```html
<div class="rmp-container" id="rmpPlayer">
  <div class="rmp-content">
    <video class="rmp-video" src="https://www.rmp-streaming.com/media/bbb-360p.mp4" playsinline></video>
  </div>
</div>
```
This structure must not be altered. CSS classes on the above elements must not be renamed.
The HTML5 video tag used for content must use the src property on the HTML5 video (e.g. do not use source tag).
- Init rmp-vast with JavaScript:
```javascript
var adTag = 'https://www.radiantmediaplayer.com/vast/tags/inline-linear-1.xml';
var id = 'rmpPlayer';
var params = {
  ajaxTimeout: 8000
};

// create RmpVast instance
var rmpVast = new RmpVast(id, params);

// call loadAds - this will start the ad loading process, display the ad and resume content automatically in the case of linear pre-roll
// in this case we use autoplay
rmpVast.loadAds(adTag);

// or if autoplay is not wanted the call to loadAds must be the result 
// of a user interaction (click, touchend ...)
// playButton.addEventListener('click', function() {
//   rmpVast.loadAds(adTag);
// });
```
A complete implementation example is provided in app/index.html. You should look at app/js/app.js. 
This example can be found live at https://www.radiantmediaplayer.com/rmp-vast/app/.

[Back to documentation sections](#documentation-sections)

## Parameters, API events and methods
Source code for rmp-vast is available for review in js/src/ folder. Code comments should be available at key points to better understand rmp-vast inner workings.

### Parameters when creating a rmp-vast instance
Once rmp-vast library is loaded on your page you can create a new rmp-vast instance as follows:

`new RmpVast(id, params)`

`id: String` is the id for the player container. This is a required parameter.

`params: Object` is an optional object representing various parameters that can be passed to a rmp-vast instance and that will affect the player inner-workings. Available properties for the params object follow:

`params.ajaxTimeout: Number` timeout in ms for an AJAX request to load a VAST tag from the ad server. Default 8000.

`params.creativeLoadTimeout: Number` timeout in ms to load linear media creative from the server. Default 10000.

`params.ajaxWithCredentials: Boolean` AJAX request to load VAST tag from ad server should or should not be made with credentials. Default: false.

`params.maxNumRedirects: Number` the number of VAST wrappers the player should follow before triggering an error. Default: 4. Capped at 30 to avoid infinite wrapper loops.

`params.maxNumItemsInAdPod: Number` maximum number of Ad an AdPod can play. Default: 10.

`params.pauseOnClick: Boolean` when an ad is clicked - pause or not VAST player (linear) or content player (non-linear). Default: true.

`params.skipMessage: String` the skip message to show on player when a skippable ad is detected and the ad is in a state where it can be skipped. Default: 'Skip ad'.

`params.skipWaitingMessage: String` the skip message to show on player when a skippable ad is detected and the ad is in a state where it cannot be skipped. Default: 'Skip ad in'. This will be completed by the number of seconds remaining before the ad state changes to a state where it can be skipped.

`params.textForClickUIOnMobile: String` on mobile devices the click-through URL for a linear ad is provided in a box located at the top right corner of the player. This setting set the text for this box. Default: 'Learn more'.

`params.outstream: Boolean` Enables outstream ad mode. Default: false.

`params.enableVpaid: Boolean` Enables VPAID support or not. Default: true.

`params.vpaidSettings: Object` information required to properly display VPAID creatives - note that it is to the parent application of rmp-vast to provide those informations - below values are default (see test/spec/vpaidSpec/ for examples):
```javascript
vpaidSettings: {
  width: 640,
  height: 360,
  viewMode: 'normal',
  desiredBitrate: 500
}
```

### Starting the rmp-vast player
It is important for the rmp-vast instance to be properly initialized to avoid playback issues. 

Playing video ads in HTML5 video is a non-trivial process that requires the overlaying of multiple video tags or changes in source depending on the targeted environments. On mobile devices a user interaction is required to properly initialized a video tag and various restrictions are set by the OS to limit the manipulation of a video tag with JavaScript.

To sum up: use the rmp-vast API `loadAds()` method to start playback. On mobile devices this should be the result of a direct user interaction. You can also use autoplay (desktop) or muted autoplay (mobiles) to start playback. Refer to the autoplay support section.

If you do not want to call `loadAds()` method directly - call `initialize()` method (as a result of a user interaction or on page 
load for autoplay) then call `loadAds()` later on when you wish to load a VAST tag.

### Importing rmp-vast as a ES2015 module
```javascript
import RmpVast from 'js/src/module';

const adTag = 'https://www.radiantmediaplayer.com/vast/tags/inline-linear-1.xml';
const id = 'rmpPlayer';
const params = {
  ajaxTimeout: 8000
};

// create RmpVast instance
const rmpVast = new RmpVast(id, params);

// call loadAds
rmpVast.loadAds(adTag);
```
Note that 'core-js' is not provided when rmp-vast is imported as a ES2015 module, if wanted you will need to add it in your main app (and transform resulting code with Babel if needed).

To enable debug logs you will need to add `window.DEBUG = true;` in module.js (just after import). The removal of the global `DEBUG` varibale should be handled with uglifyjs when building your main app (see grunt/shell.js). 

### API events
rmp-vast will fire VAST-related events on the player container as they occur. 

Events are registered and unregistered with the addEventListener and removeEventListener JavaScript methods set on the player container. Example:
```javascript
var id = 'rmpPlayer';
var container = document.getElementById(id);
...
container.addEventListener('adloaded', function() {
  console.log('adloaded event');
});
```
Available events are:
- `adtagstartloading`
- `adtagloaded`
- `adfollowingredirect`
- `adloaded`
- `addurationchange`
- `adimpression`
- `adstarted`
- `adpaused`
- `adresumed`
- `adskipped`
- `adskippablestatechanged`
- `adfirstquartile`
- `admidpoint`
- `adthirdquartile`
- `adcomplete`
- `adclick`
- `advolumemuted`
- `advolumechanged`
- `adclosed`
- `aderror`
- `addestroyed`
- `adinitialplayrequestfailed`
- `adinitialplayrequestsucceeded`
- `adpodcompleted`: the current ad pod has finished playing all its Ad

The `adinitialplayrequestfailed` event tells if the vast (or content in case of non-linear creatives) player was able to play on first attempt. Typically this event will fire when autoplay is requested but blocked by an interference engine (macOS Safari 11+, Chrome 66+, Firefox w/ media.autoplay.enabled set to false, browser extensions ...). If the initial play request was a success, the `adinitialplayrequestsucceeded` event will fire.

VPAID-related events:
- `adlinearchange`
- `adsizechange`
- `adexpandedchange`
- `adremainingtimechange`
- `adinteraction`

### API methods
Once a rmp-vast instance is created you can query the API methods to interact with the player. Example:
```javascript
var rmpVast = new RmpVast(id);
...
rmpVast.pause();
...
rmpVast.setVolume(0.5);
```
For linear ads rmp-vast exposes 2 players: a content player (for the actual content) and a vast player (for the loaded ad).
- `play()`: play content or vast player depending on what is on stage.
- `pause()`: pause content or vast player depending on what is on stage.
- `loadAds()`: load a new VAST tag and start displaying it - if rmp-vast is not initialized when loadAds is called then `initialize()` is called first.
- `initialize()`: initialize rmp-vast - this method can be used in case of deferred use of `loadAds()` - Note that when autoplay is not wanted the call to `initialize()` must be the result of a direct user interaction.
- `getAdPaused()`: return Boolean, stating if the ad on stage is paused or not.
- `setVolume(volume)`: set volume of (content|vast) player depending on what is on stage. Input value should be a Number between 0 and 1.
- `getVolume()`: return Number, the volume of (content|vast) player depending on what is on stage. Returned value is a number between 0 and 1. -1 is returned if this value is not available.
- `setMute(muted)`: set mute state of (content|vast) player depending on what is on stage. Input value should be a Boolean.
- `getMute()`: return Boolean, the mute state of (content|vast) player depending on what is on stage.  Returned value is a Boolean.
- `stopAds()`: stop playing the ad on stage.
- `skipAd()`: skips the creative on stage - this method only has effects if the creative on stage is a skippable ad and can be skipped (e.g. `getAdSkippableState` returns true).
- `getAdTagUrl()`: return String, representing the current VAST tag URL.
- `getAdOnStage()`: return Boolean, stating if an ad is currently on stage.
- `getInitialized()`: return Boolean, stating if rmp-vast has been initialized.

The following methods should be queried after the `adstarted` event has fired for accurate data:
- `getAdMediaUrl()`: return String, representing the selected creative URL.
- `getAdLinear()`: return Boolean, representing the type of the selected creative either linear (true) or non linear (false).
- `getAdSystem()`: return String, representing the VAST AdSystem tag.
- `getAdContentType()`: return String, representing the MIME type for the selected creative.
- `getAdTitle()`: return String, representing the VAST AdTitle tag.
- `getAdDescription()`: return String, representing the VAST Description tag.
- `getAdDuration()`: return Number in ms, representing the duration of the selected linear creative. -1 is returned if this value is not available.
- `getAdCurrentTime()`: return Number in ms, representing the current timestamp in the selected linear creative. -1 is returned if this value is not available.
- `getAdRemainingTime()`: return Number in ms, representing the current time remaining in the selected linear creative. -1 is returned if this value is not available.
- `getAdMediaWidth()`: return Number, representing the width of the selected creative. -1 is returned if this value is not available.
- `getAdMediaHeight()`: return Number, representing the height of the selected creative. -1 is returned if this value is not available.
- `getClickThroughUrl()`: return String, representing the click-through (e.g. destination) URL for the selected creative.
- `getIsSkippableAd()`: return Boolean, stating if the loaded linear ad is a VAST skippable ad - can be querried when adloaded event fires.
- `getAdSkippableState()`: return Boolean, stating if the creative on stage can be skipped or not.
- `getContentPlayerCompleted()`: return Boolean, stating if content player has reached end of content.
- `setContentPlayerCompleted(value)`: input value must be a Boolean - sets the contentPlayerCompleted state of the player, this is used when source on content player changes and we need to explicitly reset contentPlayerCompleted internal value so that content can resume as expected on next ad load.

Additional AdPod-related methods
- `getAdPodInfo()`: return (Object|null) as {adPodCurrentIndex: Number, adPodLength: Number} giving information about the currently playing pod.


Additional VPAID-related methods
- `resizeAd(width, height, viewMode)`: resizes the VPAID creative based on width: Number, height: Number and viewMode: String. viewMode should be either 'normal' or 'fullscreen'.
- `expandAd()`: expands the VPAID creative on stage.
- `collapseAd()`: collapses the VPAID creative on stage.
- `getVpaidCreative()`: return (Object|null) reference to the VPAID creative.
- `getAdExpanded()`: return Boolean, stating if the VPAID creative on stage is expanded or not.
- `getVPAIDCompanionAds()`: return String, providing ad companion details in VAST 3.0 format for the `<CompanionAds>` element.

The following methods should be queried after the `aderror` event has fired for accurate data:
- `getAdErrorMessage()`: return String, representing the error message for the current error.
- `getAdVastErrorCode()`: return Number, representing the VAST error code for the current error. -1 is returned if this value is not available.
- `getAdErrorType()`: return String, representing the detected ad error type, possible values: 'adLoadError', 'adPlayError' or '' (if unknown error type).

The following methods provide context information for the rmp-vast instance:
- `getEnvironment()`: return Object, the rmp-vast environment object.
- `getFramework()`: return Object, the core internal rmp-vast framework.
- `getVastPlayer()`: return HTMLVideoElement, the VAST player video tag.
- `getContentPlayer()`: return HTMLVideoElement, the content player video tag.
- `getIsUsingContentPlayerForAds()`: return Boolean, on iOS and macOS Safari the VAST player is the content player. This is to avoid fullscreen management and autoplay issues and to provide a consistent user experience. This method will return true for iOS and macOS Safari, false otherwise.

## Companion ads support
Feedback is welcome! Companion ads support is currently in BETA in rmp-vast, your contributions can help us make this a rock-solid feature faster.

We support StaticResource images (JPEG, GIF, PNG) in Companion tags. We do not support IFrameResource or HTMLResource in Companion tags.

We support AltText, CompanionClickThrough, CompanionClickTracking, TrackingEvents tags in Companion tags. We support "required" attribute for CompanionAds tag as well as "adSlotID" attribute for Companion tag. We also support CompanionAds in wrappers/redirects (The CompanionAds nearer to the final linear creative will be selected).

See app/companion.html for an example of implementation.

The following methods must be querried when the `adstarted` event fires for the master linear ad.

- `getCompanionAds(width, height, wantedCompanionAds)`: return an Array of HTMLElement images. Each image can be appended to a DOM node where the companion ads can be displayed. Input `width` and `height` parameters are used to select companion ads based on available width and height for display. `wantedCompanionAds` input parameter represents the number of expected companion ads with the request to `getCompanionAds`. By default this method returns as many companion ads as possible while automatically pinging ALL returned companion ads (`creativeView` event).
- `getCompanionAdsAdSlotID()`: return an Array of String representing the adSlotID for each companion ad. An empty array is returned when this method has no information to provide.
- `getCompanionAdsRequiredAttribute()`: return a String representing the "required" attribute for CompanionAds tag. Value can be all, any, none or an empty String when this attribute is not defined. See section 2.3.3.4 of VAST 3 specification for more information.

[Back to documentation sections](#documentation-sections)

## VPAID support
It is no secret that VPAID in the industry is a jungle and we need your help to best implement it. 
Any feedback and test adTags that can improve VPAID support in rmp-vast are welcome - open an issue when needed.
Current VPAID support limitations:
- supports only linear VPAID (non-linear support may be coming later)
- no support for changes in linearity (likely to cause playback issues): we need production adTag to test this but we have not found reliable resources for it - please share if you have some available

[Back to documentation sections](#documentation-sections)

## Autoplay support
This is done by simply calling `loadAds` method on page load (after HTML5 content video player is in DOM and rmp-vast library is loaded and instantiated). For muted autoplay (iOS, Android, Desktop Chrome 66+ and Desktop Safari 11+) also add the `muted` attribute on the HTML5 content video player.

[Back to documentation sections](#documentation-sections)

## Fullscreen management
rmp-vast supports fullscreen for the global player (e.g. content + vast players) but there is an extra layer to add to your application. See the app/js/app.js file around line 25 for an example of implementation.

[Back to documentation sections](#documentation-sections)

## Pre, mid and post rolls
rmp-vast can handle pre/mid/post rolls ad breaks through the loadAds API method. See app/pre-mid-post-roll.html for an example.

[Back to documentation sections](#documentation-sections)

## Outstream ads
rmp-vast supports displaying outstream ads when parameter `outstream` is set to true. For an implementation example see test/spec/outstreamSpec/Simple.html.

[Back to documentation sections](#documentation-sections)

## Contributing
Contributions are welcome. Please review general code structure and stick to existing patterns.
Provide test where appropriate (see test/ folder). Tests are written with Jasmine and automated with [node.js 6.11+ and selenium web driver 3.6+](https://www.npmjs.com/package/selenium-webdriver) and are validated in latest webdriver for Chrome, Firefox and MS Edge for Windows 10. Additionally we test on latest Chrome for Android 8 and macOS Safari 11.

To develop rmp-vast do install it:

`git clone https://github.com/radiantmediaplayer/rmp-vast.git`

`npm install`

Please review grunt/shell.js - you need to have eslint, browserify, watchify, uglifyjs, node, stylelint and js-beautify installed globally to move forward.

Make changes to code and then run:

`grunt build`

You can also use 

`grunt concurrent` 

to make developement easier (watchify task) and use the app/dev.html file (which references js/dist/rmp-vast.js).

Before committing for a pull request - run test:

`grunt test` 

For testing on Android use:

`grunt testAndroid` 

For testing on macOS Safari use:

`grunt testSafari` 

Before running `grunt test` make sure to update `TEST.pathToTest` in test/helpers/test.js with your local IP address. Running test on Android requires a [runnning adb server](https://developer.android.com/studio/command-line/adb.html).

[Back to documentation sections](#documentation-sections)
