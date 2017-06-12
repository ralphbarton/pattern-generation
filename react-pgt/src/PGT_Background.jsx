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
	    Grid: (nextProps.gridUIState.previewActive ? nextProps.gridObj : null),
	    prevGrid: (this.state !== null ? this.state.Grid : null)
	});
    }
    
    shouldComponentUpdate(nextProps, nextState){
	return this.state.Grid !== nextState.Grid || this.props.gridUIState !== nextProps.gridUIState;
    }

    componentDidUpdate(){
	Grid_d3draw.updateBgGrid(this.svgElement, this.state.Grid, this.state.prevGrid, this.props.gridUIState);
    }

    render() {
	const Grid = this.props.gridObj;

	const winW = window.innerWidth;
	const winH = window.innerHeight;
	const visible = this.props.gridUIState.showAllGrids === this.props.isMultiGrid;

	const uid = Grid ? Grid.uid : "no-uid";
	const svgClass = this.props.isMultiGrid ? ("GridSVG-uid" + uid) : "transformingGridSVG";
	
	return(
	    <svg
	       className={svgClass}
	       style={{
		   width:  winW,
		   height:  winH,
		   display: (visible ? "block" : "none")
	       }}
	       ref={ (el) => {this.svgElement = el;}}
	      />
	);
    }
}


//this is really a component specifically for GRID background...
class PGT_Background extends React.PureComponent {

    constructor() {
	super();
	Grid_d3draw.randomiseColourSet();
    }

    
    render() {
	
	const gridUIState = this.props.UIState['grid'];
	console.log("PGT_Background render() called", gridUIState);
	
	const gridArray = this.props.DataArrays['grid'];
	const nextGrid = gridUIState.previewActive ? util.lookup(gridArray, "uid", gridUIState.selectedGridUid) : null;
	
	return (
	    <div className="PGT_Background">
	      <div className="GridsSVGcontainer">
		<SvgGrid gridObj={nextGrid} gridUIState={gridUIState} isMultiGrid={false}/>
		{
		    gridArray.map((Grid)=>{
			return(
			    <SvgGrid key={Grid.uid} gridObj={Grid} gridUIState={gridUIState} isMultiGrid={true}/>
			);
		    })
		}
	      </div>
	    </div>
	);
    }
}

export default PGT_Background;
