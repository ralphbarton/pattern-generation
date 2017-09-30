import React from 'react';
var _ = require('lodash');

import Pointset_calculate from '../Pointset/plain-js/Pointset_calculate';
import Patt_util from './plain-js/Patt_util';

class Background_Patt extends React.PureComponent {

    // component will mount before needed, so don't need a custom Mount method...
    componentDidUpdate(){
	const pattUIState = this.props.pattUIState;
	
	if(!pattUIState.previewActive){
	    //preview turned OFF. Just clear the SVG of all shapes, and return...
	    Patt_util.putPatternSVG(this.svgElement, null);
	    return;
	}

	// 1. find the motif
	const Patt = this.props.pattArray[pattUIState.selectedRowIndex];

	const motif_props = Patt.Motif_set[0]; // take only the first item of the motifs set...

	const Motf = _.find(this.props.PGTobjARRAYS["motf"], {uid: motif_props.uid} );//extract motif from the list, by UID


	// 2. Generate Pointset
	let Pointset = [];
	if(Patt.type === "grid"){
	    const Grid = _.find(this.props.PGTobjARRAYS["grid"], {uid: Patt.pdrive_uid} );
	    Pointset = Pointset_calculate.Grid_points(Grid);
	}else{ // this means it is a plot (assume)


	    const prominence_factor = 4; // plotUIState.pointsProminenceFactor (state needed per plot? Or per pattern?)

	    // need to access "ImageData_grey"
//	    Pointset = Pointset_calculate.Density_points(this.ImageData_grey, prominence_factor, plotUIState.pointsQuantity);

	    
	}
	
	// signature:     putPatternSVG: function(svg_el, Pointset, Motif, motif_props)
	Patt_util.putPatternSVG(this.svgElement, Pointset, Motf, motif_props);
    }
    
    render() {
	
	const pattUIState = this.props.pattUIState;

	/*
	const gridArray = this.props.gridArray; // this reference is to the user's "collection" of Patts...
	const nextPatt = gridUIState.previewActive ? util.lookup(gridArray, "uid", gridUIState.selectionUid) : null;
	 */	

	const winW = window.innerWidth;
	const winH = window.innerHeight;
	
	return (
	    <div className="Background_Patt">
	    <svg
	       style={{
		   width:  winW,
		   height:  winH
	       }}
	       ref={ (el) => {this.svgElement = el;}}
	      />
	    </div>
	);
    }
}

export default Background_Patt;