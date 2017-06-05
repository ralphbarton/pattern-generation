import React from 'react';

import util from './plain-js/util';
import Grid_d3draw from './Grid/plain-js/Grid_d3draw';


//this is really a component specifically for GRID background...
class PGT_Background extends React.PureComponent {

    constructor() {
	super();
	Grid_d3draw.randomiseColourSet();
    }
    
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

	const pGrd = this.props.bgControl.grid;
	const Grd = nextProps.bgControl.grid;
	const cfgChange = pGrd.showAllGrids !== Grd.showAllGrids || pGrd.showColourGrids !== Grd.showColourGrids;
	return this.state.Grid !== nextState.Grid || cfgChange;
    }

    componentDidUpdate(){
	//place lineset...

	const Grid = this.state.Grid;
	
	const gridBg = this.props.bgControl.grid;
	const lockAngles = gridBg.lockAngles;//boolean
	const showAll = gridBg.showAllGrids;//boolean
	const colour = gridBg.showColourGrids;//boolean

	const options = {
	    lock_angles: lockAngles,
	    showAll: showAll
	};
	this.props.DataArrays['grid'].forEach((Grid_i)=>{
	    const isSelectedGrid = Grid !== undefined && Grid_i.uid === Grid.uid;
	    if((!isSelectedGrid) && (!showAll)){return;}
	    const prevGrid = showAll ? undefined : this.state.prevGrid;

	    options.isSelectedGrid = isSelectedGrid;
	    options.lineSetIndex = 0;
	    Grid_d3draw.updatLineset(this.refs.svg, Grid_i, prevGrid, options);
	    options.lineSetIndex = 1;
	    Grid_d3draw.updatLineset(this.refs.svg, Grid, prevGrid, options);

	});	


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
