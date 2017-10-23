import React from 'react';

import Background_Grid from '../Grid/Background_Grid';
import Background_Plot from '../Plot/Background_Plot';
import Background_Patt from '../Patt/Background_Patt';

import Background_Drawing from './Background_Drawing';


class PaneContent extends React.PureComponent {

    render() {
	if(this.props.n === 2){ // drawing
	    return (
	    	<Background_Drawing
		   dims={this.props.dims}
		   outerWidth={this.props.outerWidth}
		   setAspect={this.props.setAspect}
		   />
	    );
		  
	}else if(this.props.n === 1){ // synthesised content...

	    return (
		<div className="Background">
	      {
		  //CONDITIONALLY RENDER GRID BACKGROUND COMPONENT...
		  (this.props.UIState['grid'].selectedRowIndex !== undefined) &&
		  
		      <Background_Grid
			     dims={this.props.dims}
			     gridUIState={this.props.UIState['grid']}
			     gridArray={this.props.PGTobjARRAYS['grid']}
			     />
	      }

	      {
		  //CONDITIONALLY RENDER PLOT BACKGROUND COMPONENT...
		  (this.props.UIState['plot'].selectedRowIndex !== undefined) &&
			  
			  <Background_Plot
				 dims={this.props.dims}
				 plotArray={this.props.PGTobjARRAYS['plot']}
				 onPlotArrayChange={this.props.onPGTobjARRAYSChange.bind(null, "plot")} // to delete..
				 plotUIState={this.props.UIState['plot']}
				 setPlotUIState={($chg)=>{this.props.onUIStateChange({"plot": $chg});}} // to delete..
				/>
	      }

	      {
		  //CONDITIONALLY RENDER PLOT BACKGROUND COMPONENT...
		  (this.props.UIState['patt'].selectedRowIndex !== undefined) &&
			  
			  <Background_Patt
				 dims={this.props.dims}
				 pattArray={this.props.PGTobjARRAYS['patt']}
				 PGTobjARRAYS={this.props.PGTobjARRAYS} // this is a superset of the data passed above...
				 pattUIState={this.props.UIState['patt']}
				/>
	      }

		</div>
	    );
	}else{
	    return null;
	}
    }
    
}


class Background extends React.PureComponent {

    constructor() {
	super();
	this.state = {
	    aspect: null
	};
	
	this.setAspect = this.setAspect.bind(this);
	this.renderWrappedPane = this.renderWrappedPane.bind(this);
    }

    setAspect(v){
	this.setState({
	    aspect: v
	});
    }

    renderWrappedPane(n, dims){
	const a = this.state.aspect;
	const constrain = a !== null;

	let dims2 = dims;
	if(constrain){
	    const r = a[0] / a[1]; // width as a fraction of height
	    dims2 = {
		width:  Math.min(dims.width,  Math.floor(dims.height*r)),
		height: Math.min(dims.height, Math.floor(dims.width/r))
	    };

	    //achieve centering best via inline style too
	    if(dims2.height !== dims.height){
		dims2.top = (dims.height - dims2.height) / 2;
	    }else{
		dims2.left = (dims.width - dims2.width) / 2;
	    }
	}

	this.cfg.paneDimsAR = dims2;
	
	return (
	    <div className={constrain?"constrain":""} style={dims} key={n}>
	      <div className="page" style={dims2}>

		<PaneContent
		   {...this.props}
		   n={n}
		   dims={dims2}
		   outerWidth={dims.width}
		   setAspect={this.setAspect}/>

	      </div>
	    </div>
	);

    }

    shouldComponentUpdate(nextProps, nextState){

	// positive selection props which are bound functions will be a different object each time
	const c1 = nextProps.PGTobjARRAYS  !== this.props.PGTobjARRAYS;
	const c2 = nextProps.UIState       !== this.props.UIState;

	//also, any state change
	const c3 = nextState !== this.state;
	
	return c1 || c2 || c3;
    }

    componentDidUpdate(){
	// "this.cfg" - the screen configuration...
	this.props.onPaneConfigChange(this.cfg);
    }
    
    render() {

	const opts_UI = this.props.UIState['opts'];

	const M = 20; // margin
	
	const winW = window.innerWidth;
	const winH = window.innerHeight;

	const winWM = winW - 2*M; // window width padded
	const winHM = winH - 2*M;

	const winWhalfM = Math.floor(winWM/2 - M);
	const winHhalfM = Math.floor(winHM/2 - M);
	
	const dims = {width: winW, height: winH};
	
	if(opts_UI.mode === 0 || (!opts_UI.mode) ){// 0 - fullscreen - also a fallback if no mode set...
	    this.cfg = {
		splitMode: "single",
		paneDims: dims
	    };
	}else if(opts_UI.mode === 1){ // 1 - split screen, halves vertical divide
	    this.cfg = {
		splitMode: "vertical",
		paneDims: {width: winWhalfM, height: winHM},
		paneIDs: [1,2]
	    };
	}else if(opts_UI.mode === 2){ // 2 - split screen, halves horizontal divide
	    this.cfg = {
		splitMode: "horizontal",
		paneDims: {width: winWM, height: winHhalfM},
		paneIDs: [1,2]
	    };
	}else{ // 3 - split screen, quarters
	    this.cfg = {
		splitMode: "quad",
		paneDims: {width: winWhalfM, height: winHhalfM},
		paneIDs: [1,2,3,4]
	    };
	}
	
	this.cfg.dims = dims;
	const S = this.cfg;

	
	return (
	    <div className="Background">

	      {
		  S.splitMode === "single" &&
		      <PaneContent n={1} dims={dims} {...this.props}/> // forward ALL props...
	      }

	      {
		  S.splitMode !== "single" &&
		      <div className={"bg-grey "+S.splitMode} style={dims}>
		 	    {
				S.paneIDs.map(n => {
				    return this.renderWrappedPane(n, S.paneDims);
				})
			    }
		      </div>
	      }

	    </div>
	);
    }
}

export default Background;
