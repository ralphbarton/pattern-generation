import React from 'react';

import {WgButton} from '../Wg/WgButton';

import MotfEdit_SubSec_mElem from './MotfEdit_SubSec_mElem';

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
					const nValue = Number(value);
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
		<WgButton
		   name="Expand All"
		   buttonStyle={"small"}
		   onClick={this.hofHandleSetExpandClick(1)}
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
