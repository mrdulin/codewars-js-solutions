function $(selector) {
  return document.querySelector(selector);
}
function $all(selector) {
  return document.querySelectorAll(selector);
}
window.onload = function () {
  const dom_aside = $('.aside');
  const dom_fixed_aside = $('.aside-fixed');
  const dom_main = $('.main');
  const dom_header = $('.header');
  const dom_tab_list = $('.tab-list');
  const dom_fixed_aside_active_class = 'aside-show';
  const dom_tab_item_li_active_class = 'tab-item-active';
  let dom_tab_item_li_active_idx = -1;

  dom_main.addEventListener('scroll', onMainScroll, false);
  dom_tab_list.addEventListener('click', onTabClick, false);

  function onMainScroll(e) {
    if (reachTop(dom_aside)) {
      showFixedAsideElement();
    }
    if (reachBottom(dom_fixed_aside)) {
      hideFixedAsideElement();
    }
  }

  function onTabClick(e) {
    const target = e.target;
    if (target.nodeName.toUpperCase() === 'A') {
      const dom_tab_item_li = target.parentElement;
      const tabId = dom_tab_item_li.dataset.id;
      const nodes = Array.prototype.slice.call(dom_tab_item_li.parentElement.children);
      const domLastActiveTabItem = nodes[dom_tab_item_li_active_idx];
      if (domLastActiveTabItem) {
        domLastActiveTabItem.classList.remove(dom_tab_item_li_active_class);
      }
      dom_tab_item_li_active_idx = nodes.indexOf(dom_tab_item_li);
      console.log('tabId: ', tabId, ' dom_tab_item_li_active_idx: ', dom_tab_item_li_active_idx);
      dom_tab_item_li.classList.add(dom_tab_item_li_active_class);
    }
  }

  function reachTop(el) {
    const rect = el.getBoundingClientRect();
    const top = rect.top;
    return top < (getElementClientHeight(dom_header) - getElementClientHeight(dom_aside));
  }

  function reachBottom(el) {
    const rect = el.getBoundingClientRect();
    const top = rect.top;
    return top > getElementClientHeight(dom_header);
  }

  function showFixedAsideElement() {
    dom_fixed_aside.classList.add(dom_fixed_aside_active_class);
    dom_aside.classList.add(dom_fixed_aside_active_class);
  }

  function hideFixedAsideElement() {
    dom_fixed_aside.classList.remove(dom_fixed_aside_active_class);
    dom_aside.classList.remove(dom_fixed_aside_active_class);
  }

  function getElementClientHeight(el) {
    return el.clientHeight;
  }
}
