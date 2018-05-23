( function( $ ) {

  /*! minnpost-styles - v0.0.6-alpha - 2016-02-24
  * https://github.com/MinnPost/minnpost-styles
  * Copyright (c) 2016 ; Licensed MIT */

  !function(a,b){if("undefined"!=typeof module&&module.exports&&"function"==typeof require)module.exports=b(require("jquery"),require("underscore"));else if("function"==typeof define&&define.amd)define(["jquery","underscore"],b);else{if(!a.jQuery||!a._)throw new Error("Could not find dependencies for MinnPost Styles Navigation.");a.MP=a.MP||{},a.MP.nav=b(a.jQuery,a._)}}("undefined"!=typeof window?window:this,function(a,b){function c(b,c){this.element=b,this.$element=a(b),this._defaults=e.MPStickDefaults,this.options=a.extend({},this._defaults,c),this._name="mpStick",this._scrollEvent="scroll.mp.mpStick",this._on=!1,this.init()}function d(b,c){this.element=b,this.$element=a(b),this._defaults=e.MPScrollSpyDefaults,this.options=a.extend({},this._defaults,c),this._name="mpScollSpy",this._scrollEvent="scroll.mp.mpScollSpy",this.init()}var e={};return e.MPStickDefaults={activeClass:"stuck top",wrapperClass:"minnpost-full-container",topPadding:0,throttle:90},c.prototype={init:function(){this.$container=void 0===this.options.container?this.$element.parent():a(this.options.container),this.elementHeight=this.$element.outerHeight(!0),this.$spacer=a("<div>").height(this.elementHeight).hide(),this.$element.after(this.$spacer),this.options.wrapperClass&&this.$element.wrapInner('<div class="'+this.options.wrapperClass+'"></div>'),this._throttledListen=b.bind(b.throttle(this.listen,this.options.throttle),this),this._throttledListen(),a(window).on(this._scrollEvent,this._throttledListen)},listen:function(){var b=this.$container.offset().top,c=b+this.$container.height(),d=a(window).scrollTop(),e=b-this.options.topPadding,f=c-this.elementHeight-this.options.topPadding-2;!this._on&&d>e&&f>d?this.on():this._on&&(e>d||d>f)&&this.off()},on:function(){this.$element.addClass(this.options.activeClass),this.options.topPadding&&this.$element.css("top",this.options.topPadding),this.$spacer.show(),this._on=!0},off:function(){this.$element.removeClass(this.options.activeClass),this.options.topPadding&&this.$element.css("top","inherit"),this.$spacer.hide(),this._on=!1},remove:function(){this.$container.off(this._scrollEvent)}},a.fn.mpStick=function(b){return this.each(function(){a.data(this,"mpStick")||a.data(this,"mpStick",new c(this,b))})},e.MPScrollSpyDefaults={activeClass:"active",offset:80,throttle:200,gotoEvent:"click",gotoPreventDefault:!0,gotoSpeed:600},d.prototype={init:function(){this.$listeners=this.$element.find("[data-spy-on]"),this.$targets=this.$element.find("[data-spy-me]"),this._throttledListen=b.bind(b.throttle(this.listen,this.options.throttle),this),this._throttledListen(),a(window).on(this._scrollEvent,this._throttledListen),this.options.gotoEvent&&this.$listeners.on(this.options.gotoEvent,b.bind(this.gotoClick,this))},listen:function(){var b,c=this,d=a(window).scrollTop();this.$targets.each(function(){var e=a(this);e.offset().top<=d+(c.options.offset+5)&&(b=e.data("spyMe"))}),b&&(this.$listeners.removeClass(this.options.activeClass),this.$element.find('[data-spy-on="'+b+'"]').addClass(this.options.activeClass))},gotoClick:function(b){this.options.gotoPreventDefault&&b.preventDefault();a(b.target);this.goto(a(b.target).data("spyOn"))},"goto":function(b){var c=this.$element.find('[data-spy-me="'+b+'"]'),d=c.offset().top;a("html, body").animate({scrollTop:d-this.options.offset},this.options.gotoSpeed)},remove:function(){this.$container.off(this._scrollEvent)}},a.fn.mpScrollSpy=function(b){return this.each(function(){a.data(this,"mpScrollSpy")||a.data(this,"mpScrollSpy",new d(this,b))})},e});


  $('body').mpScrollSpy();
  // mpStick will use sensible defaults
  $('.in-page').mpStick();

  if ($('.in-page').hasClass('stuck')) {
    var height = $('.top').next().height();
    $('.panel:visible').css('marginTop', height);
  }

  /*global $*/

  // a temp value to cache *what* we're about to show
  var target = null;

  // collect all the tabs
  var tabs = $('.tab').on('click', function () {
    target = $(this.hash).removeAttr('id');
    if (location.hash === this.hash) {
      setTimeout(update);
    }
  }).attr('tabindex', '0');

  // get an array of the panel ids (from the anchor hash)
  var targets = tabs.map(function () {
    return this.hash;
  }).get();

  // use those ids to get a jQuery collection of panels
  var panels = $(targets.join(',')).each(function () {
    // keep a copy of what the original el.id was
    $(this).data('old-id', this.id);
  });

  function update() {
    if (target) {
      target.attr('id', target.data('old-id'));
      target = null;
    }
    
    var hash = window.location.hash;
    if (targets.indexOf(hash) !== -1) {
      return show(hash);
    }
    
    // NOTE: this was added after the article was written
    // to fix going "back" on the browser nav to an empty state
    if (!hash) {
      show();
    }
  }

  function show(id) {
    // if no value was given, let's take the first panel
    if (!id) {
      id = targets[0];
    }
    // remove the selected class from the tabs,
    // and add it back to the one the user selected
    tabs.removeClass('selected').attr('aria-selected', 'false').filter(function () {
      return (this.hash === id);
    }).addClass('selected').attr('aria-selected', 'true');

    // now hide all the panels, then filter to
    // the one we're interested in, and show it
    panels.hide().attr('aria-hidden', 'true').filter(id).show().attr('aria-hidden', 'false');
  }

  window.addEventListener('hashchange', update);

  // initialise
  if (targets.indexOf(window.location.hash) !== -1) {
    update();
  } else {
    show();
  }

  $('.x').on('click', function() {
    $(this).closest('nav').toggleClass('open');
  });

} )( jQuery );