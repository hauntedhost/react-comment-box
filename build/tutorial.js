/** @jsx React.DOM */

var CommentBox = React.createClass({displayName: 'CommentBox',
  getInitialState: function () {
    return { data: [] };
  },
  componentWillMount: function () {
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
  render: function () {
    return (
      React.DOM.div( {className:"commentForm"}, 
        " Hello, world! I am a CommentForm. "
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
  CommentBox( {url:"comments.json"} ),
  document.getElementById('content')
);
