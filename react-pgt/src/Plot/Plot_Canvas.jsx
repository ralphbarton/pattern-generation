import React from 'react';

/* I am ignoring the Plot_RenderManager.init() function, which I am assuming is called by something else and the
imported object below is shared. This does imply implicit communication between Components which is I guess an antipattern...
*/
import Plot_RenderManager from './plain-js/Plot_RenderManager';


class Plot_Canvas extends React.PureComponent {

    constructor(props) {
	super(props);
	this.side_length = this.props.size || 55; //default is a thumbnail square size 55px
    }

    applyThumbImgData(){
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
    }
    
    componentDidUpdate(){
	this.applyThumbImgData();
    }

    componentDidMount(){
	this.applyThumbImgData();
    }
    
    render(){
	return (
	    <canvas
	       className={"plot-thumb uid-" + this.props.Plot.uid}
	       width={this.side_length}
	       height={this.side_length}
	       ref={ (el) => {this.ThumbCanvas = el;}}
	      />
	);
    }
}

export default Plot_Canvas;
