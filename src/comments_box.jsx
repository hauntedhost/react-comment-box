/** @jsx React.DOM */

var CommentBox = React.createClass({
  getComments: function () {
    console.log('GET', this.props.url);
    $.ajax({
      url: this.props.url,
      dataType: 'json',
      success: function (data) {
        this.setState({ data: data || [] });
      }.bind(this),
      error: function (xhr, status, err) {
        console.error('GET', status, err.toString());
      }.bind(this)
    });
  },
  handleCommentSubmit: function (comment) {
    console.log('POST', this.props.url, comment);
    var comments = this.state.data;
    var newComments = comments.concat([comment]);
    this.setState({ data: newComments });
    $.ajax({
      url: this.props.url,
      dataType: 'json',
      type: 'POST',
      data: comment,
      success: function (data) {
        this.setState({ data: data || []});
      }.bind(this),
      error: function (xhr, status, err) {
        console.error('POST', status, err.toString());
      }.bind(this)
    });
  },
  handleCommentDelete: function (key) {
    console.log('DELETE', this.props.url, key);
    $.ajax({
      url: this.props.url,
      dataType: 'json',
      type: 'DELETE',
      data: { id: key },
      success: function (data) {
        this.setState({ data: data || [] });
      }.bind(this),
      error: function (xhr, status, err) {
        console.error('DELETE', status, err.toString());
      }.bind(this)
    });
  },
  getInitialState: function () {
    return { data: [] };
  },
  componentWillMount: function () {
    this.getComments();
    setInterval(this.getComments, this.props.pollInterval);
  },
  render: function () {
    return (
      <div className="commentBox">
        <h1>Comments</h1>
        <CommentList data={this.state.data} onDeleteComment={this.handleCommentDelete} />
        <CommentForm onCommentSubmit={this.handleCommentSubmit} />
      </div>
    );
  }
});

var CommentList = React.createClass({
  onDeleteComment: function (key) {
    this.props.onDeleteComment(key);
  },
  render: function () {
    var that = this;
    var commentNodes = this.props.data.map(function (comment) {
      return (
        <Comment author={comment.author} key={comment.id} onDeleteComment={that.onDeleteComment}>
          {comment.text}
        </Comment>
      );
    });
    return (
      <div className="commentList">
        {commentNodes}
      </div>
    );
  }
});

var converter = new Showdown.converter();
var Comment = React.createClass({
  deleteComment: function () {
    var key = this.props.key;
    this.props.onDeleteComment(key);
  },
  render: function () {
    var rawMarkup = converter.makeHtml(this.props.children.toString());
    return (
      <div className="comment">
        <h2 className="commentAuthor">
          {this.props.author}
        </h2>
        <span dangerouslySetInnerHTML={{__html: rawMarkup}} />
        <button onClick={this.deleteComment}>Delete</button>
      </div>
    );
  }
});

var CommentForm = React.createClass({
  handleSubmit: function () {
    var author = this.refs.author.getDOMNode().value.trim();
    var text = this.refs.text.getDOMNode().value.trim();
    if (!text || !author) {
      return false;
    }
    this.props.onCommentSubmit({ author: author, text: text });
    this.refs.author.getDOMNode().value = '';
    this.refs.text.getDOMNode().value = '';
    return false;
  },
  render: function () {
    return (
      <form className="commentForm" onSubmit={this.handleSubmit}>
        <input type="text" placeholder="Your name" ref="author" /><br />
        <textarea placeholder="Say something ..." ref="text" /><br />
        <input type="submit" value="Post" />
      </form>
    );
  }
});

React.renderComponent(
  <CommentBox url="comments" pollInterval={2000} />,
  document.getElementById('content')
);
