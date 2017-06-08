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
	    selectedRowIndex: 0,
	    lockAngles: false,
	    previewActive: false, /* i.e. the grid lines */
	    pointsActive: false, /* i.e. the intersection points */
	    showAllGrids: false, //synchronising state
	    showColourGrids: false  //synchronising state
	};
    }

    componentDidMount(){
	// this lifecycle method is to set a UID default uid of grid index 0.
	const Grid_i = this.props.gridArray[0];
	this.props.onBgChange({
	    selGridUid: {$set: Grid_i.uid},
	    active: {$set: false}, //this is synchronising state between components, a bad idea in principle and practice!
	    lockAngles: {$set: false},//this again is synchronising state between components, a bad idea..
	    pointsActive: {$set: false}, //synchronising state
	    showAllGrids: {$set: false}, //synchronising state
	    showColourGrids: {$set: false}  //synchronising state
	});
    }
    
    handleRowSelectedChange(index){
	if (index === this.state.selectedRowIndex){return;}
	this.setState({
	    selectedRowIndex: index
	});

	//update which Bg grid is showing
	const Grid_i = this.props.gridArray[index];
	this.props.onBgChange({selGridUid: {$set: Grid_i.uid}});
    }

    handleGridPreviewChange(options){

	// command to change ON / OFF state of overall grid preview *may* or may not be in function call
	if(options.active !== undefined){
	    this.setState({
		previewActive: options.active
	    }); 
	    this.props.onBgChange({active: {$set: options.active}});
	}

	// point visiblity *may* be requested to change.
	if(options.pointsActive !== undefined){
	    this.setState({
		pointsActive: options.pointsActive
	    });
	    this.props.onBgChange({pointsActive: {$set: options.pointsActive}});
	}	

    }

    //any change to the selected Grid
    handleSelGridChange($change){
	const rIndex = this.state.selectedRowIndex;
	this.props.onGridChange("update", {index: rIndex, $Updater: $change});
    }

    // Iso / Squ / Dia
    handleSelGridToPresetType(toType){
	const rIndex = this.state.selectedRowIndex;
	const Grid_i = this.props.gridArray[rIndex];
	const response = Grid_util.GeneratePresetTypeFromGrid(Grid_i, toType, this.state.lockAngles);
	this.props.onGridChange("update", {index: rIndex, $Updater: {
	    line_sets: response.$LSupd
	}});
	if(response.changedLockAngles !== undefined){
	    this.handleSharedStateChange("lockAngles", response.changedLockAngles);
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
	if((key === "angle") && (this.state.lockAngles)){
	    const Grid_i = this.props.gridArray[this.state.selectedRowIndex];
	    const delta = value - Grid_i.line_sets[ls].angle;
	    const altAngle = Grid_i.line_sets[1-ls].angle - delta;
	    $updater.line_sets[1-ls] = {angle: {$set: altAngle}};
	}

	this.handleSelGridChange($updater);	    
    }

    handleSharedStateChange(sharedKey, newValue){
	this.setState({[sharedKey]: newValue});
	this.props.onBgChange({[sharedKey]: {$set: newValue}}); // state duplication aaargh!!
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
	const Grid_i = this.props.gridArray[this.state.selectedRowIndex];
	return (
	    <div className="MainTab_Grid">

	      {/* 1. Table & buttons beneath */}
	      <div className="tableWithButtonsZone">
	      <WgTable
		 selectedRowIndex={this.state.selectedRowIndex}
		 onRowSelectedChange={(i)=>{this.handleRowSelectedChange(i);}}
		rowRenderingData={this.props.gridArray}
		columnsRendering={this.grid_WgTableColumns()}
		/>

		<div className="mainButtons">

		  <WgButton
		     name="Add"
		     buttonStyle={"small"}
		     onClick={()=>{
			 const i = this.state.selectedRowIndex;
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
			 const i = this.state.selectedRowIndex;
			 const i_new = Math.min(this.props.gridArray.length -2, i);
			 this.props.onGridChange("delete", {index: i});
			 this.handleRowSelectedChange(i_new);
		    }}
		     enabled={this.props.gridArray.length > 0}
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
				 this.handleSharedStateChange("lockAngles", false);// will reset locked angles
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
		     enabled={true}
		     />
		  <Grid_Section_LineSetBoxie
		     lineSetId={2}
		     lineSetData={Grid_i.line_sets[1]}
		     onLineSetChange={this.handleSelGridLineSetChange.bind(this)}
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
			 currentValue: this.state.lockAngles,
			 representedValuesArray: [true, false]
		     }}
		     enabled={Grid_i.n_dimentions > 1}
		     actions={[
			 {
			     name: "link",
			     cb: this.handleSharedStateChange.bind(this, "lockAngles", true)
			 },{
			     name: "unlink",
			     cb: this.handleSharedStateChange.bind(this, "lockAngles", false)
			 }
		     ]}
		     />		    
		    
		</div>

		{/* Block 4 */}
		<div className="section4 sliderSection">
		  <Slider />
		</div>

		{/* Block 5 */}
		<WgBoxie className="section5 previewOptions" name="Preview Options" boxieStyle={"small"}>

		  <div className="section1">
		    <WgMutexActionLink
		       name=""
		       equityTestingForEnabled={{
			   currentValue: this.state.showAllGrids,
			   representedValuesArray: [false, true]
		       }}
		       className="showAll"
		       enabled={this.state.previewActive}
		       actions={[
			   {
			       name: "Show Selected",
			       cb: this.handleSharedStateChange.bind(this, "showAllGrids", false)
			   },{
			       name: "Show All",
			       cb: this.handleSharedStateChange.bind(this, "showAllGrids", true)
			   }
		       ]}
		       />
		  </div>
		  
		  <div className="section2">
		    <WgMutexActionLink
		       name="Gridlines:"
		       equityTestingForEnabled={{
			   currentValue: this.state.showColourGrids,
			   representedValuesArray: [true, false]
		       }}
		       className="gridlinesColour"
		       enabled={this.state.previewActive && this.state.showAllGrids}
		       actions={[
			   {
			       name: "Colour",
			       cb: this.handleSharedStateChange.bind(this, "showColourGrids", true)
			   },{
			       name: "Monochrome",
			       cb: this.handleSharedStateChange.bind(this, "showColourGrids", false)
			   }
		       ]}
		       />
		    <WgMutexActionLink
		       name="Points:"
		       equityTestingForEnabled={{
			   currentValue: this.state.pointsActive,
			   representedValuesArray: [false, true]
		       }}
		       className="showPoints"
		       enabled={this.state.previewActive && (!this.state.showAllGrids)}
		       actions={[
			   {
			       name: "Hide",
			       cb: ()=>{this.handleGridPreviewChange({pointsActive: false});}
			   },{
			       name: "Show",
			       cb: ()=>{this.handleGridPreviewChange({pointsActive: true});}
			   }
		       ]}
		       />
		  </div>

		    
		  <div className="section3">
		    <WgActionLink
		       name={"Hide Preview"}
		       onClick={()=>{this.handleGridPreviewChange({active: false});}}
		      enabled={this.state.previewActive}
		      />
		      
		      <WgButton
			 name="Show"
			 onClick={()=>{this.handleGridPreviewChange({active: true});}}
			enabled={!this.state.previewActive}
			/>
		  </div>		  

		</WgBoxie>
		  
	      </div>
	    </div>
	);
    }
    
}

export default MainTab_Grid;
