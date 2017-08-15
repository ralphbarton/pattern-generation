import React from 'react';

import {WgButton} from '../Wg/WgButton';

import MotfEdit_SubSec_mElem from './MotfEdit_SubSec_mElem';

class MotfEdit_Section_Properties extends React.PureComponent {

    constructor() {
	super();
	this.state = {
	    expandLevel: 1, // 0-none... 1-[Pos & Size] 2-[Appearance] 3-[Repetition] 4-[More]
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
		      return <MotfEdit_SubSec_mElem
				    key={mElem.PGTuid}
				    mElem={mElem}
				    expand={this.state}
				    isFocus={mElem.PGTuid === this.props.FS_UI.selectionUID}
				    deleteElem={()=>{
					this.props.handleEditingMotfChange({
					    Elements: {$splice: [[index,1]]}
					});
				    }}
				    setSelectedMElem={(PGTuid)=>{
					const cnt = this.props.FS_UI.chgOrigin_Properties_count + 1;
					this.props.handleMotfUIStateChange(
					    {fabricSelection: {
						selectionUID: {$set: PGTuid},
						chgOrigin_Properties_count: {$set: cnt}
					    }}
					);
				    }}
				    modifyElem={(propKey, value)=>{
					const nValue = value;
					this.props.handleEditingMotfChange({
					    Elements: {
						[index]: {
						    [propKey]: {$set: nValue}
						}
					    }
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
		<Motf_expandAllButton
		   hofHandleSetExpandClick={this.hofHandleSetExpandClick}
		   expandLevel={this.state.expandLevel}
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






/* code here for the Expand All button's advanced features...*/

import rightArrow from './asset/right-arrow-80.png';
import closeIcon from './asset/close-36.png';

class Motf_expandAllPopout extends React.PureComponent {

    renderContracted(){
	return (
	    <div>
	      <img className="rightArrow"
		   src={rightArrow}
		   alt=""/>
	    </div>
	);
    }

    renderExpanded(){
	const EXL = this.props.expandLevel;
	return (
	    <div>
	      <div>
		<h1>Groups shown:</h1>

	      <img className="closeIcon"
		   src={closeIcon}
		   alt=""
		   onClick={this.props.pop.hofSetExpanded(false)}
		   />
	      
	      <label className="control control--checkbox">Placement & Size
		<input type="checkbox" checked={EXL >= 1} onChange={this.props.hofHandleSetExpandClick(EXL >= 1 ? 0 : 1)}/>
		<div className="control__indicator"></div>
	      </label>

	      <label className="control control--checkbox">Appearance
		<input type="checkbox" checked={EXL >= 2} onChange={this.props.hofHandleSetExpandClick(EXL >= 2 ? 1 : 2)}/>
		<div className="control__indicator"></div>
	      </label>

	      <label className="control control--checkbox">Repetition
		<input type="checkbox" checked={EXL >= 3} onChange={this.props.hofHandleSetExpandClick(EXL >= 3 ? 2 : 3)}/>
		<div className="control__indicator"></div>
	      </label>

	      <label className="control control--checkbox">More Properties
		<input type="checkbox" checked={EXL >= 4} onChange={this.props.hofHandleSetExpandClick(EXL >= 4 ? 3 : 4)}/>
		<div className="control__indicator"></div>
	      </label>
		
	      </div>
	    </div>
	);
    }
    
    render(){
	const extraClass = this.props.pop.expanded ? " expanded" : "";
	return (
	    <div
	       className={"Motf_expandAllPopout" + extraClass}
	       ref={this.props.pop.setwrapperRef}
	       onClick={this.props.pop.hofSetExpanded(true, this.props.pop.expanded)}
	       >
	      {this.props.pop.expanded ? this.renderExpanded() : this.renderContracted()}
	    </div>
	);
    }
}

import withClickOut from './../withClickOut';
const Motf_expandAllPopout2 = withClickOut(Motf_expandAllPopout);

function Motf_expandAllButton(props) {

    return (
	<div
	   className="button s expandAll"
	   >
	  <div className="text" onClick={props.hofHandleSetExpandClick(4)}>Expand All</div>
	  <Motf_expandAllPopout2
	     hofHandleSetExpandClick={props.hofHandleSetExpandClick}
	     expandLevel={props.expandLevel}
	     />
	</div>
    );
}






export default MotfEdit_Section_Properties;
