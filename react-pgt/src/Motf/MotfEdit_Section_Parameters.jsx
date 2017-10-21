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
		}
		handleEditingMotfChange(
		    {Params: {linked: {[i]: {[key]: {$set: (limit ? v2 : v)}}}}}
		);
	    };
	};

	return ([
	    {
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
//	const AllParams = _.flatten([Params.linked, Params.random, Params.random_free]);

	return (
	    <WgBoxie className="parameters" name="Parameters">

	      <WgTable
		 selectedRowIndex={this.state.rowSelected}
		 onRowSelectedChange={ i => {this.setState({rowSelected: i});}}
		 rowRenderingData={Params.linked}
		 columnsRendering={this.MotfEdit_params_WgTableColumns()}
		/>

		<div className="rightSection">
		  <div className="parametersButtons">

		    <WgButton
		       name="Delete"
		       buttonStyle={"small"}
		       onClick={()=>{
			   this.props.handleEditingMotfChange({
			       Params: {linked: {$splice: [[this.state.rowSelected, 1]]}}
			   });
		       }}
		       />
		    <WgButton
		       name="New Linked Parameter"
		       buttonStyle={"small"}
		       onClick={()=>{
			   this.props.handleEditingMotfChange({
			       Params: {linked: {$push: [{
				       id: 99,/////////////////////////sort this...
				       name: "LP--",
				       min: 0,
				       max: 100    
			       }]}}
			   });
		       }}
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
