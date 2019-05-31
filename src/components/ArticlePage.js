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

const SPACE_ID = 'dm0i1bxzikc3'
const ACCESS_TOKEN = '51f222821a25bbd4e496b2308c3d71e09dd531142ed690d5ab333feeed7c1467'

const contentful = require("contentful");

class ArticlePage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      blog: {}
    };
  }

  componentDidMount(){
    const client = contentful.createClient({
      space: SPACE_ID,
      accessToken: ACCESS_TOKEN
    });


    client
      .getEntry(this.props.match.params.entityId)
      .then(entry => {
        this.setState({blog: entry});
      })
      .catch(err => console.log(err));
  }
  renderBlog(blog){
    return (
      <div>
        
      </div>
    );
  }

  renderArticleHeader(state){
    if (!state || !state.blog || !state.blog.fields){
      return null;
    }

    var imageUrl = state.blog.fields.thumbnail.fields.file.url;

    return <Image className="main-art" src={imageUrl} />;
  }

  renderInnerRichParagraph(contentList) {
    var results = [];
    for (var index = 0; index < contentList.length; index++) {
      var contentItem = contentList[index];

      
      if (contentItem.nodeType === 'text') {    
        var value = contentItem.value;
        value = this.applyMarkings(contentItem, value);
  
        results.push(value);
      } else if (contentItem.nodeType === 'hyperlink') {        
        results.push(<a href={contentItem.data.uri}>{this.renderInnerRichParagraph(contentItem.content)}</a>);
      } else if (contentItem.nodeType === 'paragraph'){
        results.push(<p className="text-justify">{this.renderInnerRichParagraph(contentItem.content)}</p>);
      } else if (contentItem.nodeType === 'heading-1'){
        results.push(<h1>{this.renderInnerRichParagraph(contentItem.content)}</h1>);
      } else if (contentItem.nodeType === 'heading-2'){
        results.push(<h2>{this.renderInnerRichParagraph(contentItem.content)}</h2>);
      } else if (contentItem.nodeType === 'heading-3'){
        results.push(<h3>{this.renderInnerRichParagraph(contentItem.content)}</h3>);
      } else if (contentItem.nodeType === 'heading-4'){
        results.push(<h4>{this.renderInnerRichParagraph(contentItem.content)}</h4>);
      } else if (contentItem.nodeType === 'heading-5'){
        results.push(<h5>{this.renderInnerRichParagraph(contentItem.content)}</h5>);
      } else if (contentItem.nodeType === 'blockquote'){
        results.push(<blockquote>{this.renderInnerRichParagraph(contentItem.content)}</blockquote>);
      } else if (contentItem.nodeType === 'unordered-list'){
        results.push(<ul>{this.renderInnerRichParagraph(contentItem.content)}</ul>);
        this.renderInnerRichParagraph(contentItem.content)
      } else if (contentItem.nodeType === 'ordered-list'){
        results.push(<ol>{this.renderInnerRichParagraph(contentItem.content)}</ol>);
        this.renderInnerRichParagraph(contentItem.content)
      } else if (contentItem.nodeType === 'list-item'){
        results.push(<li>{this.renderInnerRichParagraph(contentItem.content)}</li>);
      } else if (contentItem.nodeType === 'embedded-asset-block'){
        results.push(<p><Image src={contentItem.data.target.fields.file.url} width="100%"/></p>);
      } else if (contentItem.nodeType === 'embedded-entry-block') {
        console.log(contentItem);
        console.log(contentItem.nodeType);
      } else {
        console.log(contentItem);
        console.log(contentItem.nodeType);
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
    if (!bodyItem || !bodyItem.fields || !bodyItem.fields.richParagraph || !bodyItem.fields.richParagraph.content) {
      return null;
    }

    var content = bodyItem.fields.richParagraph.content;
    return this.renderInnerRichParagraph(content);
  }

  renderArticlePage(state){
    if (!state || !state.blog || !state.blog.fields){
      return null;
    }


    var bodyList = [];
    for (var index = 0; index < state.blog.fields.body.length; index++) {
      var bodyItem = state.blog.fields.body[index];
      var contentType = bodyItem.sys.contentType.sys.id;
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
        <h1>{state.blog.fields.title}</h1>
        {bodyList}
      </div>
    );
  }

  render() {

    return (
      <div>
        {this.renderArticleHeader(this.state)}
        <Grid >
          <Row>
            <Col xs={0} sm={0} md={0} lg={1}></Col>
            <Col xs={12} sm={12} md={12} lg={10} className="card">
              {this.renderArticlePage(this.state)}
            </Col>
            <Col xs={0} sm={0} md={0} lg={1}></Col>
          </Row>
        </Grid>
      </div>
    );
  }
}

export default ArticlePage;
