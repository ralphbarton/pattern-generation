import React from 'react';

import WgBoxie from '../Wg/WgBoxie';
import WgTable from '../Wg/WgTable';
import {WgButton} from '../Wg/WgButton';


class MotfEdit_Section_Parameters extends React.PureComponent {

    MotfEdit_params_WgTableColumns(){
	return ([
	    {
		heading: "Identifier",
		renderCellContents: (param, i)=>{return "A-"+param;}
	    },{
		heading: "Min",
		renderCellContents: (param, i)=>{return "B-"+param;}
	    },{
		heading: "Max",
		renderCellContents: (param, i)=>{return "C-"+param;}
	    }
	]);
    }
    
    render(){

	const Params = this.props.Motf.Params;
	//this.props.handleEditingMotfChange

	return (
	    <WgBoxie className="parameters" name="Parameters">

	      <WgTable
		     selectedRowIndex={0}
		     onRowSelectedChange={()=>{}}
		     rowRenderingData={Params.random}
		     columnsRendering={this.MotfEdit_params_WgTableColumns()}
		    />

		<div className="rightSection">
		  <div className="parametersButtons">

		    <WgButton
		       name="Delete"
		       buttonStyle={"small"}
		       />
		    <WgButton
		       name="New Linked Parameter"
		       buttonStyle={"small"}
		       />
		    <WgButton
		       name="New Random Parameter (instance)"
		       buttonStyle={"small"}
		       />
		    <WgButton
		       name="New Random Parameter (free)"
		       buttonStyle={"small"}
		       />

		  </div>
		</div>
		
	    </WgBoxie>
	);
    }
}

export default MotfEdit_Section_Parameters;
