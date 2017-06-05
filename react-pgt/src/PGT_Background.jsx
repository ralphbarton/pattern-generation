import React from 'react';

import util from './plain-js/util';
import Grid_d3draw from './Grid/plain-js/Grid_d3draw';

class PGT_Background extends React.PureComponent {

    // Whenever new props recieved, take 'snapshot' of "what grid preview is requested
    componentWillReceiveProps(nextProps){
	const gridBg = nextProps.bgControl.grid;
	const gridArray = nextProps.DataArrays['grid'];
	const nextGrid = (gridBg.active === true ? util.lookup(gridArray, "uid", gridBg.selGridUid) : undefined);
	
	this.setState({
	    Grid: nextGrid,
	    prevGrid: (this.state !== null ? this.state.Grid : undefined)
	});
    }
    
    shouldComponentUpdate(nextProps, nextState){
	//look at state snapshots only
	if(this.state === null){return false;}//no constructor, so there won't be any state till 2nd props change
	return this.state.Grid !== nextState.Grid;
    }

    componentDidUpdate(){
	//place lineset...
	const Grid = this.state.Grid;
	const prevGrid = this.state.prevGrid;
	const lockAng = this.props.bgControl.grid.lockAngles;//boolean
	
	Grid_d3draw.updatLineset(this.refs.svg, Grid, prevGrid, {lineSetIndex: 0, lock_angles: lockAng});
	Grid_d3draw.updatLineset(this.refs.svg, Grid, prevGrid, {lineSetIndex: 1, lock_angles: lockAng});

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
		 style={{width:  winW, height:  winH}}>
	      </svg>
	    </div>
	);
    }
}

export default PGT_Background;
