import React from 'react';

import util from '../plain-js/util';
import Grid_d3draw from './plain-js/Grid_d3draw';

import Pointset_render from '../Pointset/Pointset_render';
import Pointset_calculate from '../Pointset/plain-js/Pointset_calculate';

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
	Grid_d3draw.updateBgGrid(this.svgElement, this.props.dims, this.state.Grid, this.state.prevGrid, this.props.gridUIState);
    }

    render() {
	const Grid = this.props.gridObj;

	const winW = this.props.dims.width;
	const winH = this.props.dims.height;
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


class Background_Grid extends React.PureComponent {

    constructor() {
	super();
	Grid_d3draw.randomiseColourSet();
    }

    
    render() {
	
	const gridUIState = this.props.gridUIState;
	
	const gridArray = this.props.gridArray; // this reference is to the user's "collection" of Grids...
	const nextGrid = gridUIState.previewActive ? util.lookup(gridArray, "uid", gridUIState.selectionUid) : null;

	const points = gridUIState.pointsActive ? Pointset_calculate.Grid_points(nextGrid) : [];
	const dims = this.props.dims;
	
	return (
	    <div className="Background_Grid">
	      <div className="GridsSVGcontainer">
		<SvgGrid gridObj={nextGrid} gridUIState={gridUIState} isMultiGrid={false} dims={dims}/>
		{
		    gridArray.map((Grid)=>{
			return(
			    <SvgGrid key={Grid.uid} gridObj={Grid} gridUIState={gridUIState} isMultiGrid={true} dims={dims}/>
			);
		    })
		}

		<Pointset_render
	    points={points}
	    hide={!gridUIState.pointsActive}
		/>

		</div>
	    </div>
	);
    }
}

export default Background_Grid;
