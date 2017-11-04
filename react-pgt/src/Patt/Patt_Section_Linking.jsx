import React from 'react';
//var _ = require('lodash');

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
			"Gringot"
		    );
		}
	    },
	    {
		heading: "Parameter name",
		renderCellContents: (param, i)=>{
		    return (
			"abc"
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
	return (
	    <WgBoxie className="Patt_Section_Linking" name="Motif Linking" >

	      <div>
		4 linked parameter(s) assigned
	      </div>

	      <div>
		2 linked parameter(s) unassigned
	      </div>

	      <div>
		<WgTable
		   selectedRowIndex={this.state.rowSelected}
		   onRowSelectedChange={ i => {this.setState({rowSelected: i});}}
		   rowRenderingData={[1,2,3,4]}
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
