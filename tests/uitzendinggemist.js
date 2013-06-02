var UitzendingGemist = require('../lib/uitzendinggemist');

module.exports = exports = {
  setUp: function(cb) {
    cb();
  },

  tearDown: function(cb) {
    cb();
  },

  UitzendingGemist: function(test) {
    test.expect(1);

    var regex = /^http:\/\/odi.omroep.nl\/video\/embedplayer\/(.+)\/(.+)\//;

    var u = new UitzendingGemist(1348184, function(url) {
      test.ok(url.match(regex), 'URL should match the regex.');
      test.done();
    });
  }
};