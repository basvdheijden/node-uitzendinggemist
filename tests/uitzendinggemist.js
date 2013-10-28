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

    var regex = /urishieldv2/;
    var u = new UitzendingGemist(1348184, function(url) {
      test.ok(url.match(regex), 'URL should match the regex.');
      test.done();
    });
  },

  UitzendingGemistNOS: function(test) {
    test.expect(1);

    var regex = /urishieldv2/;
    var u = new UitzendingGemist(1375935, function(url) {
      test.ok(url.match(regex), 'URL should match the regex.');
      test.done();
    });
  },

  uitzendingGemistRandomTry: function(test) {
    test.expect(1);

    var regex = /urishieldv2/;
    var u = new UitzendingGemist(1375820, function(url) {
      test.ok(url.match(regex), 'URL should match the regex.');
      test.done();
    });
  }
};
