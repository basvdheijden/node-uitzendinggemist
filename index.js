var UitzendingGemist = require('./lib/uitzendinggemist');
var Overzicht = require('./lib/overzicht');

module.exports = exports = function() {
  return {
    UitzendingGemist: UitzendingGemist,
    Overzicht: Overzicht
  };
};