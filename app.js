var express = require('express'),
    app = express(),
    methodOverride = require('method-override'),
    expressSanitizer = require('express-sanitizer');
    bodyParser = require('body-parser'), /* global bodyParser */
    mongoose = require('mongoose'); /* global mongoose */
    
//app config
app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(expressSanitizer());
app.use(methodOverride('_method'));
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
  //sanitize blog
  req.body.blog.body = req.sanitize(req.body.blog.body);
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

//show route
app.get('/blogs/:id', (req, res) => {
  Blog.findById(req.params.id, (err, foundBlog) => {
    if (err) {
      res.redirect('/blogs');
      return;
    }
    
    //success
    res.render('show', {blog: foundBlog});
  });
});

//edit route
app.get('/blogs/:id/edit', (req, res) => {
  Blog.findById(req.params.id, (err, foundBlog) => {
    if (err) {
      res.redirect('/blogs');
      return;
    }
    
    //success
    res.render('edit', {blog: foundBlog});
  });
});

//update route
app.put('/blogs/:id', (req, res) => {
  req.body.blog.body = req.sanitize(req.body.blog.body);
  const newBlog = req.body.blog;
  
  Blog.findByIdAndUpdate(req.params.id, newBlog, (err, updatedBlog) => {
    if (err) {
      res.redirect('/blogs');
      return;
    }
    
    //success
    res.redirect(`/blogs/${req.params.id}`);
  });
});

//delete route
app.delete('/blogs/:id', (req, res) => {
  Blog.findByIdAndRemove(req.params.id, err => {
    if (err) {
      res.redirect('/blogs');
      return;
    }
    
    res.redirect('/blogs');
  });
});

app.listen(process.env.PORT, process.env.IP, function() {
  console.log('Blog started!');
});