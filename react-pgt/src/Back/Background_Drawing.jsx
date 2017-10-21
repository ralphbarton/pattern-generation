import React from 'react';
var _ = require('lodash');

import ImgFiles_util  from './plain-js/ImgFiles_util.js';
import gallery_files from './plain-js/gallery-files.js';

import Background_Drawing_ControlsBox from './Background_Drawing_ControlsBox';
import Background_Drawing_Chooser from './Background_Drawing_Chooser';

import {WgFadeTransition} from '../Wg/WgTransition';

import Draggable from 'react-draggable';

class Background_Drawing extends React.PureComponent {

    constructor(props) {
	super(props);
	this.state = {
	    selection: null, // this is the code (a string) for the drawing selected e.g. "139-01"
	    img_index: null, // which "progress photo" (they're in an ordered array)...
	    zoom: 1
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
	this.setZoom    = this.setZoom.bind(this);

	// Code for testing only.
	// to accelerate testing...
	setTimeout( ()=>{
	    this.setDrawing("146-04");
	}, 0);
    }

    setDrawing(imgKey, img_index){
	this.setState({
	    selection: imgKey,
	    img_index: ( typeof(img_index)==="number" ? img_index : null)
	});

	const aspect = imgKey !== null ? ImgFiles_util.getAspect(imgKey) : null;

	//this will call setState() in the parent
	this.props.setAspect(aspect);
    }

    setZoom(v){
	this.setState({
	    zoom: v
	});
    }



    // HACKY:
    // as a side effect, this compares this state with prev state and sets some hidden state...
    shouldComponentUpdate(nextProps, nextState){

	//hold memory of previous image, to allow fade-between transition effect...
	if(this.imgHistoryKey === undefined){
	    this.imgHistoryKey = 0;
	}


	//conditional so as to not use fade effect when just changing zoom on same image
	if((this.state.selection !== nextState.selection) || (this.state.img_index !== nextState.img_index)){
	    this.imgHistoryKey++;

	    // If changing to a different drawing, reset zoom...
	    if(this.state.selection !== nextState.selection){
		this.setZoom(1);
	    }
	}
	
	return true;
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

	    // which drawing
	    const imgKey = this.state.selection;

	    // which photo of that drawing
	    const ImgSet = this.dict_fullsize[imgKey];
	    const imgIdx = this.state.img_index === null ? (ImgSet.length-1) : this.state.img_index;

	    const s = new Date();
 	    return (
		<div className="Background_Drawing">

		  <div className="contain-ControlsBox"
		       style={{
			   width: this.props.outerWidth,
			   left: -(this.props.outerWidth-this.props.dims.width)/2
			   
		       }}
		       >
		    <Background_Drawing_ControlsBox
		       setDrawing={this.setDrawing}
		       selectedImgKey={imgKey}
		       selectedImgIdx={imgIdx}
		       dict_fullsize={this.dict_fullsize}
		       setZoom={this.setZoom}
		       zoom={this.state.zoom}
		       />
		  </div>

		  <div className="mainImgContainer">

		    <Draggable
		       disabled={this.state.zoom === 1}
		       position={this.state.zoom === 1 ? {x:0, y:0} : undefined}
		       bounds={{
		           left:   -((this.state.zoom/2)- 0.5) * this.props.dims.width,
		           top:    -((this.state.zoom/2)- 0.5) * this.props.dims.height,
		           right:   ((this.state.zoom/2)- 0.5) * this.props.dims.width,
		           bottom:  ((this.state.zoom/2)- 0.5) * this.props.dims.height
		       }}
		       >
		      <div className="dragImgContainer">

			<WgFadeTransition speed={1}>		  
			  <img src={ path_L + ImgSet[imgIdx] }
			       key={this.imgHistoryKey}
			       alt=""
			       style={{
				   ..._.pick(this.props.dims, ["width", "height"]),//drop "left" "top" etc
				   transform: `scale(${this.state.zoom})`
			       }}
			       onMouseDown={(event) => { if(event.preventDefault) {event.preventDefault();}}}
			       onLoad={()=>{console.log("imgLoad, took:", (new Date() - s));}}
			    />
			</WgFadeTransition>

		      </div>
		    </Draggable>

		  </div>
		  
		</div>
	    );

	}
    }
    
}

export default Background_Drawing;
