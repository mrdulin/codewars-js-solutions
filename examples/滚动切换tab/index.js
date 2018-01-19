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
  const dom_sections = $all('.section');
  const dom_fixed_aside_active_class = 'aside-show';
  const dom_tab_item_li_active_class = 'tab-item-active';
  let dom_tab_item_li_active_idx = -1;

  dom_main.addEventListener('scroll', onMainScroll, false);
  dom_tab_list.addEventListener('click', onTabClick, false);

  const el = getInitialActiveTabItemLi();
  processTabCssClass(el);

  function getInitialActiveTabItemLi() {
    let dom_tab_item_li_active;
    const dom_section_nodes = [].slice.call(dom_sections);
    dom_section_nodes.forEach(function (dom_section) {
      if (!dom_tab_item_li_active) {
        const rect = dom_section.getBoundingClientRect();
        const top = rect.top;
        if (top < document.documentElement.clientHeight && top > 0) {
          dom_tab_item_li_active = $('li[data-id=' + dom_section.id + ']');
        }
      }
    });
    return dom_tab_item_li_active;
  }

  function onMainScroll(e) {
    processTabView();
    const el = getInitialActiveTabItemLi();

    processTabCssClass(el);
  }

  function processTabView() {
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
      processTabCssClass(dom_tab_item_li);
      scrollIntoView(tabId);
    }
  }

  function processTabCssClass(dom_tab_item_li) {
    if (dom_tab_item_li) {
      const nodes = [].slice.call(dom_tab_item_li.parentElement.children);
      const domLastActiveTabItem = nodes[dom_tab_item_li_active_idx];
      if (domLastActiveTabItem) {
        domLastActiveTabItem.classList.remove(dom_tab_item_li_active_class);
      }
      dom_tab_item_li_active_idx = nodes.indexOf(dom_tab_item_li);
      dom_tab_item_li.classList.add(dom_tab_item_li_active_class);
    }
  }

  function scrollIntoView(tabId) {
    const el = $('#' + tabId);
    const alignToTop = true;
    el.scrollIntoView(true);
    dom_main.scrollTop -= getElementClientHeight(dom_aside);
  }

  function reachTop(el) {
    const rect = el.getBoundingClientRect();
    const top = rect.top;
    return top < getElementClientHeight(dom_header);
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
