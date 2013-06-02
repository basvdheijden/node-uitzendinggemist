var Overzicht = require('../lib/overzicht');

module.exports = {
  setUp: function(cb) {
    cb();
  },

  tearDown: function(cb) {
    cb();
  },

  Kijktips: function(test) {
    test.expect(3);

    var overzicht = new Overzicht();
    overzicht.getKijktips(function(items) {
      test.ok(typeof items.item !== 'undefined', 'Items.item should exist.');
      test.ok(items.item.length > 5, 'Items should have considerable length');
      test.ok(typeof items.item[0].title[0] === 'string', 'First item title should exist and be string.');
      test.done();
    });
  },

  Top50Vandaag: function(test) {
    test.expect(3);

    var overzicht = new Overzicht();
    overzicht.getTop50Vandaag(function(items) {
      test.ok(typeof items.item !== 'undefined', 'Items.item should exist.');
      test.ok(items.item.length > 5, 'Items should have considerable length');
      test.ok(typeof items.item[0].title[0] === 'string', 'First item title should exist and be string.');
      test.done();
    });
  },

  Top50Gisteren: function(test) {
    test.expect(3);

    var overzicht = new Overzicht();
    overzicht.getTop50Gisteren(function(items) {
      test.ok(typeof items.item !== 'undefined', 'Items.item should exist.');
      test.ok(items.item.length > 5, 'Items should have considerable length');
      test.ok(typeof items.item[0].title[0] === 'string', 'First item title should exist and be string.');
      test.done();
    });
  },

  Nieuw: function(test) {
    test.expect(3);

    var overzicht = new Overzicht();
    overzicht.getNieuw(function(items) {
      test.ok(typeof items.item !== 'undefined', 'Items.item should exist.');
      test.ok(items.item.length === 5, 'Items should have length of exactly 5');
      test.ok(typeof items.item[0].title[0] === 'string', 'First item title should exist and be string.');
      test.done();
    });
  }
};