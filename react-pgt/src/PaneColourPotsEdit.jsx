import React, { Component } from 'react';

// externally developed libraries
import update from 'immutability-helper';

// pure javascript functions (i.e. no JSX here)
import cpot_util from './CpotUtil'; //draw from colourpot; unpack...
import cpotEditPane_util from './PaneColourPotsEdit_util.js';// probs summing etc

// generic project widgets
import WgTable from './WgTable';
import WgButton from './WgButton';
import WgActionLink from './WgActionLink';
import WgSmartInput from './WgSmartInput';

// cpot specifc widgets
import CpotCellBlock from './CpotCellBlock';
import {WgAlphaSwatch, WgGradientCell, WgColourPill} from './CpotEdit_ItemSubComponents.jsx';

// Components of the cpot edit pane...
import CpotEditSolid from './CpotEditSolid';
import CpotEditRange from './CpotEditRange';


// Styling for THIS content....
import './PaneColourPotsEdit.css';




class PaneColourPotsEdit extends Component {

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

    // this function will be a member of all components containing a WgTable.
    // it shouldn't appear multiple times...
    handleRowSelectedChange(index){
	if (index === this.state.selectedRowIndex){return;}
	this.setState({
	    selectedRowIndex: index
	});
    }

    
    cpotEdit_WgTableColumns(){
	return ([
	    {
		heading: "#",
		renderCellContents: (item, rIndex, rowIsSelected)=>{return (rIndex+1);}
	    },{
		heading: "Prob",
		renderCellContents: (item, rIndex, rowIsSelected)=>{return (
		    <WgSmartInput
		       className="blue-cell"
		       value={item.prob}
		       editEnabled={rowIsSelected}
		       dataUnit="percent"
		       onChange={value =>{
			   // Change a CPOT item probability
			   let $updater = {contents: {}};
			   $updater.contents[rIndex] = {prob: {$set: value}};
			   this.handleEditingCpotChange( $updater );			   
		      }}
		      />
		);}
	    },{
		heading: "Item",
		renderCellContents: (item, rIndex, rowIsSelected)=>{
		    
		    switch (item.type) {
			
		    case "range":
			var xpRange = cpot_util.range_unpack( item.range );
			return (
			    <div className="range">
			      <div className="itemType">range</div>

			      <div className="itemDemo">
				<WgColourPill expandedRange={xpRange} />
				
				<div className="threeCells n1">
				  <WgGradientCell dim={25} expandedRange={xpRange} gradConf={{H:0, S:"y", L:"x"}}/>
				  <WgGradientCell dim={25} expandedRange={xpRange} gradConf={{H:"x", S:0, L:"y"}}/>
				  <WgGradientCell dim={25} expandedRange={xpRange} gradConf={{H:"x", S:"y", L:0}}/>
				</div>

				<div className="threeCells n2">
				  <WgGradientCell dim={25} expandedRange={xpRange} gradConf={{H:1, S:"y", L:"x"}}/>
				  <WgGradientCell dim={25} expandedRange={xpRange} gradConf={{H:"x", S:1, L:"y"}}/>
				  <WgGradientCell dim={25} expandedRange={xpRange} gradConf={{H:"x", S:"y", L:1}}/>
				</div>

				<WgAlphaSwatch type="range" expandedRange={xpRange} />
			      </div>
			      
			    </div>
			);
			
		    default:
			return (
			    <div className="solid">
			      <div className="itemType">solid</div>

			      <div className="itemDemo">
				<WgColourPill colourString={item.solid} />
				<WgAlphaSwatch type="solid" colourString={item.solid} />
			      </div>
			    </div>
			);
		    }

		}
	    }
	]);
    }
    
    render() {
	const expanded = this.state.selectedRowIndex === -1;
	const probs_sum = cpotEditPane_util.calcProbsSum(this.state.cpot);
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
	      <WgTable
		 selectedRowIndex={this.state.selectedRowIndex}
		 onRowSelectedChange={(i)=>{this.handleRowSelectedChange(i);}}
		rowRenderingData={this.state.cpot.contents}
		hashRowDataToKey={true}
		columnsRendering={this.cpotEdit_WgTableColumns()}
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
		</div>


		
		{/* 3. The Expanded Preview Zone*/}
		<div className={"bigPreview Zone"+(expanded?"":" hide")}>
		  <CpotCellBlock
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
			const iIndex = this.state.selectedRowIndex;
			if(iIndex < 0){return null;}
			const cpotItem = this.state.cpot.contents[iIndex];
			switch (cpotItem.type) {
			case "solid":
			    return (
				<CpotEditSolid
				   colourString={cpotItem.solid}
				   onPropagateChange={value =>{
				       // Change a CPOT item solid colour
				       let $updater = {contents: {}};
				       $updater.contents[this.state.selectedRowIndex] = {solid: {$set: value}};
				       this.handleEditingCpotChange( $updater );			   
				  }}
				   />
			    );
			default:
			    return (
				<CpotEditRange
				   hslaRange={cpotItem.range}
				   onPropagateChange={null}
				   />
			    );

			}
		    })()
		}
		
		<CpotCellBlock
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


		
		{/* 5. Buttons for Cancel / Done */}
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


export default PaneColourPotsEdit;
