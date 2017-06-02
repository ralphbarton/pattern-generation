import React from 'react';

import MainTab_CpotEdit from './MainTab_CpotEdit';

import WgTable from '../Wg/WgTable';
import WgButton from '../Wg/WgButton';
import Cpot_PreviewPatch from './Cpot_PreviewPatch';

class MainTab_CpotView extends React.PureComponent {

    constructor() {
	super();
	this.state = {
	    selectedRowIndex: 0,
	    isEditing: false
	};

	//hop straight into "Edit mode".
	const x = this.handleSetEditMode.bind(this, true);
	setTimeout(function(){
	    x();
	}, 40);

    }

    handleRowSelectedChange(index){
	if (index === this.state.selectedRowIndex){return;}
	this.setState({
	    selectedRowIndex: index
	});
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
			       this.props.onCpotChange("name", {index: i, new_name: event.target.value});
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
	
	return (
	    <div className="MainTab_CpotView">
	      <WgTable
		 selectedRowIndex={this.state.selectedRowIndex}
		 onRowSelectedChange={(i)=>{this.handleRowSelectedChange(i);}}
		rowRenderingData={this.props.cpotArray}
		columnsRendering={this.cpotView_WgTableColumns()}
		/>
		
		<Cpot_PreviewPatch
		   cpot={this.props.cpotArray[this.state.selectedRowIndex]}
		   nX={13}
		   nY={13}
	           chequerSize="normal"
		   />
		
		<div className="mainButtons">
		  <WgButton
		     name="Edit"
		     onClick={this.handleSetEditMode.bind(this, true)}
		     enabled={this.props.cpotArray.length > 0}
		     />
		  <WgButton
		     name="Duplicate"
		     onClick={()=>{
			 const i = this.state.selectedRowIndex;
			 this.props.onCpotChange("duplicate", {index: i});
			 this.handleRowSelectedChange(i+1);
		    }}
		    enabled={this.props.cpotArray.length > 0}
		    />
		    <WgButton
		       name="Delete"
		       onClick={()=>{
			   const i = this.state.selectedRowIndex;
			   const i_new = Math.min(this.props.cpotArray.length -2, i);
			   this.props.onCpotChange("delete", {index: i});
			   this.handleRowSelectedChange(i_new);
		      }}
		      enabled={this.props.cpotArray.length > 1}
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
		   cpot={this.props.cpotArray[this.state.selectedRowIndex]}
		   onSaveEdits={updatedCpot =>{
		       this.props.onCpotChange("replace", {
			   index: this.state.selectedRowIndex,
			   replacement_object: updatedCpot
		       });
		       
		  }}
		  onCloseEditingMode={this.handleSetEditMode.bind(this, false)}
		  />
	    );
	default:
	    return this.renderCpotView();
	}
    }
    
}


export default MainTab_CpotView;
