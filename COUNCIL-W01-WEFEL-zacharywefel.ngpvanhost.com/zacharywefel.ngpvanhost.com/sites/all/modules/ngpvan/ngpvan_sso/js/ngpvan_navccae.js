(function($) {
  Drupal.behaviors.ngpNavToggle = {
    attach: function(context, settings) {
      $('.ngpvan-nav-button').click(function() {
        var offset = $('.ngpvan-nav-button').offset();
        if ($('.ngpvan-nav').is(':visible')) {
          var o = { top: offset.top, left: (offset.left + $('.ngpvan-nav').width()) };
        }
        else {
          var o = { top: offset.top, left: (offset.left - $('.ngpvan-nav').width()) };
          $('.ngpvan-nav-button').offset(o);
        }
        $('.ngpvan-nav-button').offset(o);
        $('.ngpvan-nav').toggle();
        return false;
      });
    }
  };
})(jQuery);