import React from 'react';

import MotfEdit_SubSec_mElem_Icon from './MotfEdit_SubSec_mElem_Icon';

import Motf_lists from './plain-js/Motf_lists';
var _ = require('lodash');

import WgActionLink from '../Wg/WgActionLink';

import imgDustbin from './asset/dustbin-100.png';


function MotfEdit_SubSec_mElemContracted(props) {
    return(
	<div className={"mElem MotfEdit_SubSec_mElemContracted" + (props.isFocus ? " focus" : "")}>

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




function prop3cells(nameStr, mElem){

    //get the Property details from the abbreviated property name (its 'shortName')

    // Todo: is 'shortName' really the best search-key? It should really be PGTO_key.
    const PropertyDetails = _.find(Motf_lists.ObjectProperties, {shortName: nameStr} ) ;

    
    // todo: again, the lookup key here should be 'PGTO_key', not 'fabricKey'
    // nameStr may have been "", -> PropertyDetails = undefined
    const storedValue = PropertyDetails !== undefined ? mElem[PropertyDetails.fabricKey] : "";
    
    return [
	(<td className="prop" key={nameStr+"prop"}>{nameStr}</td>),
	(<td className="valu" key={nameStr+"valu"}>{storedValue}</td>),
	(<td className="more" key={nameStr+"more"}>...</td>)
    ];
}

function MotfEdit_SubSec_propsTable(props){

    const propsPairs = _.chunk( props.arrangement, 2);

    const mElem = props.mElem;
    
    return (
	<table><tbody>
	  {
	      propsPairs.map( (pair, i) => {
		  return (
		      <tr key={i}>
			{_.concat(prop3cells(pair[0], mElem), prop3cells(pair[1], mElem))}
		      </tr>
		  );
	      })
	  }
	</tbody></table>
    );
}




function MotfEdit_SubSec_mElemExpanded(props) {
    const expLvl = props.expandLevel;
    const mElem = props.mElem;

    //get the properties arrangement for this particular shape
    const ShapeDetails = _.find(Motf_lists.ObjectTypes, {DatH_name: mElem.shape} );
    const TablesArrangement = ShapeDetails.PropertyArrangement;
    
    return(
	<div className={"mElem MotfEdit_SubSec_mElemExpanded" + (props.isFocus ? " focus" : "")}>
	  <div className="bg-gradient"></div>
	  <div className="content">
	    <MotfEdit_SubSec_mElem_Icon size={24} mElem={props.mElem} />
	    <div className="name">{props.ObjectTypeDetails.fullName + " " + props.mElem.PGTuid}</div>

	    <WgActionLink
	     name={expLvl < 4 ? "Expand" : "Contract"}
	     onClick={props.hofFnSetOvrExpanded(expLvl < 4)}
	     />

	  <img className="dustbin"
	       src={imgDustbin}
	       onClick={props.deleteElem}
	       alt=""/>

	    
	    {/* Table 1. Placement & Size */}
	    <div className="tableHeading pos_size">Placement & Size
	      <MotfEdit_SubSec_propsTable
		 mElem={mElem}
		 arrangement={TablesArrangement["pos_size"]} />
	    </div>

	    {/* Table 2. Appearance */}
	    {(expLvl >= 2) && <div className="tableHeading">Appearance
		   <MotfEdit_SubSec_propsTable
			  mElem={mElem}
			  arrangement={TablesArrangement["appearance"]} />
	    </div>}

	    {/* Table 3. Repetition */}
	    {(expLvl >= 3) && <div className="tableHeading">Repetition
		    <MotfEdit_SubSec_propsTable
			   mElem={mElem}
			   arrangement={TablesArrangement["repetition"]} />
	    </div>}

	    {/* Table 4. More Properties */}
	    {(expLvl >= 4) && <div className="tableHeading">More Properties
		    <MotfEdit_SubSec_propsTable
			   mElem={mElem}
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
	const isFocus = this.props.isFocus;

	const ObjectTypeDetails = _.find(Motf_lists.ObjectTypes, {DatH_name: mElem.shape} );

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
