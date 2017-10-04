import React from 'react';
var _ = require('lodash');

// widgets etc
import {WgSlideTransition} from '../Wg/WgTransition';
import WgDustbin from '../Wg/WgDustbin';
import WgActionLink from '../Wg/WgActionLink';

import Motf_lists from './plain-js/Motf_lists';

// Sub-content
import MotfEdit_SubSec_mElem_Icon from './MotfEdit_SubSec_mElem_Icon';
import MotfEdit_SubSec_mElem_menu from './MotfEdit_SubSec_mElem_menu';
import MotfEdit_SubSec_mElem_popoutPicker from './MotfEdit_SubSec_mElem_popoutPicker';




function MotfEdit_SubSec_mElemContracted(props) {
    return(
	<div
	   className={"mElem MotfEdit_SubSec_mElemContracted" + props.focusClass}
	   onClick={props.onMElemClick}
	   ref={props.addRef}
	   >

	  <MotfEdit_SubSec_mElem_Icon size={14} mElem={props.mElem} />
	  
	  <div className="name">
	    {props.ObjectTypeDetails.fullName + " " + props.mElem.PGTuid}
	  </div>

	  <WgActionLink
	     name={"Expand"}
	     onClick={props.hofFnSetOvrExpanded(true)}
	     />

	  <WgActionLink
	     name={"Delete"}
	     onClick={props.deleteElem}
	     />

	</div>
    );
}


class MotfEdit_SubSec_TableOneRow extends React.PureComponent {

    constructor(props) {
	super();
	this.state = {
	    propJustChanged: [false, false],
	    PropertyDetailsPair: props.propsPair.map( DatH_Key => {
		//get full property details by searching its DatH_Key
		const PropertyDetails = _.find(Motf_lists.ObjectProperties, {DatH_Key: DatH_Key} );
		if(PropertyDetails){return PropertyDetails;}
		// its not necessarily an error.
		//		console.error(`Property details not retrieved for key: "${DatH_Key}"`);
		return null;
	    })
	};

	this.extractPropVal = this.extractPropVal.bind(this);
	this.ThreeCells = this.ThreeCells.bind(this);
    }

    extractPropVal(index, newer_mElem){
	const PropertyDetails = this.state.PropertyDetailsPair[index]; 
	if (PropertyDetails === null){return "";}	// DatH_Key may have been "", -> PropertyDetails = undefined
	return (newer_mElem || this.props.mElem)[PropertyDetails.DatH_Key] || "";
    }

    ThreeCells(DatH_Key, index){
	const PropertyDetails = this.state.PropertyDetailsPair[index];
	const shortName = PropertyDetails ? PropertyDetails.shortName : "";
	const extraClass = this.state.propJustChanged[index] ? " recent-change" : "";
	const propValue = this.extractPropVal(index);
	return [
	    (<td className={"prop"+extraClass} key={DatH_Key+"prop"}>{shortName}</td>),
	    (<td className={"valu"+extraClass} key={DatH_Key+"valu"}>
	     {
		 PropertyDetails && PropertyDetails.type === "number" && <input
		 value={propValue} 
		 onChange={event => {
		     const newNumericVal = Number(event.target.value);
		     this.props.modifyElem(DatH_Key, newNumericVal);
		 }}
	      />}
	     {
		 PropertyDetails && PropertyDetails.type === "colour" && <MotfEdit_SubSec_mElem_popoutPicker
		 color={propValue}
		 onColourChange={this.props.modifyElem.bind(null, DatH_Key)}
		     />
	     }
	     </td>),
	    (<td className={"more"+extraClass} key={DatH_Key+"more"}>
	     {
		 PropertyDetails && <MotfEdit_SubSec_mElem_menu
		 value={propValue}
		 PropertyDetails={PropertyDetails}
		 modifyElem={this.props.modifyElem}
		     />
	     }
	     </td>)
	];
    }


    componentWillReceiveProps(nextProps){

	// 1. Calculate if a prop has changed
	const setGlow_0 = this.extractPropVal(0) !== this.extractPropVal(0, nextProps.mElem);
	const setGlow_1 = this.extractPropVal(1) !== this.extractPropVal(1, nextProps.mElem);

	// 2. Record in current state
	const currGlow = this.state.propJustChanged;
	this.setState({
	    propJustChanged: [currGlow[0] || setGlow_0, currGlow[1] || setGlow_1]
	});

	// 3. Timeout to clear the glow effect after a short time.
	if(setGlow_0 || setGlow_1){
	    const TS = this;
	    clearTimeout(this.timeoutID || null);
	    this.timeoutID = setTimeout(function(){
		TS.setState({
		    propJustChanged: [false, false]
		});
		TS.timeoutID = null;
	    }, 1000);
	}
    }
    
    render(){

	return (
	    <tr>
	      { _.flatMap(this.props.propsPair, this.ThreeCells)}
	    </tr>
	);

    }

}

function MotfEdit_SubSec_propsTable(props){

    const propsPairsArr = _.chunk( props.arrangement, 2);    
    return (
	<table><tbody>
	  {
	      propsPairsArr.map( (propsPair, i) => {
		  return (
		      <MotfEdit_SubSec_TableOneRow
			 key={i}
			 propsPair={propsPair}		
			 mElem={props.mElem}
			 modifyElem={props.modifyElem}
			 />)
		  ;
	      })
	  }
	</tbody></table>
    );
}




function MotfEdit_SubSec_mElemExpanded(props) {

    const { expandLevel, mElem } = props;//pull off some props...

    //get the properties arrangement for this particular shape
    const ShapeDetails = _.find(Motf_lists.ObjectTypes, {DatH_name: mElem.shape} );
    const TablesArrangement = ShapeDetails.PropertyArrangement;
    
    return(
	<div
	   className={"mElem MotfEdit_SubSec_mElemExpanded" + props.focusClass}
	   onClick={props.onMElemClick}
	   ref={props.addRef}
	   >
	  <div className="bg-gradient"></div>
	  <div className="content">
	    <MotfEdit_SubSec_mElem_Icon size={24} mElem={mElem} />
	    <div className="name">{props.ObjectTypeDetails.fullName + " " + mElem.PGTuid}</div>

	    <WgActionLink
	     name={expandLevel < 4 ? "Expand" : "Contract"}
	     onClick={props.hofFnSetOvrExpanded(expandLevel < 4)}
	     />

	  <WgDustbin onClick={props.deleteElem} />

	  <WgSlideTransition>
	  
	    {/* Table 1. Placement & Size */}
	    <div className="headedTable pos_size"><span>Placement & Size</span>
	      <MotfEdit_SubSec_propsTable
		 mElem={mElem}
		 modifyElem={props.modifyElem}
		 arrangement={TablesArrangement["pos_size"]} />
	    </div>

	    {/* Table 2. Appearance */}
	    {(expandLevel >= 2) && <div className="headedTable appearance"><span>Appearance</span>
		   <MotfEdit_SubSec_propsTable
			  mElem={mElem}
			  modifyElem={props.modifyElem}
			  arrangement={TablesArrangement["appearance"]} />
	    </div>}

	    {/* Table 3. Repetition */}
	    {(expandLevel >= 3) && <div className="headedTable repetition"><span>Repetition</span>
		    <MotfEdit_SubSec_propsTable
			   mElem={mElem}
			   modifyElem={props.modifyElem}
			   arrangement={TablesArrangement["repetition"]} />
	    </div>}

	    {/* Table 4. More Properties */}
	    {(expandLevel >= 4) && <div className="headedTable more"><span>More Properties</span>
		    <MotfEdit_SubSec_propsTable
			   mElem={mElem}
			   modifyElem={props.modifyElem}
			   arrangement={TablesArrangement["more"]} />
	    </div>}

           </WgSlideTransition>
	  </div>
	</div>
    );
}


class MotfEdit_SubSec_mElem extends React.PureComponent {


    constructor() {
	super();
	this.state = {
	    expandOverride: undefined // 'undefined' = no override, '0' - fully contracted, '4' - fully expanded
	};
	this.hofFnSetOvrExpanded = this.hofFnSetOvrExpanded.bind(this);
    }

    hofFnSetOvrExpanded(isExpanded){
	const TS = this;
	return function (){
	    TS.setState({
		expandOverride: isExpanded ? 4 : 0
	    });
	};
    };

    componentWillReceiveProps(nextProps){

	//clear any overridden expansion settings, if globally adjusted
	if(nextProps.expand.expandCount !== this.props.expand.expandCount){
	    this.setState({
		expandOverride: undefined
	    });
	}
    }
    
    render(){
	const mElem = this.props.mElem;
	const EO = this.state.expandOverride;
	const expandLevel = EO !== undefined ? EO : this.props.expand.expandLevel;
	const focusClass = this.props.isFocus ? " focus" : "";

	const ObjectTypeDetails = _.find(Motf_lists.ObjectTypes, {DatH_name: mElem.shape} );

	const handleMElemClick = this.props.setSelectedMElem.bind(null, mElem.PGTuid);
	
	// Expanded M-Element
	if (expandLevel >= 1){
	    return (
		<MotfEdit_SubSec_mElemExpanded
		   ObjectTypeDetails={ObjectTypeDetails}
		   mElem={mElem}
		   addRef={this.props.addRef}
		   modifyElem={this.props.modifyElem}
		   deleteElem={this.props.deleteElem}
		   focusClass={focusClass}
		   onMElemClick={handleMElemClick}
		   expandLevel={expandLevel}
		   hofFnSetOvrExpanded={this.hofFnSetOvrExpanded}		       
		   />
	    );
	    // Contracted M-Element
	}else{
	    return (
		<MotfEdit_SubSec_mElemContracted
		   ObjectTypeDetails={ObjectTypeDetails}
		   mElem={mElem}
		   addRef={this.props.addRef}
		   deleteElem={this.props.deleteElem}
		   focusClass={focusClass}
		   onMElemClick={handleMElemClick}
		   hofFnSetOvrExpanded={this.hofFnSetOvrExpanded}
		   />
	    );
	}
    }
}

export default MotfEdit_SubSec_mElem;
