/** @jsx React.DOM */

var CommentBox = React.createClass({displayName: 'CommentBox',
  getComments: function () {
    $.ajax({
      url: 'comments.json',
      dataType: 'json',
      success: function (data) {
        this.setState({ data: data });
      }.bind(this),
      error: function (xhr, status, err) {
        console.error('comments.json', status, err.toString());
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
        CommentList( {data:this.state.data} ),
        CommentForm(null )
      )
    );
  }
});

var CommentList = React.createClass({displayName: 'CommentList',
  render: function () {
    var commentNodes = this.props.data.map(function (comment) {
      return Comment( {author:comment.author}, comment.text);
    });
    return (
      React.DOM.div( {className:"commentList"}, 
        commentNodes
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
    // TODO: send request to server
    this.refs.author.getDOMNode().value = '';
    this.refs.text.getDOMNode().value = '';
    return false;
  },
  render: function () {
    return (
      React.DOM.form( {className:"commentForm", onSubmit:this.handleSubmit}, 
        React.DOM.input( {type:"text", placeholder:"Your name", ref:"author"} ),
        React.DOM.input( {type:"text", placeholder:"Say something ...", ref:"text"} ),
        React.DOM.input( {type:"submit", value:"Post"} )
      )
    );
  }
});

var converter = new Showdown.converter();
var Comment = React.createClass({displayName: 'Comment',
  render: function () {
    var rawMarkup = converter.makeHtml(this.props.children.toString());
    return (
      React.DOM.div( {className:"comment"}, 
        React.DOM.h2( {className:"commentAuthor"}, 
          this.props.author
        ),
        React.DOM.span( {dangerouslySetInnerHTML:{__html: rawMarkup}} )
      )
    );
  }
});

React.renderComponent(
  CommentBox( {url:"comments.json", pollInterval:2000} ),
  document.getElementById('content')
);
