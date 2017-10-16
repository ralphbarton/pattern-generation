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
				 onPlotArrayChange={this.props.onPGTobjARRAYSChange.bind(null, "plot")}
				 plotUIState={this.props.UIState['plot']}
				 setPlotUIState={($chg)=>{this.props.onUIStateChange({"plot": $chg});}}
				/>
	      }

	      {
		  //CONDITIONALLY RENDER PLOT BACKGROUND COMPONENT...
		  (this.props.UIState['patt'].selectedRowIndex !== undefined) &&
			  
			  <Background_Patt
				 dims={this.props.dims}
				 pattArray={this.props.PGTobjARRAYS['patt']}
				 PGTobjARRAYS={this.props.PGTobjARRAYS} // this is a superset of the data passed above...
				 onPattArrayChange={this.props.onPGTobjARRAYSChange.bind(null, "patt")}
				 pattUIState={this.props.UIState['patt']}
				 setPattUIState={($chg)=>{this.props.onUIStateChange({"patt": $chg});}}
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

	return (
	    <div className={constrain?"constrain":""} style={dims} key={n}>
	      <div className="page" style={dims2}>

		<PaneContent
		   {...this.props}
		   n={n}
		   dims={dims2}
		   setAspect={this.setAspect}/>

	      </div>
	    </div>
	);

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

	const dims_vert2 = {width: winWhalfM, height: winHM};
	const dims_hori2 = {width: winWM, height: winHhalfM};
	const dims_quad = {width: winWhalfM, height: winHhalfM};
	
	return (
	    <div className="Background">
	      {( ()=>{

		  if(opts_UI.mode === 0){ // 0 - fullscreen
		      return(
			  <PaneContent n={1} dims={dims} {...this.props}/> // forward ALL props...
		      );

		  }else if(opts_UI.mode === 1){ // 1 - split screen, halves vertical divide


		      return(
			  <div className="bg-grey vertical" style={dims}>

			    {
				[1,2].map(n=>{
				    return this.renderWrappedPane(n, dims_vert2);
				})
			    }
			    
			  </div>
		      );

		  }else if(opts_UI.mode === 2){ // 2 - split screen, halves horizontal divide
		      return(
			  <div className="bg-grey horizontal" style={dims}>

			    {
				[1,2].map(n=>{
				    return this.renderWrappedPane(n, dims_hori2);
				})
			    }
			    
			  </div>
		      );

		  }else{ // 3 - split screen, quarters
		      return(
			  <div className="bg-grey quad" style={dims}>

			    {
				[1, 2, 3, 4].map(n=>{
				    return this.renderWrappedPane(n, dims_quad);
				})
			    }
			    
			  </div>
		      );
		  }

	      } )()}

	    </div>
	);
    }
}

export default Background;
