import React from 'react';


import WgTable from '../Wg/WgTable';
import WgButton from '../Wg/WgButton';
import WgBoxie from '../Wg/WgBoxie';

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
		     onClick={function(){console.log("hi");}
		     }
		     enabled={true}
		     />
		  <WgButton
		     name="Delete"
		     buttonStyle={"small"}
		     onClick={ function(){console.log("hi");}}
		     enabled={true}
		     />
		  <WgButton
		     name="Advanced Grid"
		     buttonStyle={"small"}
		     onClick={ function(){console.log("hi");}}
		     enabled={true}
		     />

		</div>
	      </div>


	      {/* 1. Table & buttons beneath */}
	      <div className="controlsZone">
		<div className="part1">Action Links 1</div>
		<div className="lineSetForms">
		  <WgBoxie className="um" name="G1">Grid1 - A2</WgBoxie>
		  <WgBoxie className="um" name="G2">Grid2 - A2</WgBoxie>
		</div>
		<div className="part3">Action Links 2</div>
		<div className="part4">Slider</div>
		<WgBoxie className="previewOptions" name="Preview Options" boxieStyle={"small"}>A5</WgBoxie>
	      </div>
	    </div>
	);
    }
    
}

export default MainTab_Grid;
