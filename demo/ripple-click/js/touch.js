/**
 * Created by wangxu on 9/4/16.
 */

$(function () {
  $('body').on('touchstart', touch);

  function touch(e) {

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

    $('.ripple').remove();
    var w = 100;

    var html = '<span class="ripple" style="background-color: ' + getColor() + '"></span>';
    $(this).append(html);

    var x = e.originalEvent.touches[0].pageX - w / 2;
    var y = e.originalEvent.touches[0].pageY - w / 2;

    $('.ripple').css({
      width: w,
      height: w,
      top: y + 'px',
      left: x + 'px'
    }).addClass('rippleEffect');
  }
});
