import React, { Component } from 'react';
import './PaneColourPots.css';

import WgTable from './WgTable';
import CpotCellBlock from './CpotCellBlock';

class PaneColourPots extends Component {

    constructor() {
	super();
	this.state = {
	    selectedRowIndex: 2
	};
    }

    handleRowSelectedChange(index){
	this.setState({
	    selectedRowIndex: index
	});
    }
    
    render() {
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

	    </div>
	);
    }
}


export default PaneColourPots;
