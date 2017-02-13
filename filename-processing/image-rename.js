const fs = require('fs');

// path to files on windows partition
//var pa = "/media/ralph/Windows/Documents\ and\ Settings/Ralph\ Barton/Desktop/LTT\ Lakeside\ efw/LTT_160729/";

var path = "/media/ralph/Windows/Documents and Settings/Ralph Barton/Desktop/Sketchbook patterns drawing/12-Feb filtered and resolution set2";

var dest = "/media/ralph/Windows/Documents and Settings/Ralph Barton/Desktop/Sketchbook patterns drawing/12-Feb filtered and resolution set3";


var subs = [
    {
	path: "Page 139",
	code: "139"
    },
    {
	path: "Page 146",
	code: "146"
    },
    {
	path: "Page 152",
	code: "152"
    },
    {
	path: "Page 153",
	code: "153"
    }
];


//courtesy of:
// http://stackoverflow.com/questions/1267283/how-can-i-create-a-zerofilled-value-using-javascript
function zeroFill( number, width )
{
  width -= number.toString().length;
  if ( width > 0 )
  {
    return new Array( width + (/\./.test( number ) ? 2 : 1) ).join( '0' ) + number;
  }
  return number + ""; // always return a string
}



//run through the pages 139 - 153.
subs.forEach(sub => {
    
    var page_num = sub.code; 

    //run through each design ("item") on this page
    fs.readdir(path+"/"+sub.path, function(err, items){
	items.forEach(item => {

	    var img_folder = path + "/" + sub.path + "/" + item;

	    //run through each image for this design
	    fs.readdir(img_folder, function(err, pics){

		pics.forEach( (pic, index) => {


		    var my_Fname = page_num + "-" + zeroFill(parseInt(item), 2) + "-" + "1600px" + zeroFill(index+1, 2) + ".jpg";

//		    console.log("==",page_num,"--",item,"== : ", pic);

		    console.log("my_Fname", my_Fname);

		    var source_path = img_folder + "/" + pic;
		    var dest_path = dest  + "/" + my_Fname;

		    fs.rename(source_path, dest_path);

		});
	    });


	});
    });

});


