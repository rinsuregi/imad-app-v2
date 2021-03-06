var express = require('express');
var morgan = require('morgan');
var path = require('path');
var Pool = require('pg').Pool;
var app = express();
var crypto = require('crypto');
var config = {
  host: 'db.imad.hasura-app.io',
  port: '5432',
  user: 'rinsuregi',
  password: process.env.DB_PASSWORD ,
  database: 'rinsuregi'
};
app.use(morgan('combined'));

var articles ={
    'article-one' : {
    title: 'Article One | Rinsu Regi',
    heading: 'Article One',
    date: 'Feb 24, 2017',
    content:`<p>
                This is the content for my first article.This is the content for my first article.This is the content for my first article.This is the content for my first article.This is the content for my first article.
            </p>
            <p>
                This is the content for my first article.This is the content for my first article.This is the content for my first article.This is the content for my first article.This is the content for my first article.
            </p>
            <p>
                This is the content for my first article.This is the content for my first article.This is the content for my first article.This is the content for my first article.This is the content for my first article.
            </p>`
    },
    'article-two' : {
    title: 'Article Two | Rinsu Regi',
    heading: 'Article Two',
    date: 'Feb 25, 2017',
    content:`<p>
                This is the content for my second article.
            </p>`
        
    },
    'article-three': {
    title: 'Article Three | Rinsu Regi',
    heading: 'Article Three',
    date: 'Feb 26, 2017',
    content:`<p>
                This is the content for my third article.
            </p>`
    }
};

function createTemplate (data){
    var title=data.title;
    var date=data.date;
    var heading=data.heading;
    var content=data.content;
    var htmlTemplate = `
    <!DOCTYPE html>
    <head>
        <title>
             ${title}
        </title>
        <meta name="viewport" content="width-device-width, initial-scale=1"/>
        <link href="/ui/style.css" rel="stylesheet" />
    </head>
    <body>
        <div class= "container">
            <div>
                <a href="/">Home</a>
            </div>
            <hr/>
            <h3>
                ${heading}
            </h3>
            <div>
                ${date}
            </div>
            <div>
                 ${content}
            </div>
         </div>
    </body>

    </html>
    `;
     return htmlTemplate;
}

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'index.html'));
});

function hash(input,salt)
{ var hashed = crypto.pbkdf2Sync(input, salt,10000,512,'sha512');
  return hashed.toString('hex');
}

app.get('/hash/:input',function(req, res ){
    var hashedString = hash(req.params.input, 'this-is-some-random-string');
    res.send(hashedString);
});


var pool = new Pool(config);
app.get('/test-db', function (req,res){
  pool.query('SELECT * FROM test', function(err, result){
      if(err){
          res.status(500).send(err.tostring());
      }else {
          res.send(JSON.stringify(result.rows));
      }
      
  });
  
});
var counter=0;
app.get('/counter',function(req,res){
    counter =counter + 1;
    res.send(counter.toString());
});

app.get('/:articleName', function(req,res){
     var articleName = req.params.articleName;
     res.send(createTemplate(articles[articleName]));
});

app.get('/ui/style.css', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'style.css'));
});

app.get('/ui/madi.png', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'madi.png'));
});


var port = 8080; // Use 8080 for local development because you might already have apache running on 80
app.listen(8080, function () {
  console.log(`IMAD course app listening on port ${port}!`);
});
