$(function() {
  $('.day-event').addClass('animated flipInX');
  $(document).on('click', '#calendar .agenda-event', function(e) {
    var cal = $('#calendar');
    var $this = $(this);
    var day = $this.parents('.agenda-day');
    if(day.is('.monday')) {
      cal.attr('class', 'calendar day monday');
    } else if(day.is('.tuesday')) {
      cal.attr('class', 'calendar day tuesday');
    } else if(day.is('.wednesday')) {
      cal.attr('class', 'calendar day wednesday');
    } else if(day.is('.thursday')) {
      cal.attr('class', 'calendar day thursday');
    } else if(day.is('.friday')) {
      cal.attr('class', 'calendar day friday');
    } else if(day.is('.saturday')) {
      cal.attr('class', 'calendar day saturday');
    } else if(day.is('.sunday')) {
      cal.attr('class', 'calendar day sunday');
    }
  });

  $(document).on('click', '.calendar-day, .calendar-week', function(e) {

    resetAnimation($('.day-event'));
    
    var $this = $(this);
    var cal = $('#calendar');
    cal.removeClass('day week');
    if($this.hasClass('calendar-day')) {
      $this.addClass('active');
      $('.calendar-week').removeClass('active');
      cal.addClass('day');
    } else {
      $this.addClass('active');
      $('.calendar-day').removeClass('active');
      cal.addClass('week');
    }
    e.preventDefault();
  });

});

function resetAnimation(elem) {
  if(elem instanceof jQuery) {
    elem.each(function() { 
      var newElem = $(this).clone();
      $(this).before(newElem).remove();
    });
  } else {
    var newElem = elem.cloneNode(true);
    elem.parentNode.replaceChild(newElem, elem);
  }
}