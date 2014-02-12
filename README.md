React Comment Box
=================
[![Screenshot](/public/screenshot.png)](http://facebook.github.io/react/index.html)

Summary:
--------
An experiment tinkering with a [React tutorial](http://facebook.github.io/react/docs/tutorial.html) to create an embeddable Disqus-esque comment box.

Building on top of the tutorial slightly, I added simple POST and DELETE routes via Sinatra, backed by a wildly irresponsible choice of [PStore](http://ruby-doc.org/stdlib-1.9.2/libdoc/pstore/rdoc/PStore.html) for persistence.

**NOTE:** This is my first exposure to React. In order to get comment deletion to work I had to bubble the delete event from Comment to CommentList to CommentBox in a way that I'm sure is inefficient.

Usage:
------
```
$ ruby app.rb
```
Open ``localhost:4567``.

If you want to hack on the source, it's easy.
```
$ npm install -g gulp
$ gulp
```

Now open ``src/comments_box.jsx``. Save your changes and gulp will auto-compile the JSX to ``public/javascripts/comments_box.js``.

---
Developed by [Sean Omlor](http://seanomlor.com)
