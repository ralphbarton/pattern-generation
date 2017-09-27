import React from 'react';


class Background_Patt extends React.PureComponent {

    constructor() {
	super();
    }

    // component will mount before needed, so don't need a custom Mount method...
    componentDidUpdate(){

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
		   height:  winH,
		   background: "cyan"
	       }}
	       ref={ (el) => {this.svgElement = el;}}
	      />
	    </div>
	);
    }
}

export default Background_Patt;
