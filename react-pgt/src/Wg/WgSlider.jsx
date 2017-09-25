import React from 'react';

import Slider from 'rc-slider';

function WgSlider(props) {
    const { enabled, ...restProps } = props;//pull off some props...
    const extraClass = props.enabled===false ? " disabled" : "";
    return (
	<Slider
	   className={"WgSlider" + extraClass}
	   {...restProps}
	   /*
	   step={0.5}
	   min={0}
	   max={100}
	   value={this.props.value}
	   onChange={ value =>{
	       this.props.handleEditingCpotSelItemChange(
		   {range: {[swatchKey]: {$set: value/100}}}
	       );
	  }
	  }*/
	  />
    );
}

export default WgSlider;
