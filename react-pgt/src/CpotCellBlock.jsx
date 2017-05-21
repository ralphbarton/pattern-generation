import React from 'react';
import './CpotCellBlock.css';

import cpot_util from './CpotUtil';

function CpotCellBlock(props) {
    
    const makeColour = ()=>{return cpot_util.DrawFromColourPot(props.cpot);};
    const tbodyClasses = "chequer "+ (props.chequerSize==="normal"?"":"tiny");
    return (
	<table className="CpotCellBlock"><tbody className={tbodyClasses}>{
		Array(props.nY).fill(null).map( (el,i) => {
		    return ( <tr key={i}>
			     {
				 Array(props.nX).fill(null).map( (el,j) => {
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


export default CpotCellBlock;
