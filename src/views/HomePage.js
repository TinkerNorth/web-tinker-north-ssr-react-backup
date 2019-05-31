import React, { 
  Component
 } from 'react';
import { Route, Switch } from 'react-router-dom';
import './HomePage.css';
import AggregationPage from '../components/AggregationPage';
import ArticlePage from '../components/ArticlePage';
import { 
  Navbar,
  Image
} from 'react-bootstrap';

class HomePage extends Component {
  
  render() {
    return (
      <div>
        <Navbar collapseOnSelect fixedTop>
          <Navbar.Header>
            <Navbar.Brand>
              <a href="/"><Image src="logo.png" height="25px"/></a>
            </Navbar.Brand>
          </Navbar.Header>
        </Navbar>
        <Switch>
          <Route exact path="/article/:entityId" component={ArticlePage}/>
          <Route component={AggregationPage} />
        </Switch>
      </div>
    );
  }
}

export default HomePage;
