window.onload = function () {
  // alert('app-2 onload');
  setTimeout(function () {
    // alert('app-2 replace');
    // replace 在小米4，华为v8, oppo r7微信内置浏览器回退失效
    // window.location.replace('//10.0.77.189:2223/测试微信应用间跳转问题/app-1')

    // 都有效
    // window.location.replace('//10.0.77.189:2223/测试微信应用间跳转问题/app-1' + '?timestamp=' + Date.now());

    // 都有效
    window.location.replace('//10.0.77.189:2223/测试微信应用间跳转问题/app-1/index.html#/doctor/home#' + Date.now());

    // 在华为v8无效
    // window.location = '//10.0.77.189:2223/测试微信应用间跳转问题/app-1';
  }, 1000);
}
