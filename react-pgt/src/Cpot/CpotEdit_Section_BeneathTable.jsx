import React from 'react';

// pure javascript functions (i.e. no JSX here)
import CpotEdit_util from './plain-js/CpotEdit_util.js';// probs summing etc
import Cpot_util from './plain-js/Cpot_util.js';// 'range unpack' needed for solid <-> range convert

// generic project widgets
import WgButton from '../Wg/WgButton';
import WgDropDown from '../Wg/WgDropDown';


class CpotEdit_Section_BeneathTable extends React.PureComponent {

    render() {
	const probs_sum = CpotEdit_util.calcProbsSum(this.props.cpot);
	const iIndex = this.props.selectedRowIndex;
	const cpotItem = iIndex < 0 ? {type: null} : this.props.cpot.contents[iIndex];
	
	return (

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
		this.props.onEditingCpotChange({
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
		this.props.onEditingCpotChange({
		    contents: {$splice: [[this.props.selectedRowIndex, 1]]}
		});
	    }}
	    enabled={this.props.cpot.contents.length > 0}
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
		    this.props.onEditingCpotSelItemChange({
			type: {$set: "solid"},
			solid: {$set: av_col}
		    });}
	    },{
		name: "Range",
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
