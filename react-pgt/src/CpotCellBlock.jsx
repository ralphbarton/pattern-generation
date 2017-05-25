import React from 'react';
import './CpotCellBlock.css';

import cpot_util from './CpotUtil';
import cpotEditPane_util from './PaneColourPotsEdit_util.js';

class CpotCellBlock extends React.PureComponent {

    render() {

	const invalid = (!this.props.cpot) || cpotEditPane_util.calcProbsSum(this.props.cpot) !== 100;
	const makeColour = ()=>{
	    if (!this.props.cpot){return 'grey';}
	    return cpot_util.DrawFromColourPot(this.props.cpot);
	};
	const tbodyClasses = "chequer "+ (this.props.chequerSize==="normal"?"":"tiny");

	switch (invalid){
	case false:
	    return (
		<table className="CpotCellBlock"><tbody className={tbodyClasses}>{
			Array(this.props.nY).fill(null).map( (el,i) => {
			    return ( <tr key={i}>
				     {
					 Array(this.props.nX).fill(null).map( (el,j) => {
					     return (
						 <td
						    key={j}
						    style={{backgroundColor: makeColour()}}
						    />
					     );
					 })}	
				     </tr>
				   );
			})}
		</tbody></table>
	    );
	default:
	    return (
		<div className="CpotCellBlock invalid">
		  <div>Item probabilities must sum to 100% for a valid Colour Pot.</div>
		  <div>This can be done using "summing tools"</div>
		</div>
	    );
	}
    }
}


export default CpotCellBlock;
