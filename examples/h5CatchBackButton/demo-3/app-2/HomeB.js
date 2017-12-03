import React from 'react';

class HomeB extends React.Component {
  constructor(...args) {
    super(...args);
    this.catchBackButtonHandle = this.catchBackButtonHandle.bind(this);
    this.currentHash = '';
    this.catchBackButtonQuery = 'cbb=1';
  }
  componentWillMount() {
    const searchObj = this.queryParse(window.location.search);
    console.log('searchObj', searchObj);
    if (!searchObj.returnUrl) {
      this.catchBackButton();
    }
  }
  componentWillUnmount() {
    window.removeEventListener('hashchange', this.catchBackButtonHandle, false);
  }

  catchBackButton() {
    this.currentHash = window.location.hash
    window.location.hash = this.currentHash;
    nextTick(() => {
      window.location.hash = `${this.currentHash}?${this.catchBackButtonQuery}`;
    });
    window.addEventListener('hashchange', this.catchBackButtonHandle, false);
  }

  catchBackButtonHandle(e) {
    console.log(e);
    const { newURL, oldURL } = e;
    if (window.location.href === newURL && oldURL.indexOf(`?${this.catchBackButtonQuery}`) !== -1) {
      this.props.history.replace('/somePage');
    }
  }

  queryParse(qs) {
    const queryString = qs.split('?')[1];
    if (queryString) {
      const querys = queryString.split('&');
      return querys.reduce((pre, cur) => {
        const [key, value] = cur.split('=');
        return { [key]: value };
      }, {})
    }
    return {};
  }

  render() {
    return (
      <div>
        <h2>app-2 home</h2>
      </div>
    )
  }
}

function nextTick(cb) {
  return setTimeout(cb, 0);
}

export default HomeB;
