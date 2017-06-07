import React from 'react';

import util from './plain-js/util';
import Grid_d3draw from './Grid/plain-js/Grid_d3draw';


//
class SvgGrid extends React.PureComponent {

    constructor(props) {
	super(props);
	this.state = {
	    Grid: props.gridObj,
	    prevGrid: null
	};
    }
    
    componentWillReceiveProps(nextProps){
	this.setState({
	    Grid: this.props.gridObj,
	    prevGrid: (this.state !== null ? this.state.Grid : undefined)
	});
    }
    
    shouldComponentUpdate(nextProps, nextState){
	return this.state.Grid !== nextState.Grid || this.props.bgGridCtrl !== nextProps.bgGridCtrl;
    }

    componentDidUpdate(){
	console.log("Grid_d3draw");
	Grid_d3draw.updateBgGrid(this.refs.svg, this.props.gridObj, this.state.prevGrid, {});
    }

    render() {
	const Grid = this.props.gridObj;

	const winW = window.innerWidth;
	const winH = window.innerHeight;
	const visible = this.props.bgGridCtrl.showAllGrids === this.props.isMultiGrid;

	const myStyle = {width:  winW, height:  winH, display: (visible ? "block" : "none")};
	
	return(
	    <svg className={"GridSVG-uid"+Grid.uid} style={myStyle} ref="svg" />
	);
    }
}





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
	const rigidRotate = gridBg.lockAngles;//boolean
	const showAll = gridBg.showAllGrids;//boolean
	const colour = gridBg.showColourGrids;//boolean

	const options = {
	    rigidRotate: rigidRotate,
	    showAll: showAll
	};


	this.props.DataArrays['grid'].forEach((Grid_i)=>{

	    const isSelectedGrid = Grid !== undefined && Grid_i.uid === Grid.uid;
	    if((!isSelectedGrid) && (!showAll)){return;}

	    const prevGrid = showAll ? undefined : this.state.prevGrid;

	    options.isSelectedGrid = isSelectedGrid;

	    // Update Grid...
	    Grid_d3draw.updateBgGrid(this.refs.svg, Grid_i, prevGrid, options);
	});


	/*
	//may update points, and will certainly hide them if required.
	var ops = options.hide ? {display: false} : undefined;
	this.update_grid_intersection_points(ops);
	 */

    }
    
    
    render() {
	console.log("PGT_Background render() called");
	const winW = window.innerWidth;
	const winH = window.innerHeight;

	const bgGridCtrl = this.props.bgControl.grid;
	const gridArray = this.props.DataArrays['grid'];

	const nextGrid = bgGridCtrl.active ? util.lookup(gridArray, "uid", bgGridCtrl.selGridUid) : undefined;
		
	return (
	    <div className="PGT_Background">
	      <div className="GridsSVGcontainer">
		<svg className="transformingGridSVG" style={{width:  winW, height:  winH}} ref="svg" />
		{
		    gridArray.map((Grid)=>{
			const uid = Grid.uid;
			return(
			    <SvgGrid key={Grid.uid} gridObj={Grid} bgGridCtrl={bgGridCtrl} isMultiGrid={true}/>
			);
		    })
		}
	      </div>
	    </div>
	);
    }
}

export default PGT_Background;
