import React from 'react';

//should I divide up this file into separate categories of function (better modularisation)
import Motf_FabricHandlers from './plain-js/Motf_FabricHandlers';
import MotfEdit_Section_MotifCanvas_BG from './MotfEdit_Section_MotifCanvas_BG';
import MotfEdit_Section_MotifCanvas_GD from './MotfEdit_Section_MotifCanvas_GD';


class MotfEdit_Section_MotifCanvas extends React.PureComponent {

    shouldComponentUpdate(nextProps, nextState){
	// there is no point comparing whole objects:  nextProps !== this.props
	// {} !== {} evalutes true! So it will trigger re-render when there is no change.

	//detect change in 'CC_UI', excluding mouse based change...
	const c1 = nextProps.CC_UI !== this.props.CC_UI;// change in CC_UI object
	const c2 = nextProps.CC_UI.mouseCoords === this.props.CC_UI.mouseCoords; // test for NO CHANGE 
	const c3 = nextProps.CC_UI.mouseOverCanvas === this.props.CC_UI.mouseOverCanvas; // test for NO CHANGE 

	//positively test for change in fabric selection...
	const c4 = nextProps.FS_UI.chgOrigin_Properties_count !== this.props.FS_UI.chgOrigin_Properties_count;
	
	//Positively select props in which change will trigger rerender.
	return nextProps.Motf !== this.props.Motf || (c1 && c2 && c3) || c4;
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
	return (
	    <div className={"MotfEdit_Section_MotifCanvas"+(this.props.CC_UI.canvasCircular?" circular":"")}
		 onMouseEnter={this.handleMouseEnterLeaveCanvas(true)}
		 onMouseLeave={this.handleMouseEnterLeaveCanvas(false)}
		 >
	      <MotfEdit_Section_MotifCanvas_BG CC_UI={this.props.CC_UI}/>
	      <MotfEdit_Section_MotifCanvas_GD CC_UI={this.props.CC_UI}/>

	      <canvas
		 width="399"
		 height="399"
		 ref={ (el) => {this.fabricCanvasElement = el;}}
		/>
	    </div>
	);
    }
}

export default MotfEdit_Section_MotifCanvas;
