import React from 'react';

class HomeB extends React.Component {
  constructor(...args) {
    super(...args);
    this.catchBackButton = this.catchBackButton.bind(this);
    this.currentHash = '';
  }
  componentWillMount() {
    this.currentHash = window.location.hash
    window.location.hash = this.currentHash;
    nextTick(() => {
      window.location.hash = `${this.currentHash}?cbb=1`;
    });
    window.addEventListener('hashchange', this.catchBackButton, false);
  }
  componentWillUnmount() {
    window.removeEventListener('hashchange', this.catchBackButton, false);
  }

  catchBackButton(e) {
    console.log(e);
    const { newURL, oldURL } = e;
    if (window.location.href === newURL && oldURL.indexOf('?cbb=1') !== -1) {
      this.props.history.replace('/somePage');
    }
  }

  getHashQuery(hash) {
    const queryString = hash.split('?')[1];
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
