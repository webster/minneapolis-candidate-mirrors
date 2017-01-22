jQuery(document).ready(function($) {
  $('#slideshow').addClass('slideshow');

  $('.menu-link').bigSlide(); 
  //http://css-tricks.com/snippets/jquery/addingremoving-class-on-hover/



  //make look like bootstrap buttons
    $(".more-link a").addClass("btn");
    $(".form-submit").addClass("btn btn-large tertiary");
	
  //make menu expand on hover as opposed to onclick
  $(".menu .expanded").hover(
    function () {
        $(this).addClass("open");
    },
    function () {
      $(this).removeClass("open");
  });
  $(".menu .dropdown-toggle").removeAttr("data-target");
  $(".menu .dropdown-toggle").removeAttr("data-toggle"); 

    console.log("bs3base theme script executed!");
});

var myPostRender = function() {
	(function ($) {
		$('.quicksignup .form-item-EmailAddress').insertBefore('.quicksignup .form-item-PostalCode');
		$('#ngpvan-oberon-webform').removeAttr('novalidate');
		$('.quicksignup #edit-emailaddress').attr('placeholder', 'Email Address');
		$('.quicksignup #edit-postalcode').attr('placeholder', 'Zip Code');
	    $(".ngp-form .form-submit").addClass("btn btn-large tertiary");	
   		$('body.html .nv-template-accelerator legend').addClass('primary');  
	}(jQuery));
};
var nvtag_callbacks = nvtag_callbacks || {};
nvtag_callbacks.postRender = nvtag_callbacks.postRender || [];
nvtag_callbacks.postRender.push(myPostRender);