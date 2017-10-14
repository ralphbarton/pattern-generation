import React from 'react';
var _ = require('lodash');

import gallery_files from './plain-js/gallery-files.js';
import gallery_text  from './plain-js/gallery-text.js';



class Drawing extends React.PureComponent {
    
    render() {

	const path = process.env.PUBLIC_URL + "/img1600/"; //path_fullsize

	//copy-pasted...
	var dict_fullsize = {};
	gallery_files.fullsize_img.forEach(function(filename) {

	    var img_code = filename.slice(0,6);
	    if(dict_fullsize[img_code] === undefined){
		dict_fullsize[img_code] = [];
	    }
	    dict_fullsize[img_code].push(filename);

	});


//	      <textarea>{JSON.stringify(gallery_files, null, 2)}</textarea>

	const img_details = _.find(gallery_text.text_obj, {"pattern_id": "139-01"} );  
	const aspect = img_details.dimentions.split("×").map( s => {return s.replace(/[^0-9.,]+/g, '');});
	
	return (
	    <div className="Drawing">
	      <img src={ path+gallery_files.fullsize_img[0] } alt=""/>
	      <textarea value={aspect[0]} readOnly={true}/>
	      <textarea value={aspect[1]} readOnly={true}/>
	    </div>
	);
    }
    
}

export default Drawing;
