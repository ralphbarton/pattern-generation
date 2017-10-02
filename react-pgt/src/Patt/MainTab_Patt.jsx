import React from 'react';
var _ = require('lodash');

import WgTable from '../Wg/WgTable';
import {WgButton} from '../Wg/WgButton';
import WgBoxie from '../Wg/WgBoxie';
import WgActionLink from '../Wg/WgActionLink';

import Patt_util from './plain-js/Patt_util';

import Patt_Section_IncludeMotifs from './Patt_Section_IncludeMotifs';
import Patt_Section_PatternDrive from './Patt_Section_PatternDrive';
import Patt_Section_PlacementIntensity from './Patt_Section_PlacementIntensity';

import Plot_Canvas from '../Plot/Plot_Canvas';
import Grid_d3draw from '../Grid/plain-js/Grid_d3draw';


class MainTab_Patt extends React.PureComponent {

    constructor() {
	super();
	this.state = {
	    /* possible contents of "Right Side Space"...
	     0 - Motif Linking Boxie
	     1 - Large "Plot Preview" thumbnail
	     2 - equivalent "Grid Preview" thumbnail
	     3 - Placement intensity UI (for this pattern)
	     4 - Alternation controls (for this pattern)
	     */
	    rightSideSpace: 0,
	    pDrive_thumb_uid: undefined
	};
	this.patt_WgTableColumns          = this.patt_WgTableColumns.bind(this);
    }

    patt_WgTableColumns(){
	return ([
	    {
		heading: "#",
		renderCellContents: (patt, i, rowIsSelected)=>{return (i+1);}
	    },{
		heading: "Title",
		renderCellContents: (patt, i, rowIsSelected)=>{return (
		    <input className="blue-cell"
			   value={patt.name} 
			   onChange={event =>{
			       this.props.fn.handleModifySelPGTobj(
				   {name: {$set: event.target.value}}
			       );
		      }}
		      />);}
	    }
	]);
    }
    

    componentDidMount(){
	//this function here will initialise "selectedRowIndex" to a default value...
	this.props.fn.defaultUIStateConfiguration({
	    previewActive: false
	});
    }

    //bespoke lifecycle method due to the big SVG thumb...
    componentDidUpdate(){
	if(this.state.rightSideSpace === 2){
	    const hoverGrid = _.find(this.props.PGTobjARRAYS["grid"], {uid: this.state.pDrive_thumb_uid} );
	    Grid_d3draw.updateBgGrid(this.svgBigThumb, hoverGrid, null, {size: 220, noAnimate: true});
	}	
    }
    
    render() {
	
	if(this.props.UI.selectedRowIndex === undefined){return null;}
	const Patt_i = this.props.PGTobjArray[this.props.UI.selectedRowIndex];
	
	return (
	    <div className="MainTab_Patt">

	    
	      {/* 1. Table & buttons beneath */}
	      <div className="tableWithButtonsZone">
	      <WgTable
		 selectedRowIndex={this.props.UI.selectedRowIndex}
		 onRowSelectedChange={this.props.fn.handleRowSelectedChange.bind(null)}//row index passed as single param
		 rowRenderingData={this.props.PGTobjArray}
		 columnsRendering={this.patt_WgTableColumns()}
		/>

		<div className="mainButtons">

		  <WgButton
		     name="Add"
		     buttonStyle={"small"}
		     onClick={this.props.fn.hofHandleAddPGTobj(Patt_util.newEmptyPattern)}
		     />
		  <WgButton
		     name="Delete"
		     buttonStyle={"small"}
		     onClick={this.props.fn.handleDeleteSelPGTobj}
		     />
		</div>
	      </div>


	      
	      {/* 2. "Middle Column" - shows pattern drive and included motifs */}
	      <div className="middleColumn">


		{/* 2.1 Pattern Drive */}
		<Patt_Section_PatternDrive
		   Patt_i={Patt_i}
		   handleModifySelPatt={this.props.fn.handleModifySelPGTobj}
		   GridArray={this.props.PGTobjARRAYS["grid"]}
		   PlotArray={this.props.PGTobjARRAYS["plot"]}
		   stateMainTabPatt={this.state} // set state may be conditional on current state
		   setStateMainTabPatt={this.setState.bind(this)}
		   />




		{/* 2.2 Include Motifs */}		
		<Patt_Section_IncludeMotifs
		   Patt_i={Patt_i}
		   patt_selectedIndex={this.props.UI.selectedRowIndex}
		   handleModifySelPatt={this.props.fn.handleModifySelPGTobj}
		   MotfArray={this.props.PGTobjARRAYS["motf"]}
		   />


		
	      </div>




	      
	      {/* 3. "Right Side Space" - this has variable contents... */}
	      <div className="rightSideSpace">

		{
		    /* possible contents of "Right Side Space"...
		     0 - Motif Linking Boxie
		     1 - Large "Plot Preview" thumbnail
		     2 - equivalent "Grid Preview" thumbnail
		     3 - Placement intensity UI (for this pattern)
		     4 - Alternation controls (for this pattern)
		     */

		    (()=>{
			if(this.state.rightSideSpace === 0){ // Motif Linking Boxie

			    return(
				<WgBoxie className="motifLinking" name="Motif Linking" >
				  efg
				</WgBoxie>
			    );
			}else if(this.state.rightSideSpace === 1){ // Large "Plot Preview" thumbnail

			    const hoverPlot = _.find(this.props.PGTobjARRAYS["plot"], {uid: this.state.pDrive_thumb_uid} );
			    return(
				<div className="bigThumb">
				  <Plot_Canvas
				     Plot={hoverPlot}
				     size={220}
				     />
				</div>
			    );
			}else if(this.state.rightSideSpace === 2){ // Large "Grid Preview" thumbnail

			    return(
				<div className="bigThumb">
				  <svg
				     style={{
					 width:  220,
					 height:  220,
					 background: "white"
				     }}
				     ref={ (el) => {this.svgBigThumb = el;}}
				    />
				</div>
			    );
			}else if(this.state.rightSideSpace === 3){ // Placement intensity UI (for this pattern)

			    return (
				<Patt_Section_PlacementIntensity
				   Patt_i={Patt_i}				   
				   handleModifySelPatt={this.props.fn.handleModifySelPGTobj}
				   />
			    );
			}else{ return null;}
		    })()
		}
		
		<div className="mainButtons">
		  <WgActionLink
		     name={"Clear"}
	             onClick={this.props.setPGTtabUIState.bind(null, {
			 previewActive: {$set: false}
		     })}
		     enabled={this.props.UI.previewActive}
		     />

		  
		  <WgButton
		     name="Render"
	             onClick={this.props.setPGTtabUIState.bind(null, {
			 previewActive: {$set: true}
		     })}
		     enabled={!this.props.UI.previewActive}
		     />
		</div>
	      </div>

	    </div>
	);
    }
    
}

import withTabSupport from './../withTabSupport';
export default withTabSupport(MainTab_Patt);
