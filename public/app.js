// Grab the articles as a json
$.getJSON("/articles", function(data) {
  // For each one
  for (var i = 0; i < data.length; i++) {

    // Create a variable for the article ID
    var id = data[i]._id.toString();

    var section = $("<section>");
    section.attr("id", id);

    // Create a header as a link to the article
    var header = "<a target='_blank' href=" + data[i].link + "><h2>" + data[i].title + "</h2></a>";
    section.html(header);

    // Create a save button to save the article
    var button = $("<button>");
    button.html("Save Article");

    // Include the id for the article as a part of the button
    button.attr("data-id", id);
    // header.append(button);
    // section.append(header);
    // header.append(button);
    $("#articles").append(section.append(button));
   
  }
});


// // Whenever someone clicks a p tag
// $(document).on("click", "p", function() {
//   // Empty the notes from the note section
//   $("#notes").empty();
//   // Save the id from the p tag
//   var thisId = $(this).attr("data-id");

//   // Now make an ajax call for the Article
//   $.ajax({
//     method: "GET",
//     url: "/articles/" + thisId
//   })
//     // With that done, add the note information to the page
//     .done(function(data) {
//       console.log(data);
//       // The title of the article
//       $("#notes").append("<h2>" + data.title + "</h2>");
//       // An input to enter a new title
//       $("#notes").append("<input id='titleinput' name='title' >");
//       // A textarea to add a new note body
//       $("#notes").append("<textarea id='bodyinput' name='body'></textarea>");
//       // A button to submit a new note, with the id of the article saved to it
//       $("#notes").append("<button data-id='" + data._id + "' id='savenote'>Save Note</button>");


//       // If there's a note in the article
//       if (data.note) {
//         // Place the title of the note in the title input
//         $("#titleinput").val(data.note.title);
//         // Place the body of the note in the body textarea
//         $("#bodyinput").val(data.note.body);
//       }
//     });
// });

// When you click the Save Article button
$(document).on("click", "button", function() {
  // Grab the id associated with the article from the submit button
  var thisId = $(this).attr("data-id");

  // jquery section selector
  var id = "#" + thisId.toString();


  // Run a POST request to change the article saved value to true
  $.ajax({
    method: "POST",
    url: "/articles/" + thisId,
    data: {
      // change the article truth value to saved
      saved: true    
    }
  })
    // With that done
    .done(function(data) {
      
      // Log the response
      console.log(data);

      // Remove the article from the page
      $(id).empty();
      
    });
});


  // // Run a POST request to change the note, using what's entered in the inputs
  // $.ajax({
  //   method: "POST",
  //   url: "/articles/" + thisId,
  //   data: {
  //     // Value taken from title input
  //     title: $("#titleinput").val(),
  //     // Value taken from note textarea
  //     body: $("#bodyinput").val()
  //   }
  // })
  //   // With that done
  //   .done(function(data) {
  //     // Log the response
  //     console.log(data);
  //     // Empty the notes section
  //     $("#notes").empty();
  //   });

  // // Also, remove the values entered in the input and textarea for note entry
  // $("#titleinput").val("");
  // $("#bodyinput").val("");
