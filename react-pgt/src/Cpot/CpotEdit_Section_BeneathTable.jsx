import React from 'react';

// pure javascript functions (i.e. no JSX here)
import CpotEdit_util from './plain-js/CpotEdit_util.js';// probs summing etc
import Cpot_util from './plain-js/Cpot_util.js';// 'range unpack' needed for solid <-> range convert

// generic project widgets
import {WgButton, WgButtonExpanding} from '../Wg/WgButton';
import {WgDropDownList} from '../Wg/WgDropDown';
import WgActionLink from '../Wg/WgActionLink';

import tinycolor from 'tinycolor2';

//the JSX below doesn't indent properly in emacs...
function ProbsSumText (props){
    return(
	<div className={"probsSumText" + (props.probs_sum===100?" sumIs100":"")}>
	  <div className="sum">		  
	    Probabilities sum: <span>{props.probs_sum.toFixed(1)+"%"}</span>
	  </div>
	  <div className={"error" + (props.probs_sum < 100?" sumLT100":"")} >
	       (<span>{
		   (props.probs_sum-100).toFixed(1)+"%"
	       }</span>)
	</div>
	    </div>
    );
}



class CpotEdit_Section_BeneathTable extends React.PureComponent {

    constructor() {
	super();
	this.state = {
	    addItemRerandomiseCount: 0
	};
    }
    
    render() {
	const probs_sum = CpotEdit_util.calcProbsSum(this.props.cpot);
	const iIndex = this.props.selectedRowIndex;
	const cpotItem = iIndex < 0 ? {type: null} : this.props.cpot.contents[iIndex];

	const enableSum100AllEq = (this.props.cpot.contents.length > 0) && ((!CpotEdit_util.allProbsAreEqual(this.props.cpot)) || (probs_sum !== 100));
	
	return (

	    <div className="beneathTable">

	      <ProbsSumText probs_sum={probs_sum} />

	      <div className="mainButtons">

		<WgButtonExpanding
		   name="Add"
		   className="addItem"
		   onClick={ ()=>{
		       // Add a CPOT contents item
		       const template_item = {
			   prob: 15,
			   type: "solid",
			   solid: (/*random_col || */"#FF0000"),
			   uid: this.props.nextUid()
		       };
		       this.props.onEditingCpotChange({
			   contents: {$push: [template_item]}
		       });
		   }}
		   renderExpanded={ closeFn =>{
		       return (
			   <div>
			     <div>
			       Choose a colour for new colour pot item:
			       <div className="palette">
				 {
				     Array(7).fill(null).map( (el, i)=>{
					 return (
					     <div
						key={i}
						style={{background: tinycolor.random()}}
						/>
					 );
				     })
				 }
			       </div>			      
			       <WgActionLink
				  name="Different random colours"
			   onClick={ ()=>{
			       this.setState({
				   addItemRerandomiseCount: (this.state.addItemRerandomiseCount+1)
			       });
			   }}
				  />
			     </div>
			   </div>
		       );
		   }}/>		
		
		<WgButton
		   name="Delete"
		   buttonStyle={"small"}
		   onClick={ ()=>{
		       // Delete a CPOT contents item
		       this.props.onEditingCpotChange({
			   contents: {$splice: [[this.props.selectedRowIndex, 1]]}
		       });
		   }}
		   enabled={ (this.props.cpot.contents.length > 0 && iIndex > -1) }
		   />
		
	      </div>

	      
	      <div className="mainDropdowns">		

		{/* Dropdown: Summing Too */}
		<WgDropDownList
		   name="Summing Tools"
		   menuContentList={[
		       {
			   name: "sum to 100% (adjust selected)",
			   enabled: (probs_sum !== 100) && (iIndex >= 0),
			   onClick: ()=>{
			       // Change probability on Selected CPOT
			       const newProb = Math.max((100 + cpotItem.prob - probs_sum) , 0);
			       this.props.onEditingCpotSelItemChange({
				   prob: {$set: newProb}
			       });}
		       },{
			   name: "sum to 100% (rescale all)",
			   enabled: probs_sum !== 100,
			   onClick: ()=>{
			       // Change all CPOT probabilities
			       const $cpotProbsUpdate = CpotEdit_util.calcSum100ProbsSet(this.props.cpot, {all_equal: false});
			       this.props.onEditingCpotChange($cpotProbsUpdate);
			   }
		       },{
			   name: "sum to 100% (all equal)",
			   enabled: enableSum100AllEq,
			   onClick: ()=>{
			       // Change all CPOT probabilities
			       const $cpotProbsUpdate = CpotEdit_util.calcSum100ProbsSet(this.props.cpot, {all_equal: true});
			       this.props.onEditingCpotChange($cpotProbsUpdate);
			   }
		  }]}
		  enabled={enableSum100AllEq}
		  ddStyle="plain"
	      />
	      
	      {/* Dropdown: Item Type */}
	      <WgDropDownList
		 name={cpotItem.type === "solid" ? "Solid" : (cpotItem.type === "range" ? "Range" : "(item type)")}
		 menuContentList={[
		     {
			 name: "Solid",
			 enabled: cpotItem.type !== "solid",
			 onClick: ()=>{
			     const av_col = Cpot_util.range_unpack(cpotItem.range).col;
			     this.props.onEditingCpotSelItemChange({
				 type: {$set: "solid"},
				 solid: {$set: av_col}
			     });}
		     },{
			 name: "Range",
			 enabled: cpotItem.type !== "range",
			 onClick: ()=>{
			     const synth_range = Cpot_util.range_set(cpotItem.solid, {
				 dh: 15,
				 ds: 0.30,
				 dl: 0.10,
				 da: 0.20
			     });
			     this.props.onEditingCpotSelItemChange({
				 type: {$set: "range"},
				 range: {$set: synth_range}
			     });}
		     },{
			 name: "Convert to non-static",
			 enabled: true,
			 onClick: ()=>{console.log("add fn here");}
		 }]}	    
		enabled={cpotItem.type !== null}
		ddStyle="plain"
		/>
		
		
	  </div>
	  
	</div>
	);
    }
}


export default CpotEdit_Section_BeneathTable;
