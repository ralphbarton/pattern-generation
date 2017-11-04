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

	this.pTypes = [
	    "link", // 0 - link
	    "R",    // 1 - random
	    "R-f",  // 2 - random_free
	    "CPP",  // 3 - cpot_pick
	    "C-ln"  // 4 - linked colour
	];
    }

    MotfEdit_params_WgTableColumns(){

	const handleEditingMotfChange = this.props.handleEditingMotfChange;
	const Params = this.props.Motf.Params;

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
		    const pType = this.pTypes[param.type];
		    return (
			<div className={pType}
			     onClick={()=>{
				 const new_type = param.type >= 4 ? 0 : (param.type+1);
				 this.props.handleEditingMotfChange({
				     Params: {
					 [_.findIndex(Params, {id: param.id})]: {
					     type: {$set: new_type}}
				     }});
			     }}
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
		       name="New"
		       buttonStyle={"small"}
		       onClick={()=>{
			   const hi_param = _.maxBy(Params, 'id');
			   const new_id = hi_param !== undefined ? (hi_param.id + 1) : 0;
			   this.props.handleEditingMotfChange({
			       Params: {
				   $push: [{
				       id: new_id,
				       type: 0, //link
				       name: "LP--",
				       min: 0,
				       max: 100    
				   }]
			       }
			   });
		       }}
		     />
		      
		  </div>
		</div>
		
	    </WgBoxie>
	);
    }
}

export default MotfEdit_Section_Parameters;
