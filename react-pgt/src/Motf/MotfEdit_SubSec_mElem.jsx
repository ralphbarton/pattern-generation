import React from 'react';

import Motf_lists from './plain-js/Motf_lists';
var _ = require('lodash');

import WgActionLink from '../Wg/WgActionLink';

import imgDustbin from './asset/dustbin-100.png';


function MotfEdit_SubSec_mElemContracted(props) {
    return(
	<div className={"mElem MotfEdit_SubSec_mElemContracted" + (props.isFocus ? " focus" : "")}>
	  <div className="name">{props.ObjectTypeDetails.fullName + " " + props.mElem.PGTuid}</div>

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


function MotfEdit_SubSec_mElemExpanded(props) {
    const expLvl = props.expandLevel;
    return(
	<div className={"mElem MotfEdit_SubSec_mElemExpanded" + (props.isFocus ? " focus" : "")}>
	  <div className="bg-gradient"></div>
	  <div className="content">
	    <div className="name">{props.ObjectTypeDetails.fullName + " " + props.mElem.PGTuid}</div>

	    <WgActionLink
	     name={expLvl < 4 ? "Expand" : "Contract"}
	     onClick={props.hofFnSetOvrExpanded(expLvl < 4)}
	     />

	  ...LeftSide: 
	  {props.mElem.left}

	  <img className="dustbin"
	       src={imgDustbin}
	       onClick={props.deleteElem}
	       alt=""/>

	    
	    {/* Table 1. Placement & Size */}
	    <div className="tableHeading">Placement & Size
	      {Motf_lists.GenericPropertyArrangement.pos_size.map( p_name => {
		  return <div key={p_name}> {p_name} </div>;
	      })}
	    </div>

	    {/* Table 2. Appearance */}
	    {(expLvl >= 2) && <div className="tableHeading">Appearance
		  {Motf_lists.GenericPropertyArrangement.appearance.map( p_name => {
		      return <div key={p_name}> {p_name} </div>;
		  })}
	    </div>}

	    {/* Table 3. Repetition */}
	    {(expLvl >= 3) && <div className="tableHeading">Repetition
		  {Motf_lists.GenericPropertyArrangement.repetition.map( p_name => {
		      return <div key={p_name}> {p_name} </div>;
		  })}
	    </div>}

	    {/* Table 4. More Properties */}
	    {(expLvl >= 4) && <div className="tableHeading">More Properties
		  {Motf_lists.GenericPropertyArrangement.more.map( p_name => {
		      return <div key={p_name}> {p_name} </div>;
		  })}
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
    
    render(){
	const mElem = this.props.mElem;
	const EO = this.state.expandOverride;
	const expandLevel = EO !== undefined ? EO : this.props.expand.expandLevel;
	const isFocus = this.props.isFocus;

	const ObjectTypeDetails = _.find(Motf_lists.ObjectTypes, function(o) { return o.DatH_name === mElem.shape;});

	const handleMElemClick = null;
	
	// Expanded M-Element
	if (expandLevel >= 1){
	    return (
		<MotfEdit_SubSec_mElemExpanded
		   ObjectTypeDetails={ObjectTypeDetails}
		   mElem={mElem}
		   deleteElem={this.props.deleteElem}
		   isFocus={isFocus}
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
		   isFocus={isFocus}
		   onMElemClick={handleMElemClick}
		   hofFnSetOvrExpanded={this.hofFnSetOvrExpanded}
		   />
	    );
	}
    }
}

export default MotfEdit_SubSec_mElem;
