import React from 'react';

//使用popstate和pushstate实现劫持浏览器返回和物理返回逻辑
class HomeA extends React.Component {
  constructor(...args) {
    super(...args);
    this.catchBackButton = this.catchBackButton.bind(this);
  }
  componentWillMount() {
    window.history.pushState({}, '', '');
    window.addEventListener('popstate', this.catchBackButton, false);
  }
  componentWillUnmount() {
    window.removeEventListener('popstate', this.catchBackButton, false);
  }

  catchBackButton(e) {
    this.props.history.replace('/somePage');
  }

  render() {
    return (
      <div>
        <h2>app-2 home</h2>
      </div>
    )
  }
}

export default HomeA;
