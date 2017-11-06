window.onload = function () {
  var doc = document;
  var prev = doc.getElementById('prev');
  var next = doc.getElementById('next');
  var list = doc.getElementById('list');
  var animated = false;
  var timerId;

  function go(offset) {
    var left = parseInt(list.style.left) + offset;
    var time = 500;
    var interval = 10;
    var speed = offset / (time / interval);
    animated = true;
    function animate() {
      if ((speed > 0 && parseInt(list.style.left) < left) || (speed < 0 && parseInt(list.style.left) > left)) {
        list.style.left = parseInt(list.style.left) + speed + 'px';
        setTimeout(animate, interval);
      } else {
        animated = false;
        list.style.left = left + 'px';
        if (left < -2000) {
          list.style.left = -400 + 'px';
        }
        if (left > -400) {
          list.style.left = -2000 + 'px';
        }
      }
    }
    animate();
  }

  prev.onclick = function (e) {
    if (animated) return;
    go(-400);
  };

  next.onclick = function (e) {
    if (animated) return;
    go(400);
  }

  function play() {
    timerId = setInterval(function () {
      prev.onclick();
    }, 2000);
  }
  play();

};
