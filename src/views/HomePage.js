import React, { 
  Component
 } from 'react';
import { Route, Switch } from 'react-router-dom';
import './HomePage.css';
import Layout from '../routes/Layout';
import { 
  Navbar,
  Image
} from 'react-bootstrap';

class HomePage extends Component {
  
  render() {
    return (
      
      <div>
        hi
        <Navbar collapseOnSelect fixedTop>
          <Navbar.Header>
            <Navbar.Brand>
              <a href="/"><Image src="logo.png" height="25px"/></a>
            </Navbar.Brand>
          </Navbar.Header>
        </Navbar>
        <Layout />
      </div>
    );
  }
}

export default HomePage;
