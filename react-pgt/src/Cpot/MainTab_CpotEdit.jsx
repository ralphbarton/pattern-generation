import React from 'react';

// externally developed libraries
import update from 'immutability-helper';

import Slider, { Range } from 'rc-slider';

import CpotEdit_util from './plain-js/CpotEdit_util.js';// probs summing etc


// generic project widgets
import {WgButton} from '../Wg/WgButton';
import WgActionLink from '../Wg/WgActionLink';
import {WgFadeTransition} from '../Wg/WgTransition';

// cpot specifc widgets
import Cpot_PreviewPatch from './Cpot_PreviewPatch';

// Components of the cpot edit pane...
import CpotEdit_Section_Solid from './CpotEdit_Section_Solid';
import CpotEdit_Section_Range from './CpotEdit_Section_Range';
import CpotEdit_Section_ItemsTable from './CpotEdit_Section_ItemsTable';
import CpotEdit_Section_BeneathTable from './CpotEdit_Section_BeneathTable';


class MainTab_CpotEdit extends React.PureComponent {

    constructor(props) {
	super(props);

	//set unique keys
	let $updater = {contents: {}};
	this.props.cpot.contents.forEach(function(item, index){
	    $updater.contents[index] = {uid: {$set: index}};
	});
	const cpot_with_uids = update(this.props.cpot, $updater);
	
	this.state = {
	    cpot: cpot_with_uids,//the uids referred to here are not PGTobj uids, but for the purpose of React JSX map
	    uidCounter: this.props.cpot.contents.length - 1,
	    selectedRowIndex: -1, //value of -1 means no row selected and show big preview
	    previewRerandomiseCounter: 0,
	    rangeEditTabIndex: 0 /* 0=Central, 1=Boundaries, 2=More */
	};

	//handlers passed down as props...
	this.handleEditingCpotSelItemChange = this.handleEditingCpotSelItemChange.bind(this);
	
    }

    nextUid(){
	const nexUid = this.state.uidCounter + 1;
	//note: the state is not immediately changed, following call of the setState function
	this.setState({
	    uidCounter: nexUid
	});
	return nexUid;
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
	const rIndex = this.state.selectedRowIndex;
	this.handleEditingCpotChange( {contents: {[rIndex]: changesObject}} );
    }

    // this function will be a member of all components containing a WgTable.
    // it shouldn't appear multiple times...
    handleRowSelectedChange(index){
	if (index === this.state.selectedRowIndex){return;}
	this.setState({
	    selectedRowIndex: index
	});
    }

    renderSolidRangeZone(cpotItem){
	return(
	    <div className="controls Zone">

	      {cpotItem.type === "range" &&
		  <CpotEdit_Section_Range
			 hslaRange={cpotItem.range}
			 handleEditingCpotSelItemChange={this.handleEditingCpotSelItemChange}
			 tabIndex={this.state.rangeEditTabIndex}
			 onTabIndexChange={ i => {
			     this.setState( {rangeEditTabIndex: i} );
			 }}
			 onPropagateChange={null}
			 />
	      }
	      {cpotItem.type === "solid" &&	      
		  <CpotEdit_Section_Solid
			 colourString={cpotItem.solid}
			 onPropagateChange={value =>{this.handleEditingCpotSelItemChange({solid: {$set: value}});}}
			/>
  	      }

		<Cpot_PreviewPatch
		 className="mini"
		 cpot={this.state.cpot}
		 nX={19}
		 nY={8}
		 chequerSize="normal"
		 />

	      <WgActionLink
		 name="expand"
		 onClick={() => {
		     this.setState({
			 selectedRowIndex: -1 // this means render expanded state
		     });
		}}
		/>
	    </div>
	);
    }
    
    render() {
	const expanded = this.state.selectedRowIndex === -1;
	const probs_sum = CpotEdit_util.calcProbsSum(this.state.cpot);

	const iIndex = this.state.selectedRowIndex;
	const cpotItem = iIndex < 0 ? {type: null} : this.state.cpot.contents[iIndex];

	return (
	    <div className="MainTab_CpotEdit">

	      
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

		<CpotEdit_Section_BeneathTable
		   cpot={this.state.cpot}
		   selectedRowIndex={this.state.selectedRowIndex}
		   onEditingCpotChange={this.handleEditingCpotChange.bind(this)}
		   nextUid={this.nextUid.bind(this)}
		   onEditingCpotSelItemChange={this.handleEditingCpotSelItemChange}
		   />		


		
		{/* 3. The Expanded Preview Zone*/}
		{/* 4. Controls to Edit item (solid or range); mini preview zone*/}
		<WgFadeTransition speed={1}>
		  {expanded &&
		<div className="bigPreview Zone">
		  <Cpot_PreviewPatch
		     cpot={this.state.cpot}
		     nX={8}
		     nY={19}
		     chequerSize="normal"
		     rerandomiseCounter={this.state.previewRerandomiseCounter}
		     />
		    <WgActionLink
		       name="re-randomise"
		       onClick={() => {
			   this.setState({
			       previewRerandomiseCounter: this.state.previewRerandomiseCounter+1
			   });
		        }}
		       />
		</div>
		}
		{/* note: the apparent code-duplication here is to ensure Fade Animation on Solid-Range change
		    (it causes direct children of the <WgFadeTransition> Component to switch round...)
		*/}
		{!expanded && cpotItem.type === "solid" && this.renderSolidRangeZone(cpotItem)}
		{!expanded && cpotItem.type === "range" && this.renderSolidRangeZone(cpotItem)}
		</WgFadeTransition>


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
			 //remove unique keys
			 let $updater = {contents: {}};
			 this.state.cpot.contents.forEach(function(item, index){
			     $updater.contents[index] = {uid: {$set: undefined}};
			 });
			 const cpot_no_uids = update(this.state.cpot, $updater);

			 this.props.onSaveEdits(cpot_no_uids);
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
