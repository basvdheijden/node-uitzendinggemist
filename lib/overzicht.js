var request = require('request'),
    xml2js = require('xml2js');

var Overzicht = function(cb) {
  var self = this;

  if (!cb) {
    self.cb = function() {};
  }
  else {
    self.cb = cb;
  }

  var doRequest = function(url, cb) {
    request({
      url: url
    }, function(err, res, body) {
      if (err || res.statusCode !== 200) {
        throw new Error('Could not load URL.');
      }

      xml2js.parseString(body, function(err, res) {
        if (err) {
          throw new Error('Could not parse XML.');
        }

        parse(res, cb);
      });

    });
  };

  var parse = function(obj, cb) {
    if (!obj.rss || !obj.rss.channel || !obj.rss.channel.length) {
      throw new Error('Could not parse RSS');
    }
    
    cb(obj.rss.channel[0]);
  };

  self.getKijktips = function(cb) {
    doRequest('http://www.uitzendinggemist.nl/kijktips.rss', cb);
  };

  self.getTop50 = function(dayString, cb) {
    doRequest('http://www.uitzendinggemist.nl/top50/' + dayString + '.rss', cb);
  };

  self.getTop50Vandaag = function(cb) {
    self.getTop50('vandaag', cb);
  };

  self.getTop50Gisteren = function(cb) {
    self.getTop50('gisteren', cb);
  };

  self.getNieuw = function(cb) {
    doRequest('http://www.uitzendinggemist.nl/nieuw.rss', cb);
  };

  return self;
};

module.exports = exports = Overzicht;