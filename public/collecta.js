/**
 * Collecta Namespace
 **/
var Collecta = {
  _host:"http://localhost:3000",
  _resultSet:[],
  _t:"",
  _q:"",
  api_key:"660c2b67935a96fe8bddc7eb94f182e0",
  api_host:"http://api.collecta.com/search",
  api_format:"atom"
};

/**
 * Initialize the sidebar
 **/
Collecta.init = function() {

  // featch our styles
  Collecta.fetchStyles();

  // fetch our templates
  Collecta.fetchTemplates();

  // determine search query and do search
  var query = Collecta.guessQuery();
  Collecta.search(query, function(results) {

    // parse response from collecta
    Collecta.parseResults(results);

    // display the results
    Collecta.showResults();
  });

};

/**
 * Fetch styles and append to
 * head
 **/
Collecta.fetchStyles = function() {
  var heads = document.getElementsByTagName('head');
  var head = heads[0];
  var link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = this._host+'/stylesheets/client.css' + '?_=' + Math.random();
  head.appendChild(link);
};

/**
 * Fetch templates
 **/
Collecta.fetchTemplates = function() {
  $.getJSON(this._host + '/templates?callback=?', function(r) {
    console.log('templates fetched');
    Collecta._t = unescape(r);
    Collecta.showResults();
  });
};

/**
 * Guess the intended query from our environment
 **/
Collecta.guessQuery = function() {
  var query;
  var params = window.location.href.split('&');
  $.each(params, function(i, pair) {
    var parts = pair.split('=');
    if(parts[0] == 'q') {
      query = parts[1];
      return false;
    }
  });

  return (typeof query == 'undefined') ? 'capital factory' : query;
};

/**
 * Do a collecta search
 **/
Collecta.search = function(q, cb) {
  this._q = q;
  var results;

  var uri = this.api_host + '?api_key=' + this.api_key + 
    '&format=' + this.api_format + '&callback=?&q=' + this._q;
  $.getJSON(uri, function(r) {
    cb.apply(Collecta, [r.results]);
  });

};

/**
 * Parse the search results
 **/
Collecta.parseResults = function(results) {
  this._resultSet = results;
};

/**
 * Show results
 *  - only if we have both templates
 *    and search results
 **/
Collecta.showResults = function() {

  // do we have our search results? if
  // not, just show a loading screen
  if($('#collecta').length < 1) {
    Collecta.showSidebar();
    Collecta.showResults();
    return;
  }

  var r = Collecta._resultSet;
  console.log(r);

};

/**
 * Show collecta Sidebar
 **/
Collecta.showSidebar = function() {
  console.log('showing sidebar');
  var $html = $('<div>' + this._t + '</div>');

  var base = $.template($('#base', $html).html())
  
  $('body').append(base, {
    "query":this._q
  });
};
