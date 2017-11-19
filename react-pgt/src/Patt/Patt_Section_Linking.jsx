import React from 'react';
var _ = require('lodash');

import WgBoxie from '../Wg/WgBoxie';
import WgTable from '../Wg/WgTable';
import {WgDropDown} from '../Wg/WgDropDown';
import {WgButton} from '../Wg/WgButton';

import Patt_util from './plain-js/Patt_util';

import Plot_Canvas from '../Plot/Plot_Canvas';


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

		    // todo: density paintings too.
		    if(param.type === "plot"){
			const Plot = _.find(this.props.PlotArray, {uid: param.target_uid});			
			console.log(">>", param.target_uid, this.props.PlotArray, Plot);
			return (
			    <Plot_Canvas
			       Plot={Plot}
			       size={55}
			       PlotImgCache={this.props.PlotImgCache}
			       />
			);
		    }else{
			return (
			    <div>not plot</div>
			);
		    }
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
	const AllMotifsConnectedLinks = _.flatten(Patt.Motif_set.map( motf_i_sProps => {

	    const Motf = _.find(this.props.MotfArray, {uid: motf_i_sProps.uid});

	    //  mName (Motif Name) property is set in returned objects
	    const MotifConnectedLinks = Patt_util.connectMotifLinksToPatt(Motf, Patt.links);

	    return MotifConnectedLinks;
	}));

	const AllMotifsUnassignedLinks = _.filter(AllMotifsConnectedLinks, {target_uid: undefined});
	const qty_unassigned = AllMotifsUnassignedLinks.length;
	const qty_assigned = AllMotifsConnectedLinks.length - qty_unassigned;
	
	return (
	    <WgBoxie className="Patt_Section_Linking" name="Motif Linking" >

	      <div>
		{qty_assigned} linked parameter(s) assigned
	      </div>

	      <div>
		{qty_unassigned} linked parameter(s) unassigned
	      </div>

	      <div>
		<WgTable
		   selectedRowIndex={this.state.rowSelected}
		   onRowSelectedChange={ i => {this.setState({rowSelected: i});}}
		   rowRenderingData={AllMotifsConnectedLinks}
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
