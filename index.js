var UitzendingGemist = require('./lib/uitzendinggemist');
var Overzicht = require('./lib/overzicht');

// var u = new UitzendingGemist(1348184, function(url) {
//   console.log(url);
// });

var overzicht = new Overzicht();
overzicht.getKijktips(function(items) {
  console.log(items);
});