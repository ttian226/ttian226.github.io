
var $coins = [];

$(function () {
  var $touch = $('.touch');
  for (var i = 0; i < 15; i++) {
    $coins[i] = $('.coin.coin-' + i);
  }
  $touch.on('touchend', callback);
});


function callback() {
  var num = getRandomInt(1, 5); //每次掉落金币的个数
  var coins = pickSome(15, num);
  var $tree = $('.tree');
  for (var i = 0; i < coins.length; i++) {
    var $one = coins[i];
    $one.clone().appendTo($tree).show().addClass('move');
  }
}

// 获取随机掉落的金币
function pickSome(max, num) {
  var arr = [];
  var indexs = getSomeIndex(max, num);
  for (var i = 0; i < num; i++) {
    arr[i] = $coins[indexs[i]];
  }
  return arr;
}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getSomeIndex(max, num) {
  var arr = [];
  for (var i = 0; i < max; i++) {
    arr[i] = i;
  };

  arr.sort(function () {
    return 0.5 - Math.random();
  });

  return arr.slice(0, num);
}
