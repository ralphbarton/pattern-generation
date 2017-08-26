import React from 'react';
var _ = require('lodash');

import MotfEdit_Section_MotifCanvas_BG from './MotfEdit_Section_MotifCanvas_BG';
import MotfEdit_Section_MotifCanvas_GD from './MotfEdit_Section_MotifCanvas_GD';
import MotfEdit_Section_MotifCanvas_Fabric from './MotfEdit_Section_MotifCanvas_Fabric';
import MotfEdit_Section_MotifCanvas_DTO from './MotfEdit_Section_MotifCanvas_DTO';


class MotfEdit_Section_MotifCanvas extends React.PureComponent {


    // It is important not to respond in all cases of "fabricSelection.selectedMElemsUIDArr" change.
    // hence the importance of this function
    shouldComponentUpdate(nextProps, nextState){

	/*
	 set of props passed (excl. callbacks) are:
	 Motf
	 CC_UI - Canvas Controls
	 DT_UI - Drawing Tools
	 MS_UI - Mouse State
	 FS_UI - Fabric Selection
	 */

	// Positive selection logic. If any of the conditions below (c1 - c5) are true, rerender will occur.
	const c1 = nextProps.Motf  !== this.props.Motf;  // Motif itself is changed.
	const c2 = nextProps.CC_UI !== this.props.CC_UI; // i.e. change to the background or underlying grid
	const c3 = nextProps.MS_UI !== this.props.MS_UI; // because 'Draw Tool Overlay' needs to know when mouse enters canvas
	const c4 = nextProps.DT_UI.shape !== this.props.DT_UI.shape; // 'Draw Tool Overlay' needs to know selected Tool...
	const c5 = nextProps.FS_UI.chgOrigin_Properties_count !== this.props.FS_UI.chgOrigin_Properties_count;// Props List Event

	return c1 || c2 || c3 || c4 || c5;
    }

    handleMouseEnterLeaveCanvas(isEnter){
	const TS = this;
	return function(e){
	    const BB = e.target.getBoundingClientRect();
	    TS.props.handleMotfUIStateChange({
		mouseStatus: {
		    mouseOverCanvas: {$set: isEnter},
		    canvBoundingBoxCoords: {$set: BB}
		}
	    });
	};
    }
    
    render(){
	
	return (
	    <div className={"MotfEdit_Section_MotifCanvas"+(this.props.CC_UI.canvasCircular?" circular":"")}
		 onMouseEnter={this.handleMouseEnterLeaveCanvas(true)}
		 onMouseLeave={this.handleMouseEnterLeaveCanvas(false)}
		 >

	      {/* "Layer" 1: Background (black/white/chequers etc.) */}
	      <MotfEdit_Section_MotifCanvas_BG CC_UI={this.props.CC_UI}/>

	      {/* "Layer" 2: Background-Grid (cartesian/polar etc.) */}
	      <MotfEdit_Section_MotifCanvas_GD CC_UI={this.props.CC_UI}/>

	      {/* "Layer" 3: Fabric Canvas */}
	      <MotfEdit_Section_MotifCanvas_Fabric
		 Motf={this.props.Motf}
		 CC_UI={this.props.CC_UI} // "CC_UI" - pass grid-size, for snapping behaviour
		 FS_UI={this.props.FS_UI} // The fabric selection...
		 handleEditingMotfChange={this.props.handleEditingMotfChange} // All sorts of Motif modification...
		 handleMotfUIStateChange={this.props.handleMotfUIStateChange} // Set Fabric selection...
		 onToastMsg={this.props.onToastMsg}
		 />
	      
	      {/* "Layer" 4: Drawing Tool Overlay */}
		<div>
		  {
		      (this.props.DT_UI.shape !== null) && // a draw tool is selected...
			  <MotfEdit_Section_MotifCanvas_DTO
				 DT_UI={this.props.DT_UI}
				 MS_UI={this.props.MS_UI}
				 handleEditingMotfChange={this.props.handleEditingMotfChange}
				 handleMotfUIStateChange={this.props.handleMotfUIStateChange}// Set: Toggle-OFF shape-draw tool
				 Motf={this.props.Motf} // to determine PGTuid of new element...
				 />
		  }
		</div>
		
	    </div>
	);
    }
}

export default MotfEdit_Section_MotifCanvas;
