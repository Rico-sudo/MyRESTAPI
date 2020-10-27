//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");

const mongoose = require("mongoose");

const app = express();

app.set("view engine", "ejs");

app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/wikiDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
//creating article schema
const articleSchema = {
  title: String,
  content: String,
};
//creating article model
const Article = mongoose.model("Article", articleSchema);
////////////////////req targetting all articles///////////////////////////
app
  .route("/articles")
  .get(function (req, res) {
    Article.find(function (err, foundArticles) {
      if (!err) {
        res.send(foundArticles);
      } else {
        res.send(err);
      }
    });
  })
  .post(function (req, res) {
    console.log(req.body.title);
    console.log(req.body.title);
    ///creating a post with the title and content
    const newArticle = new Article({
      title: req.body.title,
      content: req.body.content,
    });

    newArticle.save(function (err) {
      if (!err) {
        res.send("succ saved the doc");
      } else {
        res.send(err);
      }
    });
  })
  .delete(function (req, res) {
    Article.deleteMany(function (err) {
      if (!err) {
        res.send("succ delete all the articles");
      } else {
        res.send(err);
      }
    });
  });

/////////////req target a SPECIFIC article///////////////////////

//prendo un articolo specifico con la route
app
  .route("/articles/:articleTitle")
  .get((req, res) => {
    Article.findOne({ title: req.params.articleTitle }, (err, foundArticle) => {
      if (!err) {
        res.send(foundArticle);
      } else {
        console.log(err);
      }
    });
  })
// update content and title
  .put(function (req, res) {
    Article.replaceOne(
      { title: req.params.articleTitle },
      { title: req.body.title, content: req.body.content },
      function (err) {
        if (!err) {
          res.send("sucessfully updated article.");
        } else {
          res.send("there was an error:" + err);
        }
      }
    );
  })
  //update only the filed that we want 
  .patch(function(req,res)
{
  Article.updateOne(
      //condition
    {title:req.params.articleTitle},
    // the one that we want to replace
    {$set:req.body},
    function(err)
    {
      if(!err){res.send("sucessfully updated article.");} else {res.send("there was an error:" + err);}
    }
  )
})
.delete(function (req , res)
{
    Article.deleteOne(
        {title : req.params.articleTitle} , function (err){if(!err){
            res.send("succ delete the article")
        }
    else{
        res.send("error" + err)
    }}
    )
})

// app.route("/articles/:articleTitle").get(function (req, res) {
//   Article.findOne({ Title: req.params.articleTitle }, function (
//     err,
//     foundArticle
//   ) {
//     if (foundArticle) {
//       res.send(foundArticle);
//     } else {
//       res.send("no article matchin were found");
//     }
//   });
// });

app.listen(3000, function () {
  console.log("Server started on port 3000");
});
