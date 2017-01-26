jQuery(document).ready(function(){

    $("#watch button").mouseenter(function() {
	    $(this).fadeIn(function(){
                    $(this).addClass('watchhover');
                });
	});
});
