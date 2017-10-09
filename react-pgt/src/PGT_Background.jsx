import React from 'react';

import Background_Grid from './Grid/Background_Grid';
import Background_Plot from './Plot/Background_Plot';
import Background_Patt from './Patt/Background_Patt';


class PGT_Background extends React.PureComponent {
    
    render() {

	const opts_UI = this.props.UIState['opts'];

	const P = 20; // padding
	
	const winW = window.innerWidth;
	const winH = window.innerHeight;

	const winWP = winW - 2*P; // window width padded
	const winHP = winH - 2*P;
	
	const dims = {width: winW, height: winH};
	
	return (
	    <div className="PGT_Background">
	      {( ()=>{

		  if(opts_UI.mode === 0){ // 0 - fullscreen
		      return(
			  <div/>
		      );

		  }else if(opts_UI.mode === 1){ // 1 - split screen, halves vertical divide
		      return(
			  <div className="bg-grey vertical" style={dims}>

			    <div style={{
				     left: P,
				     top: P,
				     width: winWP/2 - P,
				     height: winHP
				 }}>
			    </div>

			    <div style={{
				     left: winW/2 + P,
				     top: P,
				     width: winWP/2 - P,
				     height: winHP
				 }}>
			    </div>
			    
			  </div>
		      );

		  }else if(opts_UI.mode === 2){ // 2 - split screen, halves horizontal divide
		      return(
			  <div className="bg-grey horizontal" style={dims}>

			    <div style={{
				     left: P,
				     top: P,
				     width: winWP,
				     height: winHP/2 -P
				 }}>
			    </div>

			    <div style={{
				     left: P,
				     top: winH/2 + P,
				     width: winWP,
				     height: winHP/2 - P
				 }}>
			    </div>
			    
			  </div>
		      );

		  }else{ // 3 - split screen, quarters
		      return(
			  <div className="bg-grey quad" style={dims}>

			    <div/>
			    <div/>

			    <div/>
			    <div/>
			    
			  </div>
		      );
		  }

	      } )()}
	      
	      {
		  //CONDITIONALLY RENDER GRID BACKGROUND COMPONENT...
		  (this.props.UIState['grid'].selectedRowIndex !== undefined) &&
		  
		      <Background_Grid
			     gridUIState={this.props.UIState['grid']}
			     gridArray={this.props.PGTobjARRAYS['grid']}
			     />
	      }

	      {
		  //CONDITIONALLY RENDER PLOT BACKGROUND COMPONENT...
		  (this.props.UIState['plot'].selectedRowIndex !== undefined) &&
			  
			  <Background_Plot
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
				 pattArray={this.props.PGTobjARRAYS['patt']}
				 PGTobjARRAYS={this.props.PGTobjARRAYS} // this is a superset of the data passed above...
				 onPattArrayChange={this.props.onPGTobjARRAYSChange.bind(null, "patt")}
				 pattUIState={this.props.UIState['patt']}
				 setPattUIState={($chg)=>{this.props.onUIStateChange({"patt": $chg});}}
				/>
	      }

	    </div>
	);
    }
}

export default PGT_Background;
