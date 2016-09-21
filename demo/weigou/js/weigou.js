/**
 * Created by wangxu on 9/18/16.
 */

$.fn.animateRotate = function(angle, duration, complete) {
  return this.each(function() {
    var $elem = $(this);
    $({deg: 0}).animate({
      deg: angle
    }, {
      duration: duration,
      step: function(now) {
        $elem.css({
          transform: 'rotate(' + now + 'deg)'
        });
      },
      complete: complete || $.noop
    });
  });
};

$('#MyDiv2').animateRotate(90);

$(function () {
  // $('.click-area').on('touchstart', start);
  $('.click-area').on('touchend', end);

  $(".bar").bind('oanimationend animationend webkitAnimationEnd', function() {
    gameover();
  });

  var boxWidth = $('.dog').width();
  var mouthTop = $('.dog').offset().top + 4 * boxWidth / 7;
  var winWidth = $(window).width();
  var count = 1;
  
  function randomfood() {
    var num = Math.floor(Math.random() * 5) + 1;
    return 'img/food' + num + '.png';
  }
  
  function end(e) {
    var r = 40 / 2; //初始食物半径
    var x = e.originalEvent.changedTouches[0].pageX - r;
    var y = e.originalEvent.changedTouches[0].pageY - r;
    var style = 'top:' + y + 'px; left:' + x + 'px;background-image:url(' + randomfood() + ')';
    var food = '<div class="food" style="' + style + '"></div>';
    var left = (winWidth / 2 - 25 / 2) + 'px';
    $(food).appendTo($('body')).animateRotate(180).animate({
      'top': mouthTop,
      'left': left,
      'width': '25px',
      'height': '25px',
      'opacity': '0.8'
    }, 500, function () {
      $('#count').text(count++);
      $(this).remove();
      $('.face').addClass('mouse-up');
      setTimeout(function () {
        $('.face').removeClass('mouse-up');
      }, 100);
    });
  }
  
  function start(e) {
    // $('.face').removeClass('mouse-up');
    // $('.face').removeClass('mouse-eat-active');
  }

  function gameover() {
    $('.click-area').off();
  }

  $(window).load(function () {
    var num = 3;
    var f = setInterval(function () {
      if (num === 0) {
        $('.modal').hide();
        $('.bar').addClass('start-to');
        clearInterval(f);
      }
      $('.modal .num').text(num--);
    }, 1000);
  })
});