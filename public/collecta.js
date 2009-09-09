/**
 * Collecta Namespace
 **/
var Collecta = {
  _host:"http://localhost:3000",
  _resultSet:[],
  _t:"",
  _q:""
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
    Collecta._t = unescape(r);
    Collecta.showResults();
  });
};

/**
 * Guess the intended query from our environment
 **/
Collecta.guessQuery = function() {
  console.log(window);
  return 'capital factory';
};

/**
 * Do a collecta search
 **/
Collecta.search = function(q, cb) {

  var results;

  results = "{}";

  cb.apply(Collecta, [results]);
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
  console.log(Collecta._resultSet, Collecta._t);
};
