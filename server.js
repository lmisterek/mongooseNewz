/* Showing Mongoose's "Populated" Method
 * =============================================== */

// Dependencies
var express = require("express");
var path = require("path");
var bodyParser = require("body-parser");
var logger = require("morgan");
var mongoose = require("mongoose");
// Requiring our Note and Article models
var Note = require("./models/Note.js");
var Article = require("./models/Article.js");
// Our scraping tools
var request = require("request");
var cheerio = require("cheerio");
// Set mongoose to leverage built in JavaScript ES6 Promises
mongoose.Promise = Promise;


// Initialize Express
var app = express();

// Use morgan and body parser with our app
app.use(logger("dev"));
app.use(bodyParser.urlencoded({
  extended: false
}));

// Make public a static dir
app.use(express.static("public"));



// Database configuration with mongoose
mongoose.connect("mongodb://localhost/week18homework", {
  useMongoClient: true
});
var db = mongoose.connection;

// Show any mongoose errors
db.on("error", function(error) {
  console.log("Mongoose Error: ", error);
});

// Once logged in to the db through mongoose, log a success message
db.once("open", function() {
  console.log("Mongoose connection successful.");
});


// Routes
// ======

// HTML ROUTE for viewing saved articles
app.get("/saved", function(req, res) {
  // Grab every doc in the Articles array
  res.sendFile(path.join(__dirname+'/public/saved.html'));
});

// New note creation via POST route
app.post("/saved", function(req, res) {
  console.log("made it post.");

  var id = "59a198158fd99de0d6abeafc";
  // Use our Note model to make a new note from the req.body
  var newNote = new Note(req.body);
  // Save the new note to mongoose
  newNote.save(function(error, doc) {
    // Send any errors to the browser
    if (error) {
      res.send(error);
    }
    // Otherwise
    else {
      // Find our article and push the new note id into the Articles's notes array
      Article.findOneAndUpdate({"_id": id}, { $push: { "notes": doc._id } }, { new: true }, function(err, newdoc) {
        // Send any errors to the browser
        if (err) {
          res.send(err);
        }
        // Or send the newdoc to the browser
        else {
          res.send(newdoc);
        }
      });
    }
  });
});


// Scrape data from one site and place it into the mongodb db
app.get("/scrape", function(req, res) {
  // Make a request for the news section of ycombinator
  request("http://www.npr.org/sections/news/", function(error, response, html) {
    // Load the html body from request into cheerio
    var $ = cheerio.load(html);
    // For each element with a "title" class
    $("article").each(function(i, element) {

      // Save an empty result object
      var result = {};

      // Add the text and href of every link, and save them as properties of the result object
      result.title = $(element).children("div.item-info").children("h2.title").text();
      result.link = $(element).children("div.item-info").children("h2.title").children("a").attr("href");
      result.saved = false;

      // Using our Article model, create a new entry
      // This effectively passes the result object to the entry (and the title and link)
      var entry = new Article(result);

      // Now, save that entry to the db
      entry.save(function(err, doc) {
        // Log any errors
        if (err) {
          console.log(err);
        }
        // Or log the doc
        else {
          console.log(doc);
        }
      });

    });
  });

  // Send a "Scrape Complete" message to the browser
  res.send("Scrape Complete");
});

// This will get the articles we scraped from the mongoDB
app.get("/articles", function(req, res) {
  // Grab every doc in the Articles array
  Article.find({}, function(error, doc) {
    // Log any errors
    if (error) {
      console.log(error);
    }
    // Or send the doc to the browser as a json object
    else {
      res.json(doc);
    }
  });
});

// This will get the articles we scraped from the mongoDB
app.get("/articles/saved", function(req, res) {
  // Grab every doc in the Articles array
  Article.find({"saved": true}, function(error, doc) {
    // Log any errors
    if (error) {
      console.log(error);
    }
    // Or send the doc to the browser as a json object
    else {
      res.json(doc);
    }
  });
});



// New note creation via POST route
app.post("/saved", function(req, res) {
  console.log(req.body);
  // // Use our Note model to make a new note from the req.body
  // var newNote = new Note(req.body);
  // // Save the new note to mongoose
  // newNote.save(function(error, doc) {
  //   // Send any errors to the browser
  //   if (error) {
  //     res.send(error);
  //   }
  //   // Otherwise
  //   else {
  //     // Find our user and push the new note id into the User's notes array
  //     User.findOneAndUpdate({}, { $push: { "notes": doc._id } }, { new: true }, function(err, newdoc) {
  //       // Send any errors to the browser
  //       if (err) {
  //         res.send(err);
  //       }
  //       // Or send the newdoc to the browser
  //       else {
  //         res.send(newdoc);
  //       }
  //     });
  //   }
  // });
});

// New note creation via POST route
app.post("/submit", function(req, res) {

  // get the id of the article

  // Use our Note model to make a new note from the req.body
  var newNote = new Note({
    body: req.body.note});

  // Save the new note to mongoose
  newNote.save(function(error, doc) {
    // Send any errors to the browser
    console.log(doc);

    console.log(doc);
    if (error) {
      res.send(error);
    }
    // Otherwise
    else {
      // Find our article and push the new note id into the Articles's notes array
      Article.findOneAndUpdate({}, { $push: { "notes": doc._id }}, { new: true }, function(err, newdoc) {
        // Send any errors to the browser
        if (err) {
          res.send(err);
        }
        // Or send the newdoc to the browser
        else {
          res.send(newdoc);
        }
      });
    }
  });
});

// Grab an article by it's ObjectId
app.get("/articles/:id", function(req, res) {
  // Using the id passed in the id parameter, prepare a query that finds the matching one in our db...
  Article.findOne({ "_id": req.params.id })
  // ..and populate all of the notes associated with it
  .populate("note")
  // now, execute our query
  .exec(function(error, doc) {
    // Log any errors
    if (error) {
      console.log(error);
    }
    // Otherwise, send the doc to the browser as a json object
    else {
      res.json(doc);
    }
  });
});


// Create a new note or replace an existing note
app.post("/articles/:id", function(req, res) {
  // Create a new note and pass the req.body to the entry
  var newNote = new Note(req.body);

  // And save the new note the db
  newNote.save(function(error, doc) {
    // Log any errors
    if (error) {
      console.log(error);
    }
    // Otherwise
    else {

           // Use the article id to find and update it's note
      Article.findOneAndUpdate({ "_id": req.params.id }, { "saved": true })
      // Execute the above query
      .exec(function(err, doc) {
        // Log any errors
        if (err) {
          console.log(err);
        }
        else {
          // Or send the document to the browser
          res.send(doc);
        }
      });
      // // Use the article id to find and update it's note
      // Article.findOneAndUpdate({ "_id": req.params.id }, { "note": doc._id })
      // // Execute the above query
      // .exec(function(err, doc) {
      //   // Log any errors
      //   if (err) {
      //     console.log(err);
      //   }
      //   else {
      //     // Or send the document to the browser
      //     res.send(doc);
      //   }
      // });
    }
  });
});


// Listen on port 3000
app.listen(3000, function() {
  console.log("App running on port 3000!");
});



