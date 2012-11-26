// Calendar Class
var Calendar = function() {
  var cal = $('#calendar');
  this.dom = cal;
};

// Static Declarations
Calendar.availableColors = ['green', 'red', 'blue'];
Calendar.events = [];
Calendar.days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

// Helper Functions
Calendar.helpers = {};

Calendar.helpers.pad = function(num) {
  num = ''+num;
  while(num.length < 4) num = '0'+num;
  return num;
};

Calendar.helpers.convertHeightToMinutes = function(height) {
  return Math.round(height/20)*30;
};

Calendar.helpers.convertPositionToTime = function(pos) {
  var hours = Math.round((pos)/40)-1;
  var minutes = Math.floor((pos-20)/20) % 2 == 0 ? '00' : '30';
  return 's'+Calendar.helpers.pad(''+hours+minutes);
};

// Event Functions
Calendar.changeEventLength = function(e) {
  e.preventDefault();
  e.stopPropagation();
  e.stopImmediatePropagation();
  var $this = $(this);
  var parent = $this.parent();
  var parentMinutes = Calendar.helpers.convertHeightToMinutes(parent.outerHeight());
  var initialClass = 'e'+Calendar.helpers.pad(parentMinutes);
  var initialY = e.screenY;
  var initialHeight = parent.outerHeight();

  parent.addClass('drag');

  $(document).mousemove(function(e) {
    var newHeight = Math.max(initialHeight + (e.screenY - initialY), 40);
    var newMinutes = Calendar.helpers.convertHeightToMinutes(newHeight);
    var newClass = 'e'+Calendar.helpers.pad(newMinutes);
    if(newClass != initialClass) {
      parent.removeClass(initialClass).addClass(newClass);
      initialClass = newClass;
    }
  });

  $(document).one('mouseup', function(e) {
    parent.removeClass('drag');
    $(document).unbind('mousemove');
    Calendar.saveEvent();
  });
};

Calendar.changeEventStartTime = function(e) {
  e.preventDefault();
  e.stopPropagation();
  e.stopImmediatePropagation();
  var $this = $(this);
  var parent = $this;
  var day = parent.parent();
  var isWeek = $('#calendar').hasClass('week');

  var regex = /s[0-9]{4}/;
  var initialClass = parent.attr('class').match(regex)[0];
  var offsetY = day.offset().top;
  var location = e.pageY - offsetY;
  var adjust = e.pageY - parent.offset().top;
  var initialPosition = offsetY + adjust;

  var dayPosLeft = day.offset().left;
  var dayPosRight = day.width() + dayPosLeft;
  var dayName = day.attr('class').replace('day-events ', '');
  var dayIndex = Calendar.days.indexOf(dayName);

  parent.addClass('drag');

  $(document).mousemove(function(e) {
    var newClass = Calendar.helpers.convertPositionToTime(e.pageY - initialPosition);

    if(newClass != initialClass) {
      parent.removeClass(initialClass).addClass(newClass);
      initialClass = newClass;
    }

    if(isWeek) {
      if(dayIndex > 0 && e.pageX < dayPosLeft) {
        dayIndex -= 1;
        dayName = Calendar.days[dayIndex];
        parent.appendTo('.day-events.'+dayName);

        day = parent.parent();
        dayPosLeft = day.offset().left;
        dayPosRight = day.width() + dayPosLeft;
      } else if(dayIndex < 6 && e.pageX > dayPosRight) {
        dayIndex += 1;
        dayName = Calendar.days[dayIndex];
        parent.appendTo('.day-events.'+dayName);

        day = parent.parent();
        dayPosLeft = day.offset().left;
        dayPosRight = day.width() + dayPosLeft;
      }
    }
  });

  $(document).one('mouseup', function(e) {
  parent.removeClass('drag');
    $(document).unbind('mousemove');
    Calendar.saveEvent();
  });
};

Calendar.createEvent = function(e) {
  e.preventDefault();
  e.stopPropagation();
  e.stopImmediatePropagation();

  var $this = $(this);
  var offsetY = $this.offset().top;
  var location = e.pageY - offsetY;
  var day = $this.attr('class').split(' ')[1];
  var hour = Calendar.helpers.convertPositionToTime(location);

  var evnt = {
    name: 'New Event',
    startClass: hour,
    day: day
  };

  Calendar.addEvent(evnt);
};

Calendar.addEvent = function(evnt) {
  var html = $('.day-event-template').clone().removeClass('day-event-template');
  if(evnt.name) html.find('.day-event-name').text(evnt.name);
  html.addClass('e0030');
  if(evnt.startClass) html.addClass(evnt.startClass);
  else html.addClass('s0900');
  if(evnt.day) $('.day-events.'+evnt.day).append(html);
  else $('.day-events.monday').append(html);
  html.addClass('selected');
  html.show();

  // Show form for editing new event
  var cal = $('#calendar');
  cal.removeClass('day week event');
  cal.removeClass('monday tuesday wednesday thursday friday saturday sunday');
  cal.addClass('day event');
  cal.addClass(evnt.day);

};

Calendar.changeCalendarView = function(e) {
  var $this = $(this);
  var cal = $('#calendar');
  cal.removeClass('day week event');
  if($this.hasClass('calendar-day')) {
    $this.addClass('active');
    $('.calendar-week').removeClass('active');
    cal.addClass('day');
  } else {
    $this.addClass('active');
    $('.calendar-day').removeClass('active');
    cal.addClass('week');
  }
  Calendar.eventAnimation();
  e.preventDefault();
  e.stopPropagation();
  e.stopImmediatePropagation();
};

Calendar.changeCalendarDay = function(e) {
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
  Calendar.eventAnimation();
  e.stopPropagation();
  e.stopImmediatePropagation();
};

Calendar.removeEvent = function(evnt) {

};

Calendar.saveEvent = function(evnt) {
  //alert('Event Saved.');
};

Calendar.getDOMEvents = function() {
  var that = this;
  this.events = []; // reset event list to grab current

  $('.agenda-event').each(function() {
    var evnt = new Event({});
    var $evnt = $(this);

    evnt.dom = {
      name: $evnt.find('.event-name'),
      color: $evnt.find('.event-color'),
      time: $evnt.find('.event-time'),
      starttime: $evnt.find('.event-starttime'),
      endtime: $evnt.find('.event-endtime')
    };

    evnt.name = evnt.dom.name.text();
    evnt.time = evnt.dom.time.text();

    evnt.starttime = new Date(+evnt.dom.starttime.text());
    evnt.endtime = new Date(+evnt.dom.endtime.text());

    evnt.start = {
      year: evnt.starttime.getUTCFullYear(),
      month: evnt.starttime.getUTCMonth(),
      date: evnt.starttime.getUTCDate(),
      hour: evnt.starttime.getUTCHours(),
      minute: evnt.starttime.getUTCMinutes(),
      day: evnt.starttime.getUTCDay()
    };

    evnt.end = {
      year: evnt.endtime.getUTCFullYear(),
      month: evnt.endtime.getUTCMonth(),
      date: evnt.endtime.getUTCDate(),
      hour: evnt.endtime.getUTCHours(),
      minute: evnt.endtime.getUTCMinutes(),
      day: evnt.endtime.getUTCDay()
    };

    that.events.push(evnt);
  });
};

// // Animation Helpers
 Calendar.resetAnimation = function(elem, callback) {callback(null, elem)};
//   if(!elem instanceof jQuery) 
//     elem = $(elem);
//   elem.each(function() { 
//     // var newElem = $(this).clone();
//     // $(this).before(newElem).remove();
//     // callback(null, newElem);

//     elem.removeClass('animated flipInX');
//   });
// };

 Calendar.startAnimation = function(elem, animation) {};
//   if(!elem instanceof jQuery) 
//     elem = $(elem);
//   elem.addClass('animated '+animation);
// };

 Calendar.eventAnimation = function() {};
//   var elem = $('.day-event');
//   Calendar.resetAnimation(elem, function(err, newElem) {
//     Calendar.startAnimation(newElem, 'flipInX');
//   });
// };

// Event Class
var Event = function(evnt) {
  this.id = evnt.id || '';
  this.name = evnt.name || '';
  this.description = evnt.description || '';

  this.starttime = new Date(+evnt.starttime);
  this.endtime = new Date(+evnt.endtime);

  this.start = {
    year: this.starttime.getUTCFullYear(),
    month: this.starttime.getUTCMonth(),
    date: this.starttime.getUTCDate(),
    hour: this.starttime.getUTCHours(),
    minute: this.starttime.getUTCMinutes(),
    day: this.starttime.getUTCDay()
  };

  this.end = {
    year: this.endtime.getUTCFullYear(),
    month: this.endtime.getUTCMonth(),
    date: this.endtime.getUTCDate(),
    hour: this.endtime.getUTCHours(),
    minute: this.endtime.getUTCMinutes(),
    day: this.endtime.getUTCDay()
  };

  this.form = {
    activity_attributes: {
      id: '',
      "follow_up_at(1i)": this.start.year,
      "follow_up_at(2i)": this.start.month,
      "follow_up_at(3i)": this.start.day,
      "follow_up_at(4i)": this.start.hour,
      "follow_up_at(5i)":'',
      "follow_up_at_meridiem":'',
      "(1i)":'',
      "(2i)":'',
      "(3i)":'',
      "to_time(1i)":'',
      "to_time(1i)":'',
      "to_time_meridiem":'',
      "is_complete":'',
      "activity_users_attributes": []
    },
    comments_attributes: [],
    search_users_query: '',
    "_method": 'put',
    page: 1,
    authenticy_token: ''
  }
  return this;
};

Event.prototype = {
  getColor: function() {
    var domColor = this.dom.color;
    if(domColor.hasClass('blue')) return 'blue';
    else if(domColor.hasClass('red')) return 'red';
    else if(domColor.hasClass('green')) return 'green';
    else return 'gray';
  },
  setColor: function(color) {
    this.dom.color.removeClass('blue red green');
    this.dom.color.addClass(color);
  }
};



$(document).on('mousedown', '.day-event .ui-resizable-s', Calendar.changeEventLength);
$(document).on('mousedown', '.day-event', Calendar.changeEventStartTime);
$(document).on('mousedown', '.day-events', Calendar.createEvent);

$(document).on('click', '.calendar-day, .calendar-week', Calendar.changeCalendarView);
$(document).on('click', '#calendar .agenda-event', Calendar.changeCalendarDay);

// $(function() {
//   // Load animation on page load
//   Calendar.eventAnimation();
// });

