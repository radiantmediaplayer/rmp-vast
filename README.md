# rmp-vast

A client-side JavaScript solution to load, parse, ping and display VAST resources (advertising).

It aims at implementing the [IAB VAST 4.2 specification](https://iabtechlab.com/standards/vast/) for web-based environments (e.g. browser, WebView ...) where both HTML5 video and JavaScript are available. VAST 2 and VAST 3 support is also provided.

rmp-vast comes as a compiled library (./dist/ folder) but can also be imported as a ES6 module. Is is written in ES2017.

rmp-vast makes use of [vast-client-js](https://github.com/dailymotion/vast-client-js) for fetching and parsing VAST XML resources.

rmp-vast is used and maintained by [Radiant Media Player](https://www.radiantmediaplayer.com/).

## Documentation sections

- [Quick start guide](#quick-start-guide)
- [Supported VAST 4.2 features](#supported-vast-3-features)
- [Supported environments](#supported-environments)
- [CORS requirements](#cors-requirements)
- [Video ads from Google Ads network and rmp-vast](#video-ads-from-google-ads-network-and-rmp-vast)
- [Debugging](#debugging)
- [Parameters, API events and methods](#parameters-api-events-and-methods)
  - [Parameters when creating a rmp-vast instance](#parameters-when-creating-a-rmp-vast-instance)
  - [Starting the rmp-vast player](#starting-the-rmp-vast-player)
  - [API events](#api-events)
  - [API methods](#api-methods)
- [Companion ads support](#companion-ads-support)
- [AdVerifications OM Web SDK](#adverifications-om-web-sdk)
- [VPAID support](#vpaid-support)
- [HLS video ads support](#hls-video-ads-support)
- [Autoplay support](#autoplay-support)
- [Fullscreen management](#fullscreen-management)
- [Pre, mid and post rolls](#pre-mid-and-post-rolls)
- [Outstream ads](#outstream-ads)
- [TypeScript support](#typescript-support)
- [Contributing](#contributing)
- [License](#license)
- [Radiant Media Player](#radiant-media-player)

## Quick start guide

First download latest rmp-vast package from the [release tab](https://github.com/radiantmediaplayer/rmp-vast/releases).

You must use rmp-vast in a well-formed HTML document. This means a web-page with a valid HTML5 DOCTYPE and other elements that are commonly available in today's web.

- In order to use rmp-vast you must adhere to a specific HTML layout pattern. This pattern is as follows:

```html
<script src="./dist/rmp-vast.min.js">
<div class="rmp-container" id="rmp">
  <div class="rmp-content">
    <video
      class="rmp-video"
      src="https://www.rmp-streaming.com/media/big-buck-bunny-360p.mp4"
      playsinline
      muted
      controls
    ></video>
  </div>
</div>
```

First we add rmp-vast library. Then our HTML layout (do not rename CSS classes or alter this layout).
The HTML5 video tag used for content must use the src property on the HTML5 video (e.g. do not use &lt;source&gt; tag).

- Init the library with JavaScript:

```javascript
// our VAST tag to be displayed
const adTag = "https://www.radiantmediaplayer.com/vast/tags/inline-linear-1.xml";
const id = "rmp";
const params = {
  ajaxTimeout: 8000,
};
// create RmpVast instance
const rmpVast = new RmpVast(id, params);
// call loadAds - this will start the ad loading process, display the ad and resume content automatically
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

## Supported VAST 4.2 features

- Inline and Wrapper Ads
- Linear Ads
- Skippable Linear Ads
- Linear creatives in MP4/WebM progressive download
- Linear creatives in HLS format on all supported devices (with hls.js) - BETA
- Non Linear Ads (image/iframe/HTML)
- Companion Ads (image/iframe/HTML)
- Tracking Events (tracking URLs must return an image - typically a 1px GIF/PNG/JPG)
- Error Reporting
- Industry Icons (image/iframe/HTML)
- VAST 4.2 Macros
- AdVerifications (OM Web SDK) 
- VPAID 1 and 2 JavaScript <sup>deprecated</sup>
- Outstream ads
- Ad Pods
- Audio Ads (MP3/M4A/HLS where natively supported) in HTML5 video
- ViewableImpression, Universal Ad ID, AdServingId, Survey and Ad Categories

### Currently unsupported features

- SIMID (PR welcome)
- VMAP

[Back to documentation sections](#documentation-sections)

## Supported environments for rmp-vast compiled library (./dist/rmp-vast.min.js)

### Browsers

- Latest Chrome for Android 5+
- Chrome 38+ for Desktop
- Latest Firefox for Android 5+
- Firefox 42+ for Desktop
- Opera 25+ for Desktop
- Samsung Internet 9.2+ for Android 5+
- Safari 10+ for Desktop
- Safari for iOS 12+ and iPadOS 13+
- MS Edge 79+ for Desktop
- MS Edge Legacy 12+ for Desktop
- Latest Amazon Silk for fireOS 6+

Desktop means Windows 7+, macOS 10.11+, Linux (latest LTS Ubuntu).
It could work on Internet Explorer 11 but we are not actively testing for it anymore.

### WebViews (mobile apps built with Ionic, Cordova)

- Android 5+
- iOS 12+ (WKWebView)

With the announcement of Apple in december 2019, to remove support for UIWebView API by end 2020, we only support WKWebView API for iOS apps built with Cordova, Ionic or WebView. [See this blog post](https://www.radiantmediaplayer.com/blog/updating-ios-apps-for-wkwebview.html) to help you update to WKWebView API.

### Smart TV & OTT

- Samsung Tizen 3+ apps
- LG webOS 3+ apps
- Electron 6+ apps
- Xbox One, Xbox Series S, Xbox Series X - UWP apps
- Fire TV apps (Web Apps and Hybrid Apps) with fireOS 6+

[Back to documentation sections](#documentation-sections)

## Supported environments for rmp-vast as module

rmp-vast as a module is written with ES2017. It is up to you to run it in a ES2017 compatible environment or use a tool like Babel to make it work on older versions of ES. Please refer to .babelrc and webpack.dev.config.js for guidance. Code example:

```html
<div class="rmp-container" id="rmp">
  <div class="rmp-content">
    <video
      class="rmp-video"
      src="https://www.rmp-streaming.com/media/big-buck-bunny-360p.mp4"
      playsinline
      muted
      controls
    ></video>
  </div>
</div>
```

- Import rmp-vast as a module and create your set-up:

```javascript
// import rmp-vast as a module
import RmpVast from "./src/js/index.js";
// our VAST tag to be displayed
const adTag = "https://www.radiantmediaplayer.com/vast/tags/inline-linear-1.xml";
const id = "rmp";
const params = {
  ajaxTimeout: 8000,
};
// create RmpVast instance
const rmpVast = new RmpVast(id, params);
// call loadAds - this will start the ad loading process, display the ad and resume content automatically
// in this case we use autoplay
rmpVast.loadAds(adTag);
```

## CORS requirements

rmp-vast uses JavaScript XMLHttpRequests to load VAST tags. Hence proper [CORS configuration](https://enable-cors.org/) is required on your ad-server in order for rmp-vast to be able to retrieve VAST tags. Refer to this [Google documentation](https://developers.google.com/interactive-media-ads/docs/sdks/html5/cors) for more information.

[Back to documentation sections](#documentation-sections)

## Video ads from Google Ads network and rmp-vast

When serving ads from Google Ads network (DFP, ADX, AdSense for Video) you should use [Google IMA HTML5 SDK](https://developers.google.com/interactive-media-ads/docs/sdks/html5/). Radiant Media Player supports [Google IMA HTML5 SDK](https://www.radiantmediaplayer.com/docs/latest/video-ads-documentation.html) and is a certified [Google's video technology partner](https://support.google.com/admanager/answer/186110?hl=en).

[Back to documentation sections](#documentation-sections)

## Debugging

rmp-vast compiled does not print any log to the console. If you want those logs for debugging purposes please use ./dist/rmp-vast.js instead

[Back to documentation sections](#debugging)

## Parameters, API events and methods

Source code for rmp-vast is available for review in ./src/js/ folder. Code comments should be available at key points to better understand rmp-vast inner workings.

### Parameters when creating a rmp-vast instance

Once rmp-vast is loaded on your page you can create a new rmp-vast instance as follows:

`new RmpVast(id: String, params: Object)`

- `id: String` is the id for the player container. This is a required parameter.
- `params: Object` is an optional object representing various parameters that can be passed to a rmp-vast instance and that will affect the player inner-workings. Available properties for the params object follow:
  - `params.ajaxTimeout: Number` timeout in ms for an AJAX request to load a VAST tag from the ad server. Default 8000.
  - `params.creativeLoadTimeout: Number` timeout in ms to load linear media creative from the server. Default 10000.
  - `params.ajaxWithCredentials: Boolean` AJAX request to load VAST tag from ad server should or should not be made with credentials. Default: false.
  - `params.maxNumRedirects: Number` the number of VAST wrappers the player should follow before triggering an error. Default: 4. Capped at 30 to avoid infinite wrapper loops.
  - `params.labels: Object` labels used to display information to the viewer.
  - `params.labels.skipMessage: String` skip message. Default: 'Skip ad'.
  - `params.labels.closeAd: String` close ad message. Default: 'Close ad'.
  - `params.labels.textForClickUIOnMobile: String` on mobile devices the click-through URL for a linear ad is provided in a box located at the top right corner of the player. This setting set the text for this box. Default: 'Learn more'.
  - `params.outstream: Boolean` Enables outstream ad mode. Default: false.
  - `params.showControlsForVastPlayer: Boolean` Shows VAST player HTML5 default video controls. Default: false.
  - `params.enableVpaid: Boolean` Enables VPAID support or not. Default: true.
  - `params.vpaidSettings: Object` information required to properly display VPAID creatives - note that it is up to the parent application of rmp-vast to provide those informations - below values are default (see test/spec/vpaidSpec/ for examples):
    - `params.vpaidSettings.width: Number` Default: 640.
    - `params.vpaidSettings.height: Number` Default: 360.
    - `params.vpaidSettings.viewMode: String` Default: 'normal'. Can be 'fullscreen' as well.
    - `params.vpaidSettings.desiredBitrate: Number` Default: 500. In kbps.
  - `params.useHlsJS: Boolean` Enables rendering of HLS creatives with hls.js in rmp-vast. Default: false.
  - `params.debugHlsJS: Boolean` Enables debugging of HLS creatives with hls.js in rmp-vast. Default: false.
  - `params.omidSupport: Boolean` Enables OMID (OM Web SDK) support in rmp-vast. Default: false. Refer to the [AdVerifications OM Web SDK](#adverifications-om-web-sdk) section for more information.
  - `params.omidAllowedVendors: Array` List of allowed vendors for ad verification. Vendors not listed will be rejected. Default: [].
  - `params.omidUnderEvaluation: Boolean` When debugging set this parameter to true. Default: false.
  - `params.omidPathTo: String` Path to OM Web SDK script. Default: '../externals/omweb-v1.js'.
  - `params.omidAutoplay: Boolean` The content player will autoplay or not. The possibility of autoplay is not determined by rmp-vast, this information needs to be passed to rmp-vast ([see this script for example](https://github.com/video-dev/can-autoplay)). Default: false (means a click to play is required).
  - `params.partnerName: String` partnerName for OMID. Default: 'rmp-vast'.
  - `params.partnerVersion: String` partnerVersion for OMID. Default: latest rmp-vast version.

[Back to documentation sections](#documentation-sections)

### Starting the rmp-vast player

It is important for the rmp-vast instance to be properly initialized to avoid playback issues.

Playing video ads in HTML5 video is a non-immediate process that requires the overlaying of multiple video tags or changes in content source depending on the targeted environments. On mobile devices a user interaction is required to properly initialized a video tag and various restrictions are set by OSes to limit manipulation of a video tag with JavaScript.

To sum up: use the rmp-vast API `loadAds()` method to start playback. On mobile devices this should be the result of a direct user interaction. You can also use autoplay (desktop) or muted autoplay (mobiles) to start playback. Refer to the autoplay support section.

If you do not want to call `loadAds()` method directly - call `initialize()` method (as a result of a user interaction) then call `loadAds()` later on when you wish to load a VAST tag.

[Back to documentation sections](#documentation-sections)

### API events

rmp-vast will fire VAST-related events on the player container as they occur. It will also ping VAST trackers when needed but this section refers to events emitted by rmp-vast and that can be hooked to with JavaScript.

Events are registered and unregistered with the addEventListener and removeEventListener JavaScript methods set on the player container. Example:

```javascript
const id = 'rmp';
const container = document.getElementById(id);
...
container.addEventListener('adloaded', function() {
  console.log('adloaded event');
});
```

Available events are:

- `adloaded`
- `addurationchange`
- `adclick`
- `adclosed`
- `adimpression`
- `adcollapse`
- `adstarted`
- `adtagloaded`
- `adprogress`
- `adviewable`
- `adviewundetermined`
- `adinitialplayrequestfailed`
- `adinitialplayrequestsucceeded`
- `adpaused`
- `adresumed`
- `adtagstartloading`
- `advolumemuted`
- `advolumechanged`
- `adcomplete`
- `adskipped`
- `adskippablestatechanged`
- `adfirstquartile`
- `admidpoint`
- `adthirdquartile`
- `aderror`
- `addestroyed`
- `adpodcompleted`

The `adinitialplayrequestfailed` event tells if the vast (or content in case of non-linear creatives) player was able to play on first attempt. Typically this event will fire when autoplay is requested but blocked by an interference engine (macOS Safari 11+, Chrome 66+, browser extensions ...). If the initial play request was a success, the `adinitialplayrequestsucceeded` event will fire.

VPAID-related events:

- `adlinearchange`
- `adsizechange`
- `adexpandedchange`
- `adremainingtimechange`
- `adinteraction`
- `aduseracceptinvitation`
- `adcollapse`

[Back to documentation sections](#documentation-sections)

### API methods

Once a rmp-vast instance is created you can query the API methods to interact with the player. Example:

```javascript
const rmpVast = new RmpVast(id);
...
rmpVast.pause();
...
rmpVast.setVolume(0.5);
```

For linear ads rmp-vast exposes 2 players: a content player (for the actual content) and a vast player (for the loaded ad).

- `play()`: play content or vast player depending on what is on stage.
- `pause()`: pause content or vast player depending on what is on stage.
- `loadAds(vastUrl: String, regulationsInfo: Object, requireCategory: Boolean)`: load a new VAST tag and start displaying it - if rmp-vast is not initialized when loadAds is called then `initialize()` is called first. Input parameters are
  - `vastUrl: String` the URI to the VAST resource to be loaded
  - `regulationsInfo: Object` data for regulations as
    - `regulationsInfo.regulations: String` coppa|gdpr for REGULATIONS macro
    - `regulationsInfo.limitAdTracking: String` 0|1 for LIMITADTRACKING macro
    - `regulationsInfo.gdprConsent: String` Base64-encoded Cookie Value of IAB GDPR consent info for GDPRCONSENT macro
  - `requireCategory: Boolean` for enforcement of VAST 4 Ad Categories
- `initialize()`: initialize rmp-vast - this method can be used in case of deferred use of `loadAds()` - Note that when autoplay is not wanted the call to `initialize()` must be the result of a direct user interaction.
- `getAdPaused()`: return `Boolean`, stating if the ad on stage is paused or not.
- `setVolume(volume: Number)`: set volume of (content|vast) player depending on what is on stage. Input value should be a `Number` between 0 and 1.
- `getVolume()`: return `Number`, the volume of (content|vast) player depending on what is on stage. Returned value is a number between 0 and 1. -1 is returned if this value is not available.
- `setMute(muted: Boolean)`: set mute state of (content|vast) player depending on what is on stage.
- `getMute()`: return `Boolean`, the mute state of (content|vast) player depending on what is on stage. Returned value is a Boolean.
- `stopAds()`: stop playing the ad on stage.
- `skipAd()`: skips the creative on stage - this method only has effects if the creative on stage is a skippable ad and can be skipped (e.g. `getAdSkippableState` returns true).
- `getAdTagUrl()`: return `String`, representing the current VAST tag URL.
- `getAdOnStage()`: return `Boolean`, stating if an ad is currently on stage.
- `getInitialized()`: return `Boolean`, stating if rmp-vast has been initialized.

The following methods should be queried after the `adstarted` event has fired for accurate data:

- `getAdMediaUrl()`: return `String`, representing the selected creative URL.
- `getAdLinear()`: return `Boolean`, representing the type of the selected creative either linear (true) or non linear (false).
- `getAdSystem()`: return `{value: String, version: String}`, representing the VAST AdSystem tag.
- `getAdUniversalAdIds()`: return `[{idRegistry: String, value: String}]`, representing the VAST UniversalAdId tag.
- `getAdContentType()`: return `String`, representing the MIME type for the selected creative.
- `getAdTitle()`: return `String`, representing the VAST AdTitle tag.
- `getAdDescription()`: return `String`, representing the VAST Description tag.
- `getAdAdvertiser()`: return `{id: String, value: String}`, representing the VAST Advertiser tag.
- `getAdPricing()`: return `{value: String, model: String, currency: String}`, representing the VAST Pricing tag.
- `getAdSurvey()`: return `String`, representing the VAST Survey tag.
- `getAdAdServingId()`: return `String`, representing the VAST AdServingId tag.
- `getAdCategories()`: return `{authority: String, value: String}[]`, representing the VAST Category tag.
- `getAdBlockedAdCategories()`: return `{authority: String, value: String}[]`, representing the VAST BlockedAdCategories tag.
- `getAdDuration()`: return `Number` in ms, representing the duration of the selected linear creative. -1 is returned if this value is not available.
- `getAdCurrentTime()`: return `Number` in ms, representing the current timestamp in the selected linear creative. -1 is returned if this value is not available.
- `getAdRemainingTime()`: return `Number` in ms, representing the current time remaining in the selected linear creative. -1 is returned if this value is not available.
- `getAdMediaWidth()`: return `Number`, representing the width of the selected creative. -1 is returned if this value is not available.
- `getAdMediaHeight()`: return `Number`, representing the height of the selected creative. -1 is returned if this value is not available.
- `getClickThroughUrl()`: return `String`, representing the click-through (e.g. destination) URL for the selected creative.
- `getIsSkippableAd()`: return `Boolean`, stating if the loaded linear ad is a VAST skippable ad - can be querried when adloaded event fires.
- `getSkipTimeOffset()`: return `Number` giving the skip offset when a skippable ad is displayed.
- `getAdSkippableState()`: return `Boolean`, stating if the creative on stage can be skipped or not.
- `getContentPlayerCompleted()`: return `Boolean`, stating if content player has reached end of content.
- `setContentPlayerCompleted(value: Boolean)`: sets the contentPlayerCompleted state of the player, this is used when source on content player changes and we need to explicitly reset contentPlayerCompleted internal value so that content can resume as expected on next ad load.

Additional AdPod-related methods

- `getAdPodInfo()`: return `{adPodCurrentIndex: Number, adPodLength: Number}` giving information about the currently playing pod.

Additional VPAID-related methods

- `resizeAd(width: Number, height: Number, viewMode: String)`: resizes the VPAID creative based on `width`, `height` and `viewMode`. viewMode should be either 'normal' or 'fullscreen'.
- `expandAd()`: expands the VPAID creative on stage.
- `collapseAd()`: collapses the VPAID creative on stage.
- `getAdExpanded()`: return `Boolean`, stating if the VPAID creative on stage is expanded or not.
- `getVPAIDCompanionAds()`: return `String`, providing ad companion details in VAST 3.0 format for the `<CompanionAds>` element.

The following methods should be queried after the `aderror` event has fired for accurate data:

- `getAdErrorMessage()`: return `String`, representing the error message for the current error.
- `getAdVastErrorCode()`: return `Number`, representing the VAST error code for the current error. -1 is returned if this value is not available.
- `getAdErrorType()`: return `String`, representing the detected ad error type, possible values: 'adLoadError', 'adPlayError' or '' (if unknown error type).

The following methods provide context information for the rmp-vast instance:
- `getEnvironment()`: return `Object`, data about the environment that rmp-vast runs into.
- `getVastPlayer()`: return `HTMLMediaElement|null`, the VAST player video tag.
- `getContentPlayer()`: return `HTMLMediaElement|null`, the content player video tag.
- `getIsUsingContentPlayerForAds()`: return `Boolean`, on iOS and macOS Safari the VAST player is the content player. This is to avoid fullscreen management and autoplay issues and to provide a consistent user experience. This method will return true for iOS and macOS Safari, false otherwise.

[Back to documentation sections](#documentation-sections)

## Companion ads support

We support StaticResource, IFrameResource and HTMLResource in Companion tags.
We also support AltText, CompanionClickThrough, CompanionClickTracking, TrackingEvents tags in Companion tags. We support "required" attribute for CompanionAds tag as well as "adSlotID" attribute for Companion tag. We also support CompanionAds in wrappers/redirects (The CompanionAds nearer to the final linear creative will be selected).

See ./test/spec/companionSpec/ for examples of implementation.

The following methods must be querried when the `adstarted` event fires for the master linear ad.

- `getCompanionAdsList(width: Number, height: Number)`: return `Object[]`. Each Object in the Array represents a companion ad. Input `width` and `height` parameters are used to select companion ads based on available width and height for display. Each companion ad Object is represented as:

```javascript
{
  adSlotID: "RMPSLOTID-1",
  altText: "Radiant Media Player logo",
  companionClickThroughUrl: "https://www.radiantmediaplayer.com",
  companionClickTrackingUrl: "https://www.radiantmediaplayer.com/vast/tags/ping.gif?creativeType=companion&type=companionClickTracking",
  height: 250,
  imageUrl: "https://www.radiantmediaplayer.com/vast/mp4s/companion.jpg",
  trackingEventsUri: [
    "https://www.radiantmediaplayer.com/vast/tags/ping.gif?creativeType=companion&type=creativeView",
    "https://www.radiantmediaplayer.com/vast/tags/ping.gif?creativeType=companion&type=creativeViewTwo"
  ],
  width: 300
}
```

Not all fields may be available, so check availability before usage.

- `getCompanionAd(index: Number)`: return `HTMLElement|null` representing the companion ad. It takes a `Number` index parameter which represents the index of the wanted companion ad in the Array returned from `getCompanionAdsList` method. This method automates the required pinging for companion ads. Usage example:

```javascript
container.addEventListener("adstarted", function () {
  // we need to call getCompanionAdsList BEFORE calling getCompanionAd so that
  // rmp-vast can first create a collection of available companion ads based on getCompanionAdsList
  // input parameters
  const list = rmpVast.getCompanionAdsList(900, 750);
  if (list && list.length === 3) {
    const img = rmpVast.getCompanionAd(2);
    if (img) {
      // we get our companion ad image and we can append it to DOM now
      // VAST trackers will be called automatically when needed
      const companionId = document.getElementById("companionId");
      companionId.appendChild(img);
    }
  }
});
```

- `getCompanionAdsRequiredAttribute()`: return a String representing the "required" attribute for CompanionAds tag. Value can be all, any, none or an empty String when this attribute is not defined. See section 2.3.3.4 of VAST 3 specification for more information.

[Back to documentation sections](#documentation-sections)

## AdVerifications OM Web SDK

rmp-vast supports AdVerifications through the [IAB OM Web SDK](https://iabtechlab.com/standards/open-measurement-sdk/). Our implementation is based on IAB GitHub [Open-Measurement-JSClients](https://github.com/InteractiveAdvertisingBureau/Open-Measurement-JSClients) and sports OM Web SDK version 1.3.35. This feature needs to be activated through `omidSupport: true` setting. Feedback is welcome. Please see ./test/spec/vast4Spec/omwebsdk.html for an implementation example. Make sure to add ./externals/omid/omid-session-client-v1.js in your page for it work as expected as this is not bundled in rmp-vast.

[Back to documentation sections](#documentation-sections)

## VPAID support

--- DEPRECATED with rmp-vast 7 --- 
--- SIMID is meant to replace VPAID. SIMID is not yet implemented in rmp-vast. Contributions are welcomed ---
It is no secret that VPAID in the industry is a jungle and we need your help to best implement it.
Any feedback and test adTags that can improve VPAID support in rmp-vast are welcome - open an issue when needed.
Current VPAID support limitations:

- supports only linear VPAID (non-linear support may be coming later)
- no support for changes in linearity (likely to cause playback issues): we need production adTag to test this but we have not found reliable resources for it - please share if you have some available

[Back to documentation sections](#documentation-sections)

## HLS Video ads support
This is a BETA feature, please open a GitHub issue if you spot anything. 
With rmp-vast 5.2.0 we now support linear creatives in HLS format on all supported devices for rmp-vast. This is made possible thanks to the [hls.js project](https://github.com/video-dev/hls.js). Make sure to add ./externals/hls/hls.min.js to your page and enable this feature with `useHlsJS: true` setting. See ./test/spec/inlineLinearSpec/hls-creative.html for an example.

[Back to documentation sections](#documentation-sections)


## Autoplay support

This is done by simply calling `loadAds` method on page load (after HTML5 content video player is in DOM and rmp-vast library is loaded and instantiated). For muted autoplay (iOS, Android, Desktop Chrome 66+ and Desktop Safari 11+) also add the `muted` attribute on the HTML5 content video player.

[Back to documentation sections](#documentation-sections)

## Fullscreen management

rmp-vast supports fullscreen for the global player (e.g. content + vast players) but there is an extra layer to add to your application. See the ./app/js/app.js file around line 25 for an example of implementation.

[Back to documentation sections](#documentation-sections)

## Pre, mid and post rolls

rmp-vast can handle pre/mid/post rolls ad breaks through the loadAds API method. See ./test/spec/apiSpec/pre-mid-post-roll.html for an example.

[Back to documentation sections](#documentation-sections)

## Outstream ads

rmp-vast supports displaying outstream ads when parameter `outstream` is set to true. For an implementation example see ./test/spec/outstreamSpec/Simple.html.

[Back to documentation sections](#documentation-sections)

## TypeScript support

Make sure to inluce ./types folder in your TypeScript configuration file and you can start using rmp-vast in a TypeScript environment. Note: the resulting .d.ts files are generated from JavaScript using JSDoc syntax. Type support is only available when using rmp-vast as a ES6 module right now.

## Contributing

Contributions are welcome. Please review general code structure and stick to existing patterns.
Provide test where appropriate (see ./test folder). Tests are written with Jasmine and automated with [selenium web driver](https://github.com/SeleniumHQ/selenium) and are validated in latest webdriver for Chrome and Firefox for Windows 11. Additionally we test on latest Chrome for Android and latest macOS Safari.

To develop rmp-vast do install it (you need to have node.js installed globally):

`git clone https://github.com/radiantmediaplayer/rmp-vast.git`

`npm install`

Make changes to code and then run:

`npm run dev`

When your changes are ready for commit, build rmp-vast:

`npm run build`

Before committing for a pull request - run test:

`npm run test`

For testing on Android use:

`npm run testAndroid`

For testing on macOS Safari use:

`npm run testSafari`

Before running `npm run test` make sure to update `TEST.pathToTest` in ./test/helpers/test.js with your local IP address. Running test on Android requires a [runnning adb server](https://developer.android.com/studio/command-line/adb.html).

[Back to documentation sections](#documentation-sections)

## License

rmp-vast is released under MIT.

[Back to documentation sections](#documentation-sections)

## Radiant Media Player

If you like rmp-vast you can check out [Radiant Media Player](https://www.radiantmediaplayer.com) - A Modern Go-everywhere HTML5 Video Player - Create web, mobile & OTT video apps in a snap.

Radiant Media Player is a commercial HTML5 media player, not covered by rmp-vast MIT license.

You may request a free trial for Radiant Media Player at: [https://www.radiantmediaplayer.com/free-trial.html](https://www.radiantmediaplayer.com/free-trial.html).

[Back to documentation sections](#documentation-sections)
