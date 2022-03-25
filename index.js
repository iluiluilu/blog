const express = require('express')
const app = express()
const port = 3000
const MarkdownIt = require('markdown-it')
const db = require('./mongoConnection');
db.connectToServer(function (err) {
  if (err) {
    console.error(err);
    process.exit();
  }

  // start the Express server
  app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
  })

  app.set('view engine', 'pug')

  app.get('/', (req, res) => {
    const dbConnect = db.getDb();
    dbConnect
      .collection("posts")
      .find({}).limit(10)
      .toArray(function (err, posts) {
        if (err) {
          res.render('index', { title: 'List of rice', posts: posts })
        } else {
          res.render('index', { title: 'List of rice', posts: posts })
        }
      });
  })

  app.get('/post/:id', (req, res) => {
    const dbConnect = db.getDb();
    const md = new MarkdownIt();
    const ObjectId = require('mongodb').ObjectID;
    const id = req.params.id;
    if (!ObjectId.isValid(id)) {
      res.render('detail', { "title": 'Oops!', "titlePost": null, "contentPost": "Post ID is invalid!" })
      return;
    }
    dbConnect
      .collection("posts")
      .findOne({"_id": new ObjectId(id)}, function (err, post) {
        let contentHtml = null;
        if (err || !post) {
          contentHtml = "Post not found";
        } else {
          contentHtml = md.render(post.content);
        }
        res.render('detail', { "title": post ? post.title : 'Oops!', "titlePost": post ? post.title : null, "contentPost": contentHtml })
    })
  })
});







