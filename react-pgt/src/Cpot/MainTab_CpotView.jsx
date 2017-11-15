import React from 'react';

import MainTab_CpotEdit from './MainTab_CpotEdit';

import WgTable from '../Wg/WgTable';
import {WgButton} from '../Wg/WgButton';
import Cpot_PreviewPatch from './Cpot_PreviewPatch';

class MainTab_CpotView extends React.PureComponent {

    constructor() {
	super();
	this.state = {
	    isEditing: false
	};

	//hop straight into "Edit mode".
//	setTimeout(this.handleSetEditMode.bind(this, true), 40);

    }

    componentDidMount(){
	// set state of parent component...
	//in the case of cpot, this is just to set selected row...
	this.props.fn.defaultUIStateConfiguration({});
    }

    
    handleSetEditMode(edit_mode){
	this.setState({
	    isEditing: edit_mode
	});
	this.props.onToolboxSizeChange(edit_mode ? 2 : 1);
    }

    cpotView_WgTableColumns(){
	return ([
	    {
		heading: "#",
		renderCellContents: (cpot, i, rowIsSelected)=>{return (i+1);}
	    },{
		heading: "Description",
		renderCellContents: (cpot, i, rowIsSelected)=>{return (
		    <input className="blue-cell"
			   value={cpot.name} 
			   onChange={event =>{
			       this.props.fn.handleModifySelPGTobj(
				   {name: {$set: event.target.value}}
			       );
		      }}
		      />);}
	    },{
		heading: "Preview",
		renderCellContents: (cpot, i, rowIsSelected)=>{return (
		    <Cpot_PreviewPatch
		       cpot={cpot}
		       nX={8}
		       nY={2}
		       />);}
	    }
	]);
    }

    renderCpotView(){
	
	if(this.props.UI.selectedRowIndex === undefined){return null;}	
	return (
	    <div className="MainTab_CpotView">
	      <WgTable
		 selectedRowIndex={this.props.UI.selectedRowIndex}
		 onRowSelectedChange={(i)=>{this.props.fn.handleRowSelectedChange(i);}}
		rowRenderingData={this.props.PGTobjArray}
		columnsRendering={this.cpotView_WgTableColumns()}
		/>
		
		<Cpot_PreviewPatch
		   cpot={this.props.PGTobjArray[this.props.UI.selectedRowIndex]}
		   nX={13}
		   nY={13}
	           chequerSize="normal"
		   />
		
		<div className="mainButtons">
		  <WgButton
		     name="Edit"
		     onClick={this.handleSetEditMode.bind(this, true)}
		     enabled={this.props.PGTobjArray.length > 0}
		    />
		    <WgButton
		       name="Duplicate"
		       onClick={this.props.fn.handleDuplicateSelPGTobj}
		       enabled={this.props.PGTobjArray.length > 0}
		      />
		      <WgButton
			 name="Delete"
			 onClick={this.props.fn.handleDeleteSelPGTobj}
			 enabled={this.props.PGTobjArray.length > 1}
			/>
		</div>
		
	    </div>
	);
    }

    
    render() {
	switch (this.state.isEditing) {
	case true:
	    return (
		<MainTab_CpotEdit
		   cpot={this.props.PGTobjArray[this.props.UI.selectedRowIndex]}
		   onSaveEdits={this.props.fn.handleReplaceSelPGTobj}
		   onCloseEditingMode={this.handleSetEditMode.bind(this, false)}
		  />
	    );
	default:
	    return this.renderCpotView();
	}
    }
    
}

import withTabSupport from './../HOC/withTabSupport';
export default withTabSupport(MainTab_CpotView);
