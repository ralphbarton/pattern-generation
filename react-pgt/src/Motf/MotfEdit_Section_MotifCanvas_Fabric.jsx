import React from 'react';
var _ = require('lodash');

//should I divide up this file into separate categories of function (better modularisation)
import Motf_FabricHandlers from './plain-js/Motf_FabricHandlers';

class MotfEdit_Section_MotifCanvas_Fabric extends React.PureComponent {

    shouldComponentUpdate(nextProps, nextState){

	//positive selection (important since there are also callback props (which may be a copy of the same function??)
	const c1 = nextProps.Motf  !== this.props.Motf;
	const c2 = nextProps.CC_UI !== this.props.CC_UI;
	const c3 = nextProps.FS_UI.notFabric_cngOrigin_count !== this.props.FS_UI.notFabric_cngOrigin_count;// Props List Event

	return c1 || c2 || c3;
    }
    
    componentDidUpdate(){
	// send updated UI state into "Motf_FabricHandlers"
	// Fabric Event Handlers need to know the grid size to manage snapping behaviour. This is why this data must be passed.
	Motf_FabricHandlers.RecieveUpdate(this.props.CC_UI); 
	
	Motf_FabricHandlers.UpdateCanvas(this.props.Motf, this.props.FS_UI.selectedMElemsUIDArr);
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
    
    render(){
	return (
	    <canvas
	       width="399"
	       height="399"
	       ref={ el => {this.fabricCanvasElement = el;}}
	      />
	);
    }
}

export default MotfEdit_Section_MotifCanvas_Fabric;
