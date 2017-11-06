(function () {

  var ROLLING_CHILD_CLASSNAME = 'rolling-slide';

  var Rolling = function (el, opts) {

    this.animated = false;
    this.intervalId = null;
    this.now = 0;
    this.timeOffset = 0;
    this.MAX_TIME_DIFF = 20;
    this.animateTimerId = null;
    // this.minCount = 2;
    this.reset = false;
    this.maxOffsetY = 0;
    this.minOffsetY = 0;
    this.offsetY = -30;

    var options = {
      time: 500,
      interval: 16,
      items: [
        { textContent: '', }
      ],
      duration: 2000,
      style: {
        width: '100%',
        height: '52px'
      },
      childClassName: '',
      childHtmlString: '',
      children: [],
      slidePerView: 1
    };

    for (var key in opts) {
      options[key] = opts[key];
    }

    this.dom = {
      wrapper: el
    };
    this.options = options;

    init.call(this);
  }

  function init() {
    this.itemCount = this.options.items.length;
    this.minOffsetY = this.offsetY * this.itemCount;
    this.offsetY = getOffsetY.call(this);

    setRootElementStyle.call(this);
    setWrapperElementStyle.call(this);
    renderChildren.call(this);
    this.start();
  }

  function getOffsetY() {
    var style = this.options.style;
    var slidePerView = this.options.slidePerView;
    var slideStyle = {};
    if (!style.height) return slideStyle;
    var h = Number.parseInt(style.height.replace('px', ''));
    return - h / slidePerView;
  }

  function setElementStyle(el, style) {
    for (var cssProp in style) {
      el.style[cssProp] = style[cssProp];
    }
  }

  function setRootElementStyle() {
    var wrapper = this.dom.wrapper;
    if (wrapper) {
      var rootElement = wrapper.parentElement.parentElement;
      var style = this.options.style;

      if (rootElement) {
        setElementStyle(rootElement, style)
      }
    }
  }

  function setWrapperElementStyle() {
    var wrapper = this.dom.wrapper;
    var offsetY = this.offsetY;
    if (wrapper) {
      var translateY = `translateY(${offsetY}px)`;
      var style = {
        transform: translateY,
        '-webkit-transform': translateY
      };
      setElementStyle(wrapper, style);
    }
  }

  function go(offsetY) {
    var self = this;
    var wrapper = this.dom.wrapper;
    var interval = this.options.interval;
    var time = this.options.time;
    var newOffsetY = getTranslateY(wrapper) + offsetY;
    var speed = offsetY / (time / interval);

    this.animated = true;
    function animate() {
      var wrapperOffsetY = getTranslateY(wrapper);
      // console.log('newOffsetY', newOffsetY, 'wrapperOffsetY', wrapperOffsetY, 'speed', speed);

      if ((speed > 0 && wrapperOffsetY < newOffsetY) || (speed < 0 && wrapperOffsetY > newOffsetY)) {
        var y = wrapperOffsetY + speed;
        setTranslateY(wrapper, y);
        if (self.reset) {
          // console.log('clearTimeout');
          clearTimeout(self.animateTimerId);
        }
        self.animateTimerId = setTimeout(animate, interval);
      } else {
        self.animated = false;
        setTranslateY(wrapper, newOffsetY);
        if (newOffsetY < self.minOffsetY) {
          setTranslateY(wrapper, self.maxOffsetY);
        }
        if (newOffsetY > self.maxOffsetY) {
          setTranslateY(wrapper, self.minOffsetY);
        }
      }
    }

    animate();
  }

  function getTranslateY(el) {
    const style = window.getComputedStyle(el);
    const matrix = new WebKitCSSMatrix(style.transform);
    return matrix.m42;
  }

  function setTranslateY(el, y) {
    const translateY = `translateY(${y}px)`;
    el.style.transform = translateY;
    el.style['-webkit-transform'] = translateY;
  }

  function getSlideStyle() {
    var slidePerView = this.options.slidePerView;
    var h = Math.abs(getOffsetY.call(this));
    slideStyle = {
      height: `${h / slidePerView}px`
    };
    return slideStyle;
  }

  function copy(arr) {
    return arr.slice(0);
  }

  function renderChildren() {
    var wrapper = this.dom.wrapper;
    var items = copy(this.options.items);
    var childClassName = this.options.childClassName;
    var childHtmlString = this.options.childHtmlString;
    var children = this.options.children;
    var finalItems = [];

    if (!this.itemCount) return;
    if (this.itemCount === 1) {
      finalItems = items;
    } else {
      finalItems = items.concat(items.slice(0, 2));
      finalItems.unshift(items[items.length - 1]);
    }

    var style = getSlideStyle.call(this);
    var fragment = document.createDocumentFragment();

    for (var i = 0, itemCount = finalItems.length; i < itemCount; i++) {

      if (children) {
        var childrenHtmlString = children.join('');
        fragment = fragmentFromString(childrenHtmlString);

      } else {
        var child = document.createElement('div');
        var item = finalItems[i];
        if (childHtmlString) {
          child.innerHTML = childHtmlString;
          var textContentElement = child.getElementsByClassName('textContent')[0];
          textContentElement.textContent = item.textContent;
        } else {
          child.textContent = item.textContent;
        }
        child.avatar = item.avatar;
        if (typeof childClassName === 'string' && childClassName.trim()) {
          child.classList.add(ROLLING_CHILD_CLASSNAME, childClassName);
        }
        setElementStyle(child, style);
        fragment.appendChild(child);
      }
    }
    wrapper.appendChild(fragment);
  }

  function fragmentFromString(strHTML) {
    var temp = document.createElement('template');
    temp.innerHTML = strHTML.trim();
    return temp.content;
  }

  Rolling.prototype.start = function () {
    var duration = this.options.duration;
    var slidePerView = this.options.slidePerView;
    var self = this;

    if (!this.intervalId && this.itemCount >= slidePerView && !this.animated) {
      this.intervalId = setInterval(function () {
        go.call(self, self.offsetY);

        if (self.now) {
          self.timeOffset = Date.now() - self.now;
          self.reset = Math.abs(duration - self.timeOffset > self.MAX_TIME_DIFF);
          if (self.reset) {
            // setTranslateY(self.offsetY);
          }
        }

        self.now = Date.now();
      }, duration);
    }
  };

  Rolling.prototype.destroy = function () {
    this.animateTimerId && clearTimeout(this.animateTimerId);
    this.intervalId && clearInterval(this.animateTimerId);
  };

  window.Rolling = Rolling;
})()
