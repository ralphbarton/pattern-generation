import React from 'react';

import WgSmartInput from '../Wg/WgSmartInput';

import downArrow from './../asset/down-arrow-80.png';
//import rightArrow from './../asset/right-arrow-80.png';
import closeIcon from './../asset/close-36.png';

class MotfEdit_SubSec_mElem_menu extends React.PureComponent {

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
		     onClick={this.props.pop.hofSetExpanded(false)}
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
	const extraClass = this.props.pop.expanded ? " expanded" : "";
	return (
	    <div
	       className={"MotfEdit_SubSec_mElem_menu" + extraClass}
	       ref={this.props.pop.setwrapperRef}
	       onClick={this.props.pop.hofSetExpanded(true, this.props.pop.expanded)}
	       >
	      {this.props.pop.expanded ? this.renderExpanded() : this.renderContracted()}
	    </div>
	);
    }
}


import withClickOut from './../withClickOut';
export default withClickOut(MotfEdit_SubSec_mElem_menu);
