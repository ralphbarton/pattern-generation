import React from 'react';
var _ = require('lodash');

import gallery_files from './plain-js/gallery-files.js';
import ImgFiles_util  from './plain-js/ImgFiles_util.js';

import numeral from 'numeral';// for aspect ratios

class Background_Drawing extends React.PureComponent {

    constructor() {
	super();
	this.state = {
	    selection: null//"139-01"
	};

	//copy-pasted...
	this.dict_fullsize = {};
	const TS = this;
	gallery_files.fullsize_img.forEach(function(filename) {

	    var img_code = filename.slice(0,6);
	    if(TS.dict_fullsize[img_code] === undefined){
		TS.dict_fullsize[img_code] = [];
	    }
	    TS.dict_fullsize[img_code].push(filename);

	});
	
    }

    renderChooser(){

	const path_S = process.env.PUBLIC_URL + "/thumb360/"; //path_thumb
	const TS = this;
	
	return (
	    <div className="Background_Drawing chooser">
	      {
		  _.map(this.dict_fullsize, function(value, key){
		      const aspect = ImgFiles_util.getAspect(key);
		      const r = aspect[0]/aspect[1];
		      const imgWidth = Math.min(360, TS.props.dims.width/2);
		      return (
			  <div key={key}
			       onClick={() => {
				   TS.setState({
				       selection: key
				   });
			       }}
			       >

			    <img src={ path_S + key + "-thumb.Primary.jpg" }
				 alt=""
				 style={{width: imgWidth}}/ >
			      
			    <div className="text">
			      <div className="name">{key}</div>
			      <div className="date">{ImgFiles_util.getDetails(key)["completion_date"]}</div>
			      <div className="aspect">Aspect (W:H): <span>{numeral(r).format('0.00')} : 1</span></div>
			    </div>

			  </div>
		      );
		  })
	      }
	    </div>
	);
    }

    
    renderDrawing(){

	const path_L = process.env.PUBLIC_URL + "/img1600/";  //path_fullsize
	//	      <textarea>{JSON.stringify(gallery_files, null, 2)}</textarea>

	const imgKey = this.state.selection;
	const ImgSet = this.dict_fullsize[imgKey];
	
 	return (
	    <div className="Background_Drawing drawing">
	      <img src={ path_L+ImgSet[ImgSet.length-1] } alt=""/>
	      <a onClick={() => {
		    this.setState({
			selection: null
		    });
		}}>
		back
	      </a>
	    </div>
	);
    }

    
    render() {


	if(this.state.selection === null){
	    return this.renderChooser();
	}else{
	    return this.renderDrawing();
	}

    }
    
}

export default Background_Drawing;
