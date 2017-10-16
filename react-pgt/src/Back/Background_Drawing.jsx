import React from 'react';
var _ = require('lodash');

import ImgFiles_util  from './plain-js/ImgFiles_util.js';
import gallery_files from './plain-js/gallery-files.js';

import Background_Drawing_ControlsBox from './Background_Drawing_ControlsBox';
import Background_Drawing_Chooser from './Background_Drawing_Chooser';


class Background_Drawing extends React.PureComponent {

    constructor(props) {
	super(props);
	this.state = {
	    selection: null
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

	this.setDrawing = this.setDrawing.bind(this);

	// Code for testing only.
	// to accelerate testing...
	setTimeout( ()=>{
	    this.setDrawing("139-01");
	}, 0);
    }

    setDrawing(imgKey){
	this.setState({
	    selection: imgKey
	});

	const aspect = imgKey !== null ? ImgFiles_util.getAspect(imgKey) : null;

	//this will call setState() in the parent
	this.props.setAspect(aspect);
    }
    
    render() {


	if(this.state.selection === null){

	    return (
		<Background_Drawing_Chooser
		   dict_fullsize={this.dict_fullsize}
		   setDrawing={this.setDrawing}
		   dims={this.props.dims}
		   />
	    );

	}else{

	    const path_L = process.env.PUBLIC_URL + "/img1600/";  //path_fullsize
	    //	      <textarea>{JSON.stringify(gallery_files, null, 2)}</textarea>

	    const imgKey = this.state.selection;
	    const ImgSet = this.dict_fullsize[imgKey];
	    
 	    return (
		<div className="Background_Drawing">

		  <Background_Drawing_ControlsBox
		     setDrawing={this.setDrawing}
		     selectedDrawing={imgKey}
		     />
		  
		  <img src={ path_L+ImgSet[ImgSet.length-1] } alt=""/>
		</div>
	    );

	}
    }
    
}

export default Background_Drawing;
