/*******************************************************************************
 * This plugin uses code from
 * http://plantuml.sourceforge.net/codejavascript2.html.
 * It also uses the rawdeflate algorithm from https://github.com/johan/js-deflate
 * as require in the plantuml notes.
 * Both were modified to export their relevant functions and required in. 
 ******************************************************************************/

(function(module) {
  "use strict";

  var plantUML = require("./static/lib/plantencode.js");

  // Finds @startuml and @enduml tags
  // Stores internal code in [1]
  var plantRegex = /\@startuml([\S\s]*)\@enduml/;

  var htmlRegex = /(<([^>]+)>)/ig;

  // Eventually the export object
  var Plant = {};

  var htmlEntitiesDecode = function (str) {
    return str.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"');
  }

  var generateUML = function(str) {
    var html = plantRegex.exec(str)[1];
    var script = htmlEntitiesDecode(html.replace(htmlRegex, ""));
    return "<img src='http://www.plantuml.com:80/plantuml/png/"+plantUML.compress(script)+"'></img>";
  }


  Plant.parse = function(data, callback) {

    if (!data || !data.postData || !data.postData.content) {
      return callback(null, data);
    }

    if (data.postData.content.match(plantRegex)) {
      data.postData.content =
        data.postData.content.replace(plantRegex, generateUML(data.postData.content));
      }

      callback(null, data);
    };

    module.exports = Plant;
}(module));
