/**
 * @file <%= moduleName %> module.
 * @version <%= projectVersion %>
 * @author {@link <%= yourUrl %> <%= yourName %>}
 */
 var bb = bb ? bb : {};
 (function ($) {
  $.extend(bb, {
    /**
     * Site <%= moduleName %> related methods.
     * @namespace <%= moduleName %>
     */
    <%= moduleName %>: {
      /**
      * Initialises <%= moduleName %> module.
      * @function init
      * @memberof <%= moduleName %>
      */
      init: function () {
        var self = this;

        self.bindEvents();
      },
      /**
      * Binds <%= moduleName %> module events.
      * @function bindEvents
      * @memberof <%= moduleName %>
      */
      bindEvents: function () {

      }
    }
  });
  $.subscribe('pageReady', function () {
    bb.<%= moduleName %>.init();
  });
}(jQuery));
