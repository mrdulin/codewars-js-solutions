window.onload = function () {
  const tabs = [
    { id: "t1", name: "tab1", slide: undefined, data: undefined, pormise: undefined },
    { id: "t2", name: "tab2", slide: undefined, data: undefined, promise: undefined },
    { id: "t3", name: "tab3", slide: undefined, data: undefined, promise: undefined }
  ];
  let defaultActiveTabIndex = 0;
  const tabCount = tabs.length;
  const tabWidthPercentNum = 100 / tabCount;
  const basePercent = tabWidthPercentNum * 2;

  const $tabCursor = $('.tab-cursor');
  $tabCursor.style.width = tabWidthPercentNum + '%';
  const tabCursorWidthPx = $tabCursor.clientWidth;


  const swiper = new Swiper(".swiper-container", {
    resistance: true,
    resistanceRatio: 0,

    on: {
      init: function () {
        const activeTab = attachSlideElementToTab.call(this, tabs);
        if (!activeTab.data && !activeTab.promise) {
          activeTab.promise = requestModuleById(activeTab.id);
          activeTab.promise.then(function (data) {
            activeTab.data = data;
            activeTab.promise = undefined;
            renderDataToSwiperSlide(activeTab.slide)(data);
          });
        }
      }
    },
    pagination: {
      el: ".tab-list",
      clickable: true,
      renderBullet: function (index, className) {
        const tab = "tab" + (index + 1);
        return "<li class=" + className + " style=width:" + tabWidthPercentNum + "%>" + tab + "</li>";
      },
      bulletClass: "tab-item",
      bulletActiveClass: "tab-item-active",
    }
  });

  swiper
    .on("slideChange", function onSlideChange() {
      console.log("slideChange: ", this.activeIndex);
      const activeTab = attachSlideElementToTab.call(this, tabs);
      if (this.activeIndex !== defaultActiveTabIndex && !activeTab.data && !activeTab.promise) {
        activeTab.promise = requestModuleById(activeTab.id);
        activeTab.promise.then(function (data) {
          activeTab.data = data;
          activeTab.promise = undefined;
          renderDataToSwiperSlide(activeTab.slide)(data);
        });
      }
    })
    .on('setTranslate', function onSetTranslate() {
      console.log(this.translate, this.progress);
      // 0 = 0%;
      // 0.5 === 33.33%;
      // 1 = 66.66%;
      // const left = basePercent * this.progress + '%';
      // $tabCursor.style.left = left;

      const x = tabCursorWidthPx * 2 * this.progress + 'px';
      $tabCursor.style.webkitTransform = 'translate3d(' + x + ', 0, 0)';
    });

  function attachSlideElementToTab(tabs) {
    const tab = tabs[this.activeIndex];
    if (!tab.slide) {
      tab.slide = this.slides[this.activeIndex];
    }
    return tab;
  }

  function renderDataToSwiperSlide(slideElement) {
    return function (data) {
      const datas = data.datas;
      const fragment = document.createDocumentFragment();
      for (let i = 0, len = datas.length; i < len; i++) {
        const p = document.createElement("p");
        p.textContent = datas[i];
        fragment.appendChild(p);
      }
      slideElement.appendChild(fragment);
    };
  }
};

function $(selector) {
  return document.querySelector(selector);
}

const mockData = {
  t1: { datas: ["react", "angular", "jquery"] },
  t2: { datas: ["iPhone8P", "iPhone8", "iPhone7"] },
  t3: { datas: ["小米mix2", "小米7", "小米电视4A"] }
};

function requestModuleById(id) {
  return new Promise(function (resolve, reject) {
    setTimeout(function () {
      const data = mockData[id];
      resolve(data);
    }, 1000);
  });
}
