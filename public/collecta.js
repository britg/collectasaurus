/**
 * Collecta Namespace
 **/
var Collecta = {
  _host:"http://174.129.20.246",
  //_host:"http://localhost:3000",
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
  
  // guess query
  var query = Collecta.guessQuery();

  // fetch our templates
  Collecta.fetchTemplates(function() {

    Collecta.search(query, function(results) {

      // parse response from collecta
      Collecta.parseResults(results);

      // display the results
      Collecta.showResults();
    });
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
Collecta.fetchTemplates = function(cb) {
  $.getJSON(this._host + '/templates?callback=?', function(r) {
    console.log('templates received');
    Collecta._t = $('<div>' + unescape(r) + '</div>');
    Collecta.showSidebar();
    cb.apply();
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

  return this._q = (typeof query == 'undefined') ? 'iPod' : query;
};

/**
 * Do a collecta search
 **/
Collecta.search = function(q, cb) {
  var results;

  var uri = this.api_host + '?api_key=' + this.api_key + 
    '&format=' + this.api_format + '&callback=?&q=' + q;
  $.getJSON(uri, function(r) {
    console.log('search results received');
    cb.apply(Collecta, [r]);
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
  console.log('showing results');

  // replace loading with results
  var resultWrap = $.template($('#results', Collecta._t).html());
  $('#collecta-sidebar').html(resultWrap, {
    "query": Collecta._q
    });

  var results = new JAtom(Collecta._resultSet);
  console.log(results);

  $.each(results.items, function(i, item) {
    if(item) {
      console.log(item);
      var rClone = $.template($('#result', Collecta._t).html());
      $('#collecta-results').append(rClone, {
        "result_title": '<a href="' + item.link + '">' + item.title + '</a>',
        "result_description":item.abstract,
        "result_type":item.category
      });
    }
  });

};

/**
 * Show collecta Sidebar
 **/
Collecta.showSidebar = function() {

  if($('#collecta').length > 0 || this._t.length < 1) return;

  console.log('showing sidebar', Collecta._t);

  var loading = $.template($('#loading', Collecta._t).html());

  $('body').append(loading, {
    "query": Collecta._q
  });
};
