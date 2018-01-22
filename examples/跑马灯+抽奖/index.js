function $(selector) {
  return document.querySelector(selector);
}
window.onload = function () {
  const $ul = $('.light-list');
  const $stopBtn = $('#stop');
  const $startBtn = $('#start');
  const defaultActiveIndex = 0;
  const duration = 200;
  const nodes = [];
  const activeClass = 'active';
  const lightCount = 10;
  const acceleratedSpeed = -100;
  const plusSpeedStep = 20;
  const maxSpeed = 40;
  const minSpeed = 1000 + maxSpeed;
  const congratulation = '恭喜你，中了500万软妹币';
  const off = 'off', on = 'on';

  let activeIndex = defaultActiveIndex;
  let lightSwitch = off;

  $stopBtn.addEventListener('click', onStopBtnClick, false);
  $startBtn.addEventListener('click', onStartBtnClick, false);

  renderLights();

  function onStopBtnClick() {
    lightSwitch = off;
  }

  function onStartBtnClick() {
    if (lightSwitch === off) {
      lightSwitch = on;
      // start();
      loop(duration);
    }
  }

  function renderLights() {
    const $fragment = document.createDocumentFragment();
    for (let i = 0; i < lightCount; i++) {
      const $li = document.createElement('li');
      $li.textContent = i;
      if (activeIndex === i) {
        $li.classList.add(activeClass);
      }
      nodes.push($li);
      $fragment.appendChild($li);
    }
    $ul.appendChild($fragment);
  }

  //跑马灯
  function start() {
    let timer = setInterval(function () {
      if (lightSwitch === on) {
        processLightCssClass();
      } else {
        clearInterval(timer);
      }
    }, duration);
  }

  //抽奖
  function loop(speed) {
    const timer = setTimeout(function () {
      if (speed < minSpeed) {
        processLightCssClass();
      }

      if (lightSwitch === off) {
        speed -= acceleratedSpeed;
        if (speed <= minSpeed) {
          loop(speed);
        } else {
          clearTimeout(timer);
          console.log(congratulation)
          alert(congratulation);
        }
      } else {
        if (speed > maxSpeed) {
          speed -= plusSpeedStep;
        }
        loop(speed);
      }
    }, speed);
  }

  function processLightCssClass() {
    const currentNode = nodes[activeIndex];
    currentNode.classList.remove(activeClass);

    activeIndex++;
    if (activeIndex > (lightCount - 1)) {
      activeIndex = defaultActiveIndex;
    }
    const nextNode = nodes[activeIndex];
    nextNode.classList.add(activeClass);
  }

};
