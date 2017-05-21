import React, { Component } from 'react';
import './PaneColourPots.css';

import WgTable from './WgTable';
import WgButton from './WgButton';
import WgGradientCell from './WgGradientCell';
import CpotCellBlock from './CpotCellBlock';

class PaneColourPots extends Component {

    constructor() {
	super();
	this.state = {
	    selectedRowIndex: 2,
	    isEditing: false
	};
	console.log("PaneColourPots constructor called");
    }

    handleRowSelectedChange(index){
	if (index === this.state.selectedRowIndex){return;}
	this.setState({
	    selectedRowIndex: index
	});
    }

    handleEditButtonClick(){
	this.setState({
	    isEditing: true
	});
	this.props.onToolboxSizeChange(2);
    }

    cpotView_WgTableColumns(){
	return ([
	    {
		heading: "#",
		renderCellContents: (cpot, i)=>{return (i+1);}
	    },{
		heading: "Description",
		renderCellContents: (cpot, i)=>{return (
		    <input className="blue-cell"
			   value={cpot.description} 
			   onChange={event =>{
			       this.props.onCpotChange("name", {index: i, new_description: event.target.value});
		      }}
		      />);}
	    },{
		heading: "Preview",
		renderCellContents: (cpot, i)=>{return (
		    <CpotCellBlock
		       cpot={cpot}
		       nX={8}
		       nY={2}
		       />);}
	    }
	]);
    }

    renderCpotView(){
	return (
	    <div className="PaneColourPots">
	      <WgTable
		 selectedRowIndex={this.state.selectedRowIndex}
		 onRowSelectedChange={(i)=>{this.handleRowSelectedChange(i);}}
		rowRenderingData={this.props.cpotArray}
		columns={this.cpotView_WgTableColumns()}
		/>
		<CpotCellBlock
		   cpot={this.props.cpotArray[this.state.selectedRowIndex]}
		   nX={13}
		   nY={13}
	           chequerSize="normal"
		   />
		
		<div className="mainButtons">
		  <WgButton
		     name="Edit"
		     onClick={this.handleEditButtonClick.bind(this)}
		     enabled={true}
		     />
		  <WgButton
		     name="Duplicate"
		     onClick={()=>{
			 const i = this.state.selectedRowIndex;
			 this.props.onCpotChange("duplicate", {index: i});
			 this.handleRowSelectedChange(i+1);
		    }}
		    enabled={true}
		    />
		    <WgButton
		       name="Delete"
		       onClick={()=>{
			   const i = this.state.selectedRowIndex;
			   const i_new = Math.min(this.props.cpotArray.length -2, i);
			   this.props.onCpotChange("delete", {index: i});
			   this.handleRowSelectedChange(i_new);
		      }}
		      enabled={true}
		      />
		</div>

		{/*Test code for Gradient Cell*/} 
		<WgGradientCell
		   dim={25}
		   elemRange={this.props.cpotArray[1].contents[0].range}
		   gradientConfig={{H:0, S:"y", L:"x"}}
		   />
		<WgGradientCell
		   dim={25}
		   elemRange={this.props.cpotArray[1].contents[0].range}
		   gradientConfig={{H:1, S:"y", L:"x"}}
		   />
		<WgGradientCell
		   dim={25}
		   elemRange={this.props.cpotArray[1].contents[0].range}
		   gradientConfig={{H:"x", S:0, L:"y"}}
		   />
		<WgGradientCell
		   dim={25}
		   elemRange={this.props.cpotArray[1].contents[0].range}
		   gradientConfig={{H:"x", S:1, L:"y"}}
		   />

	    </div>
	);
    }

    
    renderCpotEdit(){
	return (
	    <div className="PaneEditColourPots">
	      Edit Pane...
	    </div>
	);
    }
    
    render() {
	switch (this.state.isEditing) {
	case true:
	    return this.renderCpotEdit();
	default:
	    return this.renderCpotView();
	}
    }
    
}


export default PaneColourPots;
