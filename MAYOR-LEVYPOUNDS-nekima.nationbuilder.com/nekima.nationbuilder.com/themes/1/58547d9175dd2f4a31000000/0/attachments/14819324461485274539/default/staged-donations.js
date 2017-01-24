var StagedDonations = StagedDonations || {};

$(document).ready(function(){

  function isIOS() {
    return /iPhone|iPad|iPod/i.test(navigator.userAgent);
  }

  (function(){

    this.updateDonationAmount = function(amount) {
      var donation = this.formatDonationAmount(amount);
      $('.donation-amount').text(donation);
    }
    this.formatDonationAmount = function(amount) {
      var donation = Number(amount).toFixed(2);
      return '$' + donation.toString();
    }

    this.updateContainerHeight = function(height) {
      $('.progress-stages').animate({'min-height':height},300);
    }

    this.updateProgressIndicator = function(indicator, direction) {
      var current = indicator.find('.active');
      var next = current.next();
      var previous = current.prev();
      if (direction && current.next().length) { // direction = 0 if going backwards, 1 if going forwards
        current.addClass('completed').find('.stage-count-inner').addClass('icon-tick');
        current.removeClass('active');
        next.addClass('active');
        next.addClass('seen');
      } else if (!direction && current.prev().length) {
        current.removeClass('active');
        previous.addClass('active');
      } else {
        // do nothing
      }
    }

    this.updateProgressStages = function(stages, direction) {
      var ns = this;
      var current = stages.find('.active');
      var next = current.next();
      var previous = current.prev();
      if ($('.row-error input:invalid').length === 0 ) {
        $('.row-error').removeClass('row-error');
      }
      if (direction && current.next().length) { // direction = 0 if going backwards, 1 if going forwards
        current.hide('slide',{direction:'left',easing:'easeInBack'},300,function(){
          $(this).removeClass('active');
          current.next().show('slide',{direction:'left'},300,function(){$(this).addClass('active');});
        });
      } else if (!direction && current.prev().length) {
        current.hide('slide',{direction:'left',easing:'easeInBack'},function(){$(this).removeClass('active');
          current.prev().show('slide',{direction:'left'},300,function(){$(this).addClass('active');});
        });
      } else {
        // do nothing
      }
    }

    this.triggerAlert = function(alertMessage, insertBefore) {
      var message = '<div class="form-error">'+alertMessage+'</div>';
      if (insertBefore.prev().hasClass('form-error')) {
        return;
      }
      insertBefore.closest('.row').addClass('row-error');
      insertBefore.before(message);
    }

    this.removeAlerts = function() {
      $('.form-error').remove();
      $('.error').each(function(){
        $(this).removeClass('error');
      });
    }

    this.validateEmail = function() {
      var email = $('#donation_email');
      var re = /\S+@\S+\.\S+/;
      if (re.test(email.val()) || email.siblings('.form-error').length) {
        return true;
      } else {
        email.removeClass('validation-check');
        this.triggerAlert(email.attr('placeholder') + ' is required', email);
        return false;
      }
    }

    this.validateRequiredFields = function(num) {
      var query = '.stage-' + num + ' :invalid';
      var validationNodes = document.querySelectorAll(query);
      for (var i = 0; i < validationNodes.length; i++) {
        validationNodes[i].classList.remove('validation-check');
        var $nodeId = "#"+validationNodes[i].id;
        if ($nodeId !== 'donation_email' || !isIOS()) {
          this.triggerAlert(validationNodes[i].placeholder + ' is required', $($nodeId));
        } else {
          this.validateEmail();
          $('#donation_email').keyup(this.validateEmail());
        }
        if (validationNodes.length - i === 1) {
          return false;
        }
      }
      return true;
    }


    this.validateDonations = function(currentStage) {
      var donationAmount = parseFloat($('#donation_amount_other').val());
      switch (currentStage) {
        case "1":
          if ((donationAmount < 0.01) && ($('.progress-stage input[type="radio"]:checked').length == 0)) {
            $('#donation_amount_other').addClass('error');
            this.triggerAlert("Invalid donation amount",$('#donation_amount_other'));
            return false;
          } else {
            return this.validateRequiredFields(1);
          }
          break;
        case "2":
          return this.validateRequiredFields(2);
          break;
        case "3":
          return this.validateRequiredFields(3);
          break;
        default:
          return true;
      }
    }

  }).apply(StagedDonations);

  if ($('.progress-indicator-stages').length) {

    var progressIndicator = $('.progress-indicator-stages');
    var progressStages = $('.progress-stages');

    // Stage indicator click functions
    $('.progress-indicator-stages .stage-count').each(function(){$(this).click(function(event){
      event.preventDefault();
      if (!$(this).parent().hasClass('active')) {
        if ($(this).parent().hasClass('completed') || $(this).parent().hasClass('seen')) {
          var clickedIndicatorStageClass = $.grep($(this).parent().attr("class").split(" "), function(v, i){
            return v.indexOf('stage-') === 0;
          }).join();
          var currentActiveIndicator = progressIndicator.find('.active');
          var desiredProgressStage = progressStages.children('.'+clickedIndicatorStageClass);
          var currentActiveStage = progressStages.find('.active');
          currentActiveIndicator.removeClass('active');
          $(this).parent().addClass('active');
          currentActiveStage.hide('slide',{direction:'left',easing:'easeInBack'},300,function(){
            $(this).removeClass('active');
            desiredProgressStage.show('slide',{direction:'left'},300,function(){$(this).addClass('active');});
          });
        }
      }
    });});

    // Amount populator
    $('.stage-1 label').on('click', function() {
      var donation = $(this).text();
      $('.donation-amount').text(donation);
    });
    $('#donation_amount_other').on('change', function() {
      var donation = $(this).val();
      StagedDonations.updateDonationAmount(donation);
    });

    // Enter keystroke
    // if enter on stages 1 and 2 updateProgressStages
    $('.stage-1 input, .stage-2 input').keypress(function(e){
      if ( e.which == 13 ) {
        e.preventDefault();
        var currentStage = $('.progress-stage.active').attr('data-stageid');
        var isValid = StagedDonations.validateDonations(currentStage);
        if (isValid) {
          StagedDonations.removeAlerts();
          StagedDonations.updateProgressIndicator(progressIndicator, 1);
          StagedDonations.updateProgressStages(progressStages, 1);
        } else {
          progressIndicator.find('.active').removeClass('completed').find('.stage-count-inner').removeClass('icon-tick');
          progressIndicator.find('.active').next().removeClass('seen');
        }
      }
     });

 		var validationSet = document.getElementsByClassName('validation-check');
    var mutationConfig = { attributes: true };

      var observer = new MutationObserver(function(mutations) {
      mutations.forEach(function(mutation) {
        var ariaInvalid = mutation.attributeName === 'aria-invalid';
        var validClass = mutation.target.classList.contains('user-success');
        if (ariaInvalid && validClass) {
          mutation.target.previousSibling.classList.add('form-pass');
        }
      });
    });

      // validationSet is a NodeList, therefore you must use a for loop
    for (var i = 0; i < validationSet.length; i++) {
      observer.observe(validationSet.item(i), mutationConfig);
    }


    // Prev and next stage actions on form
    $('.progress-stage-button-next').each(function(){$(this).click(function(event){
      event.preventDefault();
      StagedDonations.removeAlerts();
      var currentStage = $('.progress-stage.active').attr('data-stageid');
      var isValid = StagedDonations.validateDonations(currentStage);
      if (isValid) {
        StagedDonations.updateProgressIndicator(progressIndicator, 1);
        StagedDonations.updateProgressStages(progressStages, 1);
      } else {
        progressIndicator.find('.active').removeClass('completed').find('.stage-count-inner').removeClass('icon-tick');
        progressIndicator.find('.active').next().removeClass('seen');
      }
    });});

    $('.progress-stages .radio').each(function(){$(this).click(function(event){
      StagedDonations.updateProgressIndicator(progressIndicator, 1);
      StagedDonations.updateProgressStages(progressStages, 1);
    });});

    $('.progress-stage-button-prev').each(function(){$(this).click(function(event){
      event.preventDefault();
      StagedDonations.removeAlerts();
      StagedDonations.updateProgressIndicator(progressIndicator, 0);
      StagedDonations.updateProgressStages(progressStages, 0);
    });});

    progressStages.find('input[type="submit"]').click(function(event){
      progressIndicator.find('.active').addClass('completed').find('.stage-count-inner').addClass('icon-tick');
    });

  }

});
