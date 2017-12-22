window.onload = function () {
  var doc = document;
  var $btn = doc.getElementById('btn');
  $btn.addEventListener('click', function () {
    setTimeout(function () {
      // 有效
      // window.location.replace('//10.0.77.189:2224/测试微信应用间跳转问题/app-2' + '?timestamp=' + Date.now());


      window.location.replace('//10.0.77.189:2224/测试微信应用间跳转问题/app-2');
    }, 1000);
  }, false);

}
