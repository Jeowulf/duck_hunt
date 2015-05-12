'use strict';

var numKilled = 0;

var dieFadeOutTime      = 1000;
var lostDuckFadeOutTime = 300;
var gameSpeed           = 500;

/*
function getRandomNumberInRange(min, max) {
  var scale = max - min;
  return Math.floor(Math.random() * scale) + min;
}
*/

function isAlive(duck) {
  return duck.hasClass('left') || duck.hasClass('right');
}

// Move a dead duck back to a random starting point
// Note that the duck parameter is a jQuery object.
function resurrect(duck) {
  console.log('resurrect: duck = ' + duck.offset().top);

  // move the duck back to the bottom with a random left/right location
  var newLeft = Math.round(Math.random() * $(document).width());
  duck.css('left', newLeft);
  duck.css('bottom', 0);

  // randomly choose a left facing or right facing orientation
  if (Math.random() > 0.5) {
    duck.removeClass('shot').show().addClass('left');
  }
  else {
    duck.removeClass('shot').show().addClass('right');
  }
}

// this duck is now dead
function die(duck) {
  ++numKilled;
  duck.removeClass('left right').addClass('shot').fadeOut(dieFadeOutTime, function () {
    resurrect(duck);
  });
}

// update the score, duck positions, orientations, and state
function step() {

  $('.score').html('Score: ' + numKilled);

  $('.duck').each(function (i, duck) {

    var theDuck = $(duck);

    if (isAlive(theDuck)) {
      // bounce left to right
      if (duck.offsetLeft < 0) {
        theDuck.removeClass('left').addClass('right');
      }

      // bounce right to left
      if (duck.offsetLeft > $(document).width() - 200) {
        theDuck.removeClass('right').addClass('left');
      }

      // Set the vertical position of the duck.
      // Note that we set bottom equal to top to move the duck up exactly 1 duck
      // height and this is "smoothed" out by the CSS3 transition settings.
      var newBottom = $(document).height() - theDuck.offset().top;
      theDuck.css('bottom', newBottom);

      // flap those wings
      theDuck.toggleClass('flap');

      var top = theDuck.offset().top;
      console.log('top: ' + top);

      if (top < 0) {
        theDuck.fadeOut(lostDuckFadeOutTime, function() {
          theDuck.removeClass('left right');
          resurrect(theDuck);
        });
      }
    }
    else {
      console.log('Skipping dead duck');
    }
    console.log('duck: top=' + theDuck.offset().top + ', class=' + theDuck.attr('class'));
  });

  // move each left facing duck a little further to the left
  $('.duck.left').each(function (i, duck) {
    $(duck).css('left', duck.offsetLeft - 30);
  });

  // move each right facing duck a little further to the right
  $('.duck.right').each(function (i, duck) {
    $(duck).css('left', duck.offsetLeft + 30);
  });
}

// get everything going.
jQuery(function () {
  $('.duck').on('click', function(event) {
    die($(event.target));
  });
  setInterval(step, gameSpeed);
});

