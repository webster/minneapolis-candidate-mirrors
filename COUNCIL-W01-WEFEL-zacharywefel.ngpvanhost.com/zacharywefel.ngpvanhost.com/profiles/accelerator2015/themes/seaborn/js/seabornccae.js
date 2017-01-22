jQuery(document).ready(function($) {
  $('body.placeholder .group-ngpaction h4.field-name-field-ngp-form-label').addClass('quaternary');
  $('body.html .nv-template-accelerator input.form-submit').addClass('secondary');
 
  if ($('.group-ngpaction:in-viewport').length > 0) {
	$('fieldset.group-ngpaction').addClass('inviewport');
  };
  if ($('.group-ngpaction:below-the-fold').length > 0) {
	$('fieldset.group-ngpaction').addClass('below');
  };
  
 //make form submits look like bootstrap buttons
    $(".form-submit").addClass("btn btn-large");
	   console.log("seaborn script executed!");
});

var myPostRender = function() {
	(function ($) {
		$('.group-ngpaction .form-item-EmailAddress').insertBefore('.group-ngpaction .form-item-PostalCode');
		$('.group-ngpaction #ngpvan-oberon-webform').removeAttr('novalidate');
		$('body.placeholder .group-ngpaction #edit-emailaddress').attr('placeholder', 'Email Address');
		$('body.placeholder .group-ngpaction #edit-postalcode').attr('placeholder', 'Zip Code');
		$('body.placeholder .group-ngpaction .ngp-form-submit input').replaceWith('<button class="quaternary icon-envelope-alt"></button>');
		$(".group-ngpaction h4").fitText(1.2);
	}(jQuery));
};
var nvtag_callbacks = nvtag_callbacks || {};
nvtag_callbacks.postRender = nvtag_callbacks.postRender || [];
nvtag_callbacks.postRender.push(myPostRender);