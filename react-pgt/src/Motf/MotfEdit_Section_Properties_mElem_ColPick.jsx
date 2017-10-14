import React from 'react';

import { SketchPicker } from 'react-color';
import tinycolor from 'tinycolor2';

import downArrow from './../asset/down-arrow-80.png';

class MotfEdit_Section_Properties_mElem_ColPick extends React.PureComponent {

    renderContracted(){
	return (
	    <div>
	      <div className="chequer">
		<div className="swatch" style={{backgroundColor: this.props.color}}></div>
	      </div>
	      <img className="downArrow"
		   src={downArrow}
		   alt=""/>
	    </div>
	);
    }

    renderExpanded(){
	return (
	    <SketchPicker
		 color={this.props.color}
		 onChange={color => {
		     const newColour = tinycolor(color.rgb).toRgbString();
		     this.props.onColourChange(newColour);
		 }}
	       />
	);
    }
    
    render(){
	const extraClass = this.props.pop.expanded ? " expanded" : "";
	return (
	    <div
	       className={"MotfEdit_Section_Properties_mElem_ColPick" + extraClass}
	       ref={this.props.pop.setwrapperRef}
	       onClick={this.props.pop.hofSetExpanded(true, this.props.pop.expanded)}
	       >
	      {this.props.pop.expanded ? this.renderExpanded() : this.renderContracted()}
	    </div>
	);
    }
}

import withClickOut from './../HOC/withClickOut';
export default withClickOut(MotfEdit_Section_Properties_mElem_ColPick);
