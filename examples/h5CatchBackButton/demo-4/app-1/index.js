import React from 'react';
import { BrowserRouter, Link } from 'react-router-dom';
import { Switch, Route } from 'react-router';
import { render } from 'react-dom';

const hostname = window.location.hostname;

const App = (props) => {
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
        <a href={`//${hostname}:2224`}>app-2 home</a>
      </li>
      <li>
        <a href={`//${hostname}:2224/?returnUrl=xxx`}>app-2 home with query</a>
      </li>
    </ul>
  </div>
)

render(
  <App>
    <BrowserRouter>
      <Switch>
        <Route exact path="/" component={Home} />
        <Route exact path="/about" component={About} />
      </Switch>
    </BrowserRouter>
  </App>,
  document.getElementById('app')
)
