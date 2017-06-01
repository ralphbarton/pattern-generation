import React from 'react';

import Slider from 'rc-slider';

import WgTable from '../Wg/WgTable';
import WgButton from '../Wg/WgButton';
import WgBoxie from '../Wg/WgBoxie';
import WgMutexActionLink from '../Wg/WgMutexActionLink';
import WgSmartInput from '../Wg/WgSmartInput';


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
			     cb: ()=>{console.log("hi");}
			 },{
			     name: "2D (=grid)",
			     cb: ()=>{console.log("hi");}
			 }
		     ]}
		     />

		</div>

		{/* Block 2 */}
		<div className="section2 lineSetForms">
		  <WgBoxie className="um" name="G1">

		    <div className="ang">
		      Angle:
		      <WgSmartInput
			 className="plain-cell"
			 value={34}
			 dataUnit="degrees"
			 onChange={null}
			 onChangeComplete={null}
			/>
		    </div>

		    
		    <div className="inte">
		      Interval:
		      <WgSmartInput
			 className="plain-cell"
			 value={34}
			 dataUnit="pixels"
			 onChange={null}
			 onChangeComplete={null}
			/>
		    </div>

		    
		    <div className="shift">
		      Shift:
		      <WgSmartInput
			 className="plain-cell"
			 value={34}
			 dataUnit="pixels"
			 onChange={null}
			 onChangeComplete={null}
			/>
		    </div>

		    
		    <div className="svg">
		      <svg id="svg-angle-1" width="70" height="70">

			<defs>
			  <marker id="arrow" markerWidth="10" markerHeight="10" refX="0" refY="3"
				  orient="auto" markerUnits="strokeWidth" viewBox="0 0 10 20">
			    <path d="M0,0 L0,6 L6,3 z" fill="#1c737c" />
			  </marker>
			</defs>

			<line x1="8" y1="0" x2="8" y2="70" stroke="rgba(0,0,0,0.3)" strokeWidth="2"/> {/*vertical*/}
			<line x1="0" y1="62" x2="70" y2="62" stroke="rgba(0,0,0,0.3)" strokeWidth="2"/> {/*horizontal*/}

			<line x1="-8" y1="0" x2="53" y2="0" stroke="#1c737c" strokeWidth="3" markerEnd="url(#arrow)"
			      transform="translate(8 62)" id="my_arrow"/>
		      </svg>
		    </div>
		    


		  </WgBoxie>

		  <WgBoxie className="um" name="G2">Grid2 - A2</WgBoxie>
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
		  Preview ops here...
		</WgBoxie>

	      </div>
	    </div>
	);
    }
    
}

export default MainTab_Grid;
