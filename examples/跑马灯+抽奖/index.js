function $(selector) {
  return document.querySelector(selector);
}
window.onload = function () {
  const $ul = $('.light-list');
  const $stopBtn = $('#stop');
  const $startBtn = $('#start');
  const $form = $('#form');

  const defaultActiveIndex = 4;
  const duration = 200;
  const nodes = [];
  const activeClass = 'active';
  const lightCount = 9;
  const plusSpeedStep = 20;
  const maxSpeed = 40;
  const minSpeed = 1000 + maxSpeed;
  const congratulation = '恭喜你，中了500万软妹币';
  const off = 'off', on = 'on';
  const defaultLuckNumber = -1;
  let acceleratedSpeed = -100;
  let luckNumber = defaultLuckNumber;
  let activeIndex = defaultActiveIndex;
  let lightSwitch = off;
  let leftNum = 0;

  $stopBtn.addEventListener('click', onStopBtnClick, false);
  $form.addEventListener('submit', onFormSubmit, false);

  renderLights();

  function onFormSubmit(e) {
    e.preventDefault();
    const input = this.elements[0];
    luckNumber = Number.parseInt(input.value.trim()) || luckNumber;
    console.log('luckNumber: ', luckNumber);
    onStartBtnClick();
  }

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
      if (speed < minSpeed || leftNum) {
        processLightCssClass();
      }

      if (lightSwitch === off) {
        // console.log('activeIndex lightSwitch === off: ', activeIndex);
        if (!leftNum) {
          speed -= acceleratedSpeed;
        }
        if (speed <= minSpeed) {
          if (speed - acceleratedSpeed > minSpeed) {
            if (activeIndex > luckNumber) {
              leftNum = lightCount - Math.abs(activeIndex - luckNumber);
            } else if (activeIndex <= luckNumber) {
              leftNum = luckNumber - activeIndex;
            }
          }
          loop(speed);
        } else {
          if (leftNum) {
            leftNum--;
            // console.log('leftNum: ', leftNum, ' speed: ', speed);
            loop(speed);
          } else {
            clearTimeout(timer);
            console.log(congratulation)
            alert(congratulation);
          }
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
      activeIndex = 0;
    }
    const nextNode = nodes[activeIndex];
    nextNode.classList.add(activeClass);
  }

};
