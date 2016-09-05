/**
 * Created by wangxu on 9/5/16.
 */
var arr = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F'];

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}

function getColor() {
  var cArr = [];
  for (var i = 0; i < 6; i++) {
    var v = getRandomInt(0, 15);
    cArr[i] = arr[v];
  }

  var color = '#';
  for (var i = 0; i < cArr.length; i++) {
    color += cArr[i];
  }
  return color;
}

$(function () {
  $(document).on('touchstart', start);
  $(document).on('touchend', end);
  var started = 0;
  var tot = 0;
  var color = '#000';

  var $number = $('#number');
  var $tobox = $('.box');
  var $to_number = $('#to_number');
  var i = 2;
  var f = setInterval(function () {
    if (i === 0) {
      startgame();
      clearInterval(f);
    } else {
      $number.html(i--);
    }
  }, 1000);


  function startgame() {
    $number.html(0);
    $tobox.show();
    started = 1;
    var cnt = Number($to_number.html());
    var tof = setInterval(function () {
      if (cnt === 0) {
        clearInterval(tof);
        gameover();
      }
      $to_number.html(cnt--);
    }, 1000);
  }

  function gameover() {
    started = 0;
    $number.css({
      'color': '#000',
      'font-size': '30px'
    }).html('score: ' + tot);
    $tobox.hide();
  }

  function end(e) {
    var x = e.originalEvent.changedTouches[0].pageX;
    var y = e.originalEvent.changedTouches[0].pageY;

    $('.ripple').addClass('rippleEffect');
    var point = '<div class="cpoint" style="background-color: ' + color + '; top: ' + y + 'px; left: ' + x + 'px"></div>';

    if (started === 1) {
      $(point).appendTo($('body')).animate({
        'top': '50%',
        'left': '50%',
        'opacity': 0,
        'width': '20px',
        'height': '20px'
      }, 500, function () {
        $number.css('color', color).html(tot++);
      });
    }
  }

  function start(e) {
    $('.ripple').remove();
    var w = 100;
    color = getColor();

    var html = '<span class="ripple" style="background-color: ' + color + '"></span>';
    $('body').append(html);

    var x = e.originalEvent.touches[0].pageX - w / 2;
    var y = e.originalEvent.touches[0].pageY - w / 2;

    $('.ripple').css({
      width: w,
      height: w,
      top: y + 'px',
      left: x + 'px'
    });
  }
});
