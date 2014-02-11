/** @jsx React.DOM */

var comments = [
  { author: 'sean', text: 'i like ruby.' },
  { author: 'alli', text: 'i like games.' },
  { author: 'sebastian', text: 'i like getting filthy dirty.' }
];

var CommentBox = React.createClass({displayName: 'CommentBox',
  render: function () {
    return (
      React.DOM.div( {className:"commentBox"}, 
        React.DOM.h1(null, "Comments"),
        CommentList( {data:this.props.data} ),
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
  CommentBox( {data:comments} ),
  document.getElementById('content')
);
