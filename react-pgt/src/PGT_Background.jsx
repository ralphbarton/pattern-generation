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
	if (this.state === null && nextState.Grid === null){return false;}
	const firstGridReq = this.state === null && nextState.Grid !== null;
	const gridChange = (this.state !== null) && (this.state.Grid !== nextState.Grid);
	const doUpdate = firstGridReq || gridChange;

	//logging message only...
	const str = "shouldComponentUpdate()? old Grid:";
	console.log(str, (this.state ? this.state.gIndex : null) , " new Grid:", nextState.gIndex, " doUpdate:", doUpdate);

	return doUpdate;
    }

    componentDidUpdate(){
	//place lineset...
	const gridArray = this.props.DataArrays['grid'];
	const Grid = gridArray[this.props.bgControl.gridIndex];
	const prevGrid = this.state.prevGrid;
	
	Grid_d3draw.updatLineset(this.refs.svg, Grid, prevGrid, {lineSetIndex: 0, lock_angles: false});
	Grid_d3draw.updatLineset(this.refs.svg, Grid, prevGrid, {lineSetIndex: 1, lock_angles: false});


	/*
	//may update points, and will certainly hide them if required.
	var ops = options.hide ? {display: false} : undefined;
	this.update_grid_intersection_points(ops);
	 */

    }
    
    
    render() {
	const winW = window.innerWidth;
	const winH = window.innerHeight;
	console.log("PGT_Background render() called");
	return (
	    <div className="PGT_Background">
	      <svg
		 className="GridsSVG"
		 ref="svg"
		 style={{width:  winW, height:  winH, background: 'cyan',}}>
	      </svg>
	    </div>
	);
    }
}

export default PGT_Background;
