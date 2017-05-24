import React from 'react';
import './CpotCellBlock.css';

import cpot_util from './CpotUtil';

class CpotCellBlock extends React.PureComponent {

    render() {
	
	const makeColour = ()=>{
	    if (!this.props.cpot){return 'grey';}
	    return cpot_util.DrawFromColourPot(this.props.cpot);
	};
	const tbodyClasses = "chequer "+ (this.props.chequerSize==="normal"?"":"tiny");

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
    }
}


export default CpotCellBlock;
