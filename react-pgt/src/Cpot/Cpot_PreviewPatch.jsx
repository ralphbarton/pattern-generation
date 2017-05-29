import React from 'react';

import Cpot_util from './plain-js/Cpot_util';
import CpotEdit_util from './plain-js/CpotEdit_util';

class Cpot_PreviewPatch extends React.PureComponent {

    render() {

	const invalid = (!this.props.cpot) || CpotEdit_util.calcProbsSum(this.props.cpot) !== 100;
	const makeColour = ()=>{
	    if (!this.props.cpot){return 'grey';}
	    return Cpot_util.DrawFromColourPot(this.props.cpot);
	};
	const tbodyClasses = "chequer "+ (this.props.chequerSize==="normal"?"":"tiny");

	switch (invalid){
	case false:
	    return (
		<table className="Cpot_PreviewPatch"><tbody className={tbodyClasses}>{
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
		<div className="Cpot_PreviewPatch invalid">
		  <div>Item probabilities must sum to 100% for a valid Colour Pot.</div>
		  <div>This can be done using "summing tools"</div>
		</div>
	    );
	}
    }
}


export default Cpot_PreviewPatch;
