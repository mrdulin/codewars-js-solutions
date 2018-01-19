window.onload = function () {
  const tabs = [
    { id: 't1', name: 'tab1' },
    { id: 't2', name: 'tab2' },
    { id: 't3', name: 'tab3' }
  ];
  const slideDataByTab = tabs.reduce(function (pre, tab) {
    pre[tab.id] = {};
    return pre;
  }, {});
  let activeTabIndex = 0;
  let activeTabId = tabs[activeTabIndex].id;

  var swiper = new Swiper('.swiper-container', {
    on: {
      init: function () {
        const self = this;
        console.log('swiper initialized');
        console.log('this.activeIndex: ', this.activeIndex, this.el);
        requestModuleById(activeTabId)
          .then(function (data) {
            console.log(data);
            renderDataToSwiperSlide(self.slides[self.activeIndex], data);
          });
      }
    }
  });

  swiper.on('slideChange', function onSlideChange() {
    console.log('slide changed');
    console.log('this.activeIndex: ', this.activeIndex);
    const self = this;
    const tab = tabs[this.activeIndex];
    requestModuleById(tab.id)
      .then(function (data) {
        console.log(data);
        renderDataToSwiperSlide(self.slides[self.activeIndex], data);
      })
  });

  function renderDataToSwiperSlide(slideElement, data) {
    const datas = data.datas;
    const fragment = document.createDocumentFragment();
    for (var i = 0, len = datas.length; i < len; i++) {
      const p = document.createElement('p');
      p.textContent = datas[i];
      fragment.appendChild(p);
    }
    slideElement.appendChild(fragment);
  }
};

const mockData = {
  t1: { datas: ['react', 'angular', 'jquery'] },
  t2: { datas: ['iPhone8P', 'iPhone8', 'iPhone7'] },
  t3: { datas: ['小米mix2', '小米7', '小米电视4A'] }
};

function requestModuleById(id) {
  return new Promise(function (resolve, reject) {
    setTimeout(function () {
      const data = mockData[id];
      resolve(data);
    }, 1000);
  });
}
