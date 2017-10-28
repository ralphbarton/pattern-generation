import React from 'react';
var _ = require('lodash');

import WgBoxie from '../Wg/WgBoxie';
import WgTable from '../Wg/WgTable';
import {WgButton} from '../Wg/WgButton';


class MotfEdit_Section_Parameters extends React.PureComponent {

    constructor() {
	super();
	this.state = {
	    rowSelected: 0
	};
    }

    MotfEdit_params_WgTableColumns(){

	const handleEditingMotfChange = this.props.handleEditingMotfChange;
	const hofSetMinMax = function(param, i, key, limit){
	    const oKey = key === "min" ? "max" : "min";
	    return function(event){
		const v = event.target.value;
		let v2;
		if(key==="min" || key==="max"){
		    v2 = Math[key](v, param[oKey]);
		    if(isNaN(v2)){v2=0;}
		}
		handleEditingMotfChange(
		    {Params: {[i]: {[key]: {$set: (limit ? v2 : v)}}}}
		);
	    };
	};

	return ([
	    {
		heading: "Type",
		renderCellContents: (param, i)=>{
		    const pType = (()=>{
			if (param.type === "link")  {return "link"}
			if (param.type === "random"){return "R"}
			if (param.type === "random_free"){return "R-f"}
			if (param.type === "cpot_pick"){return "CPP"}
			return "unk";
		    })();
		    return (
			<div className={pType} onClick={null}
			     >
			  {pType}
			</div>
		    );
		}
	    },{
		heading: "Identifier",
		renderCellContents: (param, i)=>{
		    return (
			<input className="blue-cell"
			       value={param["name"]} 
			       onChange={hofSetMinMax(param, i, "name", false)}
			       onBlur={null}//function to fix name...
			  />
		    );
		}
	    },{
		heading: "Min",
		renderCellContents: (param, i)=>{
		    return (
			<input className="blue-cell"
			       value={param["min"]} 
			       onChange={hofSetMinMax(param, i, "min", false)}
			       onBlur={hofSetMinMax(param, i, "min", true)}
			  />
		    );
		}
	    },{
		heading: "Max",
		renderCellContents: (param, i)=>{
		    return (
			<input className="blue-cell"
			       value={param["max"]} 
			       onChange={hofSetMinMax(param, i, "max", false)}
			       onBlur={hofSetMinMax(param, i, "max", true)}
			       />
		    );
		}
	    }
	]);
    }
    
    render(){

	const Params = this.props.Motf.Params;

	return (
	    <WgBoxie className="parameters" name="Parameters">

	      <WgTable
		 selectedRowIndex={this.state.rowSelected}
		 onRowSelectedChange={ i => {this.setState({rowSelected: i});}}
		 rowRenderingData={Params}
		 columnsRendering={this.MotfEdit_params_WgTableColumns()}
		/>

		<div className="rightSection">
		  <div className="parametersButtons">

		    <WgButton
		       name="Delete"
		       buttonStyle={"small"}
		       onClick={()=>{
			   this.props.handleEditingMotfChange({
			       Params: {$splice: [[this.state.rowSelected, 1]]}
			   });
		       }}
		       />
		    <WgButton
		       name="New Linked Param"
		       buttonStyle={"small"}
		       onClick={()=>{
			   this.props.handleEditingMotfChange({
			       Params: {$push: [{
				       id: 99,/////////////////////////sort this...
				       name: "LP--",
				       min: 0,
				       max: 100    
			       }]}
			   });
		       }}
		       />
		    <WgButton
		       name="New Random Param (inst.)"
		       buttonStyle={"small"}
		       />
		    <WgButton
		       name="New Random Param (free)"
		       buttonStyle={"small"}
		       />

		  </div>
		</div>
		
	    </WgBoxie>
	);
    }
}

export default MotfEdit_Section_Parameters;
