var $ = window.jQuery;
$(function() {
    $('.appnexus-ad').Lazy({
        // callback
	    beforeLoad: function(element) {
	    	//console.log('element is about to load');
	    	//var tag = element.text().replace(/\s/g,'');
	        //console.log('load this ' + tag);
	        //OAS_AD(tag);
	    },

	    afterLoad: function(element) {
	    	//console.log('element was loaded');
	    	//var tag = element.text().replace(/\s/g,'');
	        //console.log('load this ' + tag);
	        //element.html('<script>OAS_AD("' + tag + '");</script>');
	    },

	    // custom loaders
	    lazyLoadAd: function(element) {
	     	//element.load();
	     	var tag = element.text().replace(/\s/g,'');
	        //console.log('load this ' + tag);
	        element.html('<script>OAS_AD("' + tag + '");</script>');
	    }
    });
});