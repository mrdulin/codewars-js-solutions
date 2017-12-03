import React from 'react';
import { HashRouter, Link } from 'react-router-dom';
import { Switch, Route } from 'react-router';
import { render } from 'react-dom';

cons App = (props) => {
  return (
    <div>
      {props.children}
    </div>
  );
}

const Home = () => (
  <div>
    <h2>app-1 home</h2>
    <Link to='/about'>About</Link>
  </div>
)

const About = () => (
  <div>
    <h2>app-1 about</h2>
    <ul>
      <li>
        <a href='//localhost:2224'>app-2 home</a>
      </li>
      <li>
        <a href="//localhost:2224/index.html?returnUrl=xx#/">app-2 home with query</a>
      </li>
    </ul>
  </div>
)

render(
  <App>
    <HashRouter>
      <Switch>
        <Route exact path="/" component={Home} />
        <Route exact path="/about" component={About} />
      </Switch>
    </HashRouter>
  </App>,
  document.getElementById('app')
)
