import React from 'react';
var _ = require('lodash');

import WgBoxie from '../Wg/WgBoxie';
import WgTable from '../Wg/WgTable';
import {WgDropDown} from '../Wg/WgDropDown';
import {WgButton} from '../Wg/WgButton';

class Patt_Section_Linking extends React.PureComponent {

    constructor() {
	super();
	this.state = {
	    rowSelected: 0
	};
    }

    WgTableColumns(){

	return ([
	    {
		heading: "Motif",
		renderCellContents: (param, i)=>{
		    return (
			<div>{param.mName}</div>
		    );
		}
	    },
	    {
		heading: "Parameter name",
		renderCellContents: (param, i)=>{
		    return (
			param.name
		    );
		}
	    },
	    {
		heading: "assigned",
		renderCellContents: (param, i)=>{
		    return (
			"123"
		    );
		}
	    }
	]);
    }

    componentWillReceiveProps(nextProps){
	if(this.props.patt_selectedIndex !== nextProps.patt_selectedIndex){
	    this.setState({rowSelected: undefined});
	}
    }
    
    render(){

	const Patt = this.props.Patt_i;

	// for each Motif, filter to its linked params and list them
	const LnParams = _.flatten(Patt.Motif_set.map( motf_i_sProps => {
	    const Motf = _.find(this.props.MotfArray, {uid: motf_i_sProps.uid});
	    const m_LnParams = _.filter(Motf.Params , {type: 0});
	    _.each(m_LnParams, o=>{o.mName = Motf.name;});//assign motif name
	    return _.filter(Motf.Params , {type: 0});
	}));

	//Todo - now compare "LnParams" with "Patt.links". The latter is a subset, depending on how many are assigned
	
	return (
	    <WgBoxie className="Patt_Section_Linking" name="Motif Linking" >

	      <div>
		{0} linked parameter(s) assigned
	      </div>

	      <div>
		{LnParams.length} linked parameter(s) unassigned
	      </div>

	      <div>
		<WgTable
		   selectedRowIndex={this.state.rowSelected}
		   onRowSelectedChange={ i => {this.setState({rowSelected: i});}}
		   rowRenderingData={LnParams}
		   columnsRendering={this.WgTableColumns()}
		  />

		  <WgDropDown
		     name="Range Override"
		     ddStyle="plain"
	             className="rangeOverride">

		    min <input/> <br/>
		    max <input/>

		<WgButton
		   name="revert"
		   enabled={true} />
		    
		  </WgDropDown>
	      </div>
	      
	      

	      
	    </WgBoxie>
	);
    }
}

export default Patt_Section_Linking;
