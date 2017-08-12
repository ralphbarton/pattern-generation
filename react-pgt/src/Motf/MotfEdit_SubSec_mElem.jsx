import React from 'react';

import MotfEdit_SubSec_mElem_Icon from './MotfEdit_SubSec_mElem_Icon';
import MotfEdit_SubSec_mElem_menu from './MotfEdit_SubSec_mElem_menu';
import MotfEdit_SubSec_mElem_popoutPicker from './MotfEdit_SubSec_mElem_popoutPicker';

import Motf_lists from './plain-js/Motf_lists';
var _ = require('lodash');

import WgActionLink from '../Wg/WgActionLink';

import imgDustbin from './asset/dustbin-100.png';


function MotfEdit_SubSec_mElemContracted(props) {
    return(
	<div className={"mElem MotfEdit_SubSec_mElemContracted" + props.focusClass} onClick={props.onMElemClick}>

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
	     <MotfEdit_SubSec_mElem_menu
	     value={propValue}
	     PropertyDetails={PropertyDetails}
	     modifyElem={this.props.modifyElem}
	     />
	     </td>)
	];
    }


    componentWillReceiveProps(nextProps){

	// 1. Calculate if a prop has changed
	const glow = this.state.propJustChanged.map( (currentState, index) => {
	    return currentState || (this.extractPropVal(index) !== this.extractPropVal(index, nextProps.mElem));
	});

	// 2. Record in current state
	this.setState({
	    propJustChanged: glow
	});

	// 3. Timeout to clear the glow effect after a short time.
	if(glow[0] || glow[1]){
	    const TS = this;
	    clearTimeout(this.timoutID || null);
	    this.timoutID = setTimeout(function(){
		TS.setState({
		    propJustChanged: [false, false]
		});
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
	<div className={"mElem MotfEdit_SubSec_mElemExpanded" + props.focusClass} onClick={props.onMElemClick} >
	  <div className="bg-gradient"></div>
	  <div className="content">
	    <MotfEdit_SubSec_mElem_Icon size={24} mElem={mElem} />
	    <div className="name">{props.ObjectTypeDetails.fullName + " " + mElem.PGTuid}</div>

	    <WgActionLink
	     name={expandLevel < 4 ? "Expand" : "Contract"}
	     onClick={props.hofFnSetOvrExpanded(expandLevel < 4)}
	     />

	  <img className="dustbin"
	       src={imgDustbin}
	       onClick={props.deleteElem}
	       alt=""/>

	    
	    {/* Table 1. Placement & Size */}
	    <div className="tableHeading pos_size">Placement & Size
	      <MotfEdit_SubSec_propsTable
		 mElem={mElem}
		 modifyElem={props.modifyElem}
		 arrangement={TablesArrangement["pos_size"]} />
	    </div>

	    {/* Table 2. Appearance */}
	    {(expandLevel >= 2) && <div className="tableHeading">Appearance
		   <MotfEdit_SubSec_propsTable
			  mElem={mElem}
			  modifyElem={props.modifyElem}
			  arrangement={TablesArrangement["appearance"]} />
	    </div>}

	    {/* Table 3. Repetition */}
	    {(expandLevel >= 3) && <div className="tableHeading">Repetition
		    <MotfEdit_SubSec_propsTable
			   mElem={mElem}
			   modifyElem={props.modifyElem}
			   arrangement={TablesArrangement["repetition"]} />
	    </div>}

	    {/* Table 4. More Properties */}
	    {(expandLevel >= 4) && <div className="tableHeading">More Properties
		    <MotfEdit_SubSec_propsTable
			   mElem={mElem}
			   modifyElem={props.modifyElem}
			   arrangement={TablesArrangement["more"]} />
	    </div>}
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
