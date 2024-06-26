const ADTAG = 'https://pubads.g.doubleclick.net/gampad/ads?iu=/21775744923/external/single_ad_samples&sz=640x480&cust_params=sample_ct%3Dlinearvpaid2js&ciu_szs=300x250%2C728x90&gdfp_req=1&output=vast&unviewed_position_start=1&env=vp&impl=s&correlator=' + Date.now();

describe('Test for vpaid-js-linear-2', function () {

  const id = 'rmp';
  const container = document.getElementById(id);
  const video = document.querySelector('.rmp-video');
  const params = {
    enableVpaid: true,
    vpaidSettings: {
      width: 640,
      height: 360,
      viewMode: 'normal',
      desiredBitrate: 500
    }
  };
  const rmpVast = new RmpVast(id, params);
  const env = rmpVast.environment;
  video.muted = true;
  if (env.isAndroid[0] || env.isIos[0]) {
    container.style.width = '320px';
    container.style.height = '180px';
  }
  const title = document.getElementsByTagName('title')[0];
  const result = document.getElementById('result');
  const timeout = 30000;


  it('should load and play vpaid-js-linear-2', done => {

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

    const _incrementAndLog = (event) => {
      validSteps++;
      if (event && event.type) {
        console.log(event.type);
      }
    };

    rmpVast.on('adloaded', e => {
      _incrementAndLog(e);
    });
    rmpVast.on('addurationchange', e => {
      _incrementAndLog(e);
    });
    rmpVast.on('adstarted', e => {
      if (env.isAndroid[0] || env.isIos[0]) {
        rmpVast.resizeAd(320, 180, 'normal');
      }
      _incrementAndLog(e);
      setTimeout(function () {
        rmpVast.volume = 0.5;
      }, 400);
    });
    rmpVast.on('advolumechanged', e => {
      if (rmpVast.volume === 0.5) {
        _incrementAndLog(e);
      }
    });
    rmpVast.on('adtagstartloading', e => {
      _incrementAndLog(e);
    });
    rmpVast.on('adtagloaded', e => {
      _incrementAndLog(e);
    });
    rmpVast.on('addestroyed', e => {
      _incrementAndLog(e);
      let timeupdateCount = 0;
      video.addEventListener('timeupdate', e => {
        timeupdateCount++;
        if (timeupdateCount === 5) {
          _incrementAndLog(e);
          expect(validSteps).toBe(8);
          if (validSteps === 8) {
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
