import React from 'react';

import {WgButton} from '../Wg/WgButton';

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
	return (
	    <div className={"mElem" + (expLvl >= 1 ? " expanded" : " contracted")}>
	      {(expLvl >= 1) && <div className="bg-gradient"></div>}
	      
	      <div className="content">
		{mElem.shape}
		...LeftSide: 
		{mElem.left}

		{/* Table 1. Placement & Size */}
		{(expLvl >= 1) && <div className="tableHeading">Placement & Size</div>}

		{/* Table 2. Appearance */}
		{(expLvl >= 2) && <div className="tableHeading">Appearance</div>}

		{/* Table 3. Repetition */}
		{(expLvl >= 3) && <div className="tableHeading">Repetition</div>}

		{/* Table 4. More Properties */}
		{(expLvl >= 4) && <div className="tableHeading">More Properties</div>}
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

		  {this.props.Motf.Elements.map(mElem => {
		      return <MotifElement
				    key={mElem.PGTuid}
				    mElem={mElem}
				    expand={this.state}/>;
		  })}
		  
		  lots of scrollable items here...
		  <div className="blob">
		    blob
		  </div>

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
