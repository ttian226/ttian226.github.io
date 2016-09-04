/**
 * Created by wangxu on 9/4/16.
 */

$(function () {
  $('body').on('touchstart', touch);

  function touch(e) {
    $('.ripple').remove();
    var w = 100;

    var html = '<span class="ripple"></span>';
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