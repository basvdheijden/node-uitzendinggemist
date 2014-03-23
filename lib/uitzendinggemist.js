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
  this.stream = false;

  this.getEpisode = function() {
    request({
      url: self.episodeURL
    }, function(err, res, body) {
      if (err || res.statusCode !== 200) {
        throw new Error('Could not load ' + self.episodeURL);
      }

      var matches = body.match(/data-player-id="(\w+)"/);
      if (!matches || matches.length < 2) {
        throw new Error('Could not find episodeID at ' + self.episodeURL);
      }

      self.episodeIdentifier = matches[1];
      self.e.emit('episode');
    });
  };

  this.computeHash = function() {
    var hashUrl = 'http://ida.omroep.nl/npoplayer/i.js';
    request({
      url: hashUrl
    }, function(err, res, body) {
      if (err || res.statusCode !== 200) {
        throw new Error('Could not load ' + hashUrl);
      }

      var matches = body.match(/npoplayer\.token\s+=\s+"(.+)"/);
      if (!matches || matches.length < 2) {
        throw new Error('Could not retrieve hash.');
      }

      self.hash = matches[1];
      self.e.emit('hash');
    });
  };

  this.getStream = function() {
    var url = 'http://ida.omroep.nl/odi/?prid=' + self.episodeIdentifier;
    url += '&puboptions=adaptive,h264_bb,h264_sb,h264_std&adaptive=no&part=1&token=' + self.hash;

    request({
      url: url
    }, function(err, res, body) {
      if (err || res.statusCode !== 200) {
        throw new Error('Could not load ' + url);
      }

      var info;
      try {
        info = JSON.parse(body);
      }
      catch(e) {
        throw new Error('Could not JSON parse body for streams.');
      }

      if (!info.streams || !info.streams.length) {
        throw new Error('Could not retrieve any stream.');
      }

      var stream = info.streams.filter(function(stream) {
        if (stream.match(/std/)) {
          return true;
        }
        return false;
      });

      if (!stream) {
        stream = info.streams;
      }

      self.stream = stream.shift().replace('?type=jsonp&callback=?', '');
      self.e.emit('stream');
    });
  };

  this.loadStream = function() {
    request({
      url: self.stream
    }, function(err, res, body) {
      if (err || res.statusCode !== 200) {
        throw new Error('Could not load ' + self.stream);
      }

      var info;
      try {
        info = JSON.parse(body);
      }
      catch(e) {
        throw new Error('Could not JSON parse body for streams.');
      }

      if (info.errorcode && info.errorcode !== 0) {
        throw new Error('Received errorcode: ' + info.errorcode);
      }

      if (!info.server || !info.path || !info.protocol) {
        throw new Error('Did not receive all necessary components');
      }

      var url = info.protocol + '://' + info.server + info.path;
      self.e.emit('done', url);
    });
  };

  self.e.on('episode', self.computeHash);
  self.e.on('hash', self.getStream);
  self.e.on('stream', self.loadStream);
  self.e.on('done', self.cb);

  self.getEpisode();

  return self.e;
};

module.exports = exports = UitzendingGemist;