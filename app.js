var express = require('express'),
    app = express(),
    bodyParser = require('body-parser'),
    mongoose = require('mongoose');
    
//app config
app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine', 'ejs');

//Model config
mongoose.connect('mongodb://localhost/material_blog');

//schema
var blogSchema = new mongoose.Schema({
  title: String,
  image: String,
  body: String,
  created: {type: Date, default: Date.now}
});

var Blog = mongoose.model('Blog', blogSchema);

//restful routes
// Blog.create({
//   title: 'Test Blog',
//   image: 'https://images.unsplash.com/photo-1442291928580-fb5d0856a8f1?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=d160ffd5e066d0635e0f7319707531df&auto=format&fit=crop&w=889&q=80',
//   body: 'hello this is a blog post!'
// });

app.get('/', (req, res) => {
  res.redirect('/blogs');
});

//Index Route
app.get('/blogs', (req, res) => {
  Blog.find({}, (err, blogs) => {
    if(err) {
      console.log(err);
      return;
    }
    
    res.render('index', {blogs: blogs});
  });
});

//New Route
app.get('/blogs/new', (req, res) => {
  res.render('new');
});


//Create Route
app.post('/blogs', (req, res) => {
  //create blog
  Blog.create(req.body.blog, (err, newBlog) => {
    if (err) {
      res.render('new');
      return;
    }
    
    //redirect success
    res.redirect('/blogs');
  });
});

app.listen(process.env.PORT, process.env.IP, function() {
  console.log('Blog started!');
});