const bodyParser = require('body-parser');
const express = require('express');
const ejs = require('ejs');
const mongoose = require('mongoose');
const port = process.env.PORT || 3000;

const app = express();

app.use(express.static('public'));
app.use(bodyParser.urlencoded({
  extended: true
}));

app.set('view engine', 'ejs');

app.listen(3000, function() {
  console.log('Server up and running');
});

//MongoDB setup using Mongoose
mongoose.connect('mongodb://localhost:27017/wikiDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

//schema creation
var wikiSchema = new mongoose.Schema({
  title: String,
  content: String
});

//model to manage an 'articles' collection
var Article = mongoose.model('Article', wikiSchema);

var testDoc = new Article({
  title: 'testDoc title',
  content: 'testDoc content'
});
// testDoc.save();


// Requests targetting all articles

app.route('/articles')

  .get(function(req, res) {
    Article.find({}, function(err, articles) {
      if (!err) {
        res.send(articles);
      } else {
        res.send(err);
      }
    });
  })

  .post(function(req, res) {
    const newArticle = new Article({
      title: req.body.title,
      content: req.body.content
    });
    newArticle.save(function(err) {
      if (!err) {
        res.send('Successfully added a new article.');
      } else {
        res.send(err);
      }
    });
  })

  .delete(function(req, res) {
    Article.deleteMany({}, function(err) {
      if (!err) {
        res.send('Successfully deleted all articles.');
      } else {
        res.send(err);
      }
    });
  });

// Requests targetting a specific article

app.route('/articles/:target')

  .get(function(req, res) {
    Article.findOne({title: req.params.target}, function(err, article) {
      if (!err) {
        res.send(article);
      } else {
        res.send('No matching article was found.');
      }
    });
  })

  .put(function(req, res){
    Article.replaceOne(
      {title: req.params.target},
      {title: req.body.title, content: req.body.content},
      {overwrite: true},
      function(err){
        if(!err){
          res.send('Successfully updated the record.');
        } else {
          res.send(err);
        }
      });
  })

  .patch(function(req, res){
    Article.update(
      {title: req.params.target},
      {$set: req.body},
      function(err){
        if(!err){
          res.send('Successfully updated the article.');
        } else {
          res.send(err);
        }
      });
  })

  .delete(function(req, res){
    Article.deleteOne({title: req.params.target}, function(err){
      if(!err){
        res.send('Successfully deleted the article.');
      } else {
        res.send(err);
      }
    })
  });
