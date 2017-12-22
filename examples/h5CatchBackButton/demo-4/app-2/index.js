import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import { render } from 'react-dom';

import Home from './HomeA';
// import Home from './HomeB';

const App = (props) => {
  return (
    <div>
      {props.children}
    </div>
  );
}

const SomePage = () => (
  <div>
    <h2>app-2 some page</h2>
  </div>
)

render(
  <App>
    <BrowserRouter>
      <Switch>
        <Route exact path="/" component={Home} />
        <Route exact path="/somePage" component={SomePage} />
      </Switch>
    </BrowserRouter>
  </App>,
  document.getElementById('app')
)
