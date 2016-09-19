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
  $(document).on('touchstart', start);
  $(document).on('touchend', end);

  var wHeight = $(window).height();
  var mouthTop = $('.dog').offset().top + 200;
  
  function randomfood() {
    var num = Math.floor(Math.random() * 5) + 1;
    return 'img/food' + num + '.png';
  }
  
  function start(e) {
    var r = 25 / 2; //初始食物半径
    var x = e.originalEvent.touches[0].pageX - r;
    var y = e.originalEvent.touches[0].pageY - r;
    var style = 'top:' + y + 'px; left:' + x + 'px;background-image:url(' + randomfood() + ')';
    var food = '<div class="food" style="' + style + '"></div>';
    $(food).appendTo($('body')).animateRotate(180).animate({
      'top': mouthTop,
      'left': '50%',
      'width': '40px',
      'height': '40px',
      'opacity': '0.8'
    }, 500, function () {
      $(this).remove();
    })
  }
  
  function end(e) {

  }
});