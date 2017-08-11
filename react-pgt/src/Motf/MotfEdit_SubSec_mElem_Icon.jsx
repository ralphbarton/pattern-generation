import React from 'react';
import * as d3 from "d3";

class MotfEdit_SubSec_mElem_Icon extends React.PureComponent {

    componentDidUpdate(){
	// update SVG for update...
    }

    componentDidMount(){
	// do SVG properly...
    }
    
    render(){
	return(
	    <svg width={this.props.size} height={this.props.size} viewBox="0 0 400 400">
	      <ellipse
		 className="some-obj"
		 cx="200"
		 cy="200"
		 rx="200"
		 ry="200"
		 style={{"fill": this.props.mElem.fill}} />

	    </svg>
	);
    }

}

export default MotfEdit_SubSec_mElem_Icon;
