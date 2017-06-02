import React from 'react';

// externally developed libraries
import Slider from 'rc-slider';

// generic project widgets
import WgTable from '../Wg/WgTable';
import WgButton from '../Wg/WgButton';
import WgBoxie from '../Wg/WgBoxie';
import WgMutexActionLink from '../Wg/WgMutexActionLink';

//specific subsections of Grid...
import Grid_Section_LineSetBoxie from './Grid_Section_LineSetBoxie';


class MainTab_Grid extends React.PureComponent {

    constructor() {
	super();
	this.state = {
	    selectedRowIndex: 0
	};
    }
    
    handleRowSelectedChange(index){
	if (index === this.state.selectedRowIndex){return;}
	this.setState({
	    selectedRowIndex: index
	});
    }

    handleSelGridChange($change){
	const rIndex = this.state.selectedRowIndex;
	this.props.onGridChange("update", {index: rIndex, $Updater: $change});
    }
    
    handleSelGridLineSetChange(lineSetId, key, value){
	let $updater = {
	    line_sets: {
		[lineSetId - 1]: {[key]: {$set: value}}
	    }
	};

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
			 const new_grid = {name: "dummy"};
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
		     initalEnabledArray={[true, false]}
		     actions={[
			 {
			     name: "1D (=lines)",
			     cb: ()=>{this.handleSelGridChange({n_dimentions: {$set: 1}});}
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
		     initalEnabledArray={[true, true, true]}
		     actions={[
			 {
			     name: "Isometric (hex)",
			     cb: ()=>{console.log("hi");}
			 },{
			     name: "Square",
			     cb: ()=>{console.log("hi");}
			 },{
			     name: "Diamond",
			     cb: ()=>{console.log("hi");}
			 }
		     ]}
		    />

		  <WgMutexActionLink
		     name="Angles 1 & 2:"
		     className="linkAngles"
		     initalEnabledArray={[true, false]}
		     actions={[
			 {
			     name: "link",
			     cb: ()=>{console.log("hi");}
			 },{
			     name: "unlink",
			     cb: ()=>{console.log("hi");}
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
		  Preview ops <br/>  here...
		</WgBoxie>

	      </div>
	    </div>
	);
    }
    
}

export default MainTab_Grid;
