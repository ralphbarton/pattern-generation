import React from 'react';
var _ = require('lodash');

import Motf_util from './plain-js/Motf_util';

import WgMiniColourPicker from '../Wg/WgMiniColourPicker';

import Img_angledArrowRight from './../asset/angled-arrow-right.png';
import Img_angledArrowUp from './../asset/angled-arrow-up.png';



class MotfEdit_Section_DrawingTools_ColPick extends React.PureComponent {

    constructor() {
	super();
	this.hofHandleColourMove = this.hofHandleColourMove.bind(this);
	this.extractSelectionColor = this.extractSelectionColor.bind(this);
	this.setToolboxColour = this.setToolboxColour.bind(this);
	this.setMotfSelectionColour = this.setMotfSelectionColour.bind(this);
    }

    // in all these functions below, the variable 'k' will be either 'fill' or 'stroke'
    setToolboxColour(k,v){
	this.props.handleMotfUIStateChange({
	    drawingTools: {
		[k]: {$set: v}
	    }
	});
    }

    setMotfSelectionColour(k,v){
	const Motf = this.props.Motf;
	const Selection = this.props.FS_UI.selectedMElemsUIDArr;
	const ChangeBySelection = Motf_util.$ChgObj_ChangeMotfBySelection;
	
	const $chg = ChangeBySelection(Motf, Selection, {[k]: {$set: v}});
	//Apply a bunch of changes in one hit:
	this.props.handleEditingMotfChange($chg);
    }

    hofHandleColourMove(k, selectionColor){
	const TS = this;
	return function (v){
	    if(!selectionColor){
		//Case 1: no shape is selected (or at least, no colour picked up from it)
		TS.setToolboxColour(k,v);
	    }else{
		//Case 2: a shape is selected. Change the colour via motif
		TS.setMotfSelectionColour(k,v);
	    }
	};
    }

    hofHandleColourHoldClick(type, k, selectionColor){
	const TS = this;
	return function (){
	    switch(type) {
	    case "pull": // store the m-elem colour into the Toolbox
		TS.setToolboxColour(k, selectionColor);
		break;
	    case "push": // apply the stored toolbox colour to the m-elem
		TS.setMotfSelectionColour(k, TS.props.DT_UI[k]);
		break;
	    default: // swap stored and the active colour

		//does this cause multiple re-renders? Does that matter?
		TS.setToolboxColour(k, selectionColor);
		TS.setMotfSelectionColour(k, TS.props.DT_UI[k]);
	    }
	};
    }

    extractSelectionColor(k){
	const selectionUIDArr = this.props.FS_UI.selectedMElemsUIDArr;
	if(selectionUIDArr.length === 0){return null;}// no mutation required if no object selected.
	const mElem_Selected = _.find(this.props.Motf.Elements, {PGTuid: selectionUIDArr[0]} );
	return mElem_Selected[k];
    }
    
    
    render(){

	const UI = this.props.DT_UI;

	return(
	    <div className="colourPickers">
	      { _.map({"fill": "Fill", stroke: "Outline"}, (v,k)=>{
		  const selectionColor = this.extractSelectionColor(k);
		  return (
		      <div className={v} key={v}>
			<div className={"title"}>{v}</div>
			<WgMiniColourPicker
			   className={k}
			   color={ selectionColor || UI[k]}
			   onMove={this.hofHandleColourMove(k, selectionColor)}/>

			{selectionColor !== null &&
			<div className="hold-feature">

			  <img className="angledArrow right"
			       src={Img_angledArrowRight}
			       alt=""
			       onClick={this.hofHandleColourHoldClick("pull", k, selectionColor)}
			       />
			  
			  <div className="tiny-daub chequer"
			       onClick={this.hofHandleColourHoldClick("swap", k, selectionColor)}
			       >
			    <div className="fill" style={{background: UI[k]}}/>
			  </div>
			  
			  <img className="angledArrow Up"
			       src={Img_angledArrowUp}
			       alt=""
			       onClick={this.hofHandleColourHoldClick("push", k, selectionColor)}
			       />
			  
			</div>
			}
		      </div>
		  );
	      })
	      }
	    </div>
	);
    }


}

export default MotfEdit_Section_DrawingTools_ColPick;
