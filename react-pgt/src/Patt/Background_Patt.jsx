import React from 'react';
var _ = require('lodash');

import Plot_RenderManager from '../Plot/plain-js/Plot_RenderManager';

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

	if(Patt.Motif_set.length < 1){return;} // No motifs included in the pattern? Abort

	const motif_props = Patt.Motif_set[0]; /* take only the first item of the motifs set.
						this is a simplified functionality temporary workaround.
						*/

	const Motf = _.find(this.props.PGTobjARRAYS["motf"], {uid: motif_props.uid} );//extract motif from the list, by UID


	// 2. Generate Pointset
	let Pointset = [];
	if(Patt.type === "grid"){
	    const Grid = _.find(this.props.PGTobjARRAYS["grid"], {uid: Patt.pdrive_uid} );
	    Pointset = Pointset_calculate.Grid_points(Grid);


	}else{ // this means it is a plot (assume)

	    const Plot = _.find(this.props.PGTobjARRAYS["plot"], {uid: Patt.pdrive_uid} );
	    

	    /*
	     As things stand, I'm just regenerating the entire thing at a lowered resolution...
	     */
	    const render_msg = Plot_RenderManager.render({
		useWorker: false,
		Plot: Plot,
		width: this.props.dims.width,
		height: this.props.dims.height,
		resolution: 3 // probably needs to be no higher...
	    });

	    const freshImgData = render_msg.ImageData_grey;
	    
	    Pointset = Pointset_calculate.Density_points(freshImgData, Patt.plot_ops.prom, Patt.plot_ops.qty);

	    
	}


	// 3. generate the pattern SVG
	
	// signature:     putPatternSVG: function(svg_el, Pointset, Motif, motif_props, PlotImgCache, PattLinks)

	// (pass entire plot cache into the pattern renderer - there could be all sorts of links)
	Patt_util.putPatternSVG(this.svgElement, Pointset, Motf, motif_props, this.props.PlotImgCache, Patt.links);
    }


    shouldComponentUpdate(nextProps){

	/*
	 Only respond to change in these 3 props. Even this may trigger too many rerenders.
	 This is ignoring changes in the plots cache
	 - "dims"
	 - "PGTobjARRAYS"
	 - "pattUIState"
	 */

	// the 'dims' prop keeps changing when it shouldn't. Investigate...

	//	const c1 = nextProps.dims          !== this.props.dims;
	const c2 = nextProps.PGTobjARRAYS  !== this.props.PGTobjARRAYS;
	const c3 = nextProps.pattUIState   !== this.props.pattUIState;
	
	return /*c1 ||*/ c2 || c3;
    }

    
    render() {
	/*
	const gridArray = this.props.gridArray; // this reference is to the user's "collection" of Patts...
	const nextPatt = gridUIState.previewActive ? util.lookup(gridArray, "uid", gridUIState.selectionUid) : null;
	 */	

	const winW = this.props.dims.width;
	const winH = this.props.dims.height;
	
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
