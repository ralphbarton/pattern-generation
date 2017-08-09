import React from 'react';

import {WgButton} from '../Wg/WgButton';

import Motf_lists from './plain-js/Motf_lists';
var _ = require('lodash');

import imgDustbin from './asset/dustbin-100.png';

class MotifElement extends React.PureComponent {

    /*
    constructor() {
	super();
	this.state = {
	    : 2, // 0-none... 1-[Pos & Size] 2-[Appearance] 3-[Repetition] 4-[More]
	};
	this.hofHandleSetExpandClick = this.hofHandleSetExpandClick.bind(this);
    }*/   // expandOveride
    
    render(){
	const mElem = this.props.mElem;
	const expLvl = this.props.expand.expandLevel;
	const isFocus = this.props.isFocus;

	const selected_fObj = _.find(Motf_lists.ObjectTypes, function(o) { return o.DatH_name === mElem.shape;});
	
	return (
	    <div className={"mElem" + (expLvl >= 1 ? " expanded" : " contracted") + (isFocus ? " focus" : "")}>
	      {(expLvl >= 1) && <div className="bg-gradient"></div>}
	      
	      <div className="content">
		<div className="name">{selected_fObj.fullName + " " + mElem.PGTuid}</div>
		  ...LeftSide: 
		{mElem.left}

		<img className="dustbin"
		     src={imgDustbin}
		     onClick={this.props.deleteElem}
		     alt=""/>
		
		{/* Table 1. Placement & Size */}
		{(expLvl >= 1) && <div className="tableHeading">Placement & Size
		      {Motf_lists.GenericPropertyArrangement.pos_size.map( p_name => {
			  return <div key={p_name}> {p_name} </div>;
		      })}
		</div>}

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

}

class MotfEdit_Section_Properties extends React.PureComponent {

    constructor() {
	super();
	this.state = {
	    expandLevel: 2, // 0-none... 1-[Pos & Size] 2-[Appearance] 3-[Repetition] 4-[More]
	    expandCount: 0 // increment upon every change...
	};
	this.hofHandleSetExpandClick = this.hofHandleSetExpandClick.bind(this);
    }

    hofHandleSetExpandClick(expand_lvl){
	const TS = this;
	return function (){
	    TS.setState({
		expandLevel: expand_lvl,
		expandCount: TS.state.expandCount + 1
	    });
	};
    }
    
    
    render(){
	return (
	    <div>
	      <div className="properties">
		<div className="freezeHeading">
		  Motif Elements: Properties
		</div>
		<div className="scrollableContent">

		  {this.props.Motf.Elements.map( (mElem, index) => {
		      return <MotifElement
				    key={mElem.PGTuid}
				    mElem={mElem}
				    expand={this.state}
				    isFocus={mElem.PGTuid === this.props.FS_UI.selectionUID}
				    deleteElem={()=>{
					this.props.handleEditingMotfChange({
					    Elements: {$splice: [[index,1]]}
					});
				    }}
				    />;
		  })}

		</div>
	      </div>


	      
	      {/* Underneath the Table - the Buttons section... */}
	      <div className="propertiesButtons">
		<WgButton
		   name="Contract All"
		   buttonStyle={"small"}
		   onClick={this.hofHandleSetExpandClick(0)}
		   />
		<WgButton
		   name="Expand All"
		   buttonStyle={"small"}
		   onClick={this.hofHandleSetExpandClick(4)}
		   />
		<WgButton
		   name="Sweep"
		   buttonStyle={"small"}
		   />
		<WgButton
		   name="Render"
		   buttonStyle={"small"}
		   />
		<WgButton
		   name="Render ×10"
		   buttonStyle={"small"}
		   />
	      </div>
	    </div>
	);
    }
}

export default MotfEdit_Section_Properties;
