'use strict';

describe("Test for FWVAST (rmp-vast internal framework)", function () {

  var id = 'rmpPlayer';
  var rmpVast = new RmpVast(id);
  var fwVAST = rmpVast.getFWVAST();

  it("should load all pass", function () {
    expect(fwVAST.hasDOMParser()).toBe(true);
    expect(fwVAST.vastReadableTime(100)).toBe('00:00:00.100');
    expect(fwVAST.vastReadableTime(10000)).toBe('00:00:10.000');
    expect(fwVAST.vastReadableTime(100000)).toBe('00:01:40.000');
    expect(fwVAST.vastReadableTime(0)).toBe('00:00:00.000');
    expect(fwVAST.vastReadableTime(10000000)).toBe('02:46:40.000');
    expect(fwVAST.generateCacheBusting().length).toBe(8);
    expect(fwVAST.RFC3986EncodeURIComponent('https://developers.google.com/interactive-media-ads/docs/sdks/html5/vastinspector')).toBe('https%3A%2F%2Fdevelopers.google.com%2Finteractive-media-ads%2Fdocs%2Fsdks%2Fhtml5%2Fvastinspector');
    expect(fwVAST.isValidOffset('30%')).toBe(true);
    expect(fwVAST.isValidOffset('00:00:10.000')).toBe(true);
    expect(fwVAST.isValidOffset('00/00/10.000')).toBe(false);
    expect(fwVAST.convertOffsetToSeconds('00:00:10.000', 90)).toBe(10);
    expect(fwVAST.convertOffsetToSeconds('50%', 90)).toBe(45);
  });

});
