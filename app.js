const bodyParser = require('body-parser');
const express = require('express');
const ejs = require('ejs');
const mongoose = require('mongoose');
const port = process.env.PORT || 3000;

var app = express();

app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended: false}));

app.set('view engine', 'ejs');

app.listen(3000, function(){
  console.log('Server up and running');
});

//MongoDB setup using Mongoose
mongoose.connect('mongodb://localhost:27017/wikiDB', {useNewUrlParser: true, useUnifiedTopology: true});

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




app.get('/', function(req, res){

  Article.find({}, function(err, articles){
    console.log(articles);
    res.render('test', { documents: articles });
  });


});
