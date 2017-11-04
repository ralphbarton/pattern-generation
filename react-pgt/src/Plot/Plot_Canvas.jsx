import React from 'react';

/* I am ignoring the Plot_RenderManager.init() function, which I am assuming is called by something else and the
imported object below is shared. This does imply implicit communication between Components which is I guess an antipattern...
*/
//import Plot_RenderManager from './plain-js/Plot_RenderManager';


class Plot_Canvas extends React.PureComponent {

    constructor(props) {
	super(props);
	this.side_length = this.props.size || 55; //default thumbnail size capped at a 55px square
    }

    getImgData(){
	// extract the correct ImgData from the cache...
	const uid = this.props.Plot.uid;
	const colour = this.props.colouringFunction === 2 ? "heatmap" : "greyscale";
	const Cached4Plot = this.props.PlotImgCache[uid];
	if(!Cached4Plot){return null;} // abort if no data retrieved (seems to sometimes happen when new Plot added)

	return Cached4Plot.ImgData["single"][colour]; // todo - it won't always be best to extract with the key "single"
    }

    applyThumbImgData(){
	/*
	const render_msg = Plot_RenderManager.render({
	    Plot: this.props.Plot,
	    width: this.side_length,
	    height: this.side_length,
	    resolution: 1,
	    colouringFunction: this.props.colouringFunction || 1 // default to grey if prop not provided...
	});	

	const ImgData = render_msg.ImageData_heatmap || render_msg.ImageData_grey;
	var ctx = this.ThumbCanvas.getContext('2d');
	ctx.putImageData(ImgData, 0, 0);
	 */
	
	const ctx = this.ThumbCanvas.getContext('2d');
	const ImgData = this.getImgData();
	if(!ImgData){return;}

	self.createImageBitmap(ImgData).then(
	    response => {
		ctx.drawImage(response, 0,0, this.aspectedWidth, this.aspectedHeight);
	    }
	);
    }
    
    componentDidUpdate(){
	this.applyThumbImgData();
    }

    componentDidMount(){
	this.applyThumbImgData();
    }
    
    render(){

	// decide actual dimentions of the thumbnail
	const ImgData = this.getImgData();
	if(ImgData){
	    const w = ImgData.width;
	    const h = ImgData.height;
	    this.aspectedWidth  = w>h ? this.side_length : (this.side_length * w/h);
	    this.aspectedHeight = h>w ? this.side_length : (this.side_length * h/w);
	}

	return (
	    <canvas
	       className={"plot-thumb uid-" + this.props.Plot.uid}
	       width={this.aspectedWidth}
	       height={this.aspectedHeight}
	       ref={ (el) => {this.ThumbCanvas = el;}}
	      />
	);
    }
}

export default Plot_Canvas;
