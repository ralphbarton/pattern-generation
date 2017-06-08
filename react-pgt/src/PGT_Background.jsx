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
	    Grid: nextProps.gridObj,
	    prevGrid: (this.state !== null ? this.state.Grid : null)
	});
    }
    
    shouldComponentUpdate(nextProps, nextState){
	return this.state.Grid !== nextState.Grid || this.props.bgGridCtrl !== nextProps.bgGridCtrl;
    }

    componentDidUpdate(){
	Grid_d3draw.updateBgGrid(this.refs.svg, this.props.gridObj, this.state.prevGrid, this.props.bgGridCtrl);
    }

    render() {
	const Grid = this.props.gridObj;

	const winW = window.innerWidth;
	const winH = window.innerHeight;
	const visible = this.props.bgGridCtrl.showAllGrids === this.props.isMultiGrid;

	const myStyle = {width:  winW, height:  winH, display: (visible ? "block" : "none")};

	const uid = Grid ? Grid.uid : "no-uid";
	const svgClass = this.props.isMultiGrid ? ("GridSVG-uid" + uid) : "transformingGridSVG";
	
	return(
	    <svg className={svgClass} style={myStyle} ref="svg" />
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
	console.log("PGT_Background render() called");

	const bgGridCtrl = this.props.bgControl.grid;
	const gridArray = this.props.DataArrays['grid'];
	const nextGrid = bgGridCtrl.active ? util.lookup(gridArray, "uid", bgGridCtrl.selGridUid) : null;
	
	return (
	    <div className="PGT_Background">
	      <div className="GridsSVGcontainer">
		<SvgGrid gridObj={nextGrid} bgGridCtrl={bgGridCtrl} isMultiGrid={false}/>
		{
		    gridArray.map((Grid)=>{
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
