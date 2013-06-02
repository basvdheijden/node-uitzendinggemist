var request = require('request'),
    xml2js = require('xml2js'),
    crypto = require('crypto');
    Event = require('events').EventEmitter;

var UitzendingGemist = function(id, cb) {
  var self = this;

  if (!cb) {
    self.cb = function() {};
  }
  else {
    self.cb = cb;
  }

  this.e = new Event();

  this.id = id;
  this.episodeIdentifier = null;
  this.episodeURL = 'http://www.uitzendinggemist.nl/afleveringen/' + id;

  this.hash = null;

  this.playURL = null;

  this.securityString = null;
  this.securityURL = 'http://pi.omroep.nl/info/security/';

  this.getSecurity = function() {
    request({
      url: self.securityURL
    }, function(err, res, body) {
      if (err || res.statusCode !== 200) {
        throw new Error('Cannot load Security URL');
      }

      xml2js.parseString(body, function(err, res) {
        if (err || !res.session || !res.session.key || !res.session.key.length) {
          throw new Error('Cannot parse Security XML');
        }

        var security = new Buffer(res.session.key.shift(), 'base64').toString('ascii').split('|');
        if (security.length < 2) {
          throw new Error('Could not base64 decode Security String');
        }

        self.securityString = security[1];
        self.e.emit('security');
      });
    });
  };

  this.getEpisode = function() {
    request({
      url: self.episodeURL
    }, function(err, res, body) {
      if (err || res.statusCode !== 200) {
        throw new Error('Could not load ' + self.episodeURL);
      }

      var matches = body.match(/episodeID=(\w+)/);
      if (!matches || matches.length < 2) {
        throw new Error('Could not find episodeID at ' + self.episodeURL);
      }
      
      self.episodeIdentifier = matches[1];
      self.e.emit('episode');
    });
  };

  this.computeHash = function() {
    var identifier = self.episodeIdentifier + '|' + self.securityString;
    self.hash = crypto.createHash('md5').update(identifier).digest('hex').toUpperCase();
    self.e.emit('hash');
  };

  this.getSessionURL = function() {
    request({
      url: 'http://pi.omroep.nl/info/stream/aflevering/' + self.episodeIdentifier + '/' + self.hash
    }, function(err, res, body) {
      if (err || res.statusCode !== 200) {
        throw new Error('Could not load Session URL page.');
      }

      var urls = xml2js.parseString(body, function(err, res) {
        if (err || !res.streams || !res.streams.stream || !res.streams.stream.length) {
          throw new Error('Could not parse XML from Session URLS');
        }

        var url = false;
        res.streams.stream.forEach(function(s) {
          if (s.$.compressie_formaat === 'mov' && s.$.compressie_kwaliteit === 'std') {
            url = s.streamurl[0].trim();
          }
        });

        if (!url) {
          throw new Error('Could not find the right Play URL.');
        }

        self.playURL = url;
        self.e.emit('done', self.playURL);
      });
    });
  };

  self.e.on('security', this.getEpisode);
  self.e.on('episode', this.computeHash);
  self.e.on('hash', this.getSessionURL);
  self.e.on('done', self.cb);

  self.getSecurity();

  return self.e;
};

module.exports = exports = UitzendingGemist;