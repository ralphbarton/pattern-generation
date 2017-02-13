const fs = require('fs');

var path_1600 = "/media/ralph/Windows/Documents and Settings/Ralph Barton/Desktop/Sketchbook patterns drawing/13-Feb - 15 pattern designs";

var path_thumb = "/media/ralph/Windows/Documents and Settings/Ralph Barton/Desktop/Sketchbook patterns drawing/360x360 thumbnail";


fs.readdir(path_1600, function(err, items){

    console.log("\n Large JPGs\n");
    var str = JSON.stringify(items, null, 2)
    console.log(str);

});
	
fs.readdir(path_thumb, function(err, items){

    console.log("\n Thumbnails\n");
    var str = JSON.stringify(items, null, 2)
    console.log(str);

});
	
