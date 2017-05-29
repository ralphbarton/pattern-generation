import React from 'react';

// externally developed libraries
import update from 'immutability-helper';

import Slider, { Range } from 'rc-slider';

// pure javascript functions (i.e. no JSX here)
import CpotEdit_util from './plain-js/CpotEdit_util.js';// probs summing etc
import Cpot_util from './plain-js/Cpot_util.js';

// generic project widgets
import WgButton from '../Wg/WgButton';
import WgActionLink from '../Wg/WgActionLink';
import WgDropDown from '../Wg/WgDropDown';

// cpot specifc widgets
import Cpot_PreviewPatch from './Cpot_PreviewPatch';

// Components of the cpot edit pane...
import CpotEdit_Section_Solid from './CpotEdit_Section_Solid';
import CpotEdit_Section_Range from './CpotEdit_Section_Range';
import CpotEdit_Section_ItemsTable from './CpotEdit_Section_ItemsTable';


class MainTab_CpotEdit extends React.PureComponent {

    constructor(props) {
	super(props);
	this.state = {
	    cpot: this.props.cpot,
	    selectedRowIndex: -1, //value of -1 means no row selected and show big preview
	    previewRerandomiseCounter: 0
	};
    }

    handleEditingCpotChange(changesObject){
	const cpot_updated = update(this.state.cpot, changesObject);	
	const limited_rIndex = Math.min(cpot_updated.contents.length -1, this.state.selectedRowIndex);
	this.setState({
	    cpot: cpot_updated,
	    selectedRowIndex: limited_rIndex
	});
    }

    handleEditingCpotSelItemChange(changesObject){
	let $updater = {contents: {}};
	const rIndex = this.state.selectedRowIndex;
	$updater.contents[rIndex] = changesObject;
	this.handleEditingCpotChange( $updater );			   
    }

    // this function will be a member of all components containing a WgTable.
    // it shouldn't appear multiple times...
    handleRowSelectedChange(index){
	if (index === this.state.selectedRowIndex){return;}
	this.setState({
	    selectedRowIndex: index
	});
    }

    
    render() {
	const expanded = this.state.selectedRowIndex === -1;
	const probs_sum = CpotEdit_util.calcProbsSum(this.state.cpot);

	const iIndex = this.state.selectedRowIndex;
	const cpotItem = iIndex < 0 ? {type: null} : this.state.cpot.contents[iIndex];

	return (
	    <div className="PaneEditColourPots">

	      
	      {/* 1. The <input> for Colour Pot Title*/}
	      <input className="plain-cell"
		     value={this.state.cpot.name} 
		     onChange={event => {
			 // Change the CPOT title
			 this.handleEditingCpotChange({
			     name: {$set: event.target.value}
			 });
		}}
		/>


		
		{/* 2. Items Listing -AND- the Zone beneath it */}
	      <CpotEdit_Section_ItemsTable
		 selectedRowIndex={this.state.selectedRowIndex}
		 onRowSelectedChange={(i)=>{this.handleRowSelectedChange(i);}}
		onProbabilityChange={value =>{this.handleEditingCpotSelItemChange({prob: {$set: value}});}}
		rowRenderingData={this.state.cpot.contents}
		/>

		
		<div className="beneathTable">
		  <div className={"probsSumText" + (probs_sum===100?" sumIs100":"")}>
		    <div className="sum">		  
		      Probabilities sum: <span>{probs_sum.toFixed(1)+"%"}</span>
		    </div>
		    <div className={"error" + (probs_sum < 100?" sumLT100":"")}>
			 (<span>{(probs_sum-100).toFixed(1)+"%"}</span>)
	    </div>
		</div>
		
		  <div className="mainButtons">
		    <WgButton
		       name="Add"
		       buttonStyle={"small"}
		       onClick={() => {
			   // Add a CPOT contents item
			   const template_item = 	    {
			       prob: 15,
			       type: "solid",
			       solid: (/*random_col || */"#FF0000")
			   };
			   this.handleEditingCpotChange({
			       contents: {$push: [template_item]}
			   });
		      }}
		       enabled={true}
		       />
		    <WgButton
		       name="Delete"
		       buttonStyle={"small"}
		       onClick={() => {
			   // Delete a CPOT contents item
			   this.handleEditingCpotChange({
			       contents: {$splice: [[this.state.selectedRowIndex, 1]]}
			   });
		      }}
		      enabled={this.state.cpot.contents.length > 0}
		       />

		  </div>

		<div className="mainDropdowns">		
		<WgDropDown
	    name="Summing Tools"
	    menuContentList={[{
		name: "sum to 100% (adjust selected)",
		onClick: ()=>{console.log("add fn here");}
	    },{
		name: "sum to 100% (rescale all)",
		onClick: ()=>{console.log("add fn here");}
	    },{
		name: "sum to 100% (all equal)",
		onClick: ()=>{console.log("add fn here");}
	    }]}
	    enabled={cpotItem}
	    ddStyle="plain"
		/>


		<WgDropDown
	    name={cpotItem.type === "solid" ? "Solid" : (cpotItem.type === "range" ? "Range" : "(item type)")}
	    menuContentList={[{
		name: "Solid",
		onClick: ()=>{
		    const av_col = Cpot_util.range_unpack(cpotItem.range).col;
		    this.handleEditingCpotSelItemChange({
			type: {$set: "solid"},
			solid: {$set: av_col}
		    });}
	    },{
		name: "Range",
		onClick: ()=>{console.log("add fn here");}
	    },{
		name: "Convert to non-static",
		onClick: ()=>{console.log("add fn here");}
	    }]}	    
	    enabled={cpotItem.type !== null}
	    ddStyle="plain"
		/>

		
		</div>
		
		</div>


		
		{/* 3. The Expanded Preview Zone*/}
		<div className={"bigPreview Zone"+(expanded?"":" hide")}>
		  <Cpot_PreviewPatch
		     cpot={this.state.cpot}
		     nX={8}
		     nY={19}
		     chequerSize="normal"
		     rerandomiseCounter={this.state.previewRerandomiseCounter}
		     />

		  <div>
		    <WgActionLink
		       name="re-randomise"
		       onClick={() => {
			   this.setState({
			       previewRerandomiseCounter: this.state.previewRerandomiseCounter+1
			   });
		      }}
		       enabled={expanded}
		       />
		  </div>		  
		</div>



		{/* 4. Controls to Edit item (solid or range); mini preview zone*/}
		<div className={"controls Zone"+(expanded?" hide":"")}>
		{
		    //Determine which tab body to show...
		    (() => {
			switch (cpotItem.type) {
			case "solid":
			    return (
				<CpotEdit_Section_Solid
				   colourString={cpotItem.solid}
				   onPropagateChange={value =>{this.handleEditingCpotSelItemChange({solid: {$set: value}});}}
				   />
			    );
			case "range":
			    return (
				<CpotEdit_Section_Range
				   hslaRange={cpotItem.range}
				   onPropagateChange={null}
				   />
			    );
			default:
			    return (
				<div className="editZone null" />
			    );
			}
		    })()
		}
		
		<Cpot_PreviewPatch
		     className="mini"
		     cpot={this.state.cpot}
		     nX={19}
		     nY={8}
		     chequerSize="normal"
		/>
		<div>
		    <WgActionLink
		       name="expand"
		       onClick={() => {
			   this.setState({
			       selectedRowIndex: -1 // this means render expanded state
			   });
		      }}
		       enabled={!expanded}
		       />
		  </div>		  

		</div>		


		{/* 5. Slider... */}
		<div className="sliderSection">
		{
		    //Determine which slider type to show...
		    (() => {
			switch (cpotItem.type) {
			case "solid":
			    return (
				<div>
				  <Slider />
				</div>
			    );
			case "range":
			    return (
				<div>
				  <Range />
				</div>
			    );
			default: return null;
			    
			}
		    })()
		}
	    </div>
	    	
		
		{/* 6. Buttons for Cancel / Done */}
		<div className="mainButtons">
		  <WgButton
		     name="Cancel"
		     onClick={this.props.onCloseEditingMode.bind()}
		     enabled={true}
		     />
		  <WgButton
		     name="Done"
		     onClick={()=>{
			 this.props.onSaveEdits(this.state.cpot);
			 this.props.onCloseEditingMode();
		    }}
		    enabled={probs_sum === 100}
		    />
		</div>		



	    </div>
	);
    }

}


export default MainTab_CpotEdit;
