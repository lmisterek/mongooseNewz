// Grab the articles as a json
$.getJSON("/articles/saved", function(data) {
  // For each one
  for (var i = 0; i < data.length; i++) {

    // Create a variable for the article ID
    var id = data[i]._id.toString();

    var section = $("<section>");
    section.attr("id", id);

    // Create a header as a link to the article
    var form = "<form action='/submit' method='post'>"
    var header = "<a target='_blank' href=" + data[i].link + "><h2>" + data[i].title + "</h2></a>";
    var textArea =  "<p>Comment</p>" + 
        "<input type='text' name='note' placeholder='Comment here'>";
    

    // Create a save button to save the article
    var button = $("<button>");
    button.html("Post Comment");

    
    // Include the id for the article as a part of the button
    button.attr("data-id", id);

    section.html(form + header + textArea + button[0].outerHTML);
    $("#articles").append(section);
   
  }
});