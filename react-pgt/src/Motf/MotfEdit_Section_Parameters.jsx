import React from 'react';

import WgTable from '../Wg/WgTable';


class MotfEdit_Section_Parameters extends React.PureComponent {

    MotfEdit_params_WgTableColumns(){
	return ([
	    {
		heading: "Identifier",
		renderCellContents: (param, i)=>{return "c1";}
	    },{
		heading: "Min",
		renderCellContents: (param, i)=>{return "c2";}
	    },{
		heading: "Max",
		renderCellContents: (param, i)=>{return "c3";}
	    }
	]);
    }
    
    render(){
	return (
		<div className="parameters">
		  <WgTable
		     selectedRowIndex={0}
		     onRowSelectedChange={()=>{}}
		     rowRenderingData={[ [], [], [], []]}
		     columnsRendering={this.MotfEdit_params_WgTableColumns()}
		    />

		</div>
	);
    }
}

export default MotfEdit_Section_Parameters;
