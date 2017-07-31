import React from 'react';

import Background_Grid from './Grid/Background_Grid';
import Background_Plot from './Plot/Background_Plot';


class PGT_Background extends React.PureComponent {
    
    render() {

	return (
	    <div className="PGT_Background">
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

	    </div>
	);
    }
}

export default PGT_Background;
