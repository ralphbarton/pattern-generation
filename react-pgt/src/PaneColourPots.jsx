import React, { Component } from 'react';
import './PaneColourPots.css';

import WgTable from './WgTable';
import WgButton from './WgButton';
import CpotCellBlock from './CpotCellBlock';

class PaneColourPots extends Component {

    constructor() {
	super();
	this.state = {
	    selectedRowIndex: 2,
	    isEditing: false
	};
    }

    handleRowSelectedChange(index){
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

    renderCpotView(){
	return (
	    <div className="PaneColourPots">
	      <WgTable
		 columns={[
		     {name: "#"},
		     {name: "Description"},
		     {name: "Preview"}
		 ]}
		 cpotArray={this.props.cpotArray}
		 onCpotNameChange={this.props.onCpotNameChange}
		 selectedRowIndex={this.state.selectedRowIndex}
		 onRowSelectedChange={(i)=>{this.handleRowSelectedChange(i);}}
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
		     onClick={null}
		     enabled={true}
		     />
		  <WgButton
		     name="Delete"
		     onClick={null}
		     enabled={true}
		     />

		</div>
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
