const ADTAG = '<?xml version="1.0" encoding="UTF-8"?><VAST xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:noNamespaceSchemaLocation="vast.xsd" version="3.0"><Ad id="000000001"><InLine><AdSystem>RMP</AdSystem><AdTitle>Inline linear video ad (3 sec)</AdTitle><Description><![CDATA[Test adTag for Radiant Media Player - inline linear VAST 3 video ad (3 sec)]]></Description><Error><![CDATA[https://www.radiantmediaplayer.com/vast/tags/ping.gif?type=error&errorcode=[ERRORCODE]]]></Error><Impression><![CDATA[https://www.radiantmediaplayer.com/vast/tags/ping.gif?type=impression&currenttime=[CONTENTPLAYHEAD]&cachebusting=[CACHEBUSTING]&asseturi=[ASSETURI]]]></Impression><Creatives><Creative id="00000000001" sequence="1"><Linear><Duration>00:00:03</Duration><TrackingEvents><Tracking event="start"><![CDATA[https://www.radiantmediaplayer.com/vast/tags/ping.gif?type=start]]></Tracking><Tracking event="firstQuartile"><![CDATA[https://www.radiantmediaplayer.com/vast/tags/ping.gif?type=firstQuartile]]></Tracking><Tracking event="midpoint"><![CDATA[https://www.radiantmediaplayer.com/vast/tags/ping.gif?type=midpoint]]></Tracking><Tracking event="thirdQuartile"><![CDATA[https://www.radiantmediaplayer.com/vast/tags/ping.gif?type=thirdQuartile]]></Tracking><Tracking event="complete"><![CDATA[https://www.radiantmediaplayer.com/vast/tags/ping.gif?type=complete]]></Tracking><Tracking event="mute"><![CDATA[https://www.radiantmediaplayer.com/vast/tags/ping.gif?type=mute]]></Tracking><Tracking event="unmute"><![CDATA[https://www.radiantmediaplayer.com/vast/tags/ping.gif?type=unmute]]></Tracking><Tracking event="rewind"><![CDATA[https://www.radiantmediaplayer.com/vast/tags/ping.gif?type=rewind]]></Tracking><Tracking event="pause"><![CDATA[https://www.radiantmediaplayer.com/vast/tags/ping.gif?type=pause]]></Tracking><Tracking event="resume"><![CDATA[https://www.radiantmediaplayer.com/vast/tags/ping.gif?type=resume]]></Tracking><Tracking event="fullscreen"><![CDATA[https://www.radiantmediaplayer.com/vast/tags/ping.gif?type=fullscreen]]></Tracking><Tracking event="creativeView"><![CDATA[https://www.radiantmediaplayer.com/vast/tags/ping.gif?type=creativeView]]></Tracking><Tracking event="exitFullscreen"><![CDATA[https://www.radiantmediaplayer.com/vast/tags/ping.gif?type=exitFullscreen]]></Tracking><Tracking event="acceptInvitationLinear"><![CDATA[https://www.radiantmediaplayer.com/vast/tags/ping.gif?type=acceptInvitationLinear]]></Tracking><Tracking event="closeLinear"><![CDATA[https://www.radiantmediaplayer.com/vast/tags/ping.gif?type=closeLinear]]></Tracking></TrackingEvents><VideoClicks><ClickThrough><![CDATA[https://www.radiantmediaplayer.com]]></ClickThrough><ClickTracking><![CDATA[https://www.radiantmediaplayer.com/vast/tags/ping.gif?type=clickTracking]]></ClickTracking></VideoClicks><MediaFiles><MediaFile id="RMP" delivery="progressive" width="640" height="360" type="video/mp4" bitrate="524" scalable="true" maintainAspectRatio="true"><![CDATA[https://www.radiantmediaplayer.com/vast/mp4s/ad-3s.mp4]]></MediaFile></MediaFiles></Linear></Creative></Creatives></InLine></Ad></VAST>';


describe('Test for raw-xml-input', function () {

  const id = 'rmp';
  const container = document.getElementById(id);
  const video = document.querySelector('.rmp-video');
  const rmpVast = new RmpVast(id, { vastXmlInput: true });
  const env = rmpVast.environment;
  video.muted = true;
  if (env.isAndroid[0] || env.isIos[0]) {
    container.style.width = '320px';
    container.style.height = '180px';
  }
  const title = document.getElementsByTagName('title')[0];
  const result = document.getElementById('result');
  const timeout = 30000;


  it('should load adTag and play it', function (done) {

    const _fail = () => {
      result.textContent = 'failed';
      title.textContent = 'Test finished';
      done.fail();
    };

    const _pass = () => {
      result.textContent = 'passed';
      title.textContent = 'Test finished';
      done();
    };

    setTimeout(() => {
      _fail();
    }, timeout);

    let validSteps = 0;

    const _incrementAndLog = function (event) {
      validSteps++;
      if (event && event.type) {
        console.log(event.type);
      }
    };

    rmpVast.on('adloaded', function (e) {
      _incrementAndLog(e);
    });
    rmpVast.on('addurationchange', function (e) {
      _incrementAndLog(e);
    });
    rmpVast.on('adimpression', function (e) {
      _incrementAndLog(e);
    });
    rmpVast.on('adstarted', function (e) {
      _incrementAndLog(e);
      setTimeout(function () {
        rmpVast.stopAds();
      }, 3000);
    });
    rmpVast.on('addestroyed', function (e) {
      _incrementAndLog(e);
      let timeupdateCount = 0;
      video.addEventListener('timeupdate', function (e) {
        timeupdateCount++;
        if (timeupdateCount === 5) {
          _incrementAndLog(e);
          expect(validSteps).toBe(6);
          if (validSteps === 6) {
            _pass();
          } else {
            _fail();
          }
        }
      });
    });

    rmpVast.loadAds(ADTAG);
  });


});
