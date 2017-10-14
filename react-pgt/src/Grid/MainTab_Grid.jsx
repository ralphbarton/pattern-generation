import React from 'react';

// externally developed libraries
import Slider from 'rc-slider';

// generic project widgets
import WgTable from '../Wg/WgTable';
import {WgButton} from '../Wg/WgButton';
import WgBoxie from '../Wg/WgBoxie';
import {WgMutexActionLink} from '../Wg/WgMutexActionLink';
import WgActionLink from '../Wg/WgActionLink';

//specific subsections of Grid...
import Grid_Section_LineSetBoxie from './Grid_Section_LineSetBoxie';
import Grid_util from './plain-js/Grid_util';

class MainTab_Grid extends React.PureComponent {
    
    constructor() {
	super();
	this.state = {
	    sliderLink: null
	};
    }

    /*
     (now, with the exception of this.state.sliderLink), the entire
     Grid tab is one big Controlled Component

     UI State is passed down via:
     this.props.UI

     State changes are passed back up via:

     this.props.setGridUIState($chg)

     */

    componentDidMount(){
	// set state of parent component...
	this.props.fn.defaultUIStateConfiguration({
	    lockAngles: false,
	    previewActive: false, // i.e. the grid lines
	    pointsActive: false, // i.e. the intersection points
	    showAllGrids: false,
	    showColourGrids: false
	});
    }

    
    handleSliderLinkChange(newSliderLink){
	this.setState({
	    sliderLink: newSliderLink
	});
    }
    
    // Iso / Squ / Dia
    handleSelGridToPresetType(toType){
	const rIndex = this.props.UI.selectedRowIndex;
	const Grid_i = this.props.PGTobjArray[rIndex];
	const response = Grid_util.GeneratePresetTypeFromGrid(Grid_i, toType, this.props.UI.lockAngles);

	this.props.fn.handleModifySelPGTobj({
	    line_sets: response.$LSupd
	});

	if(response.changedLockAngles !== undefined){
	    this.props.fn.handleUIStateChange("lockAngles", response.changedLockAngles);
	}
    }

    
    // a change (up to 2x K-V pairs) in a lineset in the selected grid
    handleSelGridLineSetChange(lineSetId, key, value, key2, value2){
	const ls = lineSetId - 1;
	
	let $updater = {
	    line_sets: {
		[ls]: {[key]: {$set: value}}
	    }
	};

	//change multiple kv-pairs (assume value2 supplied also).
	if(key2){
	    $updater.line_sets[ls][key2] = {$set: value2};
	}

	//calc the change and apply to other angle...
	if((key === "angle") && (this.props.UI.lockAngles)){
	    const Grid_i = this.props.PGTobjArray[this.props.UI.selectedRowIndex];
	    const delta = value - Grid_i.line_sets[ls].angle;
	    const altAngle = Grid_i.line_sets[1-ls].angle - delta;
	    $updater.line_sets[1-ls] = {angle: {$set: altAngle}};
	}

	this.props.fn.handleModifySelPGTobj($updater);	    
    }

    
    grid_WgTableColumns(){
	return ([
	    {
		heading: "#",
		renderCellContents: (grid, i, rowIsSelected)=>{return (i+1);}
	    },{
		heading: "Description",
		renderCellContents: (grid, i, rowIsSelected)=>{return (
		    <input className="blue-cell"
			   value={grid.name}
			   onChange={event =>{
			       this.props.fn.handleModifySelPGTobj(
				   {name: {$set: event.target.value}}
			       );
		      }}
		      />);}
	    }
	]);
    }

    
    render(){
	/*This is a bit hacky, but very first render is designed to do nothing, because:
	 (1) mounting the component invokes a function which sets state in the parent via a callback
	 (2) Parent state change triggers re-render in this component
	 (3) Now with the correct props (including the once tested below) full render can take place

	 The rationale is that it's quite important to me that the controlled component sets its own state
	 see above 'setGridUIState()' within 'componentDidMount()'

	*/
	if(this.props.UI.selectedRowIndex === undefined){return null;}

	const Grid_i = this.props.PGTobjArray[this.props.UI.selectedRowIndex];
	const handleUIStateChange = this.props.fn.handleUIStateChange;
	
	return (
	    <div className="MainTab_Grid">

	      {/* 1. Table & buttons beneath */}
	      <div className="tableWithButtonsZone">
	      <WgTable
		 selectedRowIndex={this.props.UI.selectedRowIndex}
		 onRowSelectedChange={this.props.fn.handleRowSelectedChange.bind(null)}//row index passed as single param
		 rowRenderingData={this.props.PGTobjArray}
		 columnsRendering={this.grid_WgTableColumns()}
		/>

		<div className="mainButtons">

		  <WgButton
		     name="Add"
		     buttonStyle={"small"}
		     onClick={this.props.fn.hofHandleAddPGTobj(Grid_util.newRandomRectGrid.bind(2))}
		     enabled={true}
		     />
		  <WgButton
		     name="Delete"
		     buttonStyle={"small"}
		     onClick={this.props.fn.handleDeleteSelPGTobj}
		     // we cannot support zero grids in the list. Causes problems
		     enabled={this.props.PGTobjArray.length > 1}
		     />
		  <WgButton
		     name="Advanced Grid"
		     buttonStyle={"small"}
		     onClick={ function(){console.log("hi");}}
		     enabled={true}
		     />

		</div>
	      </div>






	      

	      {/* 2. Controls Zone */}
	      <div className="controlsZone">

		
		{/* Block 1 */}
		<div className="section1">
		  <WgMutexActionLink
		     name="Change grid type:"
		     equityTestingForEnabled={{
			 currentValue: Grid_i.n_dimentions,
			 representedValuesArray: [1,2]
		     }}
		     actions={[
			 {
			     name: "1D (=lines)",
			     cb: ()=>{
				 this.props.fn.handleModifySelPGTobj({n_dimentions: {$set: 1}});
				 handleUIStateChange("lockAngles", false);// will reset locked angles
			     }
			 },{
			     name: "2D (=grid)",
			     cb: ()=>{this.props.fn.handleModifySelPGTobj({n_dimentions: {$set: 2}});}
			 }
		     ]}
		     />

		</div>

		
		{/* Block 2 */}
		<div className="section2 lineSetForms">
		  <Grid_Section_LineSetBoxie
		     lineSetId={1}
		     lineSetData={Grid_i.line_sets[0]}
		     onLineSetChange={this.handleSelGridLineSetChange.bind(this)}
		     sliderLink={this.state.sliderLink}
		     onSliderLinkChange={this.handleSliderLinkChange.bind(this)}
		     enabled={true}
		     />
		  <Grid_Section_LineSetBoxie
		     lineSetId={2}
		     lineSetData={Grid_i.line_sets[1]}
		     onLineSetChange={this.handleSelGridLineSetChange.bind(this)}
		     sliderLink={this.state.sliderLink}
		     onSliderLinkChange={this.handleSliderLinkChange.bind(this)}
		     enabled={Grid_i.n_dimentions > 1}
		     />
		</div>

		
		{/* Block 3 */}
		<div className="section3">

		  <WgMutexActionLink
		     name="Convert to:"
		     className="convertTo"
		     applyFunctionForEnabledArray_data={Grid_i.line_sets}
		     applyFunctionForEnabledArray_func={(LS)=>{
			 const equal_spacings = LS[0].spacing === LS[1].spacing;
			 const en_isometric = (LS[1].angle + LS[0].angle !== 60) || (!equal_spacings);
			 const en_diamond = (LS[0].angle !== LS[1].angle) || (!equal_spacings);;
			 const en_square = (LS[1].angle + LS[0].angle !== 90) || (!equal_spacings);
			 return [en_isometric, en_square, en_diamond];
		    }}
		    enabled={Grid_i.n_dimentions > 1}
		    actions={[
			 {
			     name: "Isometric (hex)",
			     cb: this.handleSelGridToPresetType.bind(this, "iso")
			 },{
			     name: "Square",
			     cb: this.handleSelGridToPresetType.bind(this, "squ")
			 },{
			     name: "Diamond",
			     cb: this.handleSelGridToPresetType.bind(this, "dia")
			 }
		     ]}
		    />
		    
		  <WgMutexActionLink
		     name="Angles 1 & 2:"
		     className="linkAngles"
		     equityTestingForEnabled={{
			 currentValue: this.props.UI.lockAngles,
			 representedValuesArray: [true, false]
		     }}
		     enabled={Grid_i.n_dimentions > 1}
		     actions={[
			 {
			     name: "link",
			     cb: handleUIStateChange.bind(this, "lockAngles", true)
			 },{
			     name: "unlink",
			     cb: handleUIStateChange.bind(this, "lockAngles", false)
			 }
		     ]}
		     />		    
		    
		</div>

		{/* Block 4 */}
		<div className="section4 sliderSection">
		  <Slider
//		     disabled={this.state.sliderLink === null}
		     //assume an angle
		     step={0.5}
		     min={0}
		     max={90}
//		     value={this.state.sliderLink === null ? 6 : Grid_i.line_sets[this.state.sliderLink.lsId].angle}
//		     onChange    -- too expensive
		     onAfterChange={(value)=>{
			 const linkLsId = this.state.sliderLink.lsId - 1;
			 this.props.fn.handleModifySelPGTobj({
			     line_sets: {[linkLsId]: {angle: {$set: value}}}
			 });

		    }}
		     />
		</div>

		{/* Block 5 */}
		<WgBoxie className="section5 previewOptions" name="Preview Options" boxieStyle={"small"}>

		  <div className="section1">
		    <WgMutexActionLink
		       name=""
		       equityTestingForEnabled={{
			   currentValue: this.props.UI.showAllGrids,
			   representedValuesArray: [false, true]
		       }}
		       className="showAll"
		       enabled={this.props.UI.previewActive}
		       actions={[
			   {
			       name: "Show Selected",
			       cb: ()=>{
				   // as a side effect, turn off colour when switching to just one grid...
				   handleUIStateChange("showAllGrids", false);
				   handleUIStateChange("showColourGrids", false);
			       }
			   },{
			       name: "Show All",
			       cb: ()=>{
				   handleUIStateChange("showAllGrids", true);

				   // as a side effect, turn off points when switching to multi-grids...
				   handleUIStateChange("pointsActive", false);
			       }
			   }
		       ]}
		       />
		  </div>
		  
		  <div className="section2">
		    <WgMutexActionLink
		       name="Gridlines:"
		       equityTestingForEnabled={{
			   currentValue: this.props.UI.showColourGrids,
			   representedValuesArray: [true, false]
		       }}
		       className="gridlinesColour"
		       enabled={this.props.UI.previewActive && this.props.UI.showAllGrids}
		       actions={[
			   {
			       name: "Colour",
			       cb: handleUIStateChange.bind(this, "showColourGrids", true)
			   },{
			       name: "Monochrome",
			       cb: handleUIStateChange.bind(this, "showColourGrids", false)
			   }
		       ]}
		       />
		    <WgMutexActionLink
		       name="Points:"
		       equityTestingForEnabled={{
			   currentValue: this.props.UI.pointsActive,
			   representedValuesArray: [false, true]
		       }}
		       className="showPoints"
		       enabled={this.props.UI.previewActive && (!this.props.UI.showAllGrids)}
		       actions={[
			   {
			       name: "Hide",
			       cb: handleUIStateChange.bind(this, "pointsActive", false)
			   },{
			       name: "Show",
			       /* since the link is only enabled when single grid
				active anyway, no need additional side effect */
			       cb: handleUIStateChange.bind(this, "pointsActive", true) 
			   }
		       ]}
		       />
		  </div>

		    
		  <div className="section3">
		    <WgActionLink
		       name={"Hide Preview"}
		       onClick={handleUIStateChange.bind(this, "previewActive", false)}
		       enabled={this.props.UI.previewActive}
		      />
		      
		      <WgButton
			 name="Show"
			 onClick={handleUIStateChange.bind(this, "previewActive", true)}
			 enabled={!this.props.UI.previewActive}
			/>
		  </div>		  

		</WgBoxie>
		  
	      </div>
	    </div>
	);
    }
    
}

import withTabSupport from './../HOC/withTabSupport';
export default withTabSupport(MainTab_Grid);
