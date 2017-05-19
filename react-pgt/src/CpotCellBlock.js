import React, { Component } from 'react';
import './CpotCellBlock.css';

import cpot_util from './CpotUtil';


class CpotCellBlock extends Component {
    
    
    render() {
	const nX = this.props.nX;
	const nY = this.props.nY;
	const makeColour = ()=>{return cpot_util.DrawFromColourPot(this.props.cpot)};
	return (
		<table className="CpotCellBlock"><tbody className="chequer tiny">
		{Array(nY).fill(null).map((el,i)=>{
		    return (<tr key={i}>{
			Array(nX).fill(null).map((el,j)=>{
			    const myStyle = {backgroundColor: makeColour()};
			    return (<td key={j} style={myStyle}/>);
			})
		    }	
			    </tr>);
		})}
	    </tbody></table>
	);
    }
}


export default CpotCellBlock;
