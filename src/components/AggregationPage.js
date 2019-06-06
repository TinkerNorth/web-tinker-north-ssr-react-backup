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
import gql from "graphql-tag";
import { Query } from 'react-apollo';
 
const GET_AGGREGATION_PAGES = gql`
query {
  AggregationPages(id: "4aOf3WwFvaycCSw2q4SKWW") {
    id
    title
    blogs {
      id
      title
      description
      thumbnail {
        title
        url
      }
    }
  }
}
`;
 

class AggregationPage extends Component {

  renderBlog(blog){
    var url = '/article/' + blog.id;
    return (
      <div>
        <Link to={url}><Image width="100%" src={blog.thumbnail.url} /></Link>
        <h3>{blog.title}</h3>
        <p className="text-justify">{blog.description}</p>
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
      } else if (index % 2 === 1 && index < state.blogs.length - 1){
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
      <Query query={GET_AGGREGATION_PAGES}>
        {({ loading, error, data }) => {
          if (loading || error) return null;
          return (

            <Grid>
              <Row>
                <Col xs={0} sm={0} md={0} lg={1}></Col>
                <Col xs={12} sm={12} md={12} lg={10}>
                  {this.renderAggregationPage(data.AggregationPages)}
                </Col>
                <Col xs={0} sm={0} md={0} lg={1}></Col>
              </Row>
            </Grid>

          );
        }}
      </Query>
    );
  }
}

export default AggregationPage;
