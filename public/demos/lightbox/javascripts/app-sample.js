/* =================
 * app-sample/app.js
 * ================= */

(function($, App) {

  "use strict";

  /* ============== */
  /* MODULE TRIGGER */
  /* ============== */

  var sampleTrigger = '[data-sample]';

  /* =============== */
  /* MODULE DEFAULTS */
  /* =============== */

  var defaults = {};

  /* ================= */
  /* MODULE DEFINITION */
  /* ================= */

  function Sample(opts) {
    this.settings = $.extend({}, defaults, opts);
    return this.init();
  }

  /* ============== */
  /* MODULE METHODS */
  /* ============== */

  Sample.prototype.init = function() {
    var that = this;
    // ..
    return this;
  };

  Sample.prototype.track = function() {
    var that = this;
    // ..
    return this;
  };

  Sample.prototype.destroy = function() {
    var that = this;
    // ..
    return this;
  };

  /* =============== */
  /* MODULE DATA-API */
  /* =============== */

  $(function() {
    var opts = {};
    App.sample = new Sample(opts);
  });

}(window.jQuery, window.App));
