import React from 'react';

import Slider, { Range } from 'rc-slider';
import tinycolor from 'tinycolor2';

import Cpot_util from './plain-js/Cpot_util.js';// range unpack

class CpotEdit_Section_Slider extends React.PureComponent {

    /*
    constructor() {
	super();
    }*/


    render() {

	const X = Cpot_util.range_unpack( this.props.hslaRange );

	const swatchKey = this.props.UI_rngC.swatchSelection;
	
	const getComp = function(k, isHi){
	    if (k === swatchKey){return (isHi ? 0 : 1);}
	    return X[k+"2"];
	};
	
	const col1 = tinycolor({
	    h: getComp("h", true),
	    s: getComp("s", true),
	    l: getComp("l", true),
	    a: getComp("a", true)
	});

	const col2 = tinycolor({
	    h: getComp("h", false),
	    s: getComp("s", false),
	    l: getComp("l", false),
	    a: getComp("a", false)
	});
	
	//generate a gradient



	
	var grad_str1 = ", " + col1.toRgbString() + " 0%";
	grad_str1 += ", " + col2.toRgbString() + " 100%";

	var grad_str2 = ", " + tinycolor("rgba(0,255,255,0.3)").toRgbString() + " 0%";
	grad_str2 += ", " + tinycolor("blue").toRgbString() + " 100%";
	
	return (
	    <div className="sliderSection chequer">

	      <div className="gradient">
		<div className="ly1"
		     style={{backgroundImage: "linear-gradient(to right"+grad_str1+")"}}
		     />
		<div className="ly2"
		     style={{backgroundImage: "linear-gradient(to right"+grad_str2+")"}}
		     />
	      </div>
	      
		  { // Determine which slider type to show...
		      swatchKey !== null &&
		  <div>
			  <Slider
				 step={0.5}
				 min={0}
				 max={100}
				 value={this.props.hslaRange[swatchKey] * 100}
				 onChange={ value =>{
				     this.props.handleEditingCpotSelItemChange(
					 {range: {[swatchKey]: {$set: value/100}}}
				     );
				 }}
				 />
		  </div>

		  }

		  {
		      true === "solid" &&
		  <div>
		    <Range />
		  </div>
		  }



	    </div>
	);
    }
}

export default CpotEdit_Section_Slider;
