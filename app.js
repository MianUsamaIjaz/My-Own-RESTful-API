const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');
require("dotenv").config();

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

mongoose.connect(process.env.MONGODB_URL,{useNewURLParser: true});

const articleSchema = {
    title: String,
    content: String
};

const Article = mongoose.model("Article", articleSchema);

/////////////////////////////////////////Request Targetting all articles////////////////////////////////////////////

app.route("/articles")

.get(function(req, res){

    Article.find({}).then(function(foundArticles){
        res.send(foundArticles);
    })
    .catch(function(err){
        res.send(err);
    })

})

.post(function(req, res){

    const newArticle = new Article({
        title: req.body.title,
        content: req.body.content
    });

    newArticle.save(function(err){
        if (!err){
            res.send("Succesfully added a new article.");
        } else {
            res.send(err);
        }
    });
})

.delete(function(req, res){
    Article.deleteMany({}).then(function(err){
        if (!err){
            res.send("Succesfully deleted all articles.");
        } else {
            res.send(err);
        }
    });
});


/////////////////////////////////////////Request Targetting a Specific article////////////////////////////////////////////

app.route("/articles/:articleTitle")

.get(function(req, res){

    Article.findOne({title: req.params.articleTitle}).then(function(foundArticle){
        if (foundArticle){
            res.send(foundArticle);
        } else {
            res.send("No article matching that title was found");
        }
    })
})

.put(function (req, res) {

    Article.replaceOne(
        
      {title: req.params.articleTitle},
      {title: req.body.title, content: req.body.content},
      {overwrite: true}
      
      )
      .then(function () {
        
        res.send("Succesfully updated article");

        })
        .catch(function (err) {

          res.send(err);

          })   
})

.patch(function(req, res){

    Article.updateOne(
        {title: req.params.articleTitle},
        {$set: req.body}
    ).then(function(err){
        if (!err){
            res.send("Succesfully updated the article.")
        } else {
            res.send(err)
        }
    });

})

.delete(function(req, res){

    Article.deleteOne(
        {title: req.params.articleTitle}
    ).then(function(err){
        if (!err){
            res.send("Succesfully deleted the corresponding article.");
        } else{
            res.send(err);
        }
    });
});

app.listen(3000, function() {
  console.log("Server started on port 3000");
});