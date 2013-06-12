var request = require('request'),
    xml2js = require('xml2js'),
    $ = require('jquery');

var Overzicht = function(cb) {
  var self = this;

  if (!cb) {
    self.cb = function() {};
  }
  else {
    self.cb = cb;
  }

  var RSSRequest = function(url, cb) {
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

  var ProgramRequest = function(r, uri, cb, page, items) {
    if (!page) {
      page = 1;
    }

    if (!items) {
      items = [];
    }

    request({
      uri: uri + '?page=' + page
    }, function(err, res, body) {
      if (err || res.statusCode !== 200) {
        throw new Error('Could not load URL.');
      }

      var $items = $('ol.list', body).find('li');
      if (!$items.length) {
        cb(items);
        return;
      }

      $items.each(function() {
        var $a = $(this).find('a').eq(0),
            title = $a.attr('title');

        if (title.match(r)) {
          items.push({
            title: title,
            url: 'http://www.uitzendinggemist.nl' + $a.attr('href') + '.rss'
          });
        }
      });

      ProgramRequest(r, uri, cb, ++page, items);
    });
  };

  self.getKijktips = function(cb) {
    RSSRequest('http://www.uitzendinggemist.nl/kijktips.rss', cb);
  };

  self.getTop50 = function(dayString, cb) {
    RSSRequest('http://www.uitzendinggemist.nl/top50/' + dayString + '.rss', cb);
  };

  self.getTop50Vandaag = function(cb) {
    self.getTop50('vandaag', cb);
  };

  self.getTop50Gisteren = function(cb) {
    self.getTop50('gisteren', cb);
  };

  self.getTop50Week = function(cb) {
    self.getTop50('week', cb);
  };

  self.getTop50Maand = function(cb) {
    self.getTop50('maand', cb);
  };

  self.searchProgramma = function(term, cb) {
    var uri = 'http://www.uitzendinggemist.nl/programmas/' + term.substr(0, 1).toLowerCase(),
        r = new RegExp(term, 'i');

    ProgramRequest(r, uri, function(items) {
      cb(items);
    });
  };

  self.searchUitzending = function(term, page, cb) {
    request({
      uri: 'http://www.uitzendinggemist.nl/zoek/uitzendingen?q=' + term + '&page=' + page
    }, function(err, res, body) {
      if (err || res.statusCode !== 200) {
        throw new Error('Could not load URL.');
      }

      var data = {
        title: $('#episodes .search-info', body).text(),
        items: [],
      };

      $('#episodes .list', body).find('li').each(function() {
        var $this = $(this),
            $link = $this.find('.description').find('a').eq(0);

        data.items.push({
          title: $link.attr('title'),
          description: $this.find('h3.episode a').attr('title'),
          id: $link.attr('href').match(/\/afleveringen\/(\d+)/)[1]
        });
      });

      cb(data);
    });
  };

  self.getProgrammaUitzendingen = function(programURL, page, cb) {
    if (!page) {
      page = 1;
    }

    RSSRequest(programURL + '?page=' + page, cb);
  };

  self.getNieuw = function(cb) {
    RSSRequest('http://www.uitzendinggemist.nl/nieuw.rss', cb);
  };

  return self;
};

module.exports = exports = Overzicht;