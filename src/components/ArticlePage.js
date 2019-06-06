import React, { 
  Component
 } from 'react';
import './ArticlePage.css';
import { 
  Grid,
  Image,
  Row,
  Col
} from 'react-bootstrap';
import gql from "graphql-tag";
import { Query } from 'react-apollo';

const GET_ARTICLE = gql`
query {
  Article {
    id
    title
    thumbnail{
      title
      url
    }
    description
    body {
      id
      content_type
      content {
        node_type
        value
        marks {
          type
        }
        content {
          node_type
          value
          marks {
            type
          }
        }
      }
    }
  }
}
`;

class ArticlePage extends Component {
  renderBlog(blog){
    return (
      <div>
        
      </div>
    );
  }

  renderArticleHeader(state){
    if (!state || !state.thumbnail ){
      return null;
    }

    var imageUrl = state.thumbnail.url;

    return <Image className="main-art" src={imageUrl} />;
  }

  renderInnerRichParagraph(contentList) {
    var results = [];
    for (var index = 0; index < contentList.length; index++) {
      var contentItem = contentList[index];

      
      if (contentItem.node_type === 'text') {    
        var value = contentItem.value;
        value = this.applyMarkings(contentItem, value);
  
        results.push(value);
      } else if (contentItem.node_type === 'hyperlink') {        
        results.push(<a href={contentItem.data.uri}>{this.renderInnerRichParagraph(contentItem.content)}</a>);
      } else if (contentItem.node_type === 'paragraph'){
        results.push(<p className="text-justify">{this.renderInnerRichParagraph(contentItem.content)}</p>);
      } else if (contentItem.node_type === 'heading-1'){
        results.push(<h1>{this.renderInnerRichParagraph(contentItem.content)}</h1>);
      } else if (contentItem.node_type === 'heading-2'){
        results.push(<h2>{this.renderInnerRichParagraph(contentItem.content)}</h2>);
      } else if (contentItem.node_type === 'heading-3'){
        results.push(<h3>{this.renderInnerRichParagraph(contentItem.content)}</h3>);
      } else if (contentItem.node_type === 'heading-4'){
        results.push(<h4>{this.renderInnerRichParagraph(contentItem.content)}</h4>);
      } else if (contentItem.node_type === 'heading-5'){
        results.push(<h5>{this.renderInnerRichParagraph(contentItem.content)}</h5>);
      } else if (contentItem.node_type === 'blockquote'){
        results.push(<blockquote>{this.renderInnerRichParagraph(contentItem.content)}</blockquote>);
      } else if (contentItem.node_type === 'unordered-list'){
        results.push(<ul>{this.renderInnerRichParagraph(contentItem.content)}</ul>);
        this.renderInnerRichParagraph(contentItem.content)
      } else if (contentItem.node_type === 'ordered-list'){
        results.push(<ol>{this.renderInnerRichParagraph(contentItem.content)}</ol>);
        this.renderInnerRichParagraph(contentItem.content)
      } else if (contentItem.node_type === 'list-item'){
        results.push(<li>{this.renderInnerRichParagraph(contentItem.content)}</li>);
      } else if (contentItem.node_type === 'embedded-asset-block'){
        results.push(<p><Image src={contentItem.data.target.fields.file.url} width="100%"/></p>);
      } else if (contentItem.node_type === 'embedded-entry-block') {
        console.log(contentItem);
        console.log(contentItem.node_type);
      } else {
        console.log(contentItem);
        console.log(contentItem.node_type);
      }
      
    }

    return results;
  }

  applyMarkings(content, value) {
    if (content.marks && content.marks.length > 0) {
      for (var index = 0; index < content.marks.length; index++) {
        var markType = content.marks[index].type;
        if (markType === "bold") {
          value = <b>{value}</b>;
        } else if (markType === "code") {
          value = <code>{value}</code>;
        } else {
          console.log(markType);
        }
      }
    }
    return value;
  }

  renderRichParagraph(bodyItem) {
    if (!bodyItem || !bodyItem.content ) {
      return null;
    }

    var content = bodyItem.content;
    return this.renderInnerRichParagraph(content);
  }

  renderArticlePage(state){
    if (!state || !state.body ){
      return null;
    }


    var bodyList = [];
    for (var index = 0; index < state.body.length; index++) {
      var bodyItem = state.body[index];
      var contentType = bodyItem.content_type;
      if (contentType === "blogArticleParagraph"){
        bodyList.push(<p>{bodyItem.fields.paragraph}</p>);
      }else if (contentType === "blogArticleRichParagraph"){
        bodyList.push(this.renderRichParagraph(bodyItem));
      } else if (contentType === "blogArticleSubtitle"){
        bodyList.push(<h3>{bodyItem.fields.subtitle}</h3>);
      } else if (contentType === "blogArticleImage"){
        bodyList.push(<p><Image src={bodyItem.fields.image.fields.file.url} width="100%"/></p>);
      } else {
        console.log(contentType);
      }
    }

    return (
      <div>
        <h1>{state.title}</h1>
        {bodyList}
      </div>
    );
  }

  render() {
    console.log(this.props.match.params.entityId);
    return (
      <Query query={GET_ARTICLE}>
        {({ loading, error, data }) => {
          if (loading || error) return null;
          return (
            <div>
              {this.renderArticleHeader(data.Article)}
              <Grid >
                <Row>
                  <Col xs={0} sm={0} md={0} lg={1}></Col>
                  <Col xs={12} sm={12} md={12} lg={10} className="card">
                    {this.renderArticlePage(data.Article)}
                  </Col>
                  <Col xs={0} sm={0} md={0} lg={1}></Col>
                </Row>
              </Grid>
            </div>

          );
        }}
      </Query>
    );
  }
}

export default ArticlePage;
