var UitzendingGemistAPI = require('./lib/uitzendinggemist');
var Overzicht = require('./lib/overzicht');

module.exports = exports = function() {
  return {
    Uitzending: UitzendingGemistAPI,
    Overzicht: Overzicht
  };
};