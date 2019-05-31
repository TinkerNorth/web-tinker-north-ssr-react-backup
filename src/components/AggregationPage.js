import React, { 
  Component
 } from 'react';
import './AggregationPage.css';
import { 
  Grid,
  Row,
  Col,
  Button,
  Image
} from 'react-bootstrap';
import { Link } from 'react-router-dom'

const SPACE_ID = 'dm0i1bxzikc3'
const ACCESS_TOKEN = '51f222821a25bbd4e496b2308c3d71e09dd531142ed690d5ab333feeed7c1467'

var canUseDOM = !!(
  typeof window !== 'undefined' &&
  window.document &&
  window.document.createElement
);

const contentful = require("contentful");

class AggregationPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      blogs: []
    };
  }

  componentDidMount(){
    const client = contentful.createClient({
      space: SPACE_ID,
      accessToken: ACCESS_TOKEN
    });
    client
      .getEntry("4aOf3WwFvaycCSw2q4SKWW")
      .then(entry => {
        console.log("hi");
        this.setState({blogs: entry.fields.blogs});
      })
      .catch(err => console.log(err));
  }
  renderBlog(blog){
    var url = '/article/' + blog.sys.id;
    return (
      <div>
        <Link to={url}><Image width="100%" src={blog.fields.thumbnail.fields.file.url} /></Link>
        <h3>{blog.fields.title}</h3>
        <p className="text-justify">{blog.fields.description}</p>
        <p>
          <Button 
            bsStyle="primary"
            onClick={() => {this.props.history.push(url)}}
          >
            Read More
          </Button>
        </p>
      </div>
    );
  }

  renderAggregationPage(state){
    if (!state || !state.blogs || state.blogs.length <= 0){
      return null;
    }

    var results = [];
    for (var index = 0; index < state.blogs.length; index++){
      if (index === 0){
        results[index] = 
          <Row className="show-grid">
            <Col sm={12}>
              {this.renderBlog(state.blogs[index])}
            </Col>            
          </Row>;
      }else if (index % 2 === 1 && index < state.blogs.length - 1){
        results[index] =
          <Row className="show-grid">
            <Col xs={12} sm={6} >
              {this.renderBlog(state.blogs[index])}
            </Col>            
            <Col xs={12} sm={6} >
              {this.renderBlog(state.blogs[index + 1])}
            </Col>            
          </Row>;
      } else if (index % 2 === 1 && index === state.blogs.length - 1){
        results[index] = <Row className="show-grid">
          <Col xs={12} sm={6} >
          {this.renderBlog(state.blogs[index])}
          </Col>            
        </Row>;
      }
    }
    return results;
  }

  render() {
    return (
        <Grid>
          <Row>
            <Col xs={0} sm={0} md={0} lg={1}></Col>
            <Col xs={12} sm={12} md={12} lg={10}>
              {this.renderAggregationPage(this.state)}
            </Col>
            <Col xs={0} sm={0} md={0} lg={1}></Col>
          </Row>
        </Grid>
    );
  }
}

export default AggregationPage;
