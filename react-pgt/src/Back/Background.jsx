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
		   dims={this.props.dims}/>
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
				    return(
					<div style={dims_vert2} key={n}>
					  <PaneContent n={n} dims={dims_vert2} {...this.props}/>
					</div>
				    );
				})
			    }
			    
			  </div>
		      );

		  }else if(opts_UI.mode === 2){ // 2 - split screen, halves horizontal divide
		      return(
			  <div className="bg-grey horizontal" style={dims}>

			    {
				[1,2].map(n=>{
				    return(
					<div style={dims_hori2} key={n}>
					  <PaneContent n={n} dims={dims_hori2} {...this.props}/>
					</div>
				    );
				})
			    }
			    
			  </div>
		      );

		  }else{ // 3 - split screen, quarters
		      return(
			  <div className="bg-grey quad" style={dims}>

			    {
				[1, 2, 3, 4].map(n=>{
				    return(
					<div style={dims_quad} key={n}>
					  <PaneContent n={n} dims={dims_quad} {...this.props}/>
					</div>
				    );
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
