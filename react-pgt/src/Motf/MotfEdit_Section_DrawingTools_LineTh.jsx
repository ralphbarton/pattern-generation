import React from 'react';
var _ = require('lodash');

import {WgFadeTransition} from '../Wg/WgTransition';
import Motf_util from './plain-js/Motf_util';

class Popout extends React.PureComponent {

    constructor() {
	super();
	this.setToolboxStrokeWidth = this.setToolboxStrokeWidth.bind(this);
	this.setMotfSelectionStrokeWidth = this.setMotfSelectionStrokeWidth.bind(this);
	this.extractSelectionStrokeWidth = this.extractSelectionStrokeWidth.bind(this);
	this.renderContracted = this.renderContracted.bind(this);
    }
    
    setToolboxStrokeWidth(v){
	this.props.handleMotfUIStateChange({
	    drawingTools: {
		strokeWidth: {$set: v}
	    }
	});
    }

    setMotfSelectionStrokeWidth(v){
	const Motf = this.props.Motf;
	const Selection = this.props.FS_UI.selectedMElemsUIDArr;
	const ChangeBySelection = Motf_util.$ChgObj_ChangeMotfBySelection;
	
	const $chg = ChangeBySelection(Motf, Selection, {"strokeWidth": {$set: v}});
	//Apply a bunch of changes in one hit:
	this.props.handleEditingMotfChange($chg);
    }

    extractSelectionStrokeWidth(){
	const selectionUIDArr = this.props.FS_UI.selectedMElemsUIDArr;
	if(selectionUIDArr.length === 0){return false;}// no mutation required if no object selected.
	const mElem_Selected = _.find(this.props.Motf.Elements, {PGTuid: selectionUIDArr[0]} );
	return mElem_Selected["strokeWidth"];
    }
    
    renderContracted(currentStrokeWidth, isSelection){
	return (
	    <div>
	      <div className="text">Line</div>

	      <svg width="45" height="15">
		<line x1="0" y1="5" x2="45" y2="5" strokeWidth={currentStrokeWidth}/>
	      </svg>
	    </div>
	);
    }

    renderExpanded(currentStrokeWidth, isSelection){
	return (
	    <div>
	      <div className="heading">Line Thickness</div>
	      {
		  [1, 2, 3, 5, 10].map( th=>{
		      const extraClass = th === currentStrokeWidth ? " selected" : "";
		      return (
			  <div className={"option"+extraClass}
			       key={th}
			       onClick={
				   isSelection ?
				       this.setMotfSelectionStrokeWidth.bind(null, th)
				       :
				       this.setToolboxStrokeWidth.bind(null, th)
			       }
			       >
			    <svg width="40" height="15">
			      <line x1="0" y1="5" x2="40" y2="5" strokeWidth={th}/>
			    </svg>
			    <div >{th} Px</div>
			  </div>
		      );
		  })
	      }
	    </div>
	);
    }

    
    render(){
	const isExpanded = this.props.pop.expanded;
	const extraClass = isExpanded ? " expanded" : "";

	const selectionStrokeWidth = this.extractSelectionStrokeWidth();
	const isSelection = selectionStrokeWidth !== false;
	//May either be of the selection, or toolbox own...
	//n.b. 'null would be a valid value
	const currentStrokeWidth = isSelection ? selectionStrokeWidth : this.props.DT_UI.strokeWidth;

	return (

	    <div className={"button"+extraClass}
		 ref={this.props.pop.setwrapperRef}
		 onClick={this.props.pop.hofSetExpanded(true, this.props.pop.expanded)}
		 >

	      <WgFadeTransition speed={1}>
		{!isExpanded && this.renderContracted(currentStrokeWidth, isSelection)}
		{isExpanded  && this.renderExpanded(currentStrokeWidth, isSelection)  }
	      </WgFadeTransition>
	      
	    </div>

	);
    }
}



import withClickOut from './../HOC/withClickOut';
const Popout2 = withClickOut(Popout);


function MotfEdit_Section_DrawingTools_LineTh(props){
    return(
	<div className="LineTh">
	  <Popout2 {...props}/>
	</div>
    );
}


export default withClickOut(MotfEdit_Section_DrawingTools_LineTh);
