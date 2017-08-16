import React from 'react';

//should I divide up this file into separate categories of function (better modularisation)
import Motf_FabricHandlers from './plain-js/Motf_FabricHandlers';
import MotfEdit_Section_MotifCanvas_BG from './MotfEdit_Section_MotifCanvas_BG';
import MotfEdit_Section_MotifCanvas_GD from './MotfEdit_Section_MotifCanvas_GD';


class MotfEdit_Section_MotifCanvas extends React.PureComponent {

    shouldComponentUpdate(nextProps, nextState){

	// Test for all change in 'CC_UI'
	const c1 = nextProps.CC_UI !== this.props.CC_UI;// change in CC_UI object

	// Test for change in fabric selection, which originated in "Properties" component...
	const c2 = nextProps.FS_UI.chgOrigin_Properties_count !== this.props.FS_UI.chgOrigin_Properties_count;
	
	// Test for any change in the Motif itself (note: this change may have been instigated by Fabric modify.)
	// (in this case, the Fabric Canvas does not really need to be re-rendered)
	const c3 = nextProps.Motf !== this.props.Motf;

	return c1 || c2 || c3;
    }
    
    
    componentDidUpdate(){
	//send updated UI state into "Motf_FabricHandlers"
	Motf_FabricHandlers.RecieveUpdate(this.props.CC_UI);
	
	Motf_FabricHandlers.UpdateCanvas(this.props.Motf, this.props.FS_UI.selectionUID);
    }

    componentDidMount(){
	Motf_FabricHandlers.RecieveUpdate(this.props.CC_UI);
	Motf_FabricHandlers.MountCanvas(this.fabricCanvasElement, this.props.Motf, this.props);
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

	const isDrawing = this.props.MS_UI.mouseOverCanvas && this.props.DT_UI.toolSelected !== null;
	console.log(this.props.MS_UI.mouseOverCanvas, this.props.DT_UI.toolSelected !== null);
	
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
	      
		    <div>{isDrawing &&
		    <svg
			   className="drawingToolOverlay"
			 width="399"
			 height="399"
			 style={{background: "rgba(0,0,255,0.2)"}}
		       />}</div>
	      
	      {/*   <MotfEdit_Section_MotifCanvas_GD DT_UI={this.props.CC_UI}/>   */}
		
	    </div>
	);
    }
}

export default MotfEdit_Section_MotifCanvas;
