import React from 'react';

import {select} from "d3-selection";
import "d3-selection-multi";

var _ = require('lodash');

class MotfEdit_Section_Properties_mElem_Icon extends React.PureComponent {

    putIconSVG(){

	const d3_svg = select(this.iconSVG);
	d3_svg.selectAll("*").remove();

	// dependence upon
	// 1. shape type
	// 2. fill colour
	// 3. stroke colour
	// 4. stroke width

	const E = this.props.mElem;

	// roughly show strokeWidth in proportion to shape size
	// although twice as thick to account for generally smaller icon
	// shape will start to distort stoke > 25
	// (rx for ellipse, width otherwise)...
	E["stroke-width"] = _.clamp( _.round(2 * E.strokeWidth * (40 / (E.rx || E.width)), 1), 1.5, 25);

	/*
	//non-ideal code style here...
	const esw = E.strokeWidth;
	(function(){
	    if(esw >= 5){return 3;}
	    if(esw >= 3){return 2;}
	    if(esw >= 1){return 1;}
	    return undefined;
	})();
	 */	

	if(E.shape === "obj-ellipse"){

	    d3_svg.append("ellipse").attr("class","some-obj")
	    	.attrs( {cx: 50, cy: 50, rx: 40, ry: 40} )
		.styles( _.pick(E, ["fill", "stroke", "stroke-width"]) );

	}else{// for now, non-ellipse -> rectangle

	    d3_svg.append("rect").attr("class","some-obj")
	    	.attrs( {x:10, y:10, width:80, height:80} )
		.styles( _.pick(E, ["fill", "stroke", "stroke-width"]) );
	}

    }
    
    componentDidUpdate(){
	this.putIconSVG();
    }

    componentDidMount(){
	this.putIconSVG();
    }
    
    render(){
	return(
	    <svg
	       width={this.props.size}
	       height={this.props.size}
	       viewBox="0 0 100 100"
	       ref={ (el) => {this.iconSVG = el;}}
	      />
	);
    }

}

export default MotfEdit_Section_Properties_mElem_Icon;
