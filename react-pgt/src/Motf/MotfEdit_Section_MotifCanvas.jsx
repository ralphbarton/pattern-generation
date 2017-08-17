import React from 'react';

//should I divide up this file into separate categories of function (better modularisation)
import Motf_FabricHandlers from './plain-js/Motf_FabricHandlers';
import MotfEdit_Section_MotifCanvas_BG from './MotfEdit_Section_MotifCanvas_BG';
import MotfEdit_Section_MotifCanvas_GD from './MotfEdit_Section_MotifCanvas_GD';
import MotfEdit_Section_MotifCanvas_DTO from './MotfEdit_Section_MotifCanvas_DTO';


class MotfEdit_Section_MotifCanvas extends React.PureComponent {


    // It is important not to respond in all cases of "fabricSelection.selectionUID" change.
    // hence the importance of this function
    shouldComponentUpdate(nextProps, nextState){

	/*
	// Test for all change in 'CC_UI'
	const c1 = nextProps.CC_UI !== this.props.CC_UI;// change in CC_UI object


	
	// Test for any change in the Motif itself (note: this change may have been instigated by Fabric modify.)
	// (in this case, the Fabric Canvas does not really need to be re-rendered)
	const c3 = nextProps.Motf !== this.props.Motf;

	return c1 || c2 || c3;
	 */

	// Test for change in fabric selection, which originated in "Properties" component...
	const c2 = nextProps.FS_UI.chgOrigin_Properties_count !== this.props.FS_UI.chgOrigin_Properties_count;
	const c5 = nextProps.FS_UI.selectionUID               !== this.props.FS_UI.selectionUID;
	
	return !(c5 && (!c2));
    }

    
    componentDidUpdate(){
	//send updated UI state into "Motf_FabricHandlers"
	Motf_FabricHandlers.RecieveUpdate(this.props.CC_UI);
	
	Motf_FabricHandlers.UpdateCanvas(this.props.Motf, this.props.FS_UI.selectionUID);
    }

    componentDidMount(){
	Motf_FabricHandlers.RecieveUpdate(this.props.CC_UI);

	Motf_FabricHandlers.MountCanvas({
	    fabricCanvasElement: this.fabricCanvasElement,
	    Motf: this.props.Motf,
	    onToastMsg: this.props.onToastMsg,
	    handleEditingMotfChange: this.props.handleEditingMotfChange,
	    handleMotfUIStateChange: this.props.handleMotfUIStateChange
	});
    }

    componentWillUnmount(){
	Motf_FabricHandlers.UnmountCanvas();
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

	const isDrawing = this.props.DT_UI.toolSelected !== null;
	
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
	      <canvas
		 width="399"
		 height="399"
		 ref={ el => {this.fabricCanvasElement = el;}}
		 />
	      
	      {/* "Layer" 4: Drawing Tool Overlay */}
		<div>
		  {
		      isDrawing &&
			  <MotfEdit_Section_MotifCanvas_DTO
				 DT_UI={this.props.DT_UI}
				 MS_UI={this.props.MS_UI}
				 handleEditingMotfChange={this.props.handleEditingMotfChange}
				 handleMotfUIStateChange={this.props.handleMotfUIStateChange}// Set: Toggle-OFF shape-draw tool
				 />
		  }
		</div>
		
	    </div>
	);
    }
}

export default MotfEdit_Section_MotifCanvas;
