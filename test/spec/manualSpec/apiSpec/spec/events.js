const ADTAG1 = 'https://pubads.g.doubleclick.net/gampad/ads?iu=/21775744923/external/single_preroll_skippable&sz=640x480&ciu_szs=300x250%2C728x90&gdfp_req=1&output=vast&unviewed_position_start=1&env=vp&impl=s&correlator=' + Date.now();


describe('Test for API events', function () {

  const id = 'rmp';
  const video = document.querySelector('.rmp-video');
  const rmpVast = new RmpVast(id, {
    showControlsForAdPlayer: true
  });
  video.muted = true;
  const title = document.getElementsByTagName('title')[0];

  it('should API events', function (done) {
    let eventsSteps = 0;

    // this one requires manual action
    // when ad is paused do this:
    // click the ad to verify the adclick event
    // unmute the ad to verify advolumechanged and then remute the ad to verify advolumemuted event
    // when the ad nears the end (after 7.5 sec) > skip the ad to verify adskipped event

    const events = [
      'adtagstartloading',
      'adtagloaded',
      'adloaded',
      'adimpression',
      'adcreativeview',
      'adinitialplayrequestsucceeded',
      'adfirstquartile',
      'adpaused',
      'advolumechanged',
      'advolumemuted',
      'advolumeunmuted',
      'adresumed',
      'adskippablestatechanged',
      'admidpoint',
      'adthirdquartile',
      'adclick',
      'adskipped'
    ];

    const _incrementAndLogEvents = function (event) {
      eventsSteps++;
      if (event && event.type) {
        console.log(event.type + ' at step ' + eventsSteps);
      }
    };

    events.forEach((event) => {
      rmpVast.one(event, function (e) {
        _incrementAndLogEvents(e);
      });
    });

    rmpVast.one('adstarted', function (e) {
      _incrementAndLogEvents(e);
      setTimeout(() => {
        rmpVast.pause();
      }, 3000);
    });

    rmpVast.one('addestroyed', function (e) {
      _incrementAndLogEvents(e);
      expect(eventsSteps).toBe(19);
      if (eventsSteps === 19) {
        title.textContent = 'Test completed';
        done();
      }
    });

    rmpVast.loadAds(ADTAG1);
  });


});
