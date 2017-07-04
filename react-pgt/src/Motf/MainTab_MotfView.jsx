import React from 'react';
var _ = require('lodash');

// generic project widgets

import WgTable from '../Wg/WgTable';
import WgButton from '../Wg/WgButton';
import WgBoxie from '../Wg/WgBoxie';

/*
 import WgTabbedBoxie from '../Wg/WgTabbedBoxie';
 import WgActionLink from '../Wg/WgActionLink';
 */

import Motf_util from './plain-js/Motf_util';
import util from '.././plain-js/util'; // for lookup by uid


import MainTab_MotfEdit from './MainTab_MotfEdit';

class MainTab_MotfView extends React.PureComponent {

    constructor() {
	super();
	this.state = {
	    isEditing: false
	};
	this.WgTableThumbSVG_ElemRefs={};

	//hop straight into "Edit mode".

	const x = this.handleSetEditMode.bind(this, true);
	setTimeout(function(){
	    x();
	}, 400);



    }

    componentDidMount(){
	// set state of parent component...
	this.props.fn.defaultUIStateConfiguration({
	    previewActive: true,
	    colouringFunction: 1,
	    motfResolution: 1,
	    pointsQuantity: 0,
	    pointsProminenceFactor: 2,
	    hideUnderlyingDensity: false,
	    showContours: false,
	    quantityContours: 6,
	    overlayAxesScale: false
	});
	this.redrawAllMotifSVGs();
    }

    
    componentDidUpdate(){
	this.redrawAllMotifSVGs();
    }

    
    handleSetEditMode(edit_mode){
	this.setState({
	    isEditing: edit_mode
	});
	this.props.onToolboxSizeChange(edit_mode ? 3 : 1);
    }


    redrawAllMotifSVGs(){

	// 1. if parameters aren't set (sacraficial render first) do nothing....
	if(this.props.UI.selectedRowIndex === undefined){return null;}
	
	// 2. Draw the Main Large-sized preview
	const Motf_i = this.props.PGTobjArray[this.props.UI.selectedRowIndex];
	
	Motf_util.putMotifSVG(this.svgElement235, Motf_i);	

	const motfArray = this.props.PGTobjArray;
	// 3. Refresh all the small previews.
	_.forEach(this.WgTableThumbSVG_ElemRefs, function(svg_el, uid){// lodash argument order: (value, key)

	    const motf_uid = Number(uid); //the dictionary has keys of type Number
	    const Motif_i = util.lookup(motfArray, "uid", motf_uid);
	    
	    Motf_util.putMotifSVG(svg_el, Motif_i);		    
	});
    }
    
    
    motf_WgTableColumns(){
	return ([
	    {
		heading: "#",
		renderCellContents: (motf, i, rowIsSelected)=>{return (i+1);}
	    },{
		heading: "Title",
		renderCellContents: (motf, i, rowIsSelected)=>{return (
		    <input className="blue-cell"
			   value={motf.name} 
			   onChange={event =>{
			       this.props.fn.handleModifySelPGTobj(
				   {name: {$set: event.target.value}}
			       );
		      }}
		      />);}
	    },{
		heading: "D.",
		renderCellContents: (motf, i, rowIsSelected)=>{return "2D";}
	    },
	    {
		heading: "Prev.",
		renderCellContents: (motf, i, rowIsSelected)=>{
		    return (
			<svg
			   className={"motf-thumb uid-"+motf.uid}
			   width={45}
			   height={45}
			   viewBox={"0 0 400 400"}
			   ref={ (el) => {this.WgTableThumbSVG_ElemRefs[motf.uid] = el;}}
			  />

		    );
		}
	    },
	]);
    }

    
    renderMotfView(){

	if(this.props.UI.selectedRowIndex === undefined){return null;}
	const Motif_i = this.props.PGTobjArray[this.props.UI.selectedRowIndex];

	return (

	    <div className="MainTab_MotfView">
	      
	      {/* Column 1:  Table, buttons beneath, and 1× boxie) */}
	      <div className="column1">
		<div className="tableWithButtonsZone">
		  <WgTable
		     selectedRowIndex={this.props.UI.selectedRowIndex}
		     onRowSelectedChange={(i)=>{this.props.fn.handleRowSelectedChange(i);}}
		    rowRenderingData={this.props.PGTobjArray}
		    columnsRendering={this.motf_WgTableColumns()}
		    rowClassingFn={this.rowClassingFn}
		    />

		    <div className="mainButtons">		  
		      
		      <WgButton
			 name="Delete"
			 buttonStyle={"small"}
			 onClick={this.props.fn.handleDeleteSelPGTobj}
			 enabled={this.props.PGTobjArray.length > 1}
			 />
		      <WgButton
			 name="Add"
			 buttonStyle={"small"}
			 onClick={this.props.fn.hofHandleAddPGTobj(Motf_util.newRandomMotif)}
			 enabled={true}
			 />
		      <WgButton
			 name="Dupl."
			 buttonStyle={"small"}
			 onClick={this.props.fn.handleDuplicateSelPGTobj}
			 />
		      <WgButton
			 name="Edit"
			 buttonStyle={"small"}
			 onClick={this.handleSetEditMode.bind(this, true)}
			 enabled={true}
			 />

		    </div>
		    
		</div>

		

		{/* Column 2:  3× boxie) */}
		<WgBoxie className="stats" name="stats" boxieStyle={"small"}>
		  In Motif: How many shapes? How many colours? 
		</WgBoxie>

	      </div>
	      <div className="column2">
		
		<WgBoxie className="cpots" name="Colour Pots used" boxieStyle={"small"}>
		  Autumn leaves [re-randomise]
		</WgBoxie>

		<WgBoxie className="inputParams" name="Input Parameters" boxieStyle={"small"}>
		  K01 - animate<br/>
		  K02 - animate<br/>
		  K03 - animate 
		</WgBoxie>

		<WgBoxie className="randomParams" name="Random Parameters" boxieStyle={"small"}>
		  R01 - animate<br/>
		  R02 - animate<br/>
		  R03 - animate 
		</WgBoxie>

	      </div>

	      {/* Column 1:  the preview...) */}
	      <div className="column3">
		<div className="preview">
		  <div className="title">{Motif_i.name}</div>
		  <svg
		     width={235}
		     height={235}
		     viewBox={"0 0 400 400"}
		     ref={ (el) => {this.svgElement235 = el;}}
		     />
		</div>
	      </div>
	      
	      
	    </div>

	);
    }

    render() {
	switch (this.state.isEditing) {
	case true:
	    return (
		<MainTab_MotfEdit
		   motf={this.props.PGTobjArray[this.props.UI.selectedRowIndex]}
		   onSaveEdits={this.props.fn.handleReplaceSelPGTobj}
		   onCloseEditingMode={this.handleSetEditMode.bind(this, false)}
		  />
	    );
	default:
	    return this.renderMotfView();
	}
    }
    
}

export default MainTab_MotfView;
