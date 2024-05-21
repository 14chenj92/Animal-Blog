// script.js
document.addEventListener('DOMContentLoaded', function() {
    // Grab the template script
    var templateScript = document.getElementById('template').innerHTML;
  
    // Compile the template
    var template = Handlebars.compile(templateScript);
  
    // Define the context
    var context = {
      title: "Wavy Background Animation"
    };
  
    // Render the template
    var compiledHtml = template(context);
  
    // Insert the rendered HTML into the DOM
    document.getElementById('content').innerHTML = compiledHtml;
  });
  