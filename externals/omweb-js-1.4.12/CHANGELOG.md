# Changelog for Open Measurement SDK JavaScript service

## 1.4.12 - 2024-02-09
- Update version to match iOS SDK; no changes from 1.4.11

## 1.4.11 - 2024-02-06
- Update chromedriver version.

## 1.4.10 - 2024-01-03
- Add dv.tech domain to DoubleVerify's Whitelist.

## 1.4.9 - 2023-11-09
- Set underEvaluation to true for JS-managed sessions.
- Prevent display ad verification scripts from falsely detecting OM SDK.
- Allow sessions to be started/finished from the JS session client on App.
- Block session client post messages from unregistered windows.
- Remove unnecessary @export annotations in example creatives.

## 1.4.8 - 2023-08-03
- Send a sessionError event when verification scripts included in the creative (a.k.a. side-loaded or inline scripts) attempt to register on Web. Only verification scripts injected by the OM SDK will be permitted on Web. In a future release, all non-injected scripts will fail to register at all on Web.
- Trigger initial geometryChange event when backgrounded.
- Add getEnvironment method to verification client.

## 1.4.7 - 2023-07-07
- Partition session state in service.

## 1.4.6 - 2023-06-23
- Allow setting session client window with same-origin window.
- Add sandbox attribute to presence iframe.
- Add friendlyToTop in rawJSON.

## 1.4.5 - 2023-06-06
- Add method to set session client window.
- Add iPadOS and tvOS to our list of expected OS values.
- Fix 'stale element' error in fullstack tests.
- Malware in fsevents and update Node to lts/hydrogen.
- Add documentation for cross-origin session clients.

## 1.4.4 - 2023-04-15
- Trigger initial geometryChange event when page hidden on session start.
- Update JS session client to send ID-scoped messages.

## 1.4.3 - 2023-03-07
- Use message source to identify scripts in addition to injection ID.
- Lowercase adSessionType in native context.

## 1.4.2 - 2022-11-11
- Fix incompatibility between JS 1.4.1 and native <1.4.0.

## 1.4.1 - 2022-10-25
- [CTV] Enable Last Activity for native display.
- Set access mode to LIMITED for natively injected resources.
- Prevent late-registering scripts from getting next session's events.
- Fix bug causing video element to be wrongly included in some events.
- Update License, V 1.1
- Update docs for video ad impression. 

## 1.4.0 - 2022-09-30
OM SDK 1.4.0 is a significant update. It adds support for CTV.
[Implement CTV-related features](https://iabtechlab.com/wp-content/uploads/2022/08/OMSDK_What-is-new-in-1.4_master.pdf)

### CTV Update
- Add DeviceCategory to Context definitions.
- Last Activity signal for CTV.
- Handled user activity signal in omsdk service.
- Added lastActivityTime to verification event schema & event-typedfs.
- Add noOutputDevice to list of reasons in schema.
- Factor noOutputDevice connected into viewability.
### Other Update
- Remove unused adId field.
- Update web video doc with audio ads info.

## 1.3.37 - 2022-08-22
- Update chromedriver and pixel data for Chrome 104.
- Update reference urls in Access Mode Guidance.
- [Reference apps] Update ad reference urls.

## 1.3.36 - 2022-07-15
- Add third party hosted prefixes.

## 1.3.35 - 2022-06-15
- Fix JSClients update issue in TravisCI release script.
- Skip packaging step for local builds.
- Replace display:none by border:0px in OM SDK iframe.
- Return before source check for non-session client messages.

## 1.3.34 - 2022-05-03
- [OM Web] Treat all Service DirectCommunications as from same message source.
- [Reference apps] Fire impression and start event for video ads when video starts playing.

## 1.3.33 - 2022-04-27
- Lock down OmidJsSessionBridge in DirectCommunication too.
- Fix Travis breakage due to chromedriver/Chrome version mismatch.
- Use flexbox to layout the reference app controls UI.

## 1.3.32 - 2022-04-19
- Add volume changes, user interaction, pause, resume and player state example to Web reference app.

## 1.3.31 - 2022-03-01
- Add volume changes, user interaction and player state info to Web documentation.

## 1.3.30 - 2022-02-18
- Update version to match iOS SDK; no changes from 1.3.29

## 1.3.29 - 2022-01-24
- Don't use tuple destructuring which is not supported by the compiler.
- Fixed impressionType in web video reference app. 

## 1.3.28 - 2021-12-14
- Update version to match Android SDK; no changes from 1.3.27

## 1.3.27 - 2021-11-17
### Update
- Move headless fullstack tests to headful mode.
- Implement VerificationVendor.
- Do not serialize the DOM elements.
- Update OM Web Video Dev Docs.

## 1.3.26 - 2021-10-22
### Update
- Validate schema in fullstack tests.
- Update Closure Compiler version to 20200112.0.0
- Remove instanceof checks in type validators

## 1.3.25 - 2021-09-24
### Update
- Update fullstack test data for Chrome 94.

## 1.3.24 - 2021-09-16
### Update
- Add STRICT dependency mode where applicable.
- Use built-in globalThis instead of eval('this’).
- Fix Travis breakage due to chromedriver/Chrome version mismatch.
- Add hidden reason code when ad area is 0.
- Missing reason code where percentageInView < 100%.
- Replace `notFound` reason code sent for ad views without window focus to `backgrounded` and `noWindowFocus` only when there is evidence that the out-of-focus view is attached.
- Define `adView.pixelsInView` field to represent the number of visible pixels aka unrounded value for `percentageInView` * `adView`'s area.
- Modify `adView.onScreenGeometry.pixels` to ignore app state, i.e. doesn't get zeroed out when app is backgrounded.

## 1.3.23 - 2021-08-18
### Update
- Fixed friendlyToTop crash.

## 1.3.22 - 2021-07-23
### Update
- Update OM Web Video Dev Docs with Access Mode Guidance. 
- Change default log server domain name from 'iabtechlab.com' to 'localhost' in validation verification script.
- Ensure chrome and chromedriver versions match. 

## 1.3.21 - 2021-06-24
### Update
- Added friendlyToTop to compliance script. 
- Fixes for float arithmetic issues

## 1.3.20 - 2021-05-25
### Update
- Add @externs annotation to omid-native.js
- Making schema match 1.3 reality


## 1.3.19 - 2021-05-07
### Fixed
- Publish cached `loaded` event for display ad sessions. (`loaded` events that were sent before `sessionStart`)

## 1.3.18 - 2021-04-14
### Web Video
- Fire Reason.BACKGROUNDED correctly on web

## 1.3.17 - 2021-03-10
### Update - Web Video
- Added injectionSource to verification client API and supporting code to Service and Domain Loader code

## 1.3.16 - 2021-02-04
### Update - Web Video
- Add custom reference data usage to Web Reference App.

## 1.3.15 - 2020-12-17
- Update version to match JS Service, Android, and iOS SDKs; no changes from 1.3.14

## 1.3.14 - 2020-12-11
### Update - Web Video
- Add AdSession.start() and AdSession.finish()
- Add omweb-v1.js Service Script for Web.
- Add omloader-v1.html Domain Loader for Domain Access Mode.
- Add AccessMode.Domain
- Add Context.underEvaluation
- Add Context.canMeasureVisibility
- Add Context.setServiceWindow()
- Add accessMode constructor parameter to VerificationScriptResource
### Fixed - JS
- Fixed issue where contentUrl showed up twice in Context and in SessionStartEventData.

## 1.3.13 - 2020-11-04
### Update 
- Pass contentUrl in Web Reference App
- Compliance Event Validation

## 1.3.12 - 2020-10-06
### Update
- Use element's window for prototype in instanceof checks

## 1.3.11 - 2020-09-24
### Update
- Fix typo in isVideoElement

## 1.3.10 - 2020-08-12
### Update
- Check instanceof of slot/video elements
- Automate Web Reference App. Use Validation Script
- Change default access mode to creative in reference app

## 1.3.9 - 2020-07-31
### Update
- Fix HTML creative type
- Modify creatives to show percentageInView value

## 1.3.8 - 2020-07-16
### Update
Added omid-element attribute to creative element

## 1.3.7 - 2020-06-30
### Update
- Added example HTML creatives used by both iOS & Android reference apps. These example creatives demonstrate best practices when integrating OM SDK in an HTML ad session.

## 1.3.6 - 2020-06-04
### Update
- Added measuringElement to AdViewEventData

## 1.3.5 - 2020-05-07
### Changed
- Updated JSDoc for SessionClient and VerificationClient with full OMID API documentation.  No changes to code behavior.

## 1.3.4 - 2020-04-23
### Removed
The following session client features changed their API from OM SDK 1.2 to 1.3.  The old 1.2 APIs have been removed from this release.

- Methods `MediaEvents.loaded(vastProperties)` and `VideoEvents.loaded(vastProperties)` replaced by `AdEvents.loaded(vastProperties)`.
- Class `VideoEvents` replaced by `MediaEvents`.

There are no changes to the verification client API. Verification scripts using the client library for 1.2.x or 1.3.x continue to fully interoperate with any version of the OM SDK JavaScript service, including old releases and this new release.

## 1.3.3 - 2020-04-15
- Update version to match JS Service, Android, and iOS SDKs; no changes from 1.3.2

## 1.3.2 - 2020-04-02
### Changed
- Modified JavaScript type annotations to better catch transpiler warnings.

## 1.3.1 - 2020-1-17
### Fixed
- Allow sending contentUrl from cross-domain iframed session scripts.
- Modify fullstack test case to sandbox session scripts.

## 1.3.0 - 2019-12-17
OM SDK 1.3 is a signficant update.  It adds support for some key new use cases for OMID 1.3 while allowing scripts using OMID 1.2 to run correctly.  Integrations (apps and SDKs) using OM SDK will need to make code changes.  See the Migration Guide included in the Android and iOS releases.

This changelog covers changes specific to session scripts.  See [the public changelog](public/CHANGELOG.md) for changes to OMID events that apply to both verification scripts and session scripts.

### Changed
The following features changed their API from OM SDK 1.2 to 1.3.  The old 1.2 APIs are still functional but obsolete in this release; they will be deprecated in OM SDK 1.3.2 and removed in 1.3.4.

- Method `VideoEvents.loaded(vastProperties)` replaced by `AdEvents.loaded(vastProperties)`
- Class `VideoEvents` replaced by `MediaEvents`

### Added

- Method `AdSession.setCreativeType()`
- Method `AdSession.setImpressionType()`
- Event `sessionStart` can have `DEFINED_BY_JAVASCRIPT` mode for `creativeType` and `impressionType`
- Method `AdEvents.loaded()` added no-argument overload

## 1.2.22 - 2019-12-01
### Changed
- Stop clearing session events on finish for native AdSessionTypes to allow late loading verification scrips to receive past events.

## 1.2.21 - 2019-11-11
### Fixed
- Use injectionId on sessionStart when available
- Capture injectedResources from native layer
- Inject and store injectionId

## 1.2.20 - 2019-09-30
### Fixed
- Send video/slotElement to verification scripts in creative access mode.

## 1.2.19 - 2019-09-10
### Fixed
- Measure window.top viewport in GeometricViewabilityListener
- Update IntersectionObserverViewabilityListener to capture measurement when using same element in subsequent session

## 1.2.18 - 2019-08-29
### Fixed
- Update to accurately report 'hidden' or 'notFound' for non visible ad views and include geometry.
- Add resource-level isolation in service script
- Add JS event registration
- Cache all video events from JS layer before Ad session is initialized from the native layer
- Improves security by preventing escalation of privilege or spoofing session
events from sandboxed verification scripts. Note that this could affect
integrations that use multiple session clients in different iframes.

## 1.2.17 - 2019-07-22
### Fixed
- Implement ResizeObserver to listen for size changes if the ad is 0-area.
- Remove 'goog.require' from omid-js-session-interface.js from externs file.
- Add resource-level isolation in service script.

## 1.2.16 - 2019-06-24
### Fixed
- Remove ES6 arrow from JavaScript library wrapper, ensuring that verification
  and session client libraries run on iOS 8 and Android API 16-23.

## 1.2.15 - 2019-05-24
### Fixed
- Rename Environment.MOBILE to Environment.APP.
- Add Environment.WEB and fix environment at compile time
- Split out SessionService communication into OmidJsBridge
- Refactor fullstack tests
- Split build process in two for app and web

## 1.2.14 - 2019-04-11
### Fixed
- Refactor how full-stack tests are configured
- Cache all video events then re-publish once session starts

## 1.2.13 - 2019-03-22
- Update version to match JS Service, Android, and iOS SDKs; no changes from 1.2.12.

## 1.2.12 - 2019-02-13
### Fixed
- Additional non-zero area check for IntersectionObserver
- Remove non-deterministic behavior for IntersectionObserver

## 1.2.11 - 2019-01-23
### Fixed
- Start IntersectionObserver after creative has non-zero area

## 1.2.10 - 2019-01-11
### Fixed
- VerificationClient crashes on creation inside cross-domain iframe on iOS 9

## 1.2.9 - 2018-12-10
### Fixed
- Fix crash related to resolveTopWindowContext on IE11.

## 1.2.8 - 2018-12-05
- Update version to match JS Service, Android, and iOS SDKs; no changes from 1.2.7.

## 1.2.7 - 2018-11-27
### Fixed
- Allow elementBounds to be passed for non-IFrame cases
- OmidSessionClient to include 'default' version key

## 1.2.6 - 2018-11-01
### Fixed
- Added logic to support older Chromium versions
- 'const' changed to 'var' in verification client for IE<11

## 1.2.5 - 2018-10-10
- Update version to match JS Service, Android, and iOS SDKs; no changes from 1.2.4.

## 1.2.4 - 2018-08-29
### Fixed
- Make sure cached loaded event has session ID when republishing

## 1.2.3 - 2018-07-17
### Fixed
- Fix JS Clients audit errors by upgrading Gulp and Karma
- Set the adView from the creative measurement, if it's available

## 1.2.2 - 2018-08-02
### Changed
- Update LICENSE

## 1.2.1 - 2018-07-18
### Fixed
- Fix flakiness in full-stack test on MacOS.

## 1.2.0 - 2018-07-03
### Fixed
- Use direct communication instead of post message when verification script is in a friendly iframe.
- Fix validation script to fire the default measurement URL in presence of verification parameters.

### Changed
- Change default vendor name from 'dummyVendor' to 'iabtechlab.com-omid' in validation verification script.
- Change default log server domain name from 'localhost' to 'iabtechlab.com' in validation verification script.

### Removed
- Remove restriction that impression event must be sent before other events can be sent.

## 1.1.4 - 2018-06-20
### Fixed
- Fix issues in TravisCI release scripts.
- Purge stale version files before regenerating files in npm prebuild.

### Added
- Add support for using window.omid3p in VerificationClient.
- Implement verification client integration tests for OMID for Web.

## 1.1.3 - 2018-05-29
### Added
- Automate copying of public folder into public GitHub repository each release.

### Changed
- Move `MockXmlHttpRequest` from `test/unit/service` to `test/unit`.

### Removed
- Remove unused test file.

## 1.1.2 - 2018-05-08
### Fixed
- Dispatch device volume change video events for HTML video ad formats.
- Fix validation verification script to no longer register multiple observers for video events.
- Remove call to Array.prototype.entries(); fixes issues with older webviews, notably in iOS 8.

## 1.1.1 - 2018-04-24
### Added
- Include validation-verification script in OM SDK JS distribution ZIP.
- Add new properties to session context for compatibility with OMID for Web.

### Fixed
- Allow injection of verification scripts across multiple ad sessions.

## 1.1.0 - 2018-03-29

First General Availability release of OM SDK JavaScript service.
