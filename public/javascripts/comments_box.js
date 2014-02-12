/** @jsx React.DOM */

var CommentBox = React.createClass({displayName: 'CommentBox',
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
      React.DOM.div( {className:"commentBox"}, 
        React.DOM.h1(null, "Comments"),
        CommentList( {data:this.state.data, onDeleteComment:this.handleCommentDelete} ),
        CommentForm( {onCommentSubmit:this.handleCommentSubmit} )
      )
    );
  }
});

var CommentList = React.createClass({displayName: 'CommentList',
  onDeleteComment: function (key) {
    this.props.onDeleteComment(key);
  },
  render: function () {
    var that = this;
    var commentNodes = this.props.data.map(function (comment) {
      return (
        Comment( {author:comment.author, key:comment.id, onDeleteComment:that.onDeleteComment}, 
          comment.text
        )
      );
    });
    return (
      React.DOM.div( {className:"commentList"}, 
        commentNodes
      )
    );
  }
});

var converter = new Showdown.converter();
var Comment = React.createClass({displayName: 'Comment',
  deleteComment: function () {
    var key = this.props.key;
    this.props.onDeleteComment(key);
  },
  render: function () {
    var rawMarkup = converter.makeHtml(this.props.children.toString());
    return (
      React.DOM.div( {className:"comment"}, 
        React.DOM.h2( {className:"commentAuthor"}, 
          this.props.author
        ),
        React.DOM.span( {dangerouslySetInnerHTML:{__html: rawMarkup}} ),
        React.DOM.button( {onClick:this.deleteComment}, "Delete")
      )
    );
  }
});

var CommentForm = React.createClass({displayName: 'CommentForm',
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
      React.DOM.form( {className:"commentForm", onSubmit:this.handleSubmit}, 
        React.DOM.input( {type:"text", placeholder:"Your name", ref:"author"} ),React.DOM.br(null ),
        React.DOM.textarea( {placeholder:"Say something ...", ref:"text"} ),React.DOM.br(null ),
        React.DOM.input( {type:"submit", value:"Post"} )
      )
    );
  }
});

React.renderComponent(
  CommentBox( {url:"comments", pollInterval:2000} ),
  document.getElementById('content')
);
