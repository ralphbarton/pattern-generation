var _ = require('lodash');

//import gallery_files from './gallery-files.js';
import gallery_text  from './gallery-text.js';

var ImgFiles_util = {

    getDetails: function(img_identity_str){
	return _.find(gallery_text.text_obj, {"pattern_id": img_identity_str} );  
    },

    getAspect: function(img_identity_str){
	const img_details = this.getDetails(img_identity_str);
	return img_details.dimentions.split("×").map( s => {return s.replace(/[^0-9.,]+/g, '');});
    }

};

export {ImgFiles_util as default};
