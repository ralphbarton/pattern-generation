import React from 'react';

import Grid_d3draw from './Grid/plain-js/Grid_d3draw';

class PGT_Background extends React.PureComponent {

    //whenever new props are recieved, a 'snapshot' is taken of the requested grid.
    componentWillReceiveProps(nextProps){
	const gIndex = nextProps.bgControl.gridIndex;
	const gridArray = nextProps.DataArrays['grid'];
	this.setState({
	    gIndex: gIndex,
	    Grid: (gIndex !== null ? gridArray[gIndex] : null),
	    prevGrid: (this.state !== null ? this.state.Grid : null)
	});
    }
    
    shouldComponentUpdate(nextProps, nextState){
	//only rerender when there is change in the 'bgControl' property passed.
	if(this.state !== null){
	    const doUpdate = this.state.Grid !== nextState.Grid;
	    console.log("shouldComponentUpdate()? old Grid:", this.state.gIndex, " new Grid:", nextState.gIndex, " doUpdate:", doUpdate);
	    return doUpdate;
	}else{
	    return false
	}
    }

    componentDidUpdate(){
	//place lineset...
	const gridArray = this.props.DataArrays['grid'];
	const Grid_i = gridArray[this.props.bgControl.gridIndex];

//	console.log("PGT_Background componentDidUpdate() called, gridIndex=", this.props.bgControl.gridIndex);
	
	Grid_d3draw.updatLineset(this.refs.svg, Grid_i, 0, false, {lock_angles: false});
    }
    
    
    render() {
	const winW = window.innerWidth;
	const winH = window.innerHeight;
	console.log("PGT_Background render() called");
	return (
	    <div className="PGT_Background">
	      <svg
		 ref="svg"
		 style={{width:  winW, height:  winH, background: 'cyan',}}>
	      </svg>
	    </div>
	);
    }
}

export default PGT_Background;
