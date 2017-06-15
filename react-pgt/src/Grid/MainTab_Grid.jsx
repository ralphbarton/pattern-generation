import React from 'react';

// externally developed libraries
import Slider from 'rc-slider';

// generic project widgets
import WgTable from '../Wg/WgTable';
import WgButton from '../Wg/WgButton';
import WgBoxie from '../Wg/WgBoxie';
import WgMutexActionLink from '../Wg/WgMutexActionLink';
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

     UI sub-properties are:

     'selectedRowIndex'
     'selectedGridUid'
     'lockAngles'
     'previewActive'
     'pointsActive'
     'showAllGrids'
     'showColourGrids'


     State changes are passed back up via:

     this.props.setGridUIState($chg)

     */

    // An (immutable) change in the selected Grid object
    handleSelGridChange($change){
	const rIndex = this.props.UI.selectedRowIndex;
	this.props.onGridChange("update", {index: rIndex, $Updater: $change});
    }

    handleSliderLinkChange(newSliderLink){
	this.setState({
	    sliderLink: newSliderLink
	});
    }

    // pass UI state change up to a parent component. It is not stored here...
    handleUIStateChange(key, value){
	this.props.setGridUIState({
	    [key]: {$set: value}
	});
    }

    componentDidMount(){

	//no action required if a value already set
	if(this.props.UI.selectedRowIndex !== undefined){return;}

	/* This will set some suitable Default values for
	   props (previously undefined) on component mount 
	   the very first rendering prior to this function call is 'sacrificial'
	 */

	const initialSelectedRowIndex = 0;
	const Grid_i = this.props.gridArray[initialSelectedRowIndex];
	
	this.props.setGridUIState({
	    selectedRowIndex: {$set: initialSelectedRowIndex},
	    selectedGridUid: {$set: Grid_i.uid},
	    lockAngles: {$set: false},
	    previewActive: {$set: false}, // i.e. the grid lines
	    pointsActive: {$set: false}, // i.e. the intersection points
	    showAllGrids: {$set: false},
	    showColourGrids: {$set: false}
	});
    }

    
    handleRowSelectedChange(index){
	if (index === this.props.UI.selectedRowIndex){return;}

	const Grid_i = this.props.gridArray[index];

	//the object is updated to contain both the index and the UID of the grid...
	this.props.setGridUIState({
	    selectedRowIndex: {$set: index},
	    selectedGridUid: {$set: Grid_i.uid}
	});
    }

    
    // Iso / Squ / Dia
    handleSelGridToPresetType(toType){
	const rIndex = this.props.UI.selectedRowIndex;
	const Grid_i = this.props.gridArray[rIndex];
	const response = Grid_util.GeneratePresetTypeFromGrid(Grid_i, toType, this.props.UI.lockAngles);
	this.props.onGridChange("update", {index: rIndex, $Updater: {
	    line_sets: response.$LSupd
	}});
	if(response.changedLockAngles !== undefined){
	    this.handleUIStateChange("lockAngles", response.changedLockAngles);
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
	    const Grid_i = this.props.gridArray[this.props.UI.selectedRowIndex];
	    const delta = value - Grid_i.line_sets[ls].angle;
	    const altAngle = Grid_i.line_sets[1-ls].angle - delta;
	    $updater.line_sets[1-ls] = {angle: {$set: altAngle}};
	}

	this.handleSelGridChange($updater);	    
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
			       this.props.onGridChange("name", {index: i, new_name: event.target.value});
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


	const Grid_i = this.props.gridArray[this.props.UI.selectedRowIndex];
	return (
	    <div className="MainTab_Grid">

	      {/* 1. Table & buttons beneath */}
	      <div className="tableWithButtonsZone">
	      <WgTable
		 selectedRowIndex={this.props.UI.selectedRowIndex}
		 onRowSelectedChange={(i)=>{this.handleRowSelectedChange(i);}}
		rowRenderingData={this.props.gridArray}
		columnsRendering={this.grid_WgTableColumns()}
		/>

		<div className="mainButtons">

		  <WgButton
		     name="Add"
		     buttonStyle={"small"}
		     onClick={()=>{
			 const i = this.props.UI.selectedRowIndex;
			 const new_grid = Grid_util.newRandomRectGrid(2); //uid prop will be added later
			 this.props.onGridChange("add", {index: i, new_object: new_grid});
			 this.handleRowSelectedChange(i+1);
		    }}
		     enabled={true}
		     />
		  <WgButton
		     name="Delete"
		     buttonStyle={"small"}
		     onClick={()=>{
			 const i = this.props.UI.selectedRowIndex;
			 const i_new = Math.min(this.props.gridArray.length -2, i);
			 this.props.onGridChange("delete", {index: i});
			 this.handleRowSelectedChange(i_new);
		    }}
		    // we cannot support zero grids in the list. Causes problems
		    enabled={this.props.gridArray.length > 1}
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
				 this.handleSelGridChange({n_dimentions: {$set: 1}});
				 this.handleUIStateChange("lockAngles", false);// will reset locked angles
			     }
			 },{
			     name: "2D (=grid)",
			     cb: ()=>{this.handleSelGridChange({n_dimentions: {$set: 2}});}
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
			     cb: this.handleUIStateChange.bind(this, "lockAngles", true)
			 },{
			     name: "unlink",
			     cb: this.handleUIStateChange.bind(this, "lockAngles", false)
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
			 this.handleSelGridChange({
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
			       cb: this.handleUIStateChange.bind(this, "showAllGrids", false)
			   },{
			       name: "Show All",
			       cb: this.handleUIStateChange.bind(this, "showAllGrids", true)
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
			       cb: this.handleUIStateChange.bind(this, "showColourGrids", true)
			   },{
			       name: "Monochrome",
			       cb: this.handleUIStateChange.bind(this, "showColourGrids", false)
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
			       cb: this.handleUIStateChange.bind(this, "pointsActive", false)
			   },{
			       name: "Show",
			       cb: this.handleUIStateChange.bind(this, "pointsActive", true)
			   }
		       ]}
		       />
		  </div>

		    
		  <div className="section3">
		    <WgActionLink
		       name={"Hide Preview"}
		       onClick={this.handleUIStateChange.bind(this, "previewActive", false)}
		       enabled={this.props.UI.previewActive}
		      />
		      
		      <WgButton
			 name="Show"
			 onClick={this.handleUIStateChange.bind(this, "previewActive", true)}
			 enabled={!this.props.UI.previewActive}
			/>
		  </div>		  

		</WgBoxie>
		  
	      </div>
	    </div>
	);
    }
    
}

export default MainTab_Grid;
