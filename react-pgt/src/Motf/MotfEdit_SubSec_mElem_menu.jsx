import React from 'react';

import WgSmartInput from '../Wg/WgSmartInput';

import downArrow from './asset/down-arrow-80.png';
//import rightArrow from './asset/right-arrow-80.png';
import closeIcon from './asset/close-36.png';

class MotfEdit_SubSec_mElem_menu extends React.PureComponent {

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
	    <img className="downArrow"
		 src={downArrow}
		 alt=""/>
	);
    }

    renderExpanded(){
	const details = this.props.PropertyDetails;
	return (
	    <div>

	      <div className="A">
		Rectangle 1 Height
		<img className="closeIcon"
		     src={closeIcon}
		     alt=""
		     onClick={this.hofSetExpanded(false)}
		  />
	      </div>

	      <div className="B">
		Plain Number
		<WgSmartInput
		   value={this.props.value}
		   onChange={value => {this.props.modifyElem(details.DatH_Key, value);}}
		   dataUnit={details.unit || "dimentionless"}
		   max={750}//a bit arbitrary.
		  />
	      </div>
	    </div>
	);
    }
    
    render(){
	const extraClass = this.state.expanded ? " expanded" : "";
	return (
	    <div
	       className={"MotfEdit_SubSec_mElem_menu" + extraClass}
	       ref={(node)=>{this.wrapperRef = node;}}
	      onClick={this.state.expanded ? function(){} : this.hofSetExpanded(true)}
	       >
	      {this.state.expanded ? this.renderExpanded() : this.renderContracted()}
	    </div>
	);
    }
}

export default MotfEdit_SubSec_mElem_menu;
