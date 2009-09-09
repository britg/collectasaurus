;(function($) {
  //= require "collecta"
  Collecta.init();
})(jQuery);

/**
 * Fix various IE issues
 **/
function fixIE() {
  if (!Array.indexOf) {
    Array.prototype.indexOf = function(arg) {
      var index = -1;
      for (var i = 0; i < this.length; i++){
        var value = this[i];
        if (value == arg) {
          index = i;
          break;
        } 
      }
      return index;
    };
  }

  if (!window.console) {
    window.console = {};
    window.console.log = window.console.debug = function(message) {
      return;
      var body = document.getElementsByTagName('body')[0];
      var messageDiv = document.createElement('div');
      messageDiv.innerHTML = message;
      body.insertBefore(messageDiv, body.lastChild);
    };
  } 
}
fixIE();
