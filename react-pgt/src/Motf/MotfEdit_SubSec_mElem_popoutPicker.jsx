import React from 'react';

import { SketchPicker } from 'react-color';
import tinycolor from 'tinycolor2';

import downArrow from './asset/down-arrow-80.png';

class MotfEdit_SubSec_mElem_popoutPicker extends React.PureComponent {

    constructor() {
	super();
	this.state = {
	    expanded: false
	};

	this.handleClickOutside = this.handleClickOutside.bind(this);
	this.hofSetExpanded = this.hofSetExpanded.bind(this);
    }

    componentWillUpdate(nextProps, nextState) {
	const S0 = this.state.expanded;
	const S1 = nextState.expanded;
	if(!S0 && S1){// 'rising edge'
	    document.addEventListener('mousedown', this.handleClickOutside);
	}
	if(S0 && !S1){// 'falling edge'
	    document.removeEventListener('mousedown', this.handleClickOutside);
	}
    }

    componentWillUnmount() {
	//I'm assuming it doesn't matter to call this callback-remove function if the callback was never added...
	document.removeEventListener('mousedown', this.handleClickOutside);
    }

    /**
     * Alert if clicked on outside of element
     */
    handleClickOutside(event) {
	if (this.wrapperRef && !this.wrapperRef.contains(event.target)) {
	    // You clicked outside of me!!
	    this.hofSetExpanded(false)();//get the function and immediately execute (silly).
	}
    }

    hofSetExpanded(isExpand){
	const TS = this;
	return function (){
	    TS.setState({expanded: isExpand});
	};
    }


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
	const extraClass = this.state.expanded ? " expanded" : "";
	return (
	    <div
	       className={"MotfEdit_SubSec_mElem_popoutPicker" + extraClass}
	       ref={(node)=>{this.wrapperRef = node;}}
	      onClick={this.state.expanded ? function(){} : this.hofSetExpanded(true)}
	       >
	      {this.state.expanded ? this.renderExpanded() : this.renderContracted()}
	    </div>
	);
    }
}

export default MotfEdit_SubSec_mElem_popoutPicker;
