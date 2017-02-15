const fs = require('fs');

var path_input_file = "/home/ralph/ln-pat-gen/Decriptive text.txt";
var path_output_file = "/home/ralph/ln-pat-gen/hand-descriptions.js";

//JavaScript: trim leading or trailing spaces from a string
function trim (mystring){
    return mystring.replace(/^\s+|\s+$/g, "");
}


/*
var desc_text = [
{
    pattern_id:
    completion_date:
    materials_used:
    dimentions:
    img_comments:{
	"a.jpg": "it's yellow!",
	"b.jpg": "it's green!",
    }
}

];
*/

var DescriptionsArr = [];

fs.readFile(path_input_file, 'utf8', function (err,data) {

    if (err) {return console.log(err);}

    //code to run when the file has been read into memory
    var lines = data.split("\n");
    var n_lines = lines.length;
    var ix = 0; //counter for the line I've reached in my parsing...
    

    // skip lines until we find one that starts with an equals character
    while((lines[ix][0]!="=") && (ix < n_lines)){ix++;}
    
    //assume we're at an "=" line
    while(ix < n_lines){

	//the description (only) may be composed of more than one line
	var Desc = trim(lines[ix+3].replace("C:", ""));
	var d_counter = 1;
	while( lines[ix + 3 + d_counter][1] != ":" ){// expection a "D:" to indicate next data...
	    Desc += "\n<br>" + trim(lines[ix + 3 + d_counter]);
	    d_counter++;
	}


	var desc_obj = {
	    pattern_id:       trim(lines[ix].replace("=", "")),
	    completion_date:  trim(lines[ix+1].replace("A:", "")),
	    materials_used:   trim(lines[ix+2].replace("B:", "")),
	    description:      Desc,
	    dimentions:       trim(lines[ix+4+(d_counter-1)].replace("D:", "")),
	    img_comments: {}
	};

	ix += 5 +(d_counter-1); //we should be now be on the line starting capital E
	ix ++; //now at the list of individual files and description...

	while((ix < n_lines)&&(!lines[ix].includes("="))){
	    
	    if (lines[ix].includes(":")){
		var bits = lines[ix].split(":");
		desc_obj.img_comments[bits[0]] = trim(bits[1]);
	    }
	    ix++;
	}
	DescriptionsArr.push(desc_obj);
    }

    var str = "var hand_descriptions = {\ntext_obj: "+JSON.stringify(DescriptionsArr, null, 2)+"\n};"

    fs.writeFile(path_output_file, str, function(err) {
	if(err) {
            return console.log(err);
	}

	console.log("The 'hand-descriptions.js' was saved!");
    });

});
