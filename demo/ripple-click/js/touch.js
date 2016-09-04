/**
 * Created by wangxu on 9/4/16.
 */

$(function () {
  $('body').on('click', touch);

  function touch(e) {
    $('.ripple').remove();
    var w = 100;

    var html = '<span class="ripple"></span>';
    $(this).append(html);

    var x = e.pageX - w / 2;
    var y = e.pageY - w / 2;

    $('.ripple').css({
      width: w,
      height: w,
      top: y + 'px',
      left: x + 'px'
    }).addClass('rippleEffect');
  }
});