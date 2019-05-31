import React, { 
  Component
 } from 'react';
import './App.css';
import HomePage from './views/HomePage';
import { Route, Switch } from 'react-router-dom';

class App extends Component {

  render() {
    return (
      <Switch>
        <Route component={HomePage} />
      </Switch>
    );
  }
}

export default App;
